import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConfettiButton from './ui/ConfettiButton'
import './Header.css'
import { useQueryClient } from '@tanstack/react-query'
import { firebaseService } from '../services/firebaseService'

const Header = () => {
    const [isOnHero, setIsOnHero] = useState(true)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            // 1. Check if we are on the Home page
            if (location.pathname !== '/') {
                setIsOnHero(false)
                return
            }

            // 2. Try to find hero section
            const hero = document.querySelector(".hero-section")

            if (!hero) {
                // If on Home but hero not found yet, trust scrollY
                // If at the top, we must be on hero (or loading it)
                if (window.scrollY < 50) {
                    setIsOnHero(true)
                } else {
                    setIsOnHero(false)
                }
                return
            }

            // 3. Normal hero-bound check
            const heroBottom = hero.offsetHeight - 120
            if (window.scrollY < heroBottom) {
                setIsOnHero(true)
            } else {
                setIsOnHero(false)
            }
        }

        window.addEventListener("scroll", handleScroll)

        // Run immediately, but also give a tiny delay for React to mount Hero on direct load
        handleScroll()
        const timer = setTimeout(handleScroll, 50)

        return () => {
            window.removeEventListener("scroll", handleScroll)
            clearTimeout(timer)
        }
    }, [location.pathname])

    // Close dropdown on outside click
    useEffect(() => {
        const closeOnClickOutside = (event) => {
            if (!event.target.closest(".nav-dropdown")) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("click", closeOnClickOutside)
        return () => document.removeEventListener("click", closeOnClickOutside)
    }, [])

    // Prefetch Logic
    const handlePrefetch = (route) => {
        if (route === '/team') {
            queryClient.prefetchQuery({ queryKey: ['boardMembers'], queryFn: firebaseService.getBoardMembers })
        } else if (route === '/events') {
            queryClient.prefetchQuery({ queryKey: ['events'], queryFn: firebaseService.getEvents })
        } else if (route === '/bulletin') {
            queryClient.prefetchQuery({ queryKey: ['bulletins'], queryFn: firebaseService.getBulletins })
        } else if (route === '/scrapbook') {
            queryClient.prefetchQuery({ queryKey: ['scrapbooks'], queryFn: firebaseService.getScrapbooks })
        } else if (route === '/gallery') {
            queryClient.prefetchQuery({ queryKey: ['gallery'], queryFn: firebaseService.getGallery })
        }
    }

    const handleNavClick = (e, path) => {
        // Close menus
        setIsMobileMenuOpen(false)
        setIsDropdownOpen(false)

        // If clicking current page, scroll to top
        if (location.pathname === path) {
            e.preventDefault() // Prevent default (optional, but good for pure scroll)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <header className={`header ${isOnHero ? "on-hero" : "scrolled"}`}>
            <div className="header-container">

                {/* LOGO */}
                <Link to="/" className="logo" onClick={(e) => handleNavClick(e, '/')}>
                    <span className="logo-circle">RCCU</span>
                    <div className="logo-details">
                        <span className="logo-main">Rotaract Club</span>
                        <span className="logo-sub">Coimbatore Unique</span>
                    </div>
                </Link>

                {/* NAV MENU */}
                <nav className={`nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                    <Link to="/" className="nav-link" onClick={(e) => handleNavClick(e, '/')}>Home</Link>
                    <Link to="/about" className="nav-link" onClick={(e) => handleNavClick(e, '/about')}>About Us</Link>
                    <Link
                        to="/team"
                        className="nav-link"
                        onClick={(e) => handleNavClick(e, '/team')}
                        onMouseEnter={() => handlePrefetch('/team')}
                    >Our Team</Link>

                    {/* Dropdown */}
                    <div className="nav-dropdown">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Activities
                            <svg className="dropdown-icon" width="10" height="10" viewBox="0 0 12 12">
                                <path d="M6 9L1 4h10z" fill="currentColor" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="dropdown-menu show">
                                <Link
                                    to="/events"
                                    className="dropdown-item"
                                    onClick={(e) => handleNavClick(e, '/events')}
                                    onMouseEnter={() => handlePrefetch('/events')}
                                >Events</Link>
                                <Link
                                    to="/bulletin"
                                    className="dropdown-item"
                                    onClick={(e) => handleNavClick(e, '/bulletin')}
                                    onMouseEnter={() => handlePrefetch('/bulletin')}
                                >Bulletin</Link>
                                <Link
                                    to="/scrapbook"
                                    className="dropdown-item"
                                    onClick={(e) => handleNavClick(e, '/scrapbook')}
                                    onMouseEnter={() => handlePrefetch('/scrapbook')}
                                >Scrapbook</Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/gallery"
                        className="nav-link"
                        onClick={(e) => handleNavClick(e, '/gallery')}
                        onMouseEnter={() => handlePrefetch('/gallery')}
                    >Gallery</Link>
                    <Link to="/contact" className="nav-link" onClick={(e) => handleNavClick(e, '/contact')}>Contact Us</Link>

                    <ConfettiButton
                        className="btn-join"
                        variant="gradient"
                        onClick={() => {
                            navigate('/join')
                            if (location.pathname === '/join') window.scrollTo({ top: 0, behavior: 'smooth' })
                            setIsMobileMenuOpen(false)
                        }}
                        confettiOptions={{ particleCount: 100, spread: 70, colors: ['#400763', '#ed0775', '#ffffff'] }}
                    >
                        Join Us
                    </ConfettiButton>
                </nav>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span><span></span><span></span>
                </button>

            </div>
        </header>
    )
}

export default Header
