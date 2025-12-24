import React, { useState, useEffect, useRef } from 'react'
import { firebaseService } from '../services/firebaseService'
import Loading from '../components/common/Loading'
import './Gallery.css'
import { useQuery } from '@tanstack/react-query'

const Gallery = () => {
    const { data: galleryItems = [], isLoading: loading } = useQuery({
        queryKey: ['gallery'],
        queryFn: firebaseService.getGallery,
        staleTime: 5 * 60 * 1000,
    })

    // No explicit fetch useEffect needed anymore
    // Removed unused masonry calculation logic to improve performance and CLS

    return (
        <div className="gallery-page" style={{ marginTop: '80px', padding: '2rem 0', minHeight: '80vh', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 2rem' }}>
                <h1 style={{
                    color: 'var(--primary-magenta)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    marginBottom: '1rem'
                }}>
                    Our Gallery
                </h1>
                <p style={{ color: 'var(--dark-gray)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Capturing moments of service, fellowship, and impact.
                </p>
            </div>

            <section className="gallery-carousel">
                {loading ? (
                    <Loading fullScreen={false} />
                ) : (
                    <div className="carousel__container">
                        {galleryItems.map((item, index) => (
                            <div key={item.id} className="carousel-item">
                                <img
                                    className="carousel-item__img"
                                    src={item.image}
                                    alt={item.eventName}
                                    loading={index < 4 ? "eager" : "lazy"}
                                />
                                <div className="carousel-item__details">
                                    <h2 className="carousel-item__details--title">{item.eventName}</h2>
                                </div>
                            </div>
                        ))}

                        {galleryItems.length === 0 && (
                            <div style={{ color: 'var(--dark-gray)', textAlign: 'center', width: '100%', padding: '20px' }}>
                                No images in gallery yet.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Gallery
