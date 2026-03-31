import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './SecondHeader.css';
import { links } from './linksData';
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react';

const SecondHeader = () => {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [scrollLeftPosition, setScrollLeftPosition] = useState(0);

    // Check scroll position to show/hide arrows
    const checkScrollPosition = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 20);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
        }
    }, []);

    // Initialize and check overflow
    useEffect(() => {
        const checkOverflow = () => {
            if (scrollContainerRef.current) {
                const { scrollWidth, clientWidth } = scrollContainerRef.current;
                setIsOverflowing(scrollWidth > clientWidth);
                checkScrollPosition();
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [checkScrollPosition]);

    // Add scroll event listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, [checkScrollPosition]);

    // Smooth scroll with animation
    const smoothScroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -300 : 300;

            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Drag to scroll functionality
    const handleDragMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeftPosition(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleDragMouseLeave = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
            scrollContainerRef.current.style.userSelect = 'auto';
        }
    };

    const handleDragMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
            scrollContainerRef.current.style.userSelect = 'auto';
        }
    };

    const handleDragMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - dragStartX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeftPosition - walk;
    };

    // Wheel scroll with acceleration
    const handleWheelScroll = (e) => {
        if (scrollContainerRef.current) {
            e.preventDefault();
            const delta = Math.sign(e.deltaY) * 50;
            scrollContainerRef.current.scrollBy({
                left: delta,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollLeft = () => smoothScroll('left');
    const handleScrollRight = () => smoothScroll('right');

    const handlers = useSwipeable({
        onSwipedLeft: handleScrollRight,
        onSwipedRight: handleScrollLeft,
        trackMouse: true,
        delta: 10,
    });

    useEffect(() => {
        const handleWindowScroll = () => {
            setIsSticky(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleWindowScroll);
        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
        };
    }, []);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = sessionStorage.getItem("token");
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);

    const handleDropdownMouseEnter = (index) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [index]: true,
        }));
    };

    const handleDropdownMouseLeave = (index) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [index]: false,
        }));
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="page-with-second-header">
            <header
                className={`second-header navbar navbar-expand-lg navbar-dark bg-white ${isSticky ? 'sticky' : ''}`}
                {...handlers}
            >
                {isOverflowing && showLeftArrow && (
                    <button
                        className="scroll-arrow left-arrow"
                        onClick={handleScrollLeft}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                <nav
                    ref={scrollContainerRef}
                    className={`scroll-container d-flex justify-content-between align-items-center ${isOverflowing ? 'overflowing' : ''} ${isDragging ? 'dragging' : ''}`}
                    onMouseDown={handleDragMouseDown}
                    onMouseLeave={handleDragMouseLeave}
                    onMouseUp={handleDragMouseUp}
                    onMouseMove={handleDragMouseMove}
                    onWheel={handleWheelScroll}
                >
                    {links.map((link, index) => {
                        if (link.label === "Community" && !isLoggedIn) {
                            return (
                                <div key={index} className="nav-item locked">
                                    <Link to="/login" className="local-nav-link locked-link" title="Login required to access Community">
                                        <Lock size={16} className="lock-icon" /> Community
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={index}
                                className="nav-item dropdown"
                                onMouseEnter={() => handleDropdownMouseEnter(index)}
                                onMouseLeave={() => handleDropdownMouseLeave(index)}
                            >
                                <Link
                                    to={link.path}
                                    className={`local-nav-link ${location.pathname === link.path ? 'active-link' : ''}`}
                                    title={link.label}
                                >
                                    {truncateText(link.label, 17)}
                                </Link>
                                {link.subLinks && dropdownOpen[index] && (
                                    <div className="dropdown-menu">
                                        {link.subLinks.map((subLink, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                to={subLink.path}
                                                className={`dropdown-item ${location.pathname === subLink.path ? 'active-link' : ''}`}
                                            >
                                                {subLink.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {isOverflowing && showRightArrow && (
                    <button
                        className="scroll-arrow right-arrow"
                        onClick={handleScrollRight}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </header>
        </div>
    );
};

export default SecondHeader;