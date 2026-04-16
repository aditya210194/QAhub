// utils/pdfExtractor.js - Advanced PDF Text Extraction
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ==================== ADVANCED PDF TEXT EXTRACTION ====================
export const extractTextFromPDF = async (arrayBuffer) => {
    try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        let pagesData = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Extract text with positioning for better structure
            const items = textContent.items.map(item => ({
                text: item.str,
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
                height: item.height,
                fontName: item.fontName
            }));

            // Group by Y position (lines)
            const lines = [];
            const lineMap = new Map();

            items.forEach(item => {
                const y = Math.round(item.y);
                if (!lineMap.has(y)) lineMap.set(y, []);
                lineMap.get(y).push(item);
            });

            // Sort Y positions from top to bottom
            const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

            for (const y of sortedYs) {
                const lineItems = lineMap.get(y).sort((a, b) => a.x - b.x);
                const lineText = lineItems.map(item => item.text).join(' ');
                lines.push(lineText);
            }

            const pageText = lines.join('\n');
            fullText += pageText + '\n\n';
            pagesData.push({ pageNum: i, text: pageText, lines });
        }

        console.log("Extracted text length:", fullText.length);
        return { fullText, pagesData };
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return { fullText: '', pagesData: [] };
    }
};

// ==================== ADVANCED RESUME PARSER ====================
// utils/pdfExtractor.js - Add this improved parser

