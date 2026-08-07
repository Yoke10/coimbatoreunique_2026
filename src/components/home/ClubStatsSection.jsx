import React, { useState, useEffect, useRef } from 'react'
import './ClubStatsSection.css'

const ClubStatsSection = () => {
    const [counts, setCounts] = useState({
        years: 0,
        members: 0,
        projects: 0,
        impacts: 0,
        hours: 0
    })

    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    const finalCounts = {
        years: 25,
        members: 25,
        projects: 1000,
        impacts: 50000,
        hours: 30000
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                } else {
                    setIsVisible(false)
                    setCounts({
                        years: 0,
                        members: 0,
                        projects: 0,
                        awards: 0,
                        hours: 0
                    })
                }
            },
            { threshold: 0.3 } // Trigger when 30% visible
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const duration = 2000 // 2 seconds
        const steps = 60
        const interval = duration / steps

        let currentStep = 0

        const timer = setInterval(() => {
            currentStep++
            const progress = currentStep / steps

            // Ease-out function for smoother animation
            const easeOutQuad = t => t * (2 - t)
            const easedProgress = easeOutQuad(progress)

            if (currentStep <= steps) {
                setCounts({
                    years: Math.floor(finalCounts.years * easedProgress),
                    members: Math.floor(finalCounts.members * easedProgress),
                    projects: Math.floor(finalCounts.projects * easedProgress),
                    awards: Math.floor(finalCounts.awards * easedProgress),
                    hours: Math.floor(finalCounts.hours * easedProgress)
                })
            } else {
                clearInterval(timer)
                setCounts(finalCounts)
            }
        }, interval)

        return () => clearInterval(timer)
    }, [isVisible])

    const stats = [
        { key: 'years', label: 'Years of Service', desc: 'Serving since 2000' },
        { key: 'projects', label: 'Projects Done', desc: 'Creating lasting impact' },
        { key: 'members', label: 'Active Members', desc: 'Passionate leaders' },
        { key: 'impacts', label: 'Lives Impacted', desc: 'Transforming communities' },
        { key: 'hours', label: 'Volunteer Hours', desc: 'Selfless service' }
    ]

    return (
        <section className="stats-section section" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title">Our Impact</h2>

                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.key} className={`stat-card ${isVisible ? 'animate' : ''}`}>
                            <div className="stat-number">
                                {counts[stat.key]}{stat.key === 'hours' ? '+' : '+'}
                            </div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-description">{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ClubStatsSection
