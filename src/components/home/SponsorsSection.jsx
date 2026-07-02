import React from 'react'
import './SponsorsSection.css'

// Using WebP placeholder paths as requested. 
// User needs to ensure these files exist in public/assets or src/assets, 
// or replace with actual imports if located in src.
// For now, assuming they are in public folder or will be replaced.
const SPONSOR_IMAGES = [
    "/assets/sponsors/sponsor1.webp",
    "/assets/sponsors/sponsor2.webp",
    "/assets/sponsors/sponsor3.webp",
    "/assets/sponsors/sponsor4.webp",
    "/assets/sponsors/sponsor5.webp",
    "/assets/sponsors/sponsor6.webp"
];

const SponsorsSection = () => {
    const sponsors = [
        { id: 1, name: "Our\nSponsor", number: "01", link: "#", image: SPONSOR_IMAGES[0] },
        { id: 2, name: "Our\nPartner", number: "02", link: "#", image: SPONSOR_IMAGES[1] },
        { id: 3, name: "Our\nSponsor", number: "03", link: "#", image: SPONSOR_IMAGES[2] },
        { id: 4, name: "Our\nPartner", number: "04", link: "#", image: SPONSOR_IMAGES[3] },
        { id: 5, name: "Our\nSponsor", number: "05", link: "#", image: SPONSOR_IMAGES[4] },
        { id: 6, name: "Our\nPartner", number: "06", link: "#", image: SPONSOR_IMAGES[5] }
    ];

    // Create a tripled list for smooth infinite scrolling
    const displaySponsors = [...sponsors, ...sponsors, ...sponsors];

    return (
        <section className="sponsors-section-new">
            <h2 className="section-title">Our Partners</h2>

            <div className="sponsor-slider">
                <div className="slider-track">
                    {displaySponsors.map((sponsor, index) => (
                        <div className="card" key={`${sponsor.id}-${index}`}>
                            <div
                                className="cover"
                                style={{
                                    backgroundImage: `url(${sponsor.image})`,
                                    // Fallback if image fails or for preview
                                    backgroundColor: 'var(--primary-purple)'
                                }}
                            >
                                <h1>
                                    {sponsor.name.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < sponsor.name.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h1>
                                <span className="number">{sponsor.number}</span>
                                <div className="card-back">
                                    <a href={sponsor.link} target="_blank" rel="noopener noreferrer">View</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SponsorsSection
