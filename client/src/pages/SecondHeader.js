import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import './SecondHeader.css';
import { links } from './linksData';
import { Lock } from 'lucide-react'; // Importing lock icon

const SecondHeader = () => {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [isOverflowing, setIsOverflowing] = useState(false); // Track overflow
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -100,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 100,
                behavior: 'smooth',
            });
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: scrollRight,
        onSwipedRight: scrollLeft,
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollContainerRef.current) {
                const { scrollWidth, clientWidth } = scrollContainerRef.current;
                setIsOverflowing(scrollWidth > clientWidth); // Check if content is overflowing
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow); // Recheck on resize

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = sessionStorage.getItem("token");
            setIsLoggedIn(!!token); // Update login state based on token presence
        };

        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus); // Listen for changes

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);

    const handleMouseEnter = (index) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [index]: true,
        }));
    };

    const handleMouseLeave = (index) => {
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
            <header className={`second-header navbar navbar-expand-lg navbar-dark bg-white ${isSticky ? 'sticky' : ''}`} {...handlers}>
                {isOverflowing && <button className="scroll-arrow left-arrow" onClick={scrollLeft}>←</button>}

                <nav ref={scrollContainerRef} className={`scroll-container d-flex justify-content-between align-items-center ${isOverflowing ? 'overflowing' : ''}`}>
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
                            <div key={index} className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>
                                <Link to={link.path} className={`local-nav-link ${location.pathname === link.path ? 'active-link' : ''}`} title={link.label}>
                                    {truncateText(link.label, 17)}
                                </Link>
                                {link.subLinks && dropdownOpen[index] && (
                                    <div className="dropdown-menu">
                                        {link.subLinks.map((subLink, subIndex) => (
                                            <Link key={subIndex} to={subLink.path} className={`dropdown-item ${location.pathname === subLink.path ? 'active-link' : ''}`}>
                                                {subLink.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {isOverflowing && <button className="scroll-arrow right-arrow" onClick={scrollRight}>→</button>}
            </header>
        </div>
    );
};

export default SecondHeader;
