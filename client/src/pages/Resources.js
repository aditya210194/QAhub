import React, { useEffect, useState } from 'react';
import './Resources.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faBookmark,
    faLink,
    faStar,
    faExternalLinkAlt,
    faFilter
} from '@fortawesome/free-solid-svg-icons';

// Category icons mapping
const categoryIcons = {
    "Automation Tools": "robot",
    "API Testing": "api",
    "Agile & Testing Methodologies": "agile",
    "Performance Testing": "gauge-high",
    "Security Testing": "shield-halved",
    "Test Management": "list-check",
    "UI Testing": "desktop",
    "Mobile Testing": "mobile-screen",
    "Cross-Browser Testing": "browser",
    "CI/CD Tools": "gears",
    "Test Automation Frameworks": "layer-group",
    "Test Data Management": "database",
    "Cloud Testing": "cloud",
    "Unit Testing": "vial",
    "Regression Testing": "repeat",
    "Test Automation Best Practices": "lightbulb",
    "Test Reporting": "chart-column",
    "QA Practice Platforms": "laptop-code",
    "Bug Tracking & Management": "bug",
    "Web Application Testing Practice": "globe",
    "Manual Testing Practice": "hand",
    "Continuous Integration & Delivery (CI/CD)": "arrows-rotate",
    "Test Automation Platforms": "server",
    "Accessibility Testing": "universal-access"
};

