import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './JoinUsSection.css'

const JoinUsSection = () => {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const rotateX = ((mouseY - centerY) / (rect.height / 2)) * -10; // Max 10deg
        const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10;   // Max 10deg

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotation({ x: 0, y: 0 });
    };

    return (
        <section className="join-us-section">
            <div className="join-us-container">
                <div className="join-us-grid">
                    {/* Left Side - Content */}
                    <div className="join-us-left">
                        <span className="join-us-subtitle">BE PART OF SOMETHING GREATER</span>
                        <h2 className="join-us-title">WHY JOIN US?</h2>
                        <p className="join-us-text">
                            At <b>Rotaract Club of Coimbatore Unique</b>, we believe growth comes from experiences that
                            matter. Through community service, leadership, professional development and meaningful
                            connections, we bring together people from different walks of life with one shared purpose - to
                            create positive change.

                        </p>
                    </div>

                    {/* Right Side - Card */}
                    <div className="join-us-right">
                        <div
                            className="join-us-card interactive-card-wrapper"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            ref={cardRef}
                            style={{
                                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
                                transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
                            }}
                        >
                            <div className="interactive-card-inner">
                                <h3 className="card-title">What if every opportunity could create an impact?</h3>
                                <p className="card-text">
                                    Join us in building a community where every act of service creates a meaningful impact.


                                </p>
                                <button
                                    className="join-btn"
                                    onClick={() => navigate('/join')}
                                >
                                    BECOME A MEMBER
                                </button>
                                <div className="card-shine" style={{
                                    background: `radial-gradient(circle at ${50 + rotation.y * 3}% ${50 + rotation.x * 3}%, rgba(255,255,255,0.3), transparent)`
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JoinUsSection
