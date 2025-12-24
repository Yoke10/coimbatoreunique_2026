import React, { useState } from 'react'
import './EventCard.css'

const EventCard = ({ event, index, priority = false }) => {
    const [showGallery, setShowGallery] = useState(false)

    // Parse date
    const dateObj = new Date(event.date)
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()

    // Determine layout direction based on index (even = normal, odd = reverse)
    const isReverse = index % 2 !== 0

    return (
        <div className={`event-card-container ${isReverse ? 'reverse-layout' : ''}`}>
            {/* Left Panel (Poster) */}
            <div className="event-left-panel">
                {event.poster ? (
                    <img
                        src={event.poster}
                        alt={event.title}
                        className="event-poster"
                        width="300"
                        height="400"
                        loading={priority ? "eager" : "lazy"}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        No Poster
                    </div>
                )}
            </div>

            {/* Center Panel (Content) */}
            <div className="event-center-panel">
                <span className="event-category-tag">{event.category}</span>
                <h2 className="event-title-text">{event.title}</h2>
                <p className="event-short-desc">{event.description}</p>
            </div>

            {/* Right Panel (Date & Action) */}
            <div className="event-right-panel">
                <div className="event-date-display">
                    <span className="date-big">{day}</span>
                    <span className="month-label">{month}</span>
                </div>
                {event.images && event.images.length > 0 && (
                    <button
                        className="view-gallery-btn"
                        onClick={() => setShowGallery(true)}
                        title="View Gallery"
                        aria-label={`View gallery for ${event.title}`}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>View</span>
                    </button>
                )}
            </div>

            {/* Inline Gallery Overlay */}
            {showGallery && (
                <div className="inline-gallery-container">
                    <div className="gallery-header">
                        <h4 className="gallery-title">Event Highlights</h4>
                        <button className="close-gallery-btn" onClick={() => setShowGallery(false)}>&times;</button>
                    </div>
                    <div className="gallery-images-wrapper">
                        {event.images.map((img, idx) => (
                            <div key={idx} className="gallery-img-card">
                                <img src={img} alt={`Highlight ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default EventCard