const categories = {
    "Automation Tools": [
        {
            title: "Selenium Documentation",
            description: "Official documentation for Selenium, a powerful tool for automating web applications.",
            link: "https://www.selenium.dev/documentation/",
        },
        {
            title: "Cypress Documentation",
            description: "Learn how to use Cypress for fast, reliable, and easy-to-use test automation for web applications.",
            link: "https://docs.cypress.io/",
        },
        {
            title: "Katalon Studio Documentation",
            description: "Comprehensive guide to get started with Katalon Studio for web, mobile, and API automation.",
            link: "https://docs.katalon.com/",
        },
        {
            title: "TestProject",
            description: "A free test automation platform for web, mobile, and API testing. Easy to use and integrates with Selenium and Appium.",
            link: "https://testproject.io/",
        },
        {
            title: "SoapUI",
            description: "A widely used tool for API functional testing. Ideal for testing REST and SOAP web services.",
            link: "https://www.soapui.org/",
        },
    ],
    "API Testing": [
        {
            title: "Postman API Testing Guide",
            description: "Learn how to create requests, automate tests, and integrate with CI/CD pipelines.",
            link: "https://learning.postman.com/docs/getting-started/introduction/",
        },
        {
            title: "Restful Booker",
            description: "An open REST API designed specifically for learning and testing API testing skills.",
            link: "https://restful-booker.herokuapp.com/",
        },
        {
            title: "RapidAPI Hub",
            description: "A platform for discovering, testing, and integrating APIs. It offers tools to test APIs directly from the browser.",
            link: "https://rapidapi.com/",
        },
        {
            title: "GitHub Actions for CI/CD",
            description: "Automate your CI/CD pipelines and integrate with testing frameworks like Postman and Selenium.",
            link: "https://docs.github.com/en/actions",
        },
        {
            title: "Rest API Testing with JMeter",
            description: "Learn how to perform API testing using JMeter, a popular open-source performance testing tool.",
            link: "https://jmeter.apache.org/usermanual/build-standalone.html",
        },
    ],
    "Agile & Testing Methodologies": [
        {
            title: "Agile Testing Quadrants",
            description: "An insightful article on the Agile Testing Quadrants and how they apply to modern software testing.",
            link: "https://www.agilealliance.org/glossary/testing-quadrants/",
        },
        {
            title: "Cucumber BDD Documentation",
            description: "Official documentation for Cucumber, a popular tool for Behavior-Driven Development (BDD) testing.",
            link: "https://cucumber.io/docs/",
        },
        {
            title: "Test Automation University",
            description: "Free, high-quality courses on test automation, including Selenium, Cypress, and other automation tools.",
            link: "https://testautomationu.applitools.com/",
        },
        {
            title: "Ministry of Testing",
            description: "A global community for software testers, offering blogs, forums, webinars, and courses.",
            link: "https://www.ministryoftesting.com/",
        },
        {
            title: "Codecademy: Software Testing Career Path",
            description: "A structured learning path covering foundational testing concepts, automation, and API testing.",
            link: "https://www.codecademy.com/learn/software-testing-career-path",
        },
    ],
    "Performance Testing": [
        {
            title: "JMeter User Manual",
            description: "JMeter is an open-source load testing tool. The user manual offers step-by-step instructions for load and performance testing.",
            link: "https://jmeter.apache.org/usermanual/index.html",
        },
        {
            title: "PerfTestPlus",
            description: "A performance testing learning platform with free resources to understand load and stress testing for web applications.",
            link: "https://www.perftestplus.com/",
        },
        {
            title: "BlazeMeter",
            description: "A platform for performance and load testing with a focus on API and web applications.",
            link: "https://www.blazemeter.com/",
        },
        {
            title: "Locust Performance Testing",
            description: "An open-source performance testing tool for web applications, designed for ease of use and scalability.",
            link: "https://locust.io/",
        },
        {
            title: "LoadRunner Documentation",
            description: "Official documentation for LoadRunner, a performance testing tool used for testing large-scale applications.",
            link: "https://admhelp.microfocus.com/lr/en/latest/help.htm",
        },
    ],
    "Security Testing": [
        {
            title: "OWASP Testing Guide",
            description: "The OWASP Testing Guide provides a comprehensive resource for web application security testing.",
            link: "https://owasp.org/www-project-web-security-testing-guide/",
        },
        {
            title: "WebGoat",
            description: "An intentionally insecure application from OWASP designed to teach security testing and identify vulnerabilities.",
            link: "https://owasp.org/www-project-webgoat/",
        },
        {
            title: "Security Testing with ZAP (OWASP ZAP)",
            description: "Learn how to perform security testing with OWASP ZAP, an open-source security testing tool.",
            link: "https://www.zaproxy.org/",
        },
        {
            title: "Bugzilla",
            description: "A powerful bug-tracking tool used by many organizations. Learn how to manage bug reports effectively.",
            link: "https://www.bugzilla.org/",
        },
        {
            title: "Burp Suite",
            description: "A popular security testing suite for web applications, offering tools for penetration testing.",
            link: "https://portswigger.net/burp",
        },
    ],
    "Test Management": [
        {
            title: "Jira Software for Test Management",
            description: "Learn how to use Jira Software for efficient test management. This guide provides a step-by-step approach to managing tests.",
            link: "https://www.atlassian.com/software/jira/test-management",
        },
        {
            title: "QA Symphony (qTest)",
            description: "An enterprise-level test management tool that supports Agile workflows and integrates with Jira.",
            link: "https://www.tricentis.com/products/qtest/",
        },
        {
            title: "TestLink",
            description: "An open-source test management tool to manage test cases, plans, and results.",
            link: "https://testlink.org/",
        },
        {
            title: "TestRail",
            description: "TestRail is a comprehensive test management tool that supports manual and automated testing.",
            link: "https://www.gurock.com/testrail/",
        },
        {
            title: "PractiTest",
            description: "A test management platform for managing your QA processes and integrating with multiple tools.",
            link: "https://www.practitest.com/",
        },
    ],
    "UI Testing": [
        {
            title: "Appium Documentation",
            description: "Official documentation for Appium, an open-source tool for mobile and tablet app automation.",
            link: "http://appium.io/docs/en/about-appium/intro/",
        },
        {
            title: "Sauce Labs",
            description: "A cloud-based platform for cross-browser and cross-device testing with Selenium, Appium, and Cypress.",
            link: "https://saucelabs.com/",
        },
        {
            title: "BrowserStack",
            description: "A cloud-based platform for testing websites and mobile applications across different browsers and devices.",
            link: "https://www.browserstack.com/",
        },
        {
            title: "LambdaTest Playground",
            description: "A playground for Selenium testing that includes real-world examples of HTML elements for testing locators and automation scripts.",
            link: "https://www.lambdatest.com/selenium-playground",
        },
        {
            title: "Ultimate QA",
            description: "A collection of free testing environments for practicing UI automation, handling tables, and interacting with various HTML elements.",
            link: "https://ultimateqa.com/automation/",
        },

    ],
    "Mobile Testing": [
        {
            title: "Appium Documentation",
            description: "Official documentation for Appium, an open-source tool for mobile and tablet app automation.",
            link: "http://appium.io/docs/en/about-appium/intro/",
        },
        {
            title: "Appium Studio",
            description: "A graphical user interface tool to simplify test creation for mobile app automation.",
            link: "https://www.experitest.com/appium-studio/",
        },
        {
            title: "MonkeyTalk",
            description: "A mobile test automation tool for Android and iOS that helps to create and run automated tests.",
            link: "https://www.mobilecomplete.com/monkeytalk/",
        },
        {
            title: "TestComplete Mobile",
            description: "A test automation tool that supports mobile application testing across multiple platforms.",
            link: "https://www.smartbear.com/testcomplete/",
        },
        {
            title: "Kobiton",
            description: "A cloud-based mobile app testing platform for Android and iOS devices.",
            link: "https://www.kobiton.com/",
        },
    ],
    "Cross-Browser Testing": [
        {
            title: "BrowserStack",
            description: "A cloud-based platform for testing websites and mobile applications across different browsers and devices.",
            link: "https://www.browserstack.com/",
        },
        {
            title: "Sauce Labs",
            description: "A cloud-based platform for cross-browser and cross-device testing with Selenium, Appium, and Cypress.",
            link: "https://saucelabs.com/",
        },
        {
            title: "LambdaTest",
            description: "A cloud-based platform for Selenium testing across various browsers and operating systems.",
            link: "https://www.lambdatest.com/",
        },
        {
            title: "SmartBear TestComplete",
            description: "A comprehensive testing tool supporting cross-browser testing for web applications.",
            link: "https://www.smartbear.com/testcomplete/",
        },
        {
            title: "Ghost Inspector",
            description: "A test automation tool for website testing across various browsers and operating systems.",
            link: "https://ghostinspector.com/",
        },
    ],
    "CI/CD Tools": [
        {
            title: "Jenkins",
            description: "An open-source automation server that supports building, testing, and deploying applications.",
            link: "https://www.jenkins.io/",
        },
        {
            title: "GitHub Actions",
            description: "Automate your workflows, integrating testing frameworks like Selenium and Postman.",
            link: "https://docs.github.com/en/actions",
        },
        {
            title: "CircleCI",
            description: "A continuous integration and continuous deployment platform that supports various testing frameworks.",
            link: "https://circleci.com/",
        },
        {
            title: "Travis CI",
            description: "A continuous integration service used to automate testing and deployments.",
            link: "https://travis-ci.com/",
        },
        {
            title: "Azure Pipelines",
            description: "A service for building, testing, and deploying applications, integrating various test tools.",
            link: "https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops",
        },
    ],
    "Test Automation Frameworks": [
        {
            title: "Selenium WebDriver",
            description: "A tool for automating web application testing across various browsers.",
            link: "https://www.selenium.dev/documentation/",
        },
        {
            title: "Cypress Framework",
            description: "A front-end testing tool to ensure fast, reliable testing of web applications.",
            link: "https://docs.cypress.io/",
        },
        {
            title: "Katalon Studio",
            description: "A unified test automation solution for mobile, web, and API testing.",
            link: "https://docs.katalon.com/",
        },
        {
            title: "Robot Framework",
            description: "An open-source test automation framework for acceptance testing and acceptance test-driven development (ATDD).",
            link: "https://robotframework.org/",
        },
        {
            title: "TestNG",
            description: "A framework for building and running automated tests using Java.",
            link: "https://testng.org/doc/",
        },
    ],
    "Test Data Management": [
        {
            title: "FactoryBoy",
            description: "A test data creation library for Python that allows for creating realistic test data.",
            link: "https://factoryboy.readthedocs.io/",
        },
        {
            title: "Test Data Manager",
            description: "A tool for generating and managing test data for databases and applications.",
            link: "https://www.apexsql.com/sql_tools_testdatamanager.aspx",
        },
        {
            title: "Faker",
            description: "A Python library that generates fake data for testing purposes.",
            link: "https://faker.readthedocs.io/",
        },
        {
            title: "Test Data Factory",
            description: "A tool for generating test data using templates and data models.",
            link: "https://www.testdatafactory.com/",
        },
        {
            title: "Data Generator for Testers",
            description: "A browser-based tool to create test data for various formats and APIs.",
            link: "https://data-generator.com/",
        },
        ],
    "Cloud Testing": [
        {
            title: "AWS Device Farm",
            description: "A cloud-based testing service that allows you to test mobile applications across real devices in the cloud.",
            link: "https://aws.amazon.com/device-farm/",
        },
        {
            title: "Google Cloud Test Lab",
            description: "Test your mobile app across a range of Android devices using Google Cloud Test Lab.",
            link: "https://cloud.google.com/sdk/gcloud/reference/firebase/test/android/",
        },
        {
            title: "Microsoft Azure Test Plans",
            description: "Azure Test Plans provides a set of testing tools for managing test cases, running tests, and tracking defects.",
            link: "https://azure.microsoft.com/en-us/services/devops/test-plans/",
        },
        {
            title: "BrowserStack Cloud Testing",
            description: "A cloud-based platform for automated and manual cross-browser testing.",
            link: "https://www.browserstack.com/",
        },
        {
            title: "Sauce Labs",
            description: "A platform for cloud-based automated testing across different devices and browsers.",
            link: "https://saucelabs.com/",
        },
    ],
    "Unit Testing": [
        {
            title: "JUnit",
            description: "A widely-used testing framework for Java, designed to test individual units of code.",
            link: "https://junit.org/junit5/",
        },
        {
            title: "NUnit",
            description: "A testing framework for .NET developers, used to write unit tests in C#.",
            link: "https://nunit.org/",
        },
        {
            title: "Mocha.js",
            description: "A JavaScript test framework that runs on Node.js and in the browser, supporting multiple assertion libraries.",
            link: "https://mochajs.org/",
        },
        {
            title: "Jest",
            description: "A JavaScript testing framework with a focus on simplicity, providing a rich API for testing React and Node applications.",
            link: "https://jestjs.io/",
        },
        {
            title: "TestCafe",
            description: "An end-to-end testing framework for web applications, built on JavaScript, supporting automation and testing of web apps across browsers.",
            link: "https://devexpress.github.io/testcafe/",
        },
    ],
    "Regression Testing": [
        {
            title: "Selenium for Regression Testing",
            description: "Selenium is a powerful tool to automate regression testing for web applications.",
            link: "https://www.selenium.dev/documentation/en/",
        },
        {
            title: "Ranorex",
            description: "Ranorex Studio is a powerful tool for automated regression testing with a rich set of features for web, desktop, and mobile applications.",
            link: "https://www.ranorex.com/",
        },
        {
            title: "QTP/UFT for Regression Testing",
            description: "QuickTest Professional (QTP), now known as Unified Functional Testing (UFT), is a tool that supports automated regression testing for web and desktop applications.",
            link: "https://www.microfocus.com/documentation/silk-test-20/en/",
        },
        {
            title: "TestComplete for Regression",
            description: "TestComplete is a UI-based automation tool used for regression testing of desktop, web, and mobile applications.",
            link: "https://smartbear.com/product/testcomplete/overview/",
        },
        {
            title: "Applitools for Regression Testing",
            description: "Applitools provides visual regression testing that ensures the application looks correct across different devices, screens, and resolutions.",
            link: "https://applitools.com/",
        },
    ],
    "Test Automation Best Practices": [
        {
            title: "Automated Test Design Principles",
            description: "This guide explains the key principles of automated test design, such as reusability, maintainability, and scalability.",
            link: "https://www.softwaretestinghelp.com/automated-testing-best-practices/",
        },
        {
            title: "Test Automation Pyramid",
            description: "The Test Automation Pyramid is a framework that emphasizes the need for a balanced approach between unit, integration, and UI tests.",
            link: "https://martinfowler.com/bliki/TestPyramid.html",
        },
        {
            title: "Creating Maintainable Test Scripts",
            description: "Learn strategies for writing maintainable test scripts that are easy to update and understand.",
            link: "https://www.toolsqa.com/selenium-webdriver/maintainable-selenium-test-scripts/",
        },
        {
            title: "Test Automation Strategy",
            description: "This document outlines best practices for creating a successful test automation strategy, from tool selection to team collaboration.",
            link: "https://www.atlassian.com/continuous-delivery/test-automation-strategy",
        },
        {
            title: "How to Prevent Flaky Tests",
            description: "Flaky tests can undermine test automation reliability. Learn how to prevent and fix flaky tests.",
            link: "https://testersdock.com/how-to-prevent-flaky-tests-in-test-automation/",
        },
    ],
    "Test Reporting": [
        {
            title: "Allure Framework",
            description: "Allure is a flexible, lightweight multi-language test reporting framework for displaying test results in a visually appealing way.",
            link: "https://allure.qatools.ru/",
        },
        {
            title: "ExtentReports",
            description: "ExtentReports is a reporting library for test automation frameworks that generates detailed HTML reports.",
            link: "https://extentreports.com/",
        },
        {
            title: "Cucumber Reports",
            description: "Learn how to generate detailed reports for Behavior-Driven Development (BDD) tests created with Cucumber.",
            link: "https://cucumber.io/docs/guides/reporting/",
        },
        {
            title: "TestNG Reports",
            description: "Learn how to configure and generate HTML, XML, and other types of reports for your TestNG-based test automation.",
            link: "https://testng.org/doc/reporting.html",
        },
        {
            title: "Jenkins Reporting Plugins",
            description: "Jenkins has various reporting plugins to generate reports after test executions for easy viewing and analysis.",
            link: "https://plugins.jenkins.io/",
        },
    ],
    "QA Practice Platforms": [
        {
            title: "Testing Playground",
            description: "An interactive site to practice automation scripts on various HTML elements.",
            link: "https://www.testingplayground.com/",
        },
        {
            title: "QA Test Lab",
            description: "A platform offering various real-world testing scenarios, including automation, manual testing, and performance testing.",
            link: "https://qatestlab.com/",
        },
        {
            title: "Practice Automation",
            description: "A free practice environment for learning automation testing skills with real-world examples and problems.",
            link: "https://www.practiceautomation.com/",
        },
        {
            title: "Automated Testing Practice Environment",
            description: "A site offering hands-on experience with various test automation frameworks like Selenium, Appium, and Cypress.",
            link: "https://www.automated-testing-practice.com/",
        },
        {
            title: "Test Automation University - Selenium",
            description: "A comprehensive platform offering free courses on test automation, including Selenium WebDriver.",
            link: "https://testautomationu.applitools.com/selenium-webdriver-tutorial-java/",
        },
    ],
    "Bug Tracking & Management": [
        {
            title: "Bugzilla",
            description: "An open-source bug tracking system that allows you to report and manage bugs in software projects.",
            link: "https://www.bugzilla.org/",
        },
        {
            title: "Redmine",
            description: "A flexible project management web application for issue tracking and project management.",
            link: "https://www.redmine.org/",
        },
        {
            title: "Jira Software",
            description: "A popular tool for bug tracking and agile project management, used by many teams for organizing QA processes.",
            link: "https://www.atlassian.com/software/jira",
        },
        {
            title: "YouTrack",
            description: "An issue tracker that supports agile project management, customizable workflows, and bug tracking.",
            link: "https://www.jetbrains.com/youtrack/",
        },
        {
            title: "MantisBT",
            description: "An open-source bug tracking tool that supports multiple languages and integrates with various platforms.",
            link: "https://www.mantisbt.org/",
        },
    ],
    "Web Application Testing Practice": [
        {
            title: "The Testing Academy",
            description: "A platform to help testers practice web application testing with various tools, including Selenium and Cypress.",
            link: "https://www.thetestingacademy.com/",
        },
        {
            title: "BrowserStack Automate",
            description: "A cloud-based platform that allows you to practice and test web applications across different devices and browsers.",
            link: "https://www.browserstack.com/automate",
        },
        {
            title: "LambdaTest Selenium Playground",
            description: "An interactive platform to practice writing and running Selenium test scripts on cloud grids.",
            link: "https://www.lambdatest.com/selenium-playground",
        },
        {
            title: "W3C Test Suites",
            description: "A collection of test suites for web standards compliance, providing valuable practice in testing web applications.",
            link: "https://www.w3.org/QA/TestTools/",
        },
        {
            title: "Selenium Test Automation Training Platform",
            description: "Learn test automation and practice hands-on with Selenium and other tools in a guided environment.",
            link: "https://www.learnseleniumwithus.com/",
        },
    ],
    "Manual Testing Practice": [
        {
            title: "Manual Testing Practice Lab",
            description: "A platform offering real-world examples for practicing manual testing, including test case writing and bug reporting.",
            link: "https://www.manualtestingpractice.com/",
        },
        {
            title: "Testing Practice - Manual Testing Challenges",
            description: "A site that provides challenges and problems to solve for practicing manual testing concepts.",
            link: "https://www.testingpractice.com/",
        },
        {
            title: "TestLink Manual Testing",
            description: "A practice environment for managing and executing manual test cases, with real-world scenarios for testing.",
            link: "https://testlink.org/",
        },
        {
            title: "Software Testing Help - Practice Manual Testing",
            description: "A comprehensive resource for manual testing exercises, including tutorials and real-life testing scenarios.",
            link: "https://www.softwaretestinghelp.com/manual-testing-tutorial-2/",
        },
        {
            title: "QA Mentor - Manual Testing Practice",
            description: "A QA resource offering practical exercises, tutorials, and tips for manual testing professionals.",
            link: "https://www.qamentor.com/manual-testing-services/",
        },
    ],
    "Continuous Integration & Delivery (CI/CD)": [
        {
            title: "Jenkins CI/CD Guide",
            description: "Learn how to integrate Jenkins with your testing processes for continuous integration and delivery automation.",
            link: "https://www.jenkins.io/doc/",
        },
        {
            title: "CircleCI",
            description: "A popular platform for practicing CI/CD processes, allowing integration with various testing frameworks.",
            link: "https://circleci.com/docs/",
        },
        {
            title: "GitLab CI/CD",
            description: "A web-based DevOps lifecycle tool that includes continuous integration, testing, and delivery features.",
            link: "https://docs.gitlab.com/ee/ci/",
        },
        {
            title: "Travis CI",
            description: "A continuous integration service that can be used to automate testing and deployment pipelines.",
            link: "https://docs.travis-ci.com/",
        },
        {
            title: "Buildkite",
            description: "A platform that enables you to practice building and deploying applications using CI/CD pipelines.",
            link: "https://buildkite.com/docs",
        },
    ],
    "Test Automation Platforms": [
        {
            title: "SeleniumGrid",
            description: "A platform for practicing running automated Selenium tests on multiple machines and browsers in parallel.",
            link: "https://www.selenium.dev/documentation/en/grid/",
        },
        {
            title: "Katalon Studio",
            description: "A platform offering test automation with a range of features for web, API, and mobile testing.",
            link: "https://www.katalon.com/",
        },
        {
            title: "Rainforest QA",
            description: "A test automation platform that allows you to practice and automate functional and regression testing without writing code.",
            link: "https://www.rainforestqa.com/",
        },
        {
            title: "TestComplete",
            description: "A powerful automation platform for web, mobile, and desktop testing that supports multiple scripting languages.",
            link: "https://smartbear.com/product/testcomplete/overview/",
        },
        {
            title: "Robot Framework",
            description: "A generic test automation framework for acceptance testing and robotic process automation (RPA).",
            link: "https://robotframework.org/",
        },
    ],
    "Accessibility Testing": [
        {
            title: "WAVE Web Accessibility Tool",
            description: "A browser extension for accessibility testing, providing visual feedback about accessibility issues on web pages.",
            link: "https://wave.webaim.org/",
        },
        {
            title: "Axe Accessibility Testing",
            description: "A suite of tools that can be integrated into your development and testing processes for automated accessibility testing.",
            link: "https://www.deque.com/axe/",
        },
        {
            title: "Lighthouse Accessibility Testing",
            description: "An open-source, automated tool for improving the quality of web pages, focusing on accessibility, performance, and SEO.",
            link: "https://developers.google.com/web/tools/lighthouse",
        },
        {
            title: "AChecker",
            description: "An accessibility checker that helps to identify web accessibility issues and improve user experiences.",
            link: "https://achecker.ca/checker/index.php",
        },
        {
            title: "WebAIM Accessibility Tools",
            description: "A comprehensive set of tools for assessing and improving web accessibility.",
            link: "https://www.webaim.org/standards/wcag/checklist/",
        },
    ],
};

