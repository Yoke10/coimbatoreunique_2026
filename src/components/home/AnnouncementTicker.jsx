import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './AnnouncementTicker.css'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const AnnouncementTicker = () => {
    const [isPaused, setIsPaused] = useState(false)

    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ['announcements'],
        queryFn: firebaseService.getAnnouncements,
        staleTime: 0,
        refetchOnMount: true,
    });

    if (isLoading || announcements.length === 0) return null;

    return (
        <section className="announcement-section">
            <div className="announcement-container">
                <div className="announcement-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>Announcements</span>
                </div>

                <div
                    className="ticker-wrapper"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className={`ticker-content ${isPaused ? 'paused' : ''}`}>
                        {[...announcements, ...announcements].map((announcement, index) => {
                            const isExternal = announcement.link && (announcement.link.startsWith('http') || announcement.link.startsWith('www.'));
                            const linkPath = announcement.link || '#';
                            
                            if (isExternal) {
                                return (
                                    <a 
                                        key={`${announcement.id || index}-ext`}
                                        href={linkPath.startsWith('www.') ? `https://${linkPath}` : linkPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ticker-item"
                                    >
                                        {announcement.text}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={`${announcement.id || index}-int`}
                                    to={linkPath}
                                    className="ticker-item"
                                >
                                    {announcement.text}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AnnouncementTicker
