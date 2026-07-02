import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './ClubOfficialsSection.css'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const ClubOfficialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const { data: officials = [], isLoading } = useQuery({
        queryKey: ['clubOfficials'],
        queryFn: firebaseService.getClubOfficials,
        staleTime: 0,
        refetchOnMount: true,
    });

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

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading officials...</div>
            ) : officials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No club officials added yet.</div>
            ) : (
                <>
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
                </>
            )}
        </section>
    )
}

export default ClubOfficialsSection