const Resources = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [activeCategory, setActiveCategory] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('resourceFavorites');
        return saved ? JSON.parse(saved) : {};
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    useEffect(() => {
        localStorage.setItem('resourceFavorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        let result = {...categories};

        // Apply search filter
        if (searchTerm) {
            result = {};
            Object.keys(categories).forEach((category) => {
                result[category] = categories[category].filter((resource) =>
                    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        // Apply category filter
        if (activeCategory) {
            Object.keys(result).forEach(category => {
                if (category !== activeCategory) delete result[category];
            });
        }

        // Apply favorites filter
        if (showFavoritesOnly) {
            Object.keys(result).forEach(category => {
                result[category] = result[category].filter(resource => favorites[resource.link]);
            });
        }

        // Apply sorting
        if (sortOption !== 'default') {
            Object.keys(result).forEach(category => {
                result[category] = [...result[category]].sort((a, b) => {
                    if (sortOption === 'a-z') return a.title.localeCompare(b.title);
                    if (sortOption === 'popularity') {
                        // Placeholder for popularity sorting - in real app this would come from backend
                        return Math.random() - 0.5;
                    }
                    return 0;
                });
            });
        }

        setFilteredCategories(result);
    }, [searchTerm, activeCategory, favorites, showFavoritesOnly, sortOption]);

    const toggleFavorite = (link) => {
        setFavorites(prev => ({
            ...prev,
            [link]: !prev[link]
        }));
    };

    const clearFilters = () => {
        setActiveCategory(null);
        setSearchTerm("");
        setShowFavoritesOnly(false);
    };

    return (
        <div className="resources">
            <div className="resource-header">
                <div className="header-content">
                    <h1 className="text-center" data-aos="fade-down">
                        <span className="highlight">Testing</span> Resources Hub
                    </h1>
                    <p className="text-center" data-aos="fade-up" data-aos-delay="100">
                        Discover curated tools, guides, and platforms to elevate your testing expertise
                    </p>
                </div>
            </div>

            <div className="container resource-container">
                <div className="resource-controls" data-aos="fade-up">
                    <div className="search-container">
                        <div className="search-bar">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="filter-badge" onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
                                <FontAwesomeIcon
                                    icon={faBookmark}
                                    className={showFavoritesOnly ? "active" : ""}
                                />
                                <span>Favorites</span>
                            </div>
                        </div>

                        <div className="sort-filter">
                            <FontAwesomeIcon icon={faFilter} />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="form-control"
                            >
                                <option value="default">Sort by: Default</option>
                                <option value="a-z">Sort by: A-Z</option>
                                <option value="popularity">Sort by: Popularity</option>
                            </select>
                        </div>
                    </div>

                    <div className="category-filter">
                        <div
                            className={`category-tag ${!activeCategory ? 'active' : ''}`}
                            onClick={() => setActiveCategory(null)}
                        >
                            All Categories
                        </div>
                        {Object.keys(categories).map(category => (
                            <div
                                key={category}
                                className={`category-tag ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                            >
                                <FontAwesomeIcon
                                    icon={categoryIcons[category]}
                                    className="category-icon"
                                />
                                {category}
                            </div>
                        ))}
                    </div>

                    {(activeCategory || searchTerm || showFavoritesOnly) && (
                        <div className="active-filters">
                            <div className="filter-indicator">
                                {activeCategory && (
                                    <div className="filter-tag">
                                        Category: {activeCategory}
                                        <span onClick={() => setActiveCategory(null)}>×</span>
                                    </div>
                                )}
                                {searchTerm && (
                                    <div className="filter-tag">
                                        Search: "{searchTerm}"
                                        <span onClick={() => setSearchTerm("")}>×</span>
                                    </div>
                                )}
                                {showFavoritesOnly && (
                                    <div className="filter-tag">
                                        Favorites Only
                                        <span onClick={() => setShowFavoritesOnly(false)}>×</span>
                                    </div>
                                )}
                                <button className="clear-filters" onClick={clearFilters}>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {Object.keys(filteredCategories).length === 0 ? (
                    <div className="no-results" data-aos="fade-up">
                        <div className="no-results-content">
                            <h3>No resources found</h3>
                            <p>Try adjusting your filters or search term</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    Object.keys(filteredCategories).map((category) => (
                        <div key={category} className="category-section" data-aos="fade-up">
                            <div className="category-header">
                                <h3 className="category-title">
                                    <FontAwesomeIcon
                                        icon={categoryIcons[category]}
                                        className="category-icon"
                                    />
                                    {category}
                                </h3>
                                <div className="resource-count">
                                    {filteredCategories[category].length} resources
                                </div>
                            </div>

                            <div className="resource-grid">
                                {filteredCategories[category].map((resource, index) => (
                                    <div
                                        className="resource-card"
                                        key={index}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                    >
                                        <div className="card-header">
                                            <h5 className="card-title">
                                                {resource.title}
                                                {favorites[resource.link] && (
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        className="favorite-star"
                                                        title="Bookmarked"
                                                    />
                                                )}
                                            </h5>
                                            <div className="card-actions">
                                                <button
                                                    className={`bookmark-btn ${favorites[resource.link] ? 'bookmarked' : ''}`}
                                                    onClick={() => toggleFavorite(resource.link)}
                                                    title={favorites[resource.link] ? "Remove bookmark" : "Bookmark this resource"}
                                                >
                                                    <FontAwesomeIcon icon={faBookmark} />
                                                </button>
                                                <button
                                                    className="copy-link"
                                                    onClick={() => navigator.clipboard.writeText(resource.link)}
                                                    title="Copy link to clipboard"
                                                >
                                                    <FontAwesomeIcon icon={faLink} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">
                                                {resource.description}
                                            </p>
                                            <div className="card-footer">
                                                <a
                                                    href={resource.link}
                                                    className="explore-btn"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Explore Resource
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Resources;
