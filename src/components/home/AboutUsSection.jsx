import React from 'react'
import { Link } from 'react-router-dom'
const groupPic = '/images/grouppic.webp'
import './AboutUsSection.css'

const AboutUsSection = () => {
    const cardRef = React.useRef(null);
    const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
    const [scale, setScale] = React.useState(1);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
        setScale(1.05);
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setScale(1);
    };

    return (
        <section className="about-section section">
            <div className="container">
                <div className="about-grid">
                    <div className="about-content">
                        <h2 className="about-title">About Us</h2>

                        <p className="about-text">
                            The Rotaract Club of Coimbatore Unique, chartered on 21st November 2000 by Rtr. Atma Siva, stands as a dynamic and
                            impactful youth organization driven by service, leadership, and professionalism. Since its inception, the club has
                            grown to become one of the most vibrant and community-focused clubs in the region, consistently prioritising meaningful
                            outreach and sustainable development.
                        </p>

                        <p className="about-text">
                            We proudly operate under Rotary International District 3206, carrying forward the legacy of Rotaract with passion and purpose.
                            With 25 years of excellence, our club has produced remarkable leaders, including two Past District Rotaract Representatives (DRRs)
                            who have played crucial roles in shaping the district’s growth and vision.
                        </p>

                        <p className="about-text">
                            As we move forward, we remain committed to empowering youth, uplifting communities, and fostering leadership that transforms society for the better.
                        </p>

                        <Link to="/about" className="btn btn-primary">
                            Know More
                        </Link>
                    </div>

                    {/* ---- IMAGE SECTION ---- */}
                    <div className="about-image-container">
                        <div
                            className="image-3d-wrapper"
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`
                            }}
                        >
                            <img
                                src={groupPic}
                                alt="Rotaract Club"
                                className="about-image"
                                loading="lazy"
                                width="800"
                                height="600"
                            />
                        </div>
                    </div>
                </div>
                {/* ---------------------- */}
            </div>

        </section >
    )
}

export default AboutUsSection
