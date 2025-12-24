import React from 'react'
import './TeamMemberCard.css'

const TeamMemberCard = ({ name, role, image, message, priority = false }) => {
    return (
        <div className="team-member-card">
            <div className="member-image-container">
                <img
                    src={image}
                    alt={name}
                    className="member-image"
                    width="300"
                    height="300"
                    loading={priority ? "eager" : "lazy"}
                />
                <div className="member-overlay">
                    <p className="member-message">"{message}"</p>
                </div>
            </div>
            <div className="member-info">
                <h2 className="member-name">{name}</h2>
                <span className="member-role">{role}</span>
            </div>
        </div>
    )
}

export default TeamMemberCard
