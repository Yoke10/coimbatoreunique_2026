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

    return (
        <section className="about-section section">
            <div className="container">
                <div className="about-wrapper">
                    {/* LEFT IMAGE COLLAGE */}
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

                    {/* RIGHT CONTENT */}
                    <div className="about-content" data-nosnippet>
                        <h2>About</h2>

                        <p>
                            The Rotaract Club of Coimbatore Unique, chartered on 21st November 2000 by Rtr. Athma Sivakumar, stands as a
                            dynamic and impactful youth organization driven by service, leadership, and professionalism. Since its inception, the club has grown to become
                            one of the most vibrant and community-focused clubs in the region, consistently prioritizing meaningful outreach and sustainable development.
                        </p>

                        <p>
                            We proudly operate under Rotary International District 3206, carrying forward the legacy of Rotaract with
                            passion and purpose. With 25 years of excellence, our club has produced remarkable leaders, including two
                            Past District Rotaract Representatives (DRRs) who have played crucial roles in shaping the district’s growth and vision.
                        </p>

                        <p>
                            As we move forward, we remain committed to empowering youth,
                            uplifting communities, and fostering leadership that transforms society for the better.
                        </p>

                        <Link to="/about" className="btn">
                            Know More <span>↗</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUsSection
