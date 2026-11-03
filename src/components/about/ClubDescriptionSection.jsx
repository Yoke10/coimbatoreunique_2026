import React from 'react';
import './ClubDescriptionSection.css';
import { firebaseService } from '../../services/firebaseService';
import { useQuery } from '@tanstack/react-query';

const ClubDescriptionSection = () => {
    const { data: config } = useQuery({
        queryKey: ['config'],
        queryFn: firebaseService.getClubConfig,
        staleTime: 0,
        refetchOnMount: true,
    });

    const hasAnyImage = Boolean(
        config?.aboutImage1 || config?.aboutImage2 || config?.aboutImage3 || config?.aboutImage4
    );

    return (
        <section className="club-description-section" aria-labelledby="about-story-title">
            <div className="container">
                <div className={`description-wrapper ${!hasAnyImage ? 'no-images' : ''}`}>
                    {/* LEFT CONTENT */}
                    <div className={`description-content ${!hasAnyImage ? 'full-width' : ''}`}>
                        <h2 id="about-story-title">Our Story – 25 Years of Service</h2>

                        <p>
                            The Rotaract Club of Coimbatore Unique (popularly known as <strong>RAC Coimbatore Unique</strong> or <strong>CBE Unique</strong>), sponsored by the Rotary Club of Thondamuthur and chartered on 21st November 2000 (Club ID: 50295), has stood as a beacon of youth leadership, fellowship, and impactful community service in Coimbatore, Tamil Nadu for over 25 years.
                        </p>

                        <p>
                            Proudly operating under <strong>Rotary International District 3206</strong> (Rotaract District 3206), our club has spearheaded landmark initiatives across community service, professional development, international service, and club service. Over the past two and a half decades, RAC Coimbatore Unique has fostered exceptional leaders, including two distinguished Past District Rotaract Representatives (PDRRs), upholding Rotary's core ethos of <em>Service Above Self</em>.
                        </p>

                        <p>
                            Whether through transformative social welfare campaigns, educational empowerment for underserved students, or leadership training for aspiring changemakers, the Rotaract Club of Coimbatore Unique remains steadfast in uniting passionate youth to create meaningful, lasting change.
                        </p>
                    </div>

                    {/* RIGHT IMAGE COLLAGE - Only rendered if uploaded in backend */}
                    {hasAnyImage && (
                        <div className="collage">
                            <div className="purple-panel"></div>

                            {config?.aboutImage1 && (
                                <div className="photo tl">
                                    <img 
                                        src={config.aboutImage1} 
                                        alt="Rotaract Club of Coimbatore Unique Community Service Project" 
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
                                        alt="Rotaract Club of Coimbatore Unique Team Meeting and Fellowship" 
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
                                        alt="RAC Coimbatore Unique Club Members" 
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
                                        alt="Rotaract District 3206 Youth Leadership Assembly" 
                                        width="800"
                                        height="800"
                                        loading="lazy" 
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ClubDescriptionSection;