export const parseResumeText = (text) => {
    const extractedData = {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        title: "",
        summary: "",
        skills: [],
        certifications: [],
        experience: [],
        education: [],
        projects: [],
        achievements: ""
    };

    // Split into lines for better processing
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 1. Extract Name (usually first or second line)
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        if (line && !line.includes('@') && !line.includes('linkedin') &&
            !line.includes('github') && line.length < 50 &&
            /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(line)) {
            extractedData.name = line;
            break;
        }
    }

    // 2. Extract Email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) extractedData.email = emailMatch[0];

    // 3. Extract Phone
   const phoneMatch = text.match(
     /(\+?\d{1,3}[\s-]?)?\d{10}/
   );
    if (phoneMatch) extractedData.phone = `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`;

    // 4. Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) extractedData.linkedin = `https://${linkedinMatch[0]}`;

    // 5. Extract GitHub
    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) extractedData.github = `https://${githubMatch[0]}`;

    // 6. Extract Title
    const titlePatterns = [
        /(?:Software|Senior|Lead|Principal)?\s*(QA|Quality Assurance|Software Test|Automation|Performance|SDET)\s*(?:Engineer|Analyst|Lead|Manager|Architect)/i,
        /(?:QA|Quality Assurance)\s+(?:Engineer|Lead|Manager)/i,
        /(?:Software|Application)\s+Test\s+(?:Engineer|Lead)/i
    ];
    for (const pattern of titlePatterns) {
        const match = text.match(pattern);
        if (match) {
            extractedData.title = match[0].trim();
            break;
        }
    }

    // 7. Extract Summary
    const summaryPatterns = [
        /PROFESSIONAL SUMMARY[\s\S]*?([^.]+\.[^.]+\.[^.]+\.)/i,
        /(?:Software QA engineer|QA engineer|Quality Assurance)[^.]*\.[^.]*\.[^.]*\./i
    ];
    for (const pattern of summaryPatterns) {
        const match = text.match(pattern);
        if (match) {
            extractedData.summary = match[1] || match[0];
            extractedData.summary = extractedData.summary.substring(0, 400);
            break;
        }
    }

    // 8. EXTRACT WORK EXPERIENCE - Improved version
    const experienceSection = text.match(/WORK EXPERIENCE|EMPLOYMENT HISTORY|PROFESSIONAL EXPERIENCE[\s\S]*?(?=EDUCATION|SKILLS|CERTIFICATIONS|$)/i);

    if (experienceSection) {
        const expText = experienceSection[0];

        // Split by common job patterns
        const jobPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Inc\.|LLC|Corp)?)/gi;
        let match;
        let lastIndex = 0;
        const jobBlocks = [];

        while ((match = jobPattern.exec(expText)) !== null) {
            if (lastIndex > 0) {
                const jobText = expText.substring(lastIndex, match.index);
                jobBlocks.push({
                    position: match[1],
                    company: match[2],
                    text: jobText
                });
            }
            lastIndex = match.index;
        }

        if (lastIndex > 0) {
            const jobText = expText.substring(lastIndex);
            jobBlocks.push({
                position: jobBlocks[jobBlocks.length - 1]?.position || "",
                company: jobBlocks[jobBlocks.length - 1]?.company || "",
                text: jobText
            });
        }

        // Parse each job block
        for (const job of jobBlocks) {
            if (!job.position && !job.company) continue;

            // Extract duration
            const durationMatch = job.text.match(/(\d{4})\s*[-–]\s*(?:\d{4}|Present|current)/i);
            const duration = durationMatch ? durationMatch[0] : "";

            // Extract responsibilities
            const responsibilities = [];

            // Look for bullet points
            const bulletPattern = /[•·\-*]\s*([^\n]+)/g;
            let bulletMatch;
            while ((bulletMatch = bulletPattern.exec(job.text)) !== null) {
                let resp = bulletMatch[1].trim();
                if (resp.length > 10) responsibilities.push(resp);
            }

            // Look for numbered points
            const numberedPattern = /\d+\.\s*([^\n]+)/g;
            let numberedMatch;
            while ((numberedMatch = numberedPattern.exec(job.text)) !== null) {
                let resp = numberedMatch[1].trim();
                if (resp.length > 10) responsibilities.push(resp);
            }

            // Look for sentences with achievements
            const achievementPattern = /(?:achieved|increased|reduced|saved|improved|implemented|developed|led|created)[^.!]*[.!]/gi;
            let achievementMatch;
            while ((achievementMatch = achievementPattern.exec(job.text)) !== null) {
                let achievement = achievementMatch[0].trim();
                if (achievement.length > 20 && !responsibilities.includes(achievement)) {
                    responsibilities.push(achievement);
                }
            }

            if (responsibilities.length > 0) {
                extractedData.experience.push({
                    company: job.company.trim(),
                    position: job.position.trim(),
                    duration: duration,
                    responsibilities: responsibilities.slice(0, 5).join('\n')
                });
            }
        }
    }

    // Fallback: Try to extract from lines
    if (extractedData.experience.length === 0) {
        let currentJob = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:at|@|,)/i)) {
                if (currentJob) extractedData.experience.push(currentJob);
                const posMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
                const compMatch = line.match(/(?:at|@|,)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
                currentJob = {
                    company: compMatch ? compMatch[1] : "",
                    position: posMatch ? posMatch[1] : "",
                    duration: "",
                    responsibilities: ""
                };
            } else if (currentJob && (line.startsWith('•') || line.startsWith('-') || line.match(/^\d+\./))) {
                const resp = line.replace(/^[•·\-*\d+\.]\s*/, '').trim();
                if (currentJob.responsibilities) {
                    currentJob.responsibilities += (currentJob.responsibilities ? '\n' : '') + resp;
                } else {
                    currentJob.responsibilities = resp;
                }
            }
        }
        if (currentJob) extractedData.experience.push(currentJob);
    }

    // 9. Extract Skills
    const skillsSection = text.match(/SKILLS|TECHNICAL SKILLS[\s\S]*?(?=EDUCATION|WORK EXPERIENCE|$)/i);
    if (skillsSection) {
        const skillsText = skillsSection[0];
        const skillPattern = /(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+[\w.]+)?)/g;
        const matches = skillsText.match(skillPattern);
        if (matches) {
            const skillsSet = new Set();
            matches.forEach(skill => {
                if (skill.length > 2 && skill.length < 30 &&
                    !skill.match(/^(SKILLS|TECHNICAL|INDUSTRY|TOOLS|SOFTWARE|SKILLS:|TECHNICAL SKILLS:)$/i)) {
                    skillsSet.add(skill);
                }
            });
            extractedData.skills = Array.from(skillsSet).slice(0, 20);
        }
    }

    // 10. Extract Certifications
    const certPatterns = [
        /Certified\s+(?:Software|Quality|Test)\s+(?:Engineer|Tester|Manager)/i,
        /ISTQB/i,
        /AWS\s+Certified/i,
        /Scrum\s+Master/i,
        /Security\+/i
    ];
    certPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match && !extractedData.certifications.includes(match[0])) {
            extractedData.certifications.push(match[0]);
        }
    });

    // 11. Extract Education
    const educationSection = text.match(/EDUCATION[\s\S]*?(?=SKILLS|CERTIFICATIONS|WORK EXPERIENCE|$)/i);
    if (educationSection) {
        const eduText = educationSection[0];
        const degreeMatch = eduText.match(/(?:Bachelor|Master|B\.Sc|M\.Sc|B\.Tech|M\.Tech|PhD|Associate)[\s\w]+/i);
        const institutionMatch = eduText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|College|Institute))/i);
        const yearMatch = eduText.match(/(?:20\d{2}|19\d{2})/);

        if (degreeMatch || institutionMatch) {
            extractedData.education = [{
                institution: institutionMatch ? institutionMatch[1] : "",
                degree: degreeMatch ? degreeMatch[0] : "",
                duration: yearMatch ? yearMatch[0] : "",
                honors: ""
            }];
        }
    }

    console.log("✅ Extracted Experience Count:", extractedData.experience.length);
    console.log("✅ Extracted Experience:", extractedData.experience);

    return extractedData;
};
// ==================== HELPER FUNCTIONS ====================

