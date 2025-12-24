import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './ClubOfficialsSection.css'

const ClubOfficialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const officials = [
        {
            name: "John Doe",
            role: "President",
            message: "Leading with passion and purpose to create lasting change in our community.Leading with passion and purpose to create lasting change in our community.Leading with passion and purpose to create lasting change in our community.Leading with passion and purpose to create lasting change in our community.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Jane Smith",
            role: "Secretary",
            message: "Ensuring smooth operations and effective communication for our club's success.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Mike Johnson",
            role: "IPP",
            message: "Guiding the new leadership with experience and wisdom from the past year.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Sarah Wilson",
            role: "Advisor",
            message: "Mentoring the next generation of leaders to reach their full potential.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        }
    ]

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % officials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + officials.length) % officials.length);
    };

    const getCardClass = (index) => {
        if (index === activeIndex) return 'official-card active';

        const length = officials.length;
        const prevIndex = (activeIndex - 1 + length) % length;
        const nextIndex = (activeIndex + 1) % length;

        if (index === prevIndex) return 'official-card prev';
        if (index === nextIndex) return 'official-card next';

        return 'official-card hidden';
    };

    return (
        <section className="officials-section">
            <h2 className="officials-title">Club Officials</h2>

            <div className="carousel-container">
                <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous Official">
                    <ChevronLeft size={32} />
                </button>

                <div className="cards-wrapper">
                    {officials.map((official, index) => (
                        <div
                            className={getCardClass(index)}
                            key={index}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="official-content">
                                <p className="official-message">"{official.message}"</p>
                                <div className="official-info">
                                    <span className="official-name">{official.name}</span>
                                    <span className="official-role">{official.role}</span>
                                </div>
                            </div>
                            <div className="official-image-container">
                                <img
                                    src={official.image}
                                    alt={official.name}
                                    className="official-image"
                                    width="120"
                                    height="160"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button className="nav-btn next" onClick={nextSlide} aria-label="Next Official">
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Dots indicator */}
            <div className="carousel-dots">
                {officials.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                    ></span>
                ))}
            </div>
        </section>
    )
}

export default ClubOfficialsSection
