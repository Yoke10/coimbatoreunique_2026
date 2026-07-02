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

    return (
        <section className="club-description-section">
            <div className="container">
                <div className="description-wrapper">
                    {/* LEFT CONTENT */}
                    <div className="description-content">
                        <h2>Our Story</h2>

                        <p>
                            The Rotaract Club has been a beacon of service and leadership for over 25 years.
                            Founded with a vision to empower young professionals and students, we have grown into a vibrant community
                            dedicated to making a tangible impact. Our journey is marked by countless projects, community initiatives,
                            and the development of future leaders who are passionate about service above self.
                        </p>

                        <p>
                            From local community service to international understanding, our club has consistently strived to address
                            the needs of our society. We believe in the power of collective action and the potential of youth to drive change.
                            Join us as we continue to write our history, one act of kindness at a time.
                        </p>
                    </div>

                    {/* RIGHT IMAGE COLLAGE */}
                    <div className="collage">
                        <div className="purple-panel"></div>

                        <div className="photo tl">
                            <img src={config?.aboutImage1 || "/images/about-collage-1.png"} alt="Rotaract Community Service" loading="lazy" />
                        </div>

                        <div className="photo tr">
                            <img src={config?.aboutImage2 || "/images/about-collage-2.png"} alt="Rotaract Team Meeting" loading="lazy" />
                        </div>

                        <div className="photo bl">
                            <img src={config?.aboutImage3 || "/images/grouppic.webp"} alt="Rotaract Club Members" loading="lazy" />
                        </div>

                        <div className="photo br">
                            <img src={config?.aboutImage4 || "/images/grouppic.webp"} alt="Rotaract Leadership" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClubDescriptionSection;