function extractSection(text, sectionNames) {
    for (const name of sectionNames) {
        const regex = new RegExp(`${name}[\\s\\S]*?(?=(?:${sectionNames.join('|')}|$))`, 'i');
        const match = text.match(regex);
        if (match) return match[0];
    }
    return null;
}

function splitIntoJobs(sectionText) {
    const jobs = [];
    const lines = sectionText.split('\n');
    let currentJob = null;

    // Job title patterns
    const jobTitlePattern = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@|,)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Inc\.|LLC|Corp|Company)?)/i;
    const companyFirstPattern = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+[-–]\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        let match = line.match(jobTitlePattern);
        if (!match) match = line.match(companyFirstPattern);

        if (match) {
            if (currentJob) jobs.push(currentJob);
            currentJob = {
                position: match[1],
                company: match[2],
                duration: "",
                responsibilities: [],
                rawText: ""
            };
        }

        if (currentJob) {
            currentJob.rawText += line + '\n';

            // Extract duration
            const durationMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|Present|Current)/i);
            if (durationMatch && !currentJob.duration) {
                currentJob.duration = durationMatch[0];
            }

            // Extract responsibilities (bullet points)
            if (line.match(/^[•·\-*]\s+/) || line.match(/^\d+\.\s+/)) {
                const responsibility = line.replace(/^[•·\-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
                if (responsibility.length > 10) {
                    currentJob.responsibilities.push(responsibility);
                }
            }
        }
    }

    if (currentJob) jobs.push(currentJob);

    // Format jobs for output
    return jobs.map(job => ({
        company: job.company,
        position: job.position,
        duration: job.duration,
        responsibilities: job.responsibilities.slice(0, 5).join('\n')
    }));
}

function parseJob(jobText) {
    const result = {
        company: "",
        position: "",
        duration: "",
        responsibilities: []
    };

    // Extract position and company
    const positionMatch = jobText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@|,)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (positionMatch) {
        result.position = positionMatch[1];
        result.company = positionMatch[2];
    }

    // Extract duration
    const durationMatch = jobText.match(/(\d{4})\s*[-–]\s*(\d{4}|Present|Current)/i);
    if (durationMatch) result.duration = durationMatch[0];

    // Extract responsibilities
    const lines = jobText.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.match(/^[•·\-*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
            const responsibility = trimmed.replace(/^[•·\-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
            if (responsibility.length > 15 && responsibility.length < 300) {
                result.responsibilities.push(responsibility);
            }
        }
    }

    return result;
}

function extractJobsFromText(text) {
    const jobs = [];

    // Common job patterns in QA resumes
    const jobPatterns = [
        /(Software QA Engineer|QA Engineer|Test Engineer|Automation Engineer|SDET)[\s\S]*?(?=(?:Software|QA|Test|Automation|$))/gi,
        /(Software Business Analyst|Business Analyst)[\s\S]*?(?=(?:Software|Business|Developer|$))/gi,
        /(Developer|Software Developer)[\s\S]*?(?=(?:Developer|Software|$))/gi
    ];

    for (const pattern of jobPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const jobText = match[0];
            const position = match[1];

            // Extract company
            const companyMatch = jobText.match(/(?:at|@|,)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Inc\.|LLC)?)/i);
            const company = companyMatch ? companyMatch[1] : "Unknown Company";

            // Extract responsibilities
            const responsibilities = [];
            const bulletMatches = jobText.match(/[•·\-*]\s*([^.\n]+[.])/g);
            if (bulletMatches) {
                bulletMatches.forEach(b => {
                    const resp = b.replace(/[•·\-*]\s*/, '').trim();
                    if (resp.length > 20) responsibilities.push(resp);
                });
            }

            if (responsibilities.length > 0) {
                jobs.push({
                    company: company,
                    position: position,
                    duration: "",
                    responsibilities: responsibilities.slice(0, 4).join('\n')
                });
            }
        }
    }

    return jobs;
}

