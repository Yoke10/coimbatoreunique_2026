import React from 'react'
import './GetInTouchSection.css'

const GetInTouchSection = () => {
    return (
        <section className="get-in-touch-section">
            <h2 className="section-title">Get In Touch</h2>
            <div className="container-cards">

                {/* Card 1: Phone */}
                <div className="card">
                    <div className="light-layer">
                        <div className="slit"></div>
                        <div className="lumen">
                            <div className="min"></div>
                            <div className="mid"></div>
                            <div className="hi"></div>
                        </div>
                        <div className="darken">
                            <div className="sl"></div>
                            <div className="ll"></div>
                            <div className="slt"></div>
                            <div className="srt"></div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="icon-wrapper">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <div className="bottom">
                            <h3>Phone</h3>
                            <p>
                                +91 9443502959<br />
                                +91 8148562809
                            </p>
                            <a href="tel:+919443502959">Call Now</a>
                        </div>
                    </div>
                </div>

                {/* Card 2: Email */}
                <div className="card">
                    <div className="light-layer">
                        <div className="slit"></div>
                        <div className="lumen">
                            <div className="min"></div>
                            <div className="mid"></div>
                            <div className="hi"></div>
                        </div>
                        <div className="darken">
                            <div className="sl"></div>
                            <div className="ll"></div>
                            <div className="slt"></div>
                            <div className="srt"></div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="icon-wrapper">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <div className="bottom">
                            <h3>Email</h3>
                            <p>
                                raccbeunique@gmail.com<br />
                                rtr.dharshinishri.raccbeunique@gmail.com
                            </p>
                            <a href="mailto:raccbeunique@gmail">Send Email</a>
                        </div>
                    </div>
                </div>

                {/* Card 3: Location */}
                <div className="card">
                    <div className="light-layer">
                        <div className="slit"></div>
                        <div className="lumen">
                            <div className="min"></div>
                            <div className="mid"></div>
                            <div className="hi"></div>
                        </div>
                        <div className="darken">
                            <div className="sl"></div>
                            <div className="ll"></div>
                            <div className="slt"></div>
                            <div className="srt"></div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="icon-wrapper">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <div className="bottom">
                            <h3>Location</h3>
                            <p>
                                Coimbatore, Tamil Nadu<br />
                                India - 641001
                            </p>
                            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">View Map</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GetInTouchSection
