import React, { Suspense } from 'react'
import HeroSection from '../components/home/HeroSection'
const AnnouncementTicker = React.lazy(() => import('../components/home/AnnouncementTicker'))
const AboutUsSection = React.lazy(() => import('../components/home/AboutUsSection'))
const PrayerAndTestSection = React.lazy(() => import('../components/home/PrayerAndTestSection'))
const CalendarSection = React.lazy(() => import('../components/home/CalendarSection'))
const VideoSection = React.lazy(() => import('../components/home/VideoSection'))
const OurTeamSection = React.lazy(() => import('../components/home/OurTeamSection'))
const ClubStatsSection = React.lazy(() => import('../components/home/ClubStatsSection'))
const EventsSection = React.lazy(() => import('../components/home/EventsSection'))
const SponsorsSection = React.lazy(() => import('../components/home/SponsorsSection'))
const JoinUsSection = React.lazy(() => import('../components/home/JoinUsSection'))
const GetInTouchSection = React.lazy(() => import('../components/home/GetInTouchSection'))

const Home = () => {
    // Prefetch pages for faster navigation
    React.useEffect(() => {
        const prefetch = (importFn) => {
            const module = importFn();
            return module;
        };

        const timers = [];

        // 1 second: Contact Us, Join Us
        timers.push(setTimeout(() => {
            prefetch(() => import('./Contact'));
            prefetch(() => import('./JoinUs'));
        }, 1000));

        // 2 seconds: About Us
        timers.push(setTimeout(() => {
            prefetch(() => import('./About'));
        }, 2000));

        // 5 seconds: Team, Events, Gallery, Bulletin, Scrapbook
        timers.push(setTimeout(() => {
            prefetch(() => import('./Team'));
            prefetch(() => import('./Events'));
            prefetch(() => import('./Gallery'));
            prefetch(() => import('./Bulletin'));
            prefetch(() => import('./Scrapbook'));
        }, 5000));

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, []);

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

            <Suspense fallback={<div style={{ height: '210px' }}></div>}>
                <VideoSection />
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