function parseEducation(educationText) {
    const result = {
        institution: "",
        degree: "",
        duration: "",
        honors: ""
    };

    // Extract degree
    const degreePatterns = [
        /(?:Bachelor|Master|B\.Sc|M\.Sc|B\.Tech|M\.Tech|PhD|Associate|Diploma)[\s\w]+/i,
        /(?:B\.|M\.|Ph\.D\.)\s*[A-Z][a-z]+/i
    ];

    for (const pattern of degreePatterns) {
        const match = educationText.match(pattern);
        if (match) {
            result.degree = match[0];
            break;
        }
    }

    // Extract institution
    const institutionPatterns = [
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|College|Institute|School))/i,
        /(?:University|College|Institute)\s+of\s+([A-Z][a-z]+)/i
    ];

    for (const pattern of institutionPatterns) {
        const match = educationText.match(pattern);
        if (match) {
            result.institution = match[0];
            break;
        }
    }

    // Extract year
    const yearMatch = educationText.match(/(?:20\d{2}|19\d{2})\s*[-–]\s*(?:20\d{2}|Present)/i);
    if (yearMatch) result.duration = yearMatch[0];

    // Extract honors
    const honorsMatch = educationText.match(/(?:Awards?|Honors?)[:\s]*([^.\n]+)/i);
    if (honorsMatch) result.honors = honorsMatch[1];

    return result;
}

const extractSkills = (text) => {
  const skills = new Set();
  const lowerText = text.toLowerCase();

  Object.values(KEYWORD_CATEGORIES).flat().forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  });

  return Array.from(skills);
};

function extractCertifications(certText) {
    const certifications = new Set();

    const certPatterns = [
        /ISTQB\s*(?:Foundation|Advanced|Expert)?/i,
        /Certified\s+(?:Software|Quality|Test)\s+(?:Engineer|Tester|Manager)/i,
        /AWS\s+Certified\s+(?:Developer|Solutions\s+Architect|DevOps)/i,
        /Azure\s+Certified/i,
        /Certified\s+Scrum\s+Master/i,
        /SAFe\s+\w+/i,
        /Security\+\s*Certification/i,
        /CISSP/i,
        /CEH/i,
        /CompTIA\s+\w+/i,
        /(?:Selenium|Cypress|Appium)\s+Certification/i,
        /Professional\s+Scrum\s+Master/i,
        /Certified\s+Test\s+Manager/i,
        /Certified\s+Test\s+Automation\s+Engineer/i
    ];

    for (const pattern of certPatterns) {
        const match = certText.match(pattern);
        if (match) {
            certifications.add(match[0]);
        }
    }

    return Array.from(certifications);
}

function extractProjects(projectsText) {
    const projects = [];

    // Split by project titles
    const projectLines = projectsText.split('\n');
    let currentProject = null;

    for (const line of projectLines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check if line looks like a project title
        if (trimmed.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/) && trimmed.length < 40) {
            if (currentProject) projects.push(currentProject);
            currentProject = {
                title: trimmed,
                description: "",
                technologies: ""
            };
        } else if (currentProject) {
            if (currentProject.description.length < 200) {
                currentProject.description += trimmed + ' ';
            }
        }
    }

    if (currentProject) projects.push(currentProject);

    return projects.slice(0, 3);
}

function extractAchievements(text) {
    const achievements = [];

    const achievementPatterns = [
        /(?:achieved|increased|reduced|saved|improved|implemented|developed|led|created|designed)[^.!]*[0-9]+%[^.!]*\./gi,
        /(?:received|won|earned)\s+(?:an|a)\s+(?:award|recognition|prize)[^.!]*\./gi,
        /(?:key achievement|notable accomplishment)[^.!]*\./gi,
        /(?:saved|reduced|cut)\s+(?:over|more than)?\s*\$[\d,]+[^.!]*\./gi,
        /(?:increased|boosted|improved)\s+(?:sales|revenue|efficiency|productivity)[^.!]*[0-9]+%[^.!]*\./gi
    ];

    for (const pattern of achievementPatterns) {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(m => achievements.push(m.trim()));
        }
    }

    return [...new Set(achievements)].slice(0, 5).join('\n');
}

// ==================== EXPORT FUNCTIONS ====================
export const processUploadedResume = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const { fullText, pagesData } = await extractTextFromPDF(arrayBuffer);
        const parsedData = parseResumeText(fullText);

        return {
            success: true,
            data: parsedData,
            rawText: fullText,
            pages: pagesData
        };
    } catch (error) {
        console.error('Error processing resume:', error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
};