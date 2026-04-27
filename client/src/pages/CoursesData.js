import manualTestingImg from '../images/manual-testing.webp';
import automationImg from '../images/Automation.jpg';
import agileProcessImg from '../images/agile-process.png';
import apiTestingImg from '../images/ApiTestingImg.jpg';
import performanceImg from '../images/Performance.jpg';
import securityTestingImg from '../images/securityTestingImg.jpg';
import testManagementImg from '../images/testManagementImg.jpeg';
import mobileTestingImg from '../images/mobileTestingImg.png';
import ciTestingImg from '../images/ciTestingImg.jpg';
import tddTestingImg from '../images/tddTestingImg.png';
import usabilityTestingImg from '../images/usabilityTestingImg.png';
import debuggingTestingImg from '../images/debuggingTestingImg.jpg';
import loadTestingImg from '../images/loadTestingImg.jpg';
import regressionTestingImg from '../images/regressionTestingImg.jpg';
import agileTestingImg from '../images/agileTestingImg.jpg';
import devopsTestingImg from '../images/devopsTestingImg.jpg';
import automationFrameworksImg from '../images/automationFrameworksImg.jpg';
import cloudTestingImg from '../images/cloudTestingImg.jpg';
import bddTestingImg from '../images/bddTestingImg.jpg';
import testScriptsImg from '../images/testScriptsImg.png';
import unitTestingImg from '../images/unitTestingImg.jpg';
import testDataManagementImg from '../images/testDataManagementImg.jpg';
import testEnvironmentImg from '../images/testEnvironmentImg.jpg';
import usabilityAccessibilityImg from '../images/usabilityAccessibilityImg.jpg';
import automationToolsImg from '../images/automationToolsImg.png';
import testReportingImg from '../images/testReportingImg.png';
import testCoverageImg from '../images/TestCoverage.jpg';
import testExecutionImg from '../images/testExecutionImg.png';
import testStrategyImg from '../images/testStrategyImg.jpeg';
import bigDataTestingImg from '../images/bigDataTestingImg.png';
import testAutomationBestPracticesImg from '../images/testAutomationBestPracticesImg.jpg';
import exploratoryTestingImg from '../images/exploratoryTestingImg.jpg';
import integrationTestingImg from '../images/integrationTestingImg.png';
import automationFrameworkDesignImg from '../images/automationFrameworkDesignImg.png';
import endToEndTestingImg from '../images/endToEndTestingImg.jpg';
import pythonAutomationImg from '../images/pythonAutomationImg.jpg';
import continuousTestingImg from '../images/continuousTestingImg.png';
import javaAutomationImg from '../images/javaAutomationImg.png';
import acceptanceTestingImg from '../images/acceptanceTestingImg.jpg';
import apiAutomationTestingImg from '../images/apiAutomationTestingImg.png';
import rubyAutomationImg from '../images/rubyAutomationImg.jpg';
import functionalTestingImg from '../images/functionalTestingImg.jpg';
import loadStressTestingImg from '../images/loadTestingImg.jpg';
import performanceTestingImg from '../images/Performance.jpg';
import manualTestCaseDesignImg from '../images/manualTestCaseDesignImg.jpg';
import apiPerformanceTestingImg from '../images/apiPerformanceTestingImg.png';
import testPlanCreationImg from '../images/testPlanCreationImg.png';
import testManagementToolsImg from '../images/testManagementToolsImg.jpg';



