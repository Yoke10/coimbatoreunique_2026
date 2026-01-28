import { useState } from 'react';
import './VideoSection.css';

const VideoSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Restore body scroll
        document.body.style.overflow = 'unset';
    };

    // YouTube video ID - replace with actual video ID
    const videoId = 'dQw4w9WgXcQ'; // Placeholder, update with actual video

    return (
        <section className="video-section">
            {/* Split Background */}
            <div className="video-background-split">
                <div className="video-bg-top"></div>
                <div className="video-bg-bottom"></div>
            </div>

            {/* Decorative Elements */}
            <div className="video-decorative-dots"></div>
            <div className="video-decorative-wave"></div>

            {/* Main Content */}
            <div className="video-content-wrapper">
                <div className="video-floating-container">
                    {/* Video Thumbnail */}
                    <div className="video-thumbnail-wrapper">
                        <img
                            src="/assets/video-thumbnail.jpg"
                            alt="Rotaract Club Video"
                            className="video-thumbnail-image"
                            loading="lazy"
                        />

                        {/* Play Button */}
                        <button
                            className="video-play-button"
                            onClick={openModal}
                            aria-label="Play video"
                        >
                            <div className="play-button-ripple"></div>
                            <div className="play-button-ripple ripple-delay-1"></div>
                            <div className="play-button-ripple ripple-delay-2"></div>
                            <svg
                                className="play-icon"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </div>


                </div>
            </div>

            {/* Modal Video Player */}
            {isModalOpen && (
                <div className="video-modal-overlay" onClick={closeModal}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            className="video-modal-close"
                            onClick={closeModal}
                            aria-label="Close video"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>

                        {/* YouTube Embed */}
                        <div className="video-embed-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                title="Rotaract Club Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="video-iframe"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default VideoSection;
