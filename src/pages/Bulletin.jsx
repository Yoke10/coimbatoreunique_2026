import React, { useState, useEffect } from 'react'
import BulletinCard from '../components/bulletin/BulletinCard'
import Loading from '../components/common/Loading'
import { firebaseService } from '../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const Bulletin = () => {
    const { data: bulletins = [], isLoading: loading } = useQuery({
        queryKey: ['bulletins'],
        queryFn: firebaseService.getBulletins,
        staleTime: 5 * 60 * 1000,
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="bulletin-page" style={{ marginTop: '80px', padding: '2rem 5%', minHeight: '80vh', background: '#fdfbfd' }}>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '900',
                textAlign: 'center',
                marginBottom: '3rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                Club Bulletins
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {loading ? (
                    <Loading fullScreen={false} style={{ gridColumn: '1/-1' }} />
                ) : bulletins.length > 0 ? (
                    bulletins.map((bulletin, index) => (
                        <BulletinCard
                            key={bulletin.id}
                            bulletin={bulletin}
                            priority={index < 4}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--dark-gray)', gridColumn: '1/-1' }}>
                        No bulletins available yet.
                    </p>
                )}
            </div>

            {/* <FlipbookViewer /> Component Removed as per simplified requirement */}
        </div>
    )
}

export default Bulletin
