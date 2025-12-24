import React, { useEffect } from 'react' // Removed useState as it is handled by useQuery
import EventCard from '../components/events/EventCard'
import Loading from '../components/common/Loading'
import { firebaseService } from '../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const Events = () => {
    // TanStack Query Hook
    const { data: events = [], isLoading: loading } = useQuery({
        queryKey: ['events'],
        queryFn: firebaseService.getEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes default
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="events-page" style={{ marginTop: '80px', padding: '2rem 5%', minHeight: '80vh', background: '#fdfbfd' }}>
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
                Upcoming Events
            </h1>

            <div className="events-list-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {loading ? (
                    <Loading fullScreen={false} />
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--dark-gray)' }}>
                        No upcoming events at the moment. Stay tuned!
                    </p>
                )}
            </div>
        </div>
    )
}

export default Events
