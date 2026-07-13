import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import coursesData from "../data/CoursesData";
import { Button, Card, Badge, Tab, Tabs, ListGroup } from "react-bootstrap";
import {
    FaArrowLeft,
    FaPlayCircle,
    FaChalkboardTeacher,
    FaClock,
    FaStar,
    FaUsers,
    FaFileAlt,
    FaCertificate,
    FaHeart,
    FaRegHeart
} from "react-icons/fa";
import "./CourseDetailPage.css";


const CourseDetailPage = () => {
    const { courseId } = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [isFavorite, setIsFavorite] = useState(false);
    const course = coursesData.find((c) => c.id === courseId);

    if (!course) {
        return (
            <div className="course-not-found">
                <h2>Course Not Found</h2>
                <Button variant="primary" onClick={() =>  router.push("/courses")}>
                    Go to Courses
                </Button>
            </div>
        );
    }

    return (
        <div className="course-detail-page">

            {/* Hero Section */}
            <div className="course-hero">
                <div className="container">
                    <Button
                        variant="outline-light"
                        onClick={() => router.back()}
                        className="back-btn"
                    >
                        <FaArrowLeft /> Back to Courses
                    </Button>
                    <h1 className="hero-title">{course.title}</h1>
                    <p className="hero-subtitle">{course.shortDescription}</p>
                    <div className="hero-meta">
                        <Badge pill bg="light" text="dark" className="meta-badge">
                            <FaChalkboardTeacher /> {course.instructor}
                        </Badge>
                        <Badge pill bg="light" text="dark" className="meta-badge">
                            <FaClock /> {course.duration}
                        </Badge>
                        <Badge pill bg="light" text="dark" className="meta-badge">
                            <FaUsers /> {course.enrolled} enrolled
                        </Badge>
                        <Badge pill bg="light" text="dark" className="meta-badge">
                            <FaStar /> {course.rating} ({course.reviews} reviews)
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="course-detail-container">
                    {/* Main Content */}
                    <div className="course-main-content">
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="course-tabs"
                        >
                            <Tab eventKey="overview" title="Overview">
                                <Card className="overview-card">
                                    <Card.Body>
                                        <h3>Course Description</h3>
                                        <p>{course.description}</p>

                                        <h3>What You'll Learn</h3>
                                        <ul className="learning-list">
                                            {course.learningPoints.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>

                                        <h3>Course Content</h3>
                                        <div className="course-content">
                                            {course.modules.map((module, index) => (
                                                <div key={index} className="module">
                                                    <h4>Module {index + 1}: {module.title}</h4>
                                                    <ListGroup>
                                                        {module.lessons.map((lesson, idx) => (
                                                            <ListGroup.Item key={idx} className="lesson-item">
                                                                <div className="lesson-info">
                                                                    <span className="lesson-icon">
                                                                        <FaPlayCircle />
                                                                    </span>
                                                                    <span className="lesson-title">{lesson.title}</span>
                                                                </div>
                                                                <span className="lesson-duration">{lesson.duration}</span>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="instructor" title="Instructor">
                                <Card className="instructor-card">
                                    <Card.Body>
                                        <div className="instructor-header">
                                            <div className="instructor-avatar">
                                                <img src={course.instructorImage} alt={course.instructor} />
                                            </div>
                                            <div className="instructor-info">
                                                <h3>{course.instructor}</h3>
                                                <p className="title">{course.instructorTitle}</p>
                                                <div className="instructor-meta">
                                                    <span><FaStar /> {course.instructorRating} Instructor Rating</span>
                                                    <span><FaUsers /> {course.instructorStudents} Students</span>
                                                    <span><FaFileAlt /> {course.instructorCourses} Courses</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="instructor-bio">{course.instructorBio}</p>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="reviews" title={`Reviews (${course.reviews})`}>
                                <Card className="reviews-card">
                                    <Card.Body>
                                        <div className="rating-summary">
                                            <div className="average-rating">
                                                <h1>{course.rating}</h1>
                                                <div className="stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < Math.floor(course.rating) ? 'filled' : ''} />
                                                    ))}
                                                </div>
                                                <p>Course Rating</p>
                                            </div>
                                            <div className="rating-details">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <div key={star} className="rating-bar">
                                                        <span className="stars">
                                                            {star} <FaStar />
                                                        </span>
                                                        <div className="bar-container">
                                                            <div
                                                                className="bar"
                                                                style={{ width: `${(course.ratings[star] / course.reviews) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="percentage">{course.ratings[star]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="reviews-list">
                                            {course.reviewsList.map((review, index) => (
                                                <div key={index} className="review-item">
                                                    <div className="review-header">
                                                        <div className="reviewer">
                                                            <img src={review.avatar} alt={review.name} />
                                                            <div>
                                                                <h5>{review.name}</h5>
                                                                <div className="stars">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar key={i} className={i < review.rating ? 'filled' : ''} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="review-date">{review.date}</span>
                                                    </div>
                                                    <p className="review-content">{review.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="course-sidebar">
                        <Card className="enroll-card">
                            <div className="video-container">
                                <iframe
                                    src={course.videoUrl}
                                    title={course.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <Card.Body>
                                <div className="price-container">
                                    <span className="current-price">₹{course.price}</span>
                                    {course.originalPrice && (
                                        <span className="original-price">₹{course.originalPrice}</span>
                                    )}
                                    <span className="discount-badge">
                                        {course.discount}% off
                                    </span>
                                </div>

                                <Button variant="primary" className="enroll-btn">
                                    <FaPlayCircle /> Enroll Now
                                </Button>

                                <div className="includes-list">
                                    <h5>This course includes:</h5>
                                    <ul>
                                        <li><FaClock /> {course.duration} hours on-demand video</li>
                                        <li><FaFileAlt /> {course.articles} articles</li>
                                        <li><FaFileAlt /> {course.resources} downloadable resources</li>
                                        <li><FaCertificate /> Certificate of completion</li>
                                    </ul>
                                </div>

                                <Button
                                    variant={isFavorite ? "danger" : "outline-secondary"}
                                    className="favorite-btn"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                                    {isFavorite ? ' Remove from Favorites' : ' Add to Favorites'}
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className="related-courses">
                            <Card.Body>
                                <h4>Related Courses</h4>
                                {coursesData
                                    .filter(c => c.category === course.category && c.id !== course.id)
                                    .slice(0, 3)
                                    .map(relatedCourse => (
                                        <div
                                            key={relatedCourse.id}
                                            className="related-course"
                                            onClick={() => router.push(`/course/${relatedCourse.id}`)}
                                        >
                                            <img src={relatedCourse.image} alt={relatedCourse.title} />
                                            <div className="related-info">
                                                <h6>{relatedCourse.title}</h6>
                                                <div className="related-meta">
                                                    <span><FaStar /> {relatedCourse.rating}</span>
                                                    <span><FaClock /> {relatedCourse.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;