import React, { useEffect } from 'react'
import AboutHeroSection from '../components/about/AboutHeroSection'
import ClubDescriptionSection from '../components/about/ClubDescriptionSection'
import VisionMissionGoalSection from '../components/about/VisionMissionGoalSection'
import ClubOfficialsSection from '../components/about/ClubOfficialsSection'
import AboutJoinUsSection from '../components/about/AboutJoinUsSection'

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="about-page">
            <AboutHeroSection />
            <ClubDescriptionSection />
            <VisionMissionGoalSection />
            <ClubOfficialsSection />
            <AboutJoinUsSection />
        </div>
    )
}

export default About
