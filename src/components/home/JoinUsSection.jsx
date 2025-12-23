import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './JoinUsSection.css'
const groupPic = '/images/grouppic.webp'

const JoinUsSection = () => {
    const navigate = useNavigate();

    return (
        <section className="join-us-section">
            <div className="join-us-container">
                <div className="join-us-grid">
                    {/* Left Side - Image */}
                    <div className="join-us-image-wrapper">
                        <img
                            src={groupPic}
                            alt="Join Rotaract Team"
                            className="join-us-image"
                            loading="lazy"
                        />
                    </div>

                    {/* Right Side - Content */}
                    <div className="join-us-content">
                        <h2 className="join-us-title">Ready to Make an Impact?</h2>
                        <p className="join-us-text">
                            Join Rotaract Club today and become part of a global movement of young leaders
                            dedicated to service, leadership, and fellowship. Together, we can create lasting change
                            in our community and around the world.
                        </p>
                        <div className="join-us-cta">
                            <div className="bevel-wrapper">
                                <input
                                    type="checkbox"
                                    id="bevel-button"
                                    className="bevel-input"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            // Wait for animation then navigate
                                            setTimeout(() => {
                                                navigate('/join');
                                            }, 600);
                                        }
                                    }}
                                />
                                <label className="bevel-label" htmlFor="bevel-button">
                                    Become a Member
                                </label>
                                <span className="bevel-span">Unique</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JoinUsSection
