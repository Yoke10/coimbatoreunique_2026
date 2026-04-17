import React from 'react';
import './AboutSkeleton.css';

const AboutSkeleton = () => {
    return (
        <div className="about-skeleton-page">
            {/* HERO SECTION SKELETON */}
            <section className="skel-hero-section">
                <div className="skel-hero-visual">
                    <div className="skeleton skel-years-box"></div>
                    <div className="skeleton skel-years-label"></div>
                </div>
                <div className="skel-hero-content">
                    <div className="skeleton skel-title"></div>
                    <div className="skeleton skel-subtitle-line"></div>
                    <div className="skeleton skel-subtitle-line" style={{ width: '80%' }}></div>
                    <div className="skeleton skel-subtitle-line" style={{ width: '60%' }}></div>
                </div>
            </section>

            {/* DESCRIPTION SECTION SKELETON */}
            <section className="skel-desc-section">
                <div className="skel-desc-content">
                    <div className="skeleton skel-desc-title"></div>
                    <div className="skel-paragraphs">
                        <div className="skeleton skel-line"></div>
                        <div className="skeleton skel-line"></div>
                        <div className="skeleton skel-line"></div>
                        <div className="skeleton skel-line" style={{ width: '85%' }}></div>
                        <br />
                        <div className="skeleton skel-line"></div>
                        <div className="skeleton skel-line"></div>
                        <div className="skeleton skel-line" style={{ width: '70%' }}></div>
                    </div>
                </div>
                <div className="skel-desc-collage">
                    <div className="skeleton skel-collage-item"></div>
                    <div className="skeleton skel-collage-item"></div>
                    <div className="skeleton skel-collage-item"></div>
                    <div className="skeleton skel-collage-item"></div>
                </div>
            </section>

            {/* VISION MISSION GOAL SKELETON */}
            <section className="skel-vmg-section">
                <div className="skeleton skel-vmg-main-title"></div>
                <div className="skel-vmg-cards">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton skel-vmg-card"></div>
                    ))}
                </div>
            </section>

            {/* OFFICIALS SKELETON */}
            <section className="skel-officials-section">
                <div className="skeleton skel-vmg-main-title"></div>
                <div className="skel-officials-carousel">
                    <div className="skeleton skel-nav-btn"></div>
                    <div className="skeleton skel-official-card"></div>
                    <div className="skeleton skel-nav-btn"></div>
                </div>
                <div className="skel-dots">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton skel-dot"></div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutSkeleton;
