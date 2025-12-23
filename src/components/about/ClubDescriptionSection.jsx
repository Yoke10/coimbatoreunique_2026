import React, { useRef, useState } from 'react';
import './ClubDescriptionSection.css';
const groupPic = '/images/grouppic.webp';

const ClubDescriptionSection = () => {
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
        <section className="club-description-section">
            <div className="description-content">
                <h2 className="description-title">Our Story</h2>
                <p className="description-text">
                    The Rotaract Club has been a beacon of service and leadership for over 25 years.
                    Founded with a vision to empower young professionals and students, we have grown into a vibrant community
                    dedicated to making a tangible impact. Our journey is marked by countless projects, community initiatives,
                    and the development of future leaders who are passionate about service above self.
                </p>
                <p className="description-text">
                    From local community service to international understanding, our club has consistently strived to address
                    the needs of our society. We believe in the power of collective action and the potential of youth to drive change.
                    Join us as we continue to write our history, one act of kindness at a time.
                </p>
            </div>
            <div className="history-images-container">
                <div
                    className="interactive-card-wrapper"
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
                        <img src={groupPic} alt="Club Group" className="interactive-card-img" />
                        <div className="card-shine" style={{
                            background: `radial-gradient(circle at ${50 + rotation.y * 3}% ${50 + rotation.x * 3}%, rgba(255,255,255,0.3), transparent)`
                        }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClubDescriptionSection;
