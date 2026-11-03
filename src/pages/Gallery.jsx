import React, { useState, useEffect, useRef } from 'react'
import { firebaseService } from '../services/firebaseService'
import GalleryItemSkeleton from '../components/gallery/GalleryItemSkeleton'
import './Gallery.css'
import { useQuery } from '@tanstack/react-query'

const Gallery = () => {
    const { data: galleryItems = [], isLoading: loading } = useQuery({
        queryKey: ['gallery'],
        queryFn: firebaseService.getGallery,
        staleTime: 5 * 60 * 1000,
    })

    return (
        <div className="gallery-page" style={{ marginTop: '80px', padding: '2rem 0', minHeight: '80vh', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 2rem' }}>
                <h1 style={{
                    color: 'var(--primary-magenta)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    position: 'relative'
                }}>
                    Our Gallery
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
                    }}> – Photo Memories &amp; Projects | Rotaract Club of Coimbatore Unique</span>
                </h1>
                <p style={{ color: 'var(--dark-gray)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Capturing moments of service, fellowship, and impact across Rotaract District 3206.
                </p>
            </div>

            <section className="gallery-carousel" aria-label="Photo Carousel">
                {loading ? (
                    <div className="carousel__container">
                        {[
                            '350px', '220px', '400px', '280px', '320px',
                            '260px', '450px', '200px', '380px', '290px',
                            '310px', '240px', '420px', '270px', '330px',
                        ].map((h, i) => (
                            <GalleryItemSkeleton key={i} height={h} />
                        ))}
                    </div>
                ) : (
                    <div className="carousel__container">
                        {galleryItems.map((item, index) => (
                            <div key={item.id} className="carousel-item">
                                <img
                                    className="carousel-item__img"
                                    src={item.image}
                                    alt={item.title || "Rotaract Club of Coimbatore Unique Project Photo"}
                                    loading="lazy"
                                />
                                <div className="carousel-item__details">
                                    <div className="controls">
                                        <span className="carousel-item__title">{item.title}</span>
                                    </div>
                                    <h2 className="carousel-item__subtitle">{item.category}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Gallery
