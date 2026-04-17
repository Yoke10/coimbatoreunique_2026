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
                            priority={index < 3}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p className="empty-state-text">
                            No upcoming events at the moment. Stay tuned!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Events
