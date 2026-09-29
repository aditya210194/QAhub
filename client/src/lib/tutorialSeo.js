// Per-route SEO config for the tutorial pages. `dir` = folder in /public/data/
const BASE = 'https://www.qahub.co.in';

export const TUTORIAL_SEO = {
    'software-testing': {
        dir: 'software-testing',
        h1: 'Software Testing Tutorials',
        title: 'Software Testing Tutorials: Fundamentals to Advanced | QA Hub',
        description: 'Free software testing tutorials covering testing fundamentals, test design techniques, SDLC/STLC, test management and QA best practices with practical examples.',
    },
    'manual-testing': {
        dir: 'manual-testing',
        h1: 'Manual Testing Tutorials',
        title: 'Manual Testing Tutorials: Test Cases, Bug Reports & Techniques | QA Hub',
        description: 'Learn manual testing step by step: test case design, bug tracking, exploratory testing, test plans and real-world QA scenarios.',
    },
    'automation-testing': {
        dir: 'automation-testing',
        h1: 'Automation Testing Tutorials',
        title: 'Automation Testing Tutorials: Selenium, Cypress, Appium & More | QA Hub',
        description: 'In-depth automation testing tutorials: programming for testers, Selenium, mobile automation with Appium, frameworks, CI/CD and real-world projects.',
    },
    'api-testing': {
        dir: 'api-testing',
        h1: 'API Testing Tutorials',
        title: 'API Testing Tutorials: Postman, REST Assured & Best Practices | QA Hub',
        description: 'Learn API testing with Postman and REST Assured: REST fundamentals, request validation, automation, security and performance testing.',
    },
    'agile': {
        dir: 'agile-testing',
        h1: 'Agile Testing Tutorials',
        title: 'Agile Testing Tutorials: Scrum, Sprints & QA in Agile Teams | QA Hub',
        description: 'Understand Agile methodologies and how testing fits into Scrum and Kanban teams, with practical guidance for QA engineers.',
    },
    'automation-guide': {
        dir: 'automation-tools',
        h1: 'Automation Tools & Frameworks Guide',
        title: 'Test Automation Tools & Frameworks Guide | QA Hub',
        description: 'A practical guide to test automation tools and frameworks, how to compare them and how to choose the right stack for your project.',
    },
};

export function tutorialMetadata(slug) {
    const s = TUTORIAL_SEO[slug];
    const url = `${BASE}/${slug}`;
    return {
        title: s.title,
        description: s.description,
        alternates: { canonical: url },
        openGraph: { title: s.title, description: s.description, url, type: 'website', siteName: 'QA Hub' },
    };
}
