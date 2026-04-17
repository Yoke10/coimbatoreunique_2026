import React from 'react'
import './TeamMemberCard.css'

const TeamMemberCard = ({ name, role, image, message, priority = false }) => {
    // Strip "Rtr." prefix stored in Firebase names (e.g. "Rtr. Dharshini Shri" → "Dharshini Shri")
    const cleanName = (name || '')

    return (
        <div className="tmc-wrapper">
            {/* Tilted pink accent background */}
            <div className="tmc-bg-tilt" aria-hidden="true"></div>

            {/* Main image card */}
            <div className="tmc-image-card">
                <img
                    src={image}
                    alt={name}
                    className="tmc-image"
                    width="260"
                    height="325"
                    loading={priority ? 'eager' : 'lazy'}
                />
                {/* Persistent bottom gradient */}
                <div className="tmc-gradient-overlay" aria-hidden="true"></div>

                {/* Message overlay — shown on hover (data from backend) */}
                {message && (
                    <div className="tmc-message-overlay">
                        <p className="tmc-message-text">"{message}"</p>
                    </div>
                )}
            </div>

            {/* Bottom name + role block */}
            <div className="tmc-name-section">
                <p className="tmc-full-name">{cleanName}</p>
                <span className="tmc-role-tag">{role}</span>
            </div>

            {/* Top role badge removed — role now shown below name */}
        </div>
    )
}

export default TeamMemberCard
