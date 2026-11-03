import React, { useEffect } from 'react'
import EventCard from '../components/events/EventCard'
import EventCardSkeleton from '../components/events/EventCardSkeleton'
import { firebaseService } from '../services/firebaseService'
import { useQuery } from '@tanstack/react-query'
import './Events.css'

const Events = () => {
    // TanStack Query Hook
    const { data: events = [], isLoading: loading } = useQuery({
        queryKey: ['events'],
        queryFn: firebaseService.getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes default,
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="events-page">
            <h1 className="events-page-title">
                Upcoming Events
                <span className="sr-only"> – Rotaract Club of Coimbatore Unique, Rotaract District 3206</span>
            </h1>

            <div className="events-list-container">
                {loading ? (
                    <>
                        {[1, 2, 3, 4].map((i, index) => (
                            <EventCardSkeleton key={i} index={index} />
                        ))}
                    </>
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            index={index}
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
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No upcoming events scheduled at the moment.</p>
                        <p style={{ fontSize: '0.95rem' }}>Check back soon for new club initiatives and projects!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Events
