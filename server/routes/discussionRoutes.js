const express = require('express');
const { getDiscussions, createDiscussion } = require('../controllers/discussionController');

const router = express.Router();

router.get('/discussions', getDiscussions);
router.post('/discussions', createDiscussion);

module.exports = router;