// CoursesData.js
const CoursesData = [
    {
        id: "1",
        title: "Complete Manual Testing Masterclass",
        description: "Learn manual testing techniques from scratch with real-world examples and practical exercises.",
        shortDescription: "Master manual testing fundamentals with hands-on projects",
        image: "https://picsum.photos/id/100/400/250",
        category: "Manual Testing",
        level: "Beginner",
        rating: 4.8,
        duration: "15 hours",
        durationValue: 15,
        instructor: "Sarah Johnson",
        enrolled: 3200,
        reviews: 128,
        date: "2024-01-15",
        modules: [
            {
                title: "Testing Fundamentals",
                lessons: [
                    { title: "Introduction to Software Testing", duration: "25 min" },
                    { title: "SDLC & STLC", duration: "30 min" },
                    { title: "Test Planning & Documentation", duration: "45 min" }
                ]
            },
            {
                title: "Test Design Techniques",
                lessons: [
                    { title: "Equivalence Partitioning", duration: "35 min" },
                    { title: "Boundary Value Analysis", duration: "40 min" }
                ]
            }
        ],
        learningPoints: [
            "Create comprehensive test plans",
            "Design effective test cases",
            "Execute manual tests efficiently",
            "Report and track defects",
            "Understand different testing levels"
        ],
        instructorImage: "https://picsum.photos/id/64/150/150",
        instructorTitle: "Senior QA Lead",
        instructorRating: 4.9,
        instructorStudents: 18500,
        instructorCourses: 7,
        instructorBio: "Sarah has 12 years of experience in quality assurance and has trained teams at Fortune 500 companies.",
        ratings: {
            5: 98,
            4: 25,
            3: 4,
            2: 1,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/177/50/50",
                name: "Michael Chen",
                rating: 5,
                date: "2024-02-10",
                content: "The best manual testing course I've taken. Sarah explains complex concepts in simple terms."
            },
            {
                avatar: "https://picsum.photos/id/338/50/50",
                name: "Emma Rodriguez",
                rating: 4,
                date: "2024-01-28",
                content: "Practical examples helped me implement testing strategies at work immediately."
            }
        ],
        videoUrl: "https://youtu.be/oOvURgHcd4w?si=7_STQFo5DmWlKxUu",
        price: 0,
        originalPrice: 129.99,
        discount: 100,
        articles: 15,
        resources: 24
    },
    {
        id: "2",
        title: "Selenium WebDriver with Java",
        description: "Master browser automation using Selenium WebDriver, Java, and TestNG framework.",
        shortDescription: "Build robust automation frameworks from scratch",
        image: "https://picsum.photos/id/20/400/250",
        category: "Automation Testing",
        level: "Intermediate",
        rating: 4.7,
        duration: "22 hours",
        durationValue: 22,
        instructor: "David Wilson",
        enrolled: 4500,
        reviews: 210,
        date: "2023-11-20",
        modules: [
            {
                title: "Selenium Basics",
                lessons: [
                    { title: "WebDriver Setup & Configuration", duration: "40 min" },
                    { title: "Locator Strategies", duration: "55 min" }
                ]
            },
            {
                title: "Advanced Concepts",
                lessons: [
                    { title: "Handling Dynamic Elements", duration: "50 min" },
                    { title: "Framework Design Patterns", duration: "65 min" }
                ]
            }
        ],
        learningPoints: [
            "Automate complex web applications",
            "Implement Page Object Model",
            "Create data-driven tests",
            "Generate detailed reports",
            "Integrate with CI/CD pipelines"
        ],
        instructorImage: "https://picsum.photos/id/237/150/150",
        instructorTitle: "Test Automation Architect",
        instructorRating: 4.8,
        instructorStudents: 22400,
        instructorCourses: 9,
        instructorBio: "David specializes in building enterprise-level test automation frameworks and has consulted for top tech companies.",
        ratings: {
            5: 165,
            4: 38,
            3: 6,
            2: 1,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/1074/50/50",
                name: "James Taylor",
                rating: 5,
                date: "2024-03-05",
                content: "The framework design section alone is worth the price. Clear explanations and practical examples."
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 109.99,
        originalPrice: 149.99,
        discount: 27,
        articles: 18,
        resources: 32
    },
    {
        id: "3",
        title: "Performance Testing with JMeter",
        description: "Learn to conduct load, stress, and endurance testing using Apache JMeter.",
        shortDescription: "Optimize application performance through systematic testing",
        image: "https://picsum.photos/id/30/400/250",
        category: "Performance Testing",
        level: "Intermediate",
        rating: 4.6,
        duration: "12 hours",
        durationValue: 12,
        instructor: "Lisa Anderson",
        enrolled: 2100,
        reviews: 87,
        date: "2024-02-28",
        modules: [
            {
                title: "JMeter Fundamentals",
                lessons: [
                    { title: "Installation & Test Planning", duration: "30 min" },
                    { title: "Building Test Scripts", duration: "45 min" }
                ]
            }
        ],
        learningPoints: [
            "Design realistic performance tests",
            "Analyze performance metrics",
            "Identify system bottlenecks",
            "Distributed testing setup",
            "Generate professional reports"
        ],
        instructorImage: "https://picsum.photos/id/65/150/150",
        instructorTitle: "Performance Engineering Lead",
        instructorRating: 4.7,
        instructorStudents: 11200,
        instructorCourses: 5,
        instructorBio: "Lisa has optimized performance for financial systems handling millions of transactions daily.",
        ratings: {
            5: 65,
            4: 18,
            3: 4,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/64/50/50",
                name: "Robert Kim",
                rating: 5,
                date: "2024-03-12",
                content: "Finally understand how to interpret JMeter results properly. Great real-world examples!"
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 94.99,
        originalPrice: 119.99,
        discount: 21,
        articles: 12,
        resources: 18
    },
    {
        id: "4",
        title: "API Testing with Postman",
        description: "Master API testing techniques using Postman, including automation and monitoring.",
        shortDescription: "Become an API testing expert with industry best practices",
        image: "https://picsum.photos/id/40/400/250",
        category: "API Testing",
        level: "Beginner",
        rating: 4.9,
        duration: "10 hours",
        durationValue: 10,
        instructor: "Michael Brown",
        enrolled: 3800,
        reviews: 145,
        date: "2023-12-10",
        modules: [
            {
                title: "Postman Essentials",
                lessons: [
                    { title: "API Concepts & HTTP Methods", duration: "35 min" },
                    { title: "Building Request Collections", duration: "40 min" }
                ]
            }
        ],
        learningPoints: [
            "REST API testing fundamentals",
            "Create automated test suites",
            "Implement API monitoring",
            "Work with authentication methods",
            "Generate comprehensive documentation"
        ],
        instructorImage: "https://picsum.photos/id/60/150/150",
        instructorTitle: "API Testing Specialist",
        instructorRating: 4.9,
        instructorStudents: 15600,
        instructorCourses: 6,
        instructorBio: "Michael has architected API testing solutions for microservices environments at scale.",
        ratings: {
            5: 120,
            4: 22,
            3: 3,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/1011/50/50",
                name: "Sophia Williams",
                rating: 5,
                date: "2024-01-22",
                content: "The automation sections completely transformed how we test our APIs. Worth every penny!"
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        articles: 14,
        resources: 22
    },
    {
        id: "5",
        title: "Mobile App Testing Pro",
        description: "Comprehensive guide to testing Android and iOS applications on real devices and emulators.",
        shortDescription: "Master mobile testing techniques for both platforms",
        image: "https://picsum.photos/id/50/400/250",
        category: "Mobile Testing",
        level: "Intermediate",
        rating: 4.5,
        duration: "18 hours",
        durationValue: 18,
        instructor: "Jennifer Lee",
        enrolled: 2900,
        reviews: 96,
        date: "2024-01-05",
        modules: [
            {
                title: "Mobile Testing Fundamentals",
                lessons: [
                    { title: "Mobile Testing Challenges", duration: "30 min" },
                    { title: "Testing on Real Devices", duration: "45 min" }
                ]
            }
        ],
        learningPoints: [
            "Create mobile test strategies",
            "Test on physical devices and emulators",
            "Automate mobile tests with Appium",
            "Performance testing for mobile",
            "Security considerations"
        ],
        instructorImage: "https://picsum.photos/id/433/150/150",
        instructorTitle: "Mobile QA Director",
        instructorRating: 4.6,
        instructorStudents: 13400,
        instructorCourses: 4,
        instructorBio: "Jennifer leads mobile testing initiatives for top-rated apps with millions of users.",
        ratings: {
            5: 70,
            4: 22,
            3: 4,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/1062/50/50",
                name: "Thomas Anderson",
                rating: 4,
                date: "2024-02-18",
                content: "Great coverage of both Android and iOS testing approaches. Practical labs were very helpful."
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 99.99,
        articles: 16,
        resources: 28
    },
    {
        id: "6",
        title: "Security Testing Essentials",
        description: "Learn penetration testing techniques to identify vulnerabilities in web applications.",
        shortDescription: "Discover and fix security vulnerabilities like a pro",
        image: "https://picsum.photos/id/96/400/250",
        category: "Security Testing",
        level: "Advanced",
        rating: 4.8,
        duration: "20 hours",
        durationValue: 20,
        instructor: "Robert Davis",
        enrolled: 1800,
        reviews: 73,
        date: "2023-10-15",
        modules: [
            {
                title: "Security Fundamentals",
                lessons: [
                    { title: "OWASP Top 10 Overview", duration: "45 min" },
                    { title: "Security Testing Methodologies", duration: "50 min" }
                ]
            }
        ],
        learningPoints: [
            "Identify common vulnerabilities",
            "Use security testing tools",
            "Conduct penetration tests",
            "Secure coding principles",
            "Create security test reports"
        ],
        instructorImage: "https://picsum.photos/id/177/150/150",
        instructorTitle: "Security Testing Expert",
        instructorRating: 4.9,
        instructorStudents: 8900,
        instructorCourses: 3,
        instructorBio: "Robert is a certified ethical hacker with 15 years of security testing experience.",
        ratings: {
            5: 58,
            4: 13,
            3: 2,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/342/50/50",
                name: "Daniel Martinez",
                rating: 5,
                date: "2023-11-30",
                content: "Eye-opening course! The hands-on labs with real vulnerable apps were incredibly valuable."
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 129.99,
        articles: 20,
        resources: 35
    },
    {
        id: "7",
        title: "Cypress Modern Automation",
        description: "Learn next-generation web test automation using Cypress framework.",
        shortDescription: "Fast and reliable testing for modern web applications",
        image: "https://picsum.photos/id/119/400/250",
        category: "Automation Testing",
        level: "Intermediate",
        rating: 4.9,
        duration: "14 hours",
        durationValue: 14,
        instructor: "Emily Chen",
        enrolled: 5200,
        reviews: 192,
        date: "2024-03-01",
        modules: [
            {
                title: "Cypress Core Concepts",
                lessons: [
                    { title: "Setup & Configuration", duration: "35 min" },
                    { title: "Writing Your First Test", duration: "40 min" }
                ]
            }
        ],
        learningPoints: [
            "Write maintainable tests",
            "Debug tests effectively",
            "Implement custom commands",
            "Visual testing techniques",
            "Continuous integration setup"
        ],
        instructorImage: "https://picsum.photos/id/64/150/150",
        instructorTitle: "Frontend Automation Lead",
        instructorRating: 4.9,
        instructorStudents: 18700,
        instructorCourses: 5,
        instructorBio: "Emily specializes in modern JavaScript testing frameworks and CI/CD optimization.",
        ratings: {
            5: 162,
            4: 27,
            3: 3,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/64/50/50",
                name: "Olivia Wilson",
                rating: 5,
                date: "2024-03-20",
                content: "Cypress has changed how we do testing. Emily's teaching style made complex concepts easy to grasp."
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 89.99,
        articles: 14,
        resources: 26
    },
    {
        id: "8",
        title: "Test Management with JIRA",
        description: "Master test planning, execution and reporting using JIRA and Xray add-on.",
        shortDescription: "Streamline your test management process",
        image: "https://picsum.photos/id/25/400/250",
        category: "Manual Testing",
        level: "Beginner",
        rating: 4.4,
        duration: "8 hours",
        durationValue: 8,
        instructor: "Brian Taylor",
        enrolled: 2400,
        reviews: 78,
        date: "2023-09-10",
        modules: [
            {
                title: "JIRA for Testers",
                lessons: [
                    { title: "Setting Up Test Projects", duration: "30 min" },
                    { title: "Creating Test Plans", duration: "35 min" }
                ]
            }
        ],
        learningPoints: [
            "Configure JIRA for testing",
            "Create traceability matrices",
            "Generate test execution reports",
            "Integrate with automation tools",
            "Manage testing sprints"
        ],
        instructorImage: "https://picsum.photos/id/1074/150/150",
        instructorTitle: "QA Process Consultant",
        instructorRating: 4.5,
        instructorStudents: 10200,
        instructorCourses: 4,
        instructorBio: "Brian helps teams optimize their QA processes through effective tool implementation.",
        ratings: {
            5: 52,
            4: 22,
            3: 4,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/338/50/50",
                name: "Alex Johnson",
                rating: 4,
                date: "2023-10-05",
                content: "Solid course on JIRA for test management. The Xray sections were particularly helpful."
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 74.99,
        originalPrice: 89.99,
        discount: 17,
        articles: 10,
        resources: 15
    },
    {
        id: "9",
        title: "BDD with Cucumber",
        description: "Implement Behavior-Driven Development using Cucumber, Gherkin and Selenium.",
        shortDescription: "Bridge the gap between technical and business teams",
        image: "https://picsum.photos/id/26/400/250",
        category: "Automation Testing",
        level: "Intermediate",
        rating: 4.6,
        duration: "16 hours",
        durationValue: 16,
        instructor: "Karen White",
        enrolled: 3100,
        reviews: 102,
        date: "2024-02-15",
        modules: [
            {
                title: "BDD Fundamentals",
                lessons: [
                    { title: "Gherkin Syntax Mastery", duration: "40 min" },
                    { title: "Writing Effective Scenarios", duration: "45 min" }
                ]
            }
        ],
        learningPoints: [
            "Write business-readable tests",
            "Implement step definitions",
            "Create living documentation",
            "Integrate with test frameworks",
            "Collaborate with stakeholders"
        ],
        instructorImage: "https://picsum.photos/id/64/150/150",
        instructorTitle: "Agile Testing Coach",
        instructorRating: 4.7,
        instructorStudents: 15600,
        instructorCourses: 6,
        instructorBio: "Karen helps organizations adopt BDD practices to improve collaboration and quality.",
        ratings: {
            5: 75,
            4: 24,
            3: 3,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/64/50/50",
                name: "Mark Thompson",
                rating: 5,
                date: "2024-03-08",
                content: "Finally understand how to implement BDD properly. The collaboration techniques were gold!"
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 94.99,
        articles: 16,
        resources: 24
    },
    {
        id: "10",
        title: "Accessibility Testing Mastery",
        description: "Ensure your applications are usable by everyone through comprehensive accessibility testing.",
        shortDescription: "Make your applications inclusive and compliant",
        image: "https://picsum.photos/id/27/400/250",
        category: "Manual Testing",
        level: "Beginner",
        rating: 4.7,
        duration: "9 hours",
        durationValue: 9,
        instructor: "Daniel Kim",
        enrolled: 1900,
        reviews: 65,
        date: "2024-01-25",
        modules: [
            {
                title: "Accessibility Fundamentals",
                lessons: [
                    { title: "WCAG Guidelines Overview", duration: "35 min" },
                    { title: "Screen Reader Testing", duration: "40 min" }
                ]
            }
        ],
        learningPoints: [
            "Understand WCAG standards",
            "Use accessibility testing tools",
            "Manual testing techniques",
            "Create accessible user experiences",
            "Compliance reporting"
        ],
        instructorImage: "https://picsum.photos/id/64/150/150",
        instructorTitle: "Accessibility Specialist",
        instructorRating: 4.8,
        instructorStudents: 7600,
        instructorCourses: 3,
        instructorBio: "Daniel has helped numerous organizations achieve ADA compliance and improve user experience.",
        ratings: {
            5: 48,
            4: 15,
            3: 2,
            2: 0,
            1: 0
        },
        reviewsList: [
            {
                avatar: "https://picsum.photos/id/64/50/50",
                name: "Jessica Adams",
                rating: 5,
                date: "2024-02-20",
                content: "Valuable course that opened my eyes to accessibility needs. Practical techniques I could apply immediately."
            }
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        price: 84.99,
        articles: 12,
        resources: 20
    }
];

export default CoursesData;




