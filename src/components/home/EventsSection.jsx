import React, { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { firebaseService } from '../../services/firebaseService'
import { useNavigate } from 'react-router-dom'
import './EventsSection.css'
const EventsSection = () => {
    const scrollRef = useRef(null)
    const navigate = useNavigate()

    const { data: events = [] } = useQuery({
        queryKey: ['events'],
        queryFn: firebaseService.getEvents,
        staleTime: 5 * 60 * 1000,
    })

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            const scrollAmount = 400

            if (direction === 'left') {
                scrollRef.current.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                })
            } else {
                // Check if near the end (within small tolerance)
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    navigate('/events')
                } else {
                    scrollRef.current.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    })
                }
            }
        }
    }

    const handleCardClick = () => {
        navigate('/events')
    }

    return (
        <section className="events-section section">
            <div className="container">
                <h2 className="section-title">Upcoming Events</h2>

                <div className="events-container">
                    <button className="scroll-btn scroll-left" onClick={() => scroll('left')} aria-label="Scroll left">
                        ‹
                    </button>

                    <div className="events-scroll" ref={scrollRef}>
                        {events.map((event) => {
                            const dateObj = new Date(event.date)
                            const day = dateObj.getDate().toString().padStart(2, '0')
                            const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()

                            return (
                                <div key={event.id} className="event-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                                    <div className="event-left">
                                        <div className="event-illustration">
                                            {event.poster ? (
                                                <img src={event.poster} alt={event.title} />
                                            ) : (
                                                <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <defs>
                                                        <linearGradient id={`eventGrad${event.id}`} x1="0" y1="0" x2="300" y2="200">
                                                            <stop offset="0%" stopColor="#400763" />
                                                            <stop offset="100%" stopColor="#ed0775" />
                                                        </linearGradient>
                                                    </defs>
                                                    <rect width="300" height="200" fill={`url(#eventGrad${event.id})`} opacity="0.1" rx="12" />
                                                    <circle cx="150" cy="100" r="40" fill="#400763" opacity="0.3" />
                                                    <path d="M100 120 L150 80 L200 120" stroke="#ed0775" strokeWidth="4" fill="none" />
                                                    <text x="150" y="160" textAnchor="middle" fill="#680b56" fontSize="14" fontWeight="600">
                                                        {event.category}
                                                    </text>
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <div className="event-main">
                                        <div className="event-category">{event.category}</div>
                                        <h3 className="event-title">{event.title}</h3>
                                        <p className="event-description">{event.description}</p>
                                    </div>

                                    <div className="event-date-panel">
                                        <div className="event-date">
                                            <div className="date-number">{day}</div>
                                            <div className="date-month">{month}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {/* Removed View All Card */}
                    </div>

                    <button className="scroll-btn scroll-right" onClick={() => scroll('right')} aria-label="Scroll right">
                        ›
                    </button>
                </div>
            </div>
        </section>
    )
}

export default EventsSection
