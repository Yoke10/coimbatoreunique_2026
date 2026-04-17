import React from 'react'

const BulletinCardSkeleton = () => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                position: 'relative',
            }}
            className="bulletin-card-skeleton"
        >
            <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
            </div>
            <div style={{ padding: '1.2rem 1rem' }}>
                <div className="skeleton" style={{
                    width: '60px',
                    height: '24px',
                    borderRadius: '50px',
                    marginBottom: '0.4rem'
                }}></div>
                <div className="skeleton" style={{
                    width: '90%',
                    height: '22px',
                    borderRadius: '4px',
                    marginTop: '8px'
                }}></div>
                <div className="skeleton" style={{
                    width: '60%',
                    height: '22px',
                    borderRadius: '4px',
                    marginTop: '6px'
                }}></div>
            </div>
        </div>
    )
}

export default BulletinCardSkeleton
