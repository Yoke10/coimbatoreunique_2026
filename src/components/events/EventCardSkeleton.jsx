import React from 'react'
import './EventCard.css'

const EventCardSkeleton = ({ index }) => {
    const isReverse = index % 2 !== 0

    return (
        <div className={`event-card-container ${isReverse ? 'reverse-layout' : ''}`}>
            {/* Left Panel Skeleton (Poster) */}
            <div className="event-left-panel">
                <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
            </div>

            {/* Center Panel Skeleton (Content) */}
            <div className="event-center-panel">
                <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '50px', marginBottom: '0.75rem' }}></div>
                <div className="skeleton" style={{ width: '80%', height: '32px', marginBottom: '0.75rem', borderRadius: '8px' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ width: '60%', height: '16px' }}></div>
            </div>

            {/* Right Panel Skeleton (Date & Action) */}
            <div className="event-right-panel">
                <div className="event-date-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="skeleton" style={{ width: '50px', height: '40px', borderRadius: '8px' }}></div>
                    <div className="skeleton" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
                </div>
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', marginTop: 'auto' }}></div>
            </div>
        </div>
    )
}

export default EventCardSkeleton
