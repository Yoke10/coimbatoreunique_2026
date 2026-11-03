import React, { useState, useEffect } from 'react'
import BulletinCard from '../components/bulletin/BulletinCard'
import BulletinCardSkeleton from '../components/bulletin/BulletinCardSkeleton'
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
                backgroundClip: 'text',
                position: 'relative'
            }}>
                Club Bulletins
                <span style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0
                }}> – Rotaract Club of Coimbatore Unique, Rotaract District 3206 Newsletters</span>
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {loading ? (
                    <>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <BulletinCardSkeleton key={i} />)}
                    </>
                ) : bulletins.length > 0 ? (
                    bulletins.map((bulletin, index) => (
                        <BulletinCard
                            key={bulletin.id || index}
                            bulletin={bulletin}
                            priority={index < 4}
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No bulletins published yet.</p>
                        <p style={{ fontSize: '0.95rem' }}>Check back soon for our latest club newsletters!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Bulletin
