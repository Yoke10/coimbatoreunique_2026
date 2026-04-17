import React from 'react'
import './TeamMemberCard.css'

const TeamMemberCardSkeleton = () => {
    return (
        <div className="tmc-wrapper">
            {/* Tilted pink accent background */}
            <div className="tmc-bg-tilt" aria-hidden="true" style={{ background: '#e0e0e0', boxShadow: 'none' }}></div>

            {/* Main image card skeleton */}
            <div className="tmc-image-card" style={{ border: 'none', background: '#f5f5f5' }}>
                <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
            </div>

            {/* Bottom name + role block skeleton */}
            <div className="tmc-name-section">
                <p className="tmc-full-name skeleton" style={{ width: '140px', height: '24px', color: 'transparent', border: 'none', background: 'var(--light-gray)' }}>.</p>
                <span className="tmc-role-tag skeleton" style={{ width: '90px', height: '20px', color: 'transparent', boxShadow: 'none', marginTop: '4px', background: 'var(--gray)' }}>.</span>
            </div>
        </div>
    )
}

export default TeamMemberCardSkeleton
