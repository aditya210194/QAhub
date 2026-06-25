import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faBookmark,
    faStar,
    faExternalLinkAlt,
    faFilter,
    faBookOpen,
    faClock,
    faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import './Articles.css';
import { Helmet } from 'react-helmet-async';
const Articles = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('articleFavorites');
        return saved ? JSON.parse(saved) : {};
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    useEffect(() => {
        localStorage.setItem('articleFavorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        let result = [...articles];

        // Apply search filter
        if (searchQuery.length >= 3) {
            result = result.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (activeCategory) {
            result = result.filter(article =>
                article.categories.includes(activeCategory)
            );
        }

        // Apply favorites filter
        if (showFavoritesOnly) {
            result = result.filter(article =>
                favorites[article.link]
            );
        }

        // Apply sorting
        if (sortOption !== 'default') {
            result.sort((a, b) => {
                if (sortOption === 'a-z') return a.title.localeCompare(b.title);
                if (sortOption === 'popularity') return b.popularity - a.popularity;
                if (sortOption === 'reading-time') return a.readingTime - b.readingTime;
                return 0;
            });
        }

        setFilteredArticles(result);
    }, [searchQuery, activeCategory, favorites, showFavoritesOnly, sortOption]);

    const toggleFavorite = (link) => {
        setFavorites(prev => ({
            ...prev,
            [link]: !prev[link]
        }));
    };

    const clearFilters = () => {
        setActiveCategory(null);
        setSearchQuery("");
        setShowFavoritesOnly(false);
        setSortOption('default');
    };

    // Categories with icons
    const categories = [
        { name: "Automation Testing", icon: "robot" },
        { name: "Manual Testing", icon: "hand" },
        { name: "Agile Testing", icon: "agile" },
        { name: "API Testing", icon: "api" },
        { name: "Performance Testing", icon: "gauge-high" },
        { name: "Mobile Testing", icon: "mobile-screen" },
        { name: "CI/CD", icon: "gears" },
        { name: "Interview Prep", icon: "user-tie" },
        { name: "Best Practices", icon: "lightbulb" },
    ];

    // Sample article data with additional properties
    const articles = [
        {
            title: "Understanding Automation Testing",
            description: "A comprehensive guide to understanding automation testing. Learn about various automation tools like Selenium, Cypress, and TestComplete. This article covers methodologies, best practices, and how automation can improve the efficiency and reliability of your software tests.",
            link: "https://www.guru99.com/automation-testing.html",
            categories: ["Automation Testing", "Best Practices"],
            readingTime: 12,
            popularity: 95,
            date: "2025-03-15"
        },
        {
            title: "Getting Started with Manual Testing",
            description: "Manual testing is the foundation of software testing. In this article, we'll cover the basics of manual testing, including how to plan test cases, execute tests, and document results. Ideal for those who are new to software testing or transitioning into the field.",
            link: "https://www.browserstack.com/guide/manual-testing-tutorial?utm_source=chatgpt.com",
            categories: ["Manual Testing", "Best Practices"],
            readingTime: 8,
            popularity: 87,
            date: "2025-02-22"
        },
        {
            title: "Agile Methodologies in Software Testing",
            description: "Agile has become the go-to approach for software development, and this article explores how Agile methodologies are integrated into the software testing process. Learn about key Agile practices such as Scrum, Kanban, and continuous integration, and how they impact the way testing is conducted in modern software projects.",
            link: "https://www.softwaretestinghelp.com/agile-scrum-methodology-for-development-and-testing",
            categories: ["Agile Testing", "Best Practices"],
            readingTime: 15,
            popularity: 92,
            date: "2025-04-10"
        },
        {
            title: "Interview Preparation for QA Roles",
            description: "Preparing for a QA interview can be daunting. This article provides essential tips and strategies to help you ace your software testing interview. Topics include common interview questions, the skills to focus on, and how to demonstrate your knowledge in both manual and automation testing.",
            link: "https://www.amazon.com/Cracking-Popular-Interview-Questions-Answer/dp/1981564616?utm_source=chatgpt.com",
            categories: ["Interview Prep", "Best Practices"],
            readingTime: 10,
            popularity: 98,
            date: "2025-05-01"
        },
        {
            title: "Effective Bug Reporting and Management",
            description: "Bug reporting and management are critical skills for every software tester. This article discusses how to effectively report bugs, what information should be included in a bug report, and how to prioritize and manage bugs during the testing cycle.",
            link: "https://marker.io/blog/how-to-write-bug-report?utm_source=chatgpt.com",
            categories: ["Best Practices", "Manual Testing"],
            readingTime: 9,
            popularity: 89,
            date: "2025-03-28"
        },
        {
            title: "Exploring Continuous Integration and Continuous Testing",
            description: "Continuous Integration (CI) and Continuous Testing (CT) are key practices for delivering high-quality software rapidly. This article explains how these practices work together to automate the testing process and ensure that code changes do not break existing functionality.",
            link: "https://arxiv.org/abs/1703.07019?utm_source=chatgpt.com",
            categories: ["CI/CD", "Automation Testing"],
            readingTime: 14,
            popularity: 84,
            date: "2025-04-18"
        },
        {
            title: "Test-Driven Development (TDD) in Software Testing",
            description: "Test-Driven Development (TDD) is a software development approach where tests are written before the code. This article explains the principles of TDD, its benefits, and how it helps improve software quality and test coverage.",
            link: "https://www.tutorialspoint.com/test_driven_development/index.htm",
            categories: ["Best Practices", "Automation Testing"],
            readingTime: 11,
            popularity: 90,
            date: "2025-02-10"
        },
        {
            title: "Exploring the Role of QA Automation in DevOps",
            description: "DevOps aims to improve collaboration and automation between development and IT operations. This article explores the intersection of QA automation and DevOps practices and how automated testing supports continuous delivery and integration.",
            link: "https://www.perfecto.io/blog/qa-automation-devops",
            categories: ["CI/CD", "Automation Testing"],
            readingTime: 13,
            popularity: 88,
            date: "2025-03-05"
        },
        {
            title: "Best Practices for Writing Test Cases",
            description: "Writing effective test cases is essential for ensuring comprehensive testing coverage. This article provides best practices for writing clear, concise, and maintainable test cases that improve the testing process.",
            link: "https://www.softwaretestinghelp.com/best-practices-for-writing-test-cases",
            categories: ["Best Practices", "Manual Testing"],
            readingTime: 7,
            popularity: 93,
            date: "2025-04-22"
        },
        {
            title: "Mobile App Testing: Best Tools and Techniques",
            description: "Mobile app testing is crucial for delivering high-quality mobile applications. This article covers the best tools, techniques, and approaches for testing mobile applications, including automation, performance, and usability testing.",
            link: "https://www.softwaretestinghelp.com/mobile-app-testing-tools",
            categories: ["Mobile Testing", "Automation Testing"],
            readingTime: 12,
            popularity: 86,
            date: "2025-01-15"
        },
        {
            title: "The Importance of Performance Testing in Software Development",
            description: "Performance testing helps ensure that software performs efficiently under expected loads. This article explains the importance of performance testing, different types of performance tests, and tools like JMeter and LoadRunner.",
            link: "https://www.softwaretestinghelp.com/performance-testing",
            categories: ["Performance Testing", "Best Practices"],
            readingTime: 11,
            popularity: 91,
            date: "2025-03-20"
        },
        {
            title: "Behavior-Driven Development (BDD) for Better Collaboration",
            description: "Behavior-Driven Development (BDD) fosters better collaboration between developers, testers, and non-technical stakeholders. This article explains the key concepts of BDD and how it improves communication and software quality.",
            link: "https://www.cucumber.io/resources/what-is-bdd",
            categories: ["Agile Testing", "Best Practices"],
            readingTime: 9,
            popularity: 85,
            date: "2025-02-05"
        },
        {
            title: "Mastering Automated UI Testing with Cypress",
            description: "Cypress is a popular testing framework for modern web applications. This article provides an in-depth look at how to use Cypress for automated UI testing, covering setup, syntax, and debugging.",
            link: "https://www.cypress.io/docs/",
            categories: ["Automation Testing", "Best Practices"],
            readingTime: 14,
            popularity: 94,
            date: "2025-04-05"
        },
        {
            title: "How to Automate Browser Testing with Puppeteer",
            description: "Puppeteer is a Node.js library for automating browser tasks. This article covers how to use Puppeteer to automate browser testing and other tasks.",
            link: "https://pptr.dev/",
            categories: ["Automation Testing"],
            readingTime: 10,
            popularity: 82,
            date: "2025-01-25"
        },
        {
            title: "Understanding Continuous Integration for Test Automation",
            description: "Continuous Integration (CI) is crucial for automating the integration of code changes. This article explains how CI supports test automation and improves the quality of software.",
            link: "https://www.atlassian.com/continuous-delivery/ci-vs-cd",
            categories: ["CI/CD", "Automation Testing"],
            readingTime: 8,
            popularity: 89,
            date: "2025-03-12"
        },
        {
            title: "How to Use Appium for Mobile App Automation Testing",
            description: "Appium is an open-source tool for automating mobile app testing. This article covers how to use Appium for automating tests for both Android and iOS applications.",
            link: "https://appium.io/docs/en/about-appium/intro",
            categories: ["Mobile Testing", "Automation Testing"],
            readingTime: 13,
            popularity: 88,
            date: "2025-02-18"
        },
        {
            title: "Introduction to Test Case Design Techniques",
            description: "Designing effective test cases is an essential skill. This article explains the different test case design techniques, such as boundary value analysis and equivalence partitioning.",
            link: "https://www.softwaretestinghelp.com/test-case-design-techniques",
            categories: ["Manual Testing", "Best Practices"],
            readingTime: 9,
            popularity: 87,
            date: "2025-04-15"
        },
        {
            title: "How to Conduct Smoke Testing in Software Development",
            description: "Smoke testing is a type of preliminary testing used to check whether basic functionalities work. This article explains how to conduct smoke testing during the development process.",
            link: "https://www.softwaretestinghelp.com/smoke-testing",
            categories: ["Manual Testing", "Best Practices"],
            readingTime: 7,
            popularity: 84,
            date: "2025-01-30"
        },
        {
            title: "Automated Testing for Microservices Architectures",
            description: "Microservices architectures require specialized testing approaches. This article explores how to use automated testing techniques for microservices, including tools like Postman and JUnit.",
            link: "https://dilfuruz.com/microservices-testing-strategy",
            categories: ["Automation Testing", "API Testing"],
            readingTime: 15,
            popularity: 90,
            date: "2025-03-25"
        },
        {
            title: "Understanding Load Testing for Web Applications",
            description: "Load testing ensures that web applications can handle expected traffic volumes. This article provides an overview of load testing and tools like Apache JMeter and LoadRunner.",
            link: "https://www.softwaretestinghelp.com/load-testing",
            categories: ["Performance Testing", "Automation Testing"],
            readingTime: 11,
            popularity: 92,
            date: "2025-04-02"
        },
        {
            title: "Security Testing Fundamentals for Web Applications",
            description: "Learn the essentials of security testing for web applications. This article covers common vulnerabilities like SQL injection, XSS, and CSRF, along with tools and techniques to identify and mitigate these security risks.",
            link: "https://owasp.org/www-project-web-security-testing-guide/",
            categories: ["Security Testing", "Best Practices"],
            readingTime: 14,
            popularity: 93,
            date: "2025-05-12"
        },
        {
            title: "Exploratory Testing: Techniques and Best Practices",
            description: "Exploratory testing combines learning, test design, and test execution in real-time. This article explains how to effectively perform exploratory testing to uncover hidden defects and improve software quality.",
            link: "https://www.satisfice.com/exploratory-testing",
            categories: ["Manual Testing", "Best Practices"],
            readingTime: 11,
            popularity: 87,
            date: "2025-04-28"
        },
        {
            title: "Setting Up Selenium Grid for Parallel Testing",
            description: "Learn how to configure and use Selenium Grid to run tests in parallel across multiple machines and browsers. This guide covers setup, configuration, and best practices for distributed testing.",
            link: "https://www.selenium.dev/documentation/en/grid/",
            categories: ["Automation Testing", "CI/CD"],
            readingTime: 13,
            popularity: 85,
            date: "2025-03-08"
        },
        {
            title: "API Contract Testing with Pact",
            description: "Contract testing ensures that services communicate correctly. This article explores how to use Pact for API contract testing to catch breaking changes before they reach production.",
            link: "https://pact.io/",
            categories: ["API Testing", "Best Practices"],
            readingTime: 12,
            popularity: 88,
            date: "2025-05-05"
        },
        {
            title: "Visual Regression Testing with Applitools",
            description: "Visual regression testing detects unintended visual changes. Learn how to implement visual testing using Applitools to ensure UI consistency across releases.",
            link: "https://applitools.com/",
            categories: ["UI Testing", "Automation Testing"],
            readingTime: 10,
            popularity: 90,
            date: "2025-04-15"
        },
        {
            title: "Building a QA Career Path: From Junior to Lead",
            description: "This career guide outlines the progression path for software testers, including essential skills, certifications, and strategies for advancing from junior roles to QA leadership positions.",
            link: "https://www.ministryoftesting.com/dojo/lessons/building-a-career-in-testing",
            categories: ["Career Development", "Best Practices"],
            readingTime: 15,
            popularity: 95,
            date: "2025-06-01"
        },
        {
            title: "Testing in Production: Strategies and Risks",
            description: "Learn when and how to safely test in production environments. This article covers techniques like canary releases, feature flags, and monitoring for effective production testing.",
            link: "https://martinfowler.com/bliki/TestingInProduction.html",
            categories: ["Best Practices", "CI/CD"],
            readingTime: 14,
            popularity: 86,
            date: "2025-03-18"
        },
        {
            title: "Accessibility Testing: Ensuring Inclusive Design",
            description: "Accessibility testing ensures software is usable by people with disabilities. This guide covers WCAG standards, tools like Axe and Wave, and techniques for comprehensive accessibility testing.",
            link: "https://www.w3.org/WAI/test-evaluate/",
            categories: ["Accessibility", "UI Testing"],
            readingTime: 11,
            popularity: 89,
            date: "2025-04-25"
        },
        {
            title: "Chaos Engineering for Resilient Systems",
            description: "Chaos engineering proactively tests system resilience. Learn how to implement chaos experiments using tools like Chaos Monkey to build more reliable systems.",
            link: "https://principlesofchaos.org/",
            categories: ["Performance Testing", "Best Practices"],
            readingTime: 13,
            popularity: 84,
            date: "2025-02-28"
        },
        {
            title: "Testing Blockchain Applications: Unique Challenges",
            description: "Blockchain testing presents special challenges. This article covers strategies for testing smart contracts, decentralized applications, and blockchain infrastructure.",
            link: "https://www.softwaretestinghelp.com/blockchain-testing/",
            categories: ["Emerging Tech", "Best Practices"],
            readingTime: 12,
            popularity: 82,
            date: "2025-05-18"
        },
        {
            title: "Effective Test Data Management Strategies",
            description: "Learn how to create, manage, and anonymize test data for comprehensive testing. This guide covers techniques for generating synthetic data and managing data across environments.",
            link: "https://www.softwaretestinghelp.com/test-data-management/",
            categories: ["Best Practices", "Test Data"],
            readingTime: 11,
            popularity: 87,
            date: "2025-04-05"
        },
        {
            title: "Cucumber Best Practices for BDD",
            description: "Maximize the effectiveness of Behavior-Driven Development with Cucumber. This article covers Gherkin syntax best practices, step definitions, and reporting for successful BDD implementation.",
            link: "https://cucumber.io/docs/guides/best-practices/",
            categories: ["BDD", "Automation Testing"],
            readingTime: 10,
            popularity: 91,
            date: "2025-03-22"
        },
        {
            title: "Testing IoT Systems: Challenges and Solutions",
            description: "IoT testing requires unique approaches. Learn how to test connected devices, handle network variability, and ensure security in IoT ecosystems.",
            link: "https://www.iotforall.com/iot-testing-challenges-solutions",
            categories: ["Emerging Tech", "Mobile Testing"],
            readingTime: 14,
            popularity: 83,
            date: "2025-05-08"
        },
        {
            title: "Effective Log Analysis for Debugging",
            description: "Master log analysis techniques to quickly identify and diagnose issues. This guide covers log structuring, analysis tools, and patterns to look for during debugging.",
            link: "https://www.loggly.com/ultimate-guide/log-analysis/",
            categories: ["Debugging", "Best Practices"],
            readingTime: 9,
            popularity: 88,
            date: "2025-04-12"
        },
        {
            title: "Testing Machine Learning Systems",
            description: "Learn how to test ML systems including data validation, model testing, and monitoring for drift. This article covers unique challenges in testing AI-powered applications.",
            link: "https://www.oreilly.com/library/view/testing-ml-systems/9781098107950/",
            categories: ["AI Testing", "Emerging Tech"],
            readingTime: 15,
            popularity: 86,
            date: "2025-06-05"
        },
        {
            title: "Cross-Browser Testing Strategies",
            description: "Ensure consistent user experiences across browsers. This guide covers techniques, tools, and best practices for comprehensive cross-browser testing.",
            link: "https://www.browserstack.com/guide/cross-browser-testing-strategy",
            categories: ["UI Testing", "Compatibility"],
            readingTime: 11,
            popularity: 92,
            date: "2025-03-15"
        },
        {
            title: "Testing GraphQL APIs",
            description: "Learn specialized techniques for testing GraphQL APIs. This article covers schema validation, query testing, and performance considerations for GraphQL endpoints.",
            link: "https://graphql.org/learn/testing/",
            categories: ["API Testing", "Best Practices"],
            readingTime: 10,
            popularity: 89,
            date: "2025-05-22"
        },
        {
            title: "Shift-Left Testing: Implementation Guide",
            description: "Shift-left testing brings testing earlier in the development cycle. Learn how to implement shift-left practices to catch defects sooner and reduce costs.",
            link: "https://www.softwaretestinghelp.com/shift-left-testing/",
            categories: ["Best Practices", "CI/CD"],
            readingTime: 12,
            popularity: 94,
            date: "2025-04-08"
        },
        {
            title: "Performance Testing with k6",
            description: "k6 is an open-source load testing tool. This guide covers how to write, run, and analyze performance tests using k6 for modern applications.",
            link: "https://k6.io/docs/",
            categories: ["Performance Testing", "Automation"],
            readingTime: 11,
            popularity: 87,
            date: "2025-03-25"
        },
        {
            title: "Testing Serverless Applications",
            description: "Serverless architecture requires different testing approaches. Learn strategies for testing AWS Lambda, Azure Functions, and Google Cloud Functions.",
            link: "https://serverless.com/testing/",
            categories: ["Cloud Testing", "Emerging Tech"],
            readingTime: 13,
            popularity: 85,
            date: "2025-05-15"
        },
        {
            title: "Effective Test Automation Reporting",
            description: "Learn how to create meaningful test reports that provide actionable insights. This article covers reporting tools, metrics, and visualization techniques.",
            link: "https://www.extentreports.com/docs/versions/5/java/",
            categories: ["Reporting", "Best Practices"],
            readingTime: 9,
            popularity: 90,
            date: "2025-04-20"
        },
        {
            title: "Testing VR and AR Applications",
            description: "Discover unique testing challenges for virtual and augmented reality applications. This guide covers interaction testing, performance considerations, and UX validation for immersive experiences.",
            link: "https://www.softwaretestingnews.co.uk/testing-vr-and-ar-applications/",
            categories: ["Emerging Tech", "UI Testing"],
            readingTime: 12,
            popularity: 81,
            date: "2025-06-10"
        },
        {
            title: "Creating Maintainable Test Automation",
            description: "Learn strategies for building maintainable test automation frameworks. This article covers design patterns, abstraction layers, and refactoring techniques for sustainable automation.",
            link: "https://www.ministryoftesting.com/dojo/lessons/design-patterns-for-maintainable-automation",
            categories: ["Automation Testing", "Best Practices"],
            readingTime: 14,
            popularity: 96,
            date: "2025-03-30"
        },
        {
            title: "Testing Payment Gateways",
            description: "Learn specialized techniques for testing payment processing systems. This guide covers test environments, error handling, security, and compliance for payment integrations.",
            link: "https://www.softwaretestinghelp.com/payment-gateway-testing/",
            categories: ["Security Testing", "API Testing"],
            readingTime: 11,
            popularity: 88,
            date: "2025-05-25"
        },
        {
            title: "Performance Testing in Kubernetes",
            description: "Learn how to conduct performance testing for applications running in Kubernetes clusters. This guide covers tooling, metrics collection, and scaling tests.",
            link: "https://kubernetes.io/blog/2019/07/23/get-started-with-kubernetes-using-python/",
            categories: ["Performance Testing", "Cloud Testing"],
            readingTime: 13,
            popularity: 86,
            date: "2025-04-14"
        },
        {
            title: "Testing Legacy Systems: Strategies and Challenges",
            description: "Learn approaches for testing and modernizing legacy systems. This article covers risk-based testing, characterization tests, and incremental refactoring strategies.",
            link: "https://www.softwaretestinghelp.com/testing-legacy-systems/",
            categories: ["Best Practices", "Maintenance"],
            readingTime: 12,
            popularity: 84,
            date: "2025-05-05"
        },
        {
            title: "Automating Accessibility Testing",
            description: "Learn how to incorporate automated accessibility checks into your CI/CD pipeline. This guide covers tools, techniques, and best practices for automated a11y testing.",
            link: "https://www.deque.com/axe/",
            categories: ["Accessibility", "Automation Testing"],
            readingTime: 10,
            popularity: 89,
            date: "2025-04-28"
        },
        {
            title: "Testing Microfrontends Architecture",
            description: "Learn specialized testing approaches for microfrontends. This article covers component testing, integration strategies, and end-to-end testing for distributed frontend architectures.",
            link: "https://micro-frontends.org/",
            categories: ["UI Testing", "Architecture"],
            readingTime: 12,
            popularity: 85,
            date: "2025-06-08"
        },
        {
            title: "Effective Test Environment Management",
            description: "Learn strategies for managing complex test environments. This guide covers environment provisioning, data management, and configuration best practices.",
            link: "https://www.softwaretestinghelp.com/test-environment-management/",
            categories: ["Best Practices", "DevOps"],
            readingTime: 11,
            popularity: 87,
            date: "2025-03-17"
        },
        {
            title: "Testing WebSockets and Real-Time Applications",
            description: "Learn techniques for testing real-time communication systems. This article covers WebSocket testing tools, performance considerations, and error handling for real-time apps.",
            link: "https://www.ably.io/topic/websockets-testing",
            categories: ["API Testing", "Performance"],
            readingTime: 10,
            popularity: 83,
            date: "2025-05-30"
        },
        {
            title: "QA Metrics That Matter",
            description: "Learn which QA metrics provide real value and how to measure them effectively. This guide covers defect density, escape rate, test effectiveness, and other key quality indicators.",
            link: "https://www.softwaretestinghelp.com/qa-metrics/",
            categories: ["Reporting", "Best Practices"],
            readingTime: 9,
            popularity: 92,
            date: "2025-04-10"
        },
        {
            title: "Testing for Internationalization and Localization",
            description: "Learn comprehensive strategies for testing globalized software. This guide covers locale-specific testing, cultural considerations, and automation approaches for i18n and l10n.",
            link: "https://www.w3.org/International/tests/",
            categories: ["Compatibility", "UI Testing"],
            readingTime: 12,
            popularity: 86,
            date: "2025-05-20"
        },
        {
            title: "Testing Database Interactions",
            description: "Learn techniques for testing database operations, including schema validation, stored procedure testing, and data integrity checks.",
            link: "https://www.softwaretestinghelp.com/database-testing/",
            categories: ["Backend Testing", "Best Practices"],
            readingTime: 11,
            popularity: 88,
            date: "2025-03-28"
        },
        {
            title: "Testing in Regulated Industries",
            description: "Learn compliance requirements and testing approaches for regulated industries like healthcare and finance. This article covers audit trails, validation documentation, and regulatory standards.",
            link: "https://www.complianceonline.com/",
            categories: ["Compliance", "Best Practices"],
            readingTime: 14,
            popularity: 85,
            date: "2025-06-12"
        },
        {
            title: "Testing Error Handling and Recovery",
            description: "Learn how to systematically test error handling and recovery mechanisms. This guide covers fault injection, chaos engineering, and resilience testing techniques.",
            link: "https://www.softwaretestinghelp.com/error-handling-testing/",
            categories: ["Reliability", "Best Practices"],
            readingTime: 10,
            popularity: 89,
            date: "2025-04-18"
        },
        {
            title: "Testing Third-Party Integrations",
            description: "Learn strategies for testing applications with numerous third-party dependencies. This article covers mock services, contract testing, and failure mode testing for integrations.",
            link: "https://www.softwaretestinghelp.com/testing-third-party-integrations/",
            categories: ["API Testing", "Best Practices"],
            readingTime: 11,
            popularity: 87,
            date: "2025-05-10"
        },
        {
            title: "The Future of Testing: Predictions for 2026",
            description: "Explore emerging trends and technologies shaping the future of software testing. This article covers AI-driven testing, codeless automation, and evolving QA roles.",
            link: "https://www.softwaretestinghelp.com/future-of-testing/",
            categories: ["Trends", "Industry Insights"],
            readingTime: 12,
            popularity: 94,
            date: "2025-06-15"
        },
        {
            title: "Testing for Dark Mode Compatibility",
            description: "Learn how to test dark mode implementations across platforms. This guide covers visual testing, theme switching automation, and accessibility considerations for dark themes.",
            link: "https://css-tricks.com/dark-modes-with-css/",
            categories: ["UI Testing", "Accessibility"],
            readingTime: 9,
            popularity: 90,
            date: "2025-04-22"
        },
        {
            title: "Testing Progressive Web Apps (PWAs)",
            description: "Learn specialized testing approaches for Progressive Web Apps. This article covers offline capability testing, push notifications, and installation behavior validation.",
            link: "https://web.dev/progressive-web-apps/",
            categories: ["Mobile Testing", "Web Testing"],
            readingTime: 11,
            popularity: 86,
            date: "2025-05-28"
        },
        {
            title: "Testing for GDPR Compliance",
            description: "Learn how to test applications for GDPR compliance. This guide covers data subject rights, consent management, and data protection testing strategies.",
            link: "https://gdpr.eu/",
            categories: ["Compliance", "Security Testing"],
            readingTime: 13,
            popularity: 88,
            date: "2025-03-12"
        },
        {
            title: "Testing Voice-Enabled Applications",
            description: "Learn specialized testing techniques for voice-enabled applications like Alexa skills and Google Actions. This article covers voice interaction testing, NLP validation, and multi-modal experiences.",
            link: "https://developer.amazon.com/alexa-skills-kit",
            categories: ["Emerging Tech", "UI Testing"],
            readingTime: 12,
            popularity: 84,
            date: "2025-06-18"
        }

    ];

    const displayArticles = searchQuery.length >= 3 || activeCategory || showFavoritesOnly || sortOption !== 'default'
        ? filteredArticles
        : articles;

    return (
        <div className="articles">
            <Helmet>
                <title>Software Testing Articles | QA Hub</title>
                <meta name="description" content="Read expert articles on software testing — best practices, tools, automation strategies, and QA industry insights on QA Hub." />
                <meta property="og:title" content="Software Testing Articles | QA Hub" />
                <meta property="og:description" content="Expert articles on testing best practices, tools, and QA industry insights." />
                <meta property="og:url" content="https://www.qahub.co.in/articles" />
            </Helmet>
            <div className="articles-header">
                <div className="header-content">
                    <h1 className="text-center" data-aos="fade-down">
                        <span className="highlight">Testing</span> Knowledge Center
                    </h1>
                    <p className="text-center" data-aos="fade-up" data-aos-delay="100">
                        Expert articles to advance your software testing skills and career
                    </p>
                </div>
            </div>

            <div className="container articles-container">
                <div className="articles-controls" data-aos="fade-up">
                    <div className="search-container">
                        <div className="search-bar">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div
                                className={`filter-badge ${showFavoritesOnly ? "active" : ""}`}
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            >
                                <FontAwesomeIcon icon={faBookmark} />
                                <span>Bookmarks</span>
                            </div>
                        </div>

                        <div className="sort-filter">
                            <FontAwesomeIcon icon={faFilter} />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="form-control"
                            >
                                <option value="default">Sort by: Newest</option>
                                <option value="a-z">Sort by: A-Z</option>
                                <option value="popularity">Sort by: Popularity</option>
                                <option value="reading-time">Sort by: Reading Time</option>
                            </select>
                        </div>
                    </div>

                    <div className="category-filter">
                        <div
                            className={`category-tag ${!activeCategory ? 'active' : ''}`}
                            onClick={() => setActiveCategory(null)}
                        >
                            All Topics
                        </div>
                        {categories.map(category => (
                            <div
                                key={category.name}
                                className={`category-tag ${activeCategory === category.name ? 'active' : ''}`}
                                onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                            >
                                <FontAwesomeIcon
                                    icon={category.icon}
                                    className="category-icon"
                                />
                                {category.name}
                            </div>
                        ))}
                    </div>

                    {(activeCategory || searchQuery || showFavoritesOnly || sortOption !== 'default') && (
                        <div className="active-filters">
                            <div className="filter-indicator">
                                {activeCategory && (
                                    <div className="filter-tag">
                                        Topic: {activeCategory}
                                        <span onClick={() => setActiveCategory(null)}>×</span>
                                    </div>
                                )}
                                {searchQuery && (
                                    <div className="filter-tag">
                                        Search: "{searchQuery}"
                                        <span onClick={() => setSearchQuery("")}>×</span>
                                    </div>
                                )}
                                {showFavoritesOnly && (
                                    <div className="filter-tag">
                                        Bookmarks Only
                                        <span onClick={() => setShowFavoritesOnly(false)}>×</span>
                                    </div>
                                )}
                                {sortOption !== 'default' && (
                                    <div className="filter-tag">
                                        Sorted by: {sortOption === 'a-z' ? 'A-Z' :
                                        sortOption === 'popularity' ? 'Popularity' :
                                            sortOption === 'reading-time' ? 'Reading Time' : 'Newest'}
                                        <span onClick={() => setSortOption('default')}>×</span>
                                    </div>
                                )}
                                <button className="clear-filters" onClick={clearFilters}>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {displayArticles.length === 0 ? (
                    <div className="no-results" data-aos="fade-up">
                        <div className="no-results-content">
                            <h3>No articles found</h3>
                            <p>Try adjusting your filters or search term</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="articles-grid">
                        {displayArticles.map((article, index) => (
                            <div
                                className="article-card"
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index % 12 * 50}
                            >
                                <div className="card-header">
                                    <div className="article-meta">
                                        <div className="meta-item">
                                            <FontAwesomeIcon icon={faClock} />
                                            <span>{article.readingTime} min read</span>
                                        </div>
                                        <div className="meta-item">
                                            <FontAwesomeIcon icon={faThumbsUp} />
                                            <span>{article.popularity}% useful</span>
                                        </div>
                                    </div>
                                    <button
                                        className={`bookmark-btn ${favorites[article.link] ? 'bookmarked' : ''}`}
                                        onClick={() => toggleFavorite(article.link)}
                                        title={favorites[article.link] ? "Remove bookmark" : "Bookmark this article"}
                                    >
                                        <FontAwesomeIcon icon={faBookmark} />
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="article-topics">
                                        {article.categories.map((category, i) => (
                                            <span key={i} className="topic-tag">{category}</span>
                                        ))}
                                    </div>
                                    <h3 className="card-title">
                                        {article.title}
                                        {favorites[article.link] && (
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                className="favorite-star"
                                                title="Bookmarked"
                                            />
                                        )}
                                    </h3>
                                    <p className="card-text">
                                        {article.description}
                                    </p>
                                    <div className="card-footer">
                                        <a
                                            href={article.link}
                                            className="read-btn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Read Article
                                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;