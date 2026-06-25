import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaStar, FaClock, FaUserGraduate, FaFilter } from 'react-icons/fa';
import CoursesData from './CoursesData';
import './Courses.css';
import { Helmet } from 'react-helmet-async';

const CoursesPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filteredCourses, setFilteredCourses] = useState(CoursesData);
    const [sortOption, setSortOption] = useState('popularity');

    useEffect(() => {
        // Filter courses based on search term, level and category
        let result = CoursesData;

        if (searchTerm) {
            result = result.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterLevel !== 'all') {
            result = result.filter(course => course.level === filterLevel);
        }

        if (filterCategory !== 'all') {
            result = result.filter(course => course.category === filterCategory);
        }

        // Sort courses
        if (sortOption === 'popularity') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'newest') {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption === 'duration') {
            result.sort((a, b) => a.durationValue - b.durationValue);
        }

        setFilteredCourses(result);
    }, [searchTerm, filterLevel, filterCategory, sortOption]);

    const handleLearnMore = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    // Get unique categories
    const categories = [...new Set(CoursesData.map(course => course.category))];

    return (
        <div className="courses-page">
            <Helmet>
                <title>Software Testing Courses | QA Hub</title>
                <meta name="description" content="Browse QA Hub's software testing courses — manual testing, Selenium automation, API testing, performance testing and more. Learn at your own pace." />
                <meta property="og:title" content="Software Testing Courses | QA Hub" />
                <meta property="og:description" content="Browse courses on manual testing, automation, API testing and more." />
                <meta property="og:url" content="https://www.qahub.co.in/courses" />
            </Helmet>
            {/* Hero Section */}
            <div className="courses-hero">
                <div className="container">
                    <h1 className="hero-title">Master Software Testing</h1>
                    <p className="hero-subtitle">Learn from industry experts with our comprehensive courses</p>
                </div>
            </div>

            <Container className="py-5">
                {/* Search and Filters */}
                <div className="courses-controls mb-5">
                    <div className="search-container">
                        <div className="search-bar">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filters-container">
                            <div className="filter-group">
                                <FaFilter className="filter-icon" />
                                <Form.Select
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                >
                                    <option value="all">All Levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </Form.Select>
                            </div>

                            <div className="filter-group">
                                <Form.Select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </Form.Select>
                            </div>

                            <div className="filter-group">
                                <Form.Select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="popularity">Sort by: Popularity</option>
                                    <option value="newest">Sort by: Newest</option>
                                    <option value="duration">Sort by: Duration</option>
                                </Form.Select>
                            </div>
                        </div>
                    </div>

                    <div className="category-tags">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className={`category-tag ${filterCategory === category ? 'active' : ''}`}
                                onClick={() => setFilterCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                        <button
                            className={`category-tag ${filterCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterCategory('all')}
                        >
                            All Categories
                        </button>
                    </div>
                </div>

                {/* Courses Grid */}
                {filteredCourses.length > 0 ? (
                    <Row>
                        {filteredCourses.map((course) => (
                            <Col key={course.id} md={4} sm={6} className="mb-4">
                                <Card className="course-card h-100">
                                    <div className="card-img-container">
                                        <Card.Img variant="top" src={course.image} alt={course.title} />
                                        <div className="card-badge">{course.category}</div>
                                        <div className="rating-badge">
                                            <FaStar /> {course.rating}
                                        </div>
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{course.title}</Card.Title>
                                        <div className="course-meta">
                                            <span className="meta-item">
                                                <FaUserGraduate /> {course.instructor}
                                            </span>
                                            <span className="meta-item">
                                                <FaClock /> {course.duration}
                                            </span>
                                        </div>
                                        <Card.Text>{course.description}</Card.Text>
                                        <div className="course-footer">
                                            <Badge pill bg="info">{course.level}</Badge>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleLearnMore(course.id)}
                                                className="course-btn"
                                            >
                                                View Course
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="no-results text-center py-5">
                        <h3>No courses found</h3>
                        <p>Try adjusting your filters or search term</p>
                        <Button variant="outline-primary" onClick={() => {
                            setSearchTerm('');
                            setFilterLevel('all');
                            setFilterCategory('all');
                        }}>
                            Reset Filters
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default CoursesPage;