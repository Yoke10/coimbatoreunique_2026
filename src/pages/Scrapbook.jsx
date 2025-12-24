import React, { useState, useEffect } from 'react'
import BulletinCard from '../components/bulletin/BulletinCard'
import Loading from '../components/common/Loading'
import { firebaseService } from '../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const Scrapbook = () => {
    const { data: scrapbooks = [], isLoading: loading } = useQuery({
        queryKey: ['scrapbooks'],
        queryFn: firebaseService.getScrapbooks,
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
                Scrapbooks
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
                ) : scrapbooks.length > 0 ? (
                    scrapbooks.map((item, index) => (
                        <BulletinCard
                            key={item.id}
                            bulletin={{ ...item, month: item.date }} // Map date to month for card compatibility
                            priority={index < 4}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--dark-gray)', gridColumn: '1/-1' }}>
                        No scrapbooks available yet.
                    </p>
                )}
            </div>

            {/* Modal removed as per requirement */}
        </div>
    )
}

export default Scrapbook
