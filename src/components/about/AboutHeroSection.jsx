import React from 'react'
import './AboutHeroSection.css'

const AboutHeroSection = () => {
    return (
        <section className="about-hero-section" aria-label="About Coimbatore Unique Introduction">
            <div className="about-hero-visual">
                <div className="years-3d-container">
                    <div className="years-text-3d">25+</div>
                </div>
                <div className="years-label">Years of Service</div>
            </div>
            <div className="about-hero-content">
                <h1 className="about-hero-title">
                    <span className="sr-only">About Rotaract Club of Coimbatore Unique – </span>
                    Legacy of Service &amp; Leadership
                </h1>
                <p className="about-hero-subtitle">
                    Celebrating over 25 years of empowering youth, creating community leaders, and driving impactful social service across Coimbatore under Rotaract District 3206.
                </p>
            </div>
        </section>
    )
}

export default AboutHeroSection
