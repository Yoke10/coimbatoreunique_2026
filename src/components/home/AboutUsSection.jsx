import React from 'react'
import { Link } from 'react-router-dom'
import './AboutUsSection.css'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const AboutUsSection = () => {
    const { data: config } = useQuery({
        queryKey: ['config'],
        queryFn: firebaseService.getClubConfig,
        staleTime: 0,
        refetchOnMount: true,
    })

    const hasAnyImage = Boolean(
        config?.aboutImage1 || config?.aboutImage2 || config?.aboutImage3 || config?.aboutImage4
    )

    return (
        <section className="about-section section" aria-labelledby="home-about-heading">
            <div className="container">
                <div className={`about-wrapper ${!hasAnyImage ? 'no-images' : ''}`}>
                    {/* LEFT IMAGE COLLAGE - Only rendered if uploaded in backend */}
                    {hasAnyImage && (
                        <div className="collage">
                            <div className="purple-panel"></div>

                            {config?.aboutImage1 && (
                                <div className="photo tl">
                                    <img 
                                        src={config.aboutImage1} 
                                        alt="Rotaract Club of Coimbatore Unique Community Service" 
                                        width="800"
                                        height="800"
                                        loading="lazy" 
                                    />
                                </div>
                            )}

                            {config?.aboutImage2 && (
                                <div className="photo tr">
                                    <img 
                                        src={config.aboutImage2} 
                                        alt="RAC Coimbatore Unique Team Fellowship and Planning Meeting" 
                                        width="800"
                                        height="800"
                                        loading="lazy" 
                                    />
                                </div>
                            )}

                            {config?.aboutImage3 && (
                                <div className="photo bl">
                                    <img 
                                        src={config.aboutImage3} 
                                        alt="Rotaract Club of Coimbatore Unique Members Group Photo" 
                                        width="800"
                                        height="800"
                                        loading="lazy" 
                                    />
                                </div>
                            )}

                            {config?.aboutImage4 && (
                                <div className="photo br">
                                    <img 
                                        src={config.aboutImage4} 
                                        alt="Rotaract District 3206 Youth Leadership" 
                                        width="800"
                                        height="800"
                                        loading="lazy" 
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIGHT CONTENT */}
                    <div className={`about-content ${!hasAnyImage ? 'full-width' : ''}`}>
                        <h2 id="home-about-heading">About Coimbatore Unique</h2>

                        <p>
                            The <strong>Rotaract Club of Coimbatore Unique</strong> (popularly known as <em>RAC Coimbatore Unique</em> or <em>CBE Unique</em>), chartered on 21st November 2000 by Rtr. Athma Sivakumar, stands as a dynamic youth organization driven by service, leadership, and professional growth in Coimbatore, Tamil Nadu. Since inception, our club has prioritized high-impact community outreach and sustainable social development.
                        </p>

                        <p>
                            We proudly operate under <strong>Rotary International District 3206</strong> (Rotaract District 3206), carrying forward the rich heritage of Rotaract with passion and integrity. Celebrating 25 years of youth empowerment, our club has nurtured outstanding community leaders, including two Past District Rotaract Representatives (PDRRs) who shaped the district's vision.
                        </p>

                        <p>
                            From professional development workshops to community health camps and environmental conservation, we remain dedicated to uniting proactive youth to transform our city and society for the better.
                        </p>

                        <Link to="/about" className="btn" aria-label="Learn more about Rotaract Club of Coimbatore Unique">
                            Know More <span>↗</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUsSection
