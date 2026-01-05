import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { firebaseService } from '../../services/firebaseService';
import './CalendarSection.css';

// Rotary Areas of Focus Logic
const AREA_OF_FOCUS = {
    0: { // Jan
        title: "Vocational Service",
        desc: "The month of January is designated as Vocational Service Month to emphasize the dignity of all vocations and the worthiness of all useful occupations."
    },
    1: { // Feb
        title: "Peacebuilding and Conflict Prevention",
        desc: "February is Peacebuilding and Conflict Prevention Month, highlighting Rotary's goal to build peace and resolve conflicts."
    },
    2: { // Mar
        title: "Water, Sanitation, and Hygiene",
        desc: "March focuses on Water, Sanitation, and Hygiene. Rotary supports activities that ensure sustainable access to water and sanitation."
    },
    3: { // Apr
        title: "Maternal and Child Health",
        // Note: April is technically Environmental Month in newer calendars, keeping standard or checking latest.
        // Update: April is Environmental Month now. July is Maternal/Child. 
        // User prompt said: "April for Environmental... plus July for Maternal/Child Health"
        desc: "April is Environmental Month. Rotary members are committed to carrying out projects that protect the environment."
    },
    4: { // May
        title: "Youth Service",
        desc: "May is Youth Service Month, recognizing the positive change implemented by youth and young adults."
    },
    5: { // Jun
        title: "Rotary Fellowships",
        desc: "June is designated for Rotary Fellowships, celebrating the bonds of friendship and common interests."
    },
    6: { // Jul
        title: "Maternal and Child Health",
        desc: "July is Maternal and Child Health Month. Rotary makes high-quality health care available to vulnerable mothers and children."
    },
    7: { // Aug
        title: "Membership and New Club Development",
        desc: "August is Membership and New Club Development Month, a time to focus on growing Rotary and the family of Rotary."
    },
    8: { // Sep
        title: "Basic Education and Literacy",
        desc: "September is Basic Education and Literacy Month. Rotary supports education for all children and literacy for children and adults."
    },
    9: { // Oct
        title: "Community Economic Development",
        desc: "October is Community Economic Development Month, focusing on building local economies and creating opportunities."
    },
    10: { // Nov
        title: "Rotary Foundation",
        desc: "November is Rotary Foundation Month. The Foundation transforms your gifts into service projects that change lives."
    },
    11: { // Dec
        title: "Disease Prevention and Treatment",
        desc: "December is Disease Prevention and Treatment Month. Rotary prevents disease and promotes health."
    }
};

// Fixed Rotary/Rotaract Days (Static for now, can be moved to DB)
const FIXED_IMPORTANT_DAYS = [
    { month: 2, day: 13, title: "World Rotaract Day", type: "rotary" }, // March 13 (Month is 0-indexed in JS Date)
    { month: 1, day: 23, title: "World Understanding and Peace Day", type: "rotary" }, // Feb 23
    { month: 9, day: 24, title: "World Polio Day", type: "rotary" } // Oct 24
];

