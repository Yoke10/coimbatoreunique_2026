import React from 'react'
import '../../pages/Gallery.css'

const GalleryItemSkeleton = ({ height = '300px' }) => {
    return (
        <div className="carousel-item" style={{ height: height }}>
            {/* The image placeholder */}
            <div className="skeleton carousel-item__img" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}></div>
            
            {/* Title overlay placeholder */}
            <div className="carousel-item__details" style={{ opacity: 1, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}>
                <div className="skeleton" style={{ width: '60%', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.4)' }}></div>
            </div>
        </div>
    )
}

export default GalleryItemSkeleton
