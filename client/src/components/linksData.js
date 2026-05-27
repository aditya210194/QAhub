// src/components/linksData.js

export const links = [
    {
        label: "Software Testing",
        path: "/software-testing",
        subLinks: [
            { label: "Manual Testing", path: "/manual-testing" },
            { label: "Automation Testing", path: "/automation-testing" },
            { label: "API Testing", path: "/api-testing" },
            { label: "Agile Testing", path: "/agile" }
        ]
    },
    {
        label: "Automation Testing",
        path: "/automation-testing",
        subLinks: [
            { label: "Automation Guide", path: "/automation-guide" },
            { label: "Selenium", path: "/automation-testing/selenium" },
            { label: "Cypress", path: "/automation-testing/cypress" },
            { label: "Playwright", path: "/automation-testing/playwright" }
        ]
    },
    {
        label: "Manual Testing",
        path: "/manual-testing",
        subLinks: [
            { label: "Testing Fundamentals", path: "/manual-testing/fundamentals" },
            { label: "Test Case Design", path: "/manual-testing/test-case-design" },
            { label: "Bug Tracking", path: "/manual-testing/bug-tracking" }
        ]
    },
    {
        label: "Agile",
        path: "/agile",
        subLinks: [
            { label: "Scrum", path: "/agile/scrum" },
            { label: "Kanban", path: "/agile/kanban" },
            { label: "SAFe", path: "/agile/safe" }
        ]
    },
    {
        label: "API Testing",
        path: "/api-testing",
        subLinks: [
            { label: "Postman", path: "/api-testing/postman" },
            { label: "REST Assured", path: "/api-testing/rest-assured" },
            { label: "SOAP UI", path: "/api-testing/soap-ui" }
        ]
    },
    {
        label: "Automation Guide",
        path: "/automation-guide",
        subLinks: [
            { label: "Tools & Frameworks", path: "/automation-guide/tools" },
            { label: "Best Practices", path: "/automation-guide/best-practices" },
            { label: "CI/CD Integration", path: "/automation-guide/cicd" }
        ]
    },
    {
        label: "Interview QA",
        path: "/interview-qa",
        subLinks: [
            { label: "Beginner Questions", path: "/interview-qa/beginner" },
            { label: "Advanced Questions", path: "/interview-qa/advanced" },
            { label: "Mock Interviews", path: "/interview-qa/mock" }
        ]
    },
    {
        label: "Resumes",
        path: "/resumes",
        subLinks: [
            { label: "Resume Templates", path: "/resumes/templates" },
            { label: "Resume Generator", path: "/resume-generator" },
            { label: "Resume Tips", path: "/resumes/tips" }
        ]
    },
    {
        label: "Community",
        path: "/community-features",
        subLinks: [
            { label: "Discussion Forums", path: "/community-features/discussion-forums" },
            { label: "QA Q&A", path: "/community-features/qa" },
            { label: "Mentorship Program", path: "/community-features/qa/mentorship-program" }
        ]
    }
];