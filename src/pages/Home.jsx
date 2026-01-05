import React, { Suspense } from 'react'
import HeroSection from '../components/home/HeroSection'
const AnnouncementTicker = React.lazy(() => import('../components/home/AnnouncementTicker'))
const AboutUsSection = React.lazy(() => import('../components/home/AboutUsSection'))
const PrayerAndTestSection = React.lazy(() => import('../components/home/PrayerAndTestSection'))
const CalendarSection = React.lazy(() => import('../components/home/CalendarSection'))
const OurTeamSection = React.lazy(() => import('../components/home/OurTeamSection'))
const ClubStatsSection = React.lazy(() => import('../components/home/ClubStatsSection'))
const EventsSection = React.lazy(() => import('../components/home/EventsSection'))
const SponsorsSection = React.lazy(() => import('../components/home/SponsorsSection'))
const JoinUsSection = React.lazy(() => import('../components/home/JoinUsSection'))
const GetInTouchSection = React.lazy(() => import('../components/home/GetInTouchSection'))

const Home = () => {
    return (
        <div className="home-page">
            <HeroSection />

            <Suspense fallback={<div style={{ height: '50px' }}></div>}>
                <AnnouncementTicker />
            </Suspense>

            <Suspense fallback={<div style={{ height: '400px' }}></div>}>
                <AboutUsSection />
            </Suspense>

            <Suspense fallback={<div style={{ height: '300px' }}></div>}>
                <PrayerAndTestSection />
                <CalendarSection />
            </Suspense>

            <Suspense fallback={<div style={{ height: '200px' }}></div>}>
                <OurTeamSection />
                <ClubStatsSection />
                <EventsSection />
                <SponsorsSection />
                <JoinUsSection />
                <GetInTouchSection />
            </Suspense>
        </div>
    )
}

export default Home
