// server/routes/contentRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticate, isAdmin } = require('../middleware/authenticate');

const router = express.Router();

// Path to your public/data folder
const DATA_PATH = path.join(__dirname, '../../client/public/data');

// Ensure data directory exists
if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
}

// Get all content files
router.get('/content-files', authenticate, isAdmin, async (req, res) => {
    try {
        const files = fs.readdirSync(DATA_PATH).filter(file => file.endsWith('.json'));
        const fileData = files.map(file => {
            const filePath = path.join(DATA_PATH, file);
            const stats = fs.statSync(filePath);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return {
                name: file,
                path: filePath,
                size: stats.size,
                modified: stats.mtime,
                categories: content.categories?.length || 0,
                tutorials: content.categories?.reduce((sum, cat) => sum + (cat.tutorials?.length || 0), 0) || 0
            };
        });
        res.json(fileData);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific content file
router.get('/content-files/:filename', authenticate, isAdmin, async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(DATA_PATH, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(content);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save content file (create or update)
router.post('/content-files/:filename', authenticate, isAdmin, async (req, res) => {
    try {
        const { filename } = req.params;
        const content = req.body;
        const filePath = path.join(DATA_PATH, filename);

        // Validate filename (prevent directory traversal)
        if (filename.includes('..') || !filename.endsWith('.json')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        res.json({ success: true, message: 'File saved successfully', path: filePath });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete content file
router.delete('/content-files/:filename', authenticate, isAdmin, async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(DATA_PATH, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add new tutorial to a category
router.post('/content-files/:filename/categories/:categoryIndex/tutorials', authenticate, isAdmin, async (req, res) => {
    try {
        const { filename, categoryIndex } = req.params;
        const tutorial = req.body;
        const filePath = path.join(DATA_PATH, filename);

        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const category = content.categories[parseInt(categoryIndex)];

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        if (!category.tutorials) category.tutorials = [];
        category.tutorials.push(tutorial);

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        res.json({ success: true, message: 'Tutorial added successfully', tutorial });
    } catch (error) {
        console.error('Error adding tutorial:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update tutorial
router.put('/content-files/:filename/categories/:categoryIndex/tutorials/:tutorialIndex', authenticate, isAdmin, async (req, res) => {
    try {
        const { filename, categoryIndex, tutorialIndex } = req.params;
        const updatedTutorial = req.body;
        const filePath = path.join(DATA_PATH, filename);

        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const category = content.categories[parseInt(categoryIndex)];

        if (!category || !category.tutorials[parseInt(tutorialIndex)]) {
            return res.status(404).json({ error: 'Tutorial not found' });
        }

        category.tutorials[parseInt(tutorialIndex)] = updatedTutorial;
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        res.json({ success: true, message: 'Tutorial updated successfully' });
    } catch (error) {
        console.error('Error updating tutorial:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete tutorial
router.delete('/content-files/:filename/categories/:categoryIndex/tutorials/:tutorialIndex', authenticate, isAdmin, async (req, res) => {
    try {
        const { filename, categoryIndex, tutorialIndex } = req.params;
        const filePath = path.join(DATA_PATH, filename);

        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const category = content.categories[parseInt(categoryIndex)];

        if (!category || !category.tutorials[parseInt(tutorialIndex)]) {
            return res.status(404).json({ error: 'Tutorial not found' });
        }

        category.tutorials.splice(parseInt(tutorialIndex), 1);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        res.json({ success: true, message: 'Tutorial deleted successfully' });
    } catch (error) {
        console.error('Error deleting tutorial:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;