const CalendarSection = () => {
    // Clock State
    const [time, setTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date()); // For navigation
    const [selectedDate, setSelectedDate] = useState(new Date()); // For sidebar

    // Fetch Events
    // Fetch Events
    const queryClient = useQueryClient();

    const { data: serverEvents = [] } = useQuery({
        queryKey: ['calendar_days'],
        queryFn: firebaseService.getCalendarDays,
        staleTime: 5 * 60 * 1000
    });

    // Prefetch Data on Mount (Instant Load)
    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ['calendar_days'],
            queryFn: firebaseService.getCalendarDays,
            staleTime: 5 * 60 * 1000
        });
    }, [queryClient]);

    // Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Helper: Components of Time
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // For Widget
    const widgetMonth = monthNames[time.getMonth()];
    const widgetDay = dayNames[time.getDay()];
    const widgetDate = time.getDate();
    const widgetYear = time.getFullYear();

    // For Area of Focus
    const currentFocus = AREA_OF_FOCUS[widgetMonth === monthNames[time.getMonth()] ? time.getMonth() : 0]; // Default to current

    // Calendar Helper Functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    // Reset state when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
            document.body.style.overflow = 'hidden'; // Lock Body Scroll
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    // Render Calendar Grid
    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Calculate days from prev month to fill start
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
            const day = daysInPrevMonth - firstDayOfMonth + 1 + i;
            return { day, type: 'prev' };
        });

        // Current month days
        const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
            return { day: i + 1, type: 'current' };
        });

        // Calculate next month fillers (only to complete current week)
        const totalUsed = prevMonthDays.length + currentMonthDays.length;
        const remaining = (7 - (totalUsed % 7)) % 7;
        const nextMonthDays = Array.from({ length: remaining }, (_, i) => {
            return { day: i + 1, type: 'next' };
        });

        const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

        return allDays.map((cell, index) => {
            const { day, type } = cell;

            // Date for event checking
            let cellDate;
            if (type === 'current') cellDate = new Date(year, month, day);
            else if (type === 'prev') cellDate = new Date(year, month - 1, day);
            else cellDate = new Date(year, month + 1, day);

            // Check events
            const dayEvents = getEventsForDate(cellDate);
            const hasEvent = dayEvents.length > 0;
            const isRotaryDay = dayEvents.some(e => e.type === 'rotary');

            const isToday = type === 'current' && day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const isSelected = type === 'current' && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();

            // Prepare Tooltip Content
            const tooltipText = dayEvents.map(e => `${e.title}${e.description ? ': ' + e.description : ''}`).join('\n');

            return (
                <div
                    key={index}
                    className={`ui2-date-cell ${type} ${isToday ? 'today' : ''} ${isSelected ? 'active-day' : ''} ${hasEvent ? 'has-event' : ''}`}
                    onClick={() => {
                        if (type === 'current') handleDateClick(day);
                    }}
                    title={tooltipText} // Native fallback
                >
                    <span className="ui2-cell-date-num">{day}</span>
                    {dayEvents.slice(0, 3).map((evt, idx) => (
                        <div key={idx} className={`ui2-cell-event-label type-${evt.type || 'event'}`}>
                            {evt.title}
                        </div>
                    ))}

                    {/* Hover Tooltip */}
                    {hasEvent && (
                        <div className="ui2-tooltip-content">
                            {dayEvents.map((evt, i) => (
                                <div key={i} className="ui2-tooltip-item">
                                    <strong>{evt.title}</strong>
                                    {evt.description && <span className="tooltip-desc">{evt.description}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    const getEventsForDate = (date) => {
        const apiEvents = serverEvents.filter(e => {
            const eDate = new Date(e.date); // Assuming e.date is standard string or timestamp
            return eDate.getDate() === date.getDate() &&
                eDate.getMonth() === date.getMonth() &&
                eDate.getFullYear() === date.getFullYear();
        });

        const fixedEvents = FIXED_IMPORTANT_DAYS.filter(e => {
            return e.month === date.getMonth() && e.day === date.getDate();
        });

        return [...fixedEvents, ...apiEvents];
    };

    const selectedEvents = getEventsForDate(selectedDate);

    return (
        <section className="calendar-section-wrapper">
            <div className="container">

                {/* --- UI 1: Widget (Left) --- */}
                {/* --- UI 1: Widget (Left) --- */}
                <div className="cs-widget-container" onMouseEnter={() => { }} onClick={() => setIsModalOpen(true)}>
                    <div className="signboard outer">
                        <div className="signboard front inner anim04c">
                            <div className="year anim04c">
                                <span>{widgetYear}</span>
                            </div>
                            <ul className="calendarMain anim04c">
                                <span className="month anim04c">
                                    <span>{widgetMonth}</span>
                                </span>
                                <span className="date anim04c">
                                    <span>{widgetDate}</span>
                                </span>
                                <span className="day anim04c">
                                    <span>{widgetDay}</span>
                                </span>
                            </ul>
                            <div className="clock minute anim04c">
                                <span>{time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}</span>
                            </div>
                            <div className="calendarNormal date2 anim04c">
                                <span>{widgetDate}</span>
                            </div>
                        </div>
                        <div className="signboard left inner anim04c">
                            <div className="clock hour anim04c">
                                <span>{time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}</span>
                            </div>
                            <div className="calendarNormal day2 anim04c">
                                <span>{widgetDay}</span>
                            </div>
                        </div>
                        <div className="signboard right inner anim04c">
                            <div className="clock second anim04c">
                                <span>{time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}</span>
                            </div>
                            <div className="calendarNormal month2 anim04c">
                                <span>{widgetMonth}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Content: Area of Focus (Right) --- */}
                <div className="cs-focus-container">
                    <span className="cs-focus-subtitle">Rotary's Area of Focus - {widgetMonth}</span>
                    <h2 className="cs-focus-title-large">{currentFocus.title}</h2>
                    <p className="cs-focus-desc">{currentFocus.desc}</p>
                </div>
            </div>

            {/* --- UI 2: Modal (Full Calendar) --- */}
            {isModalOpen && (
                <div className="cs-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="cs-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="cs-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>

                        {/* Sidebar (Left) */}
                        <div className="ui2-calendar-left">
                            <div className="ui2-num-date">{selectedDate.getDate()}</div>
                            <div className="ui2-day">{dayNames[selectedDate.getDay()]}</div>

                            {/* Dynamic Focus Display */}
                            <div className="ui2-focus-display" style={{ marginTop: '20px', padding: '0 10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '30px', marginBottom: '5px' }}>{AREA_OF_FOCUS[currentDate.getMonth()].icon}</div>
                                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Rotary Focus</div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>
                                    {AREA_OF_FOCUS[currentDate.getMonth()].title}
                                </div>
                            </div>

                            <div className="ui2-current-events">
                                <strong>Events On This Day:</strong>
                                {selectedEvents.length > 0 ? (
                                    <ul>
                                        {selectedEvents.map((evt, idx) => (
                                            <li key={idx} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {evt.title}
                                                    {evt.type === 'rotary' && ' (Rotary Day)'}
                                                </div>
                                                {evt.description && (
                                                    <div style={{ fontSize: '0.85em', opacity: 0.8, marginTop: '2px' }}>
                                                        {evt.description}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No events scheduled.</p>
                                )}
                            </div>
                        </div>

                        {/* Calendar Grid (Right) */}
                        <div className="ui2-calendar-base">
                            <div className="ui2-year">{currentDate.getFullYear()}</div>

                            <div className="ui2-months">
                                <span onClick={handlePrevMonth}>&lt;</span>
                                <strong className="ui2-month-active" style={{ margin: '0 20px', fontSize: '18px' }}>
                                    {monthNames[currentDate.getMonth()]}
                                </strong>
                                <span onClick={handleNextMonth}>&gt;</span>
                            </div>

                            <div className="ui2-days">
                                <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div>
                                <div>THU</div><div>FRI</div><div>SAT</div>
                            </div>

                            <div className="ui2-num-dates">
                                {renderCalendarGrid()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CalendarSection;
