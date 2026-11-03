import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
    const title = "COIMBATORE UNIQUE";

    return (
        <section className="hero-section" aria-label="Hero Introduction">
            <div className="hero-bg-image"></div>
            <div className="hero-background"></div>
            <div className="hero-floating-circles"></div>
            <div className="hero-content">
                <h1 className="hero-main-heading">
                    <span className="hero-subtitle">Rotaract Club of</span>
                    {/* Auto-split title into spans */}
                    <span className="hero-title" aria-label="Coimbatore Unique">
                        {title.split("").map((char, index) => (
                            <span key={index} className="hero-letter" aria-hidden="true">
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </span>
                    <span className="sr-only"> – Rotaract District 3206, Coimbatore, Tamil Nadu</span>
                </h1>

                <div className="hero-info">
                    <span className="hero-district">Rotary International District 3206</span>
                    <span className="hero-separator">|</span>
                    <span className="hero-charter">Charter Day - 21.11.2000</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
