import React from 'react'
import { Link } from 'react-router-dom'
import TeamMemberCard from '../team/TeamMemberCard'
import './OurTeamSection.css'
const groupPic = '/images/grouppic.webp'

const OurTeamSection = () => {
    const teamMembers = [
        {
            id: 1,
            name: "John Doe",
            designation: "President",
            message: "Leading with passion and dedication to serve our community",
            image: groupPic
        },
        {
            id: 2,
            name: "Jane Smith",
            designation: "Secretary",
            message: "Organizing excellence and keeping our club running smoothly",
            image: groupPic
        },
        {
            id: 3,
            name: "Mike Johnson",
            designation: "Immediate Past President",
            message: "Guiding with experience and wisdom from past leadership",
            image: groupPic
        },
        {
            id: 4,
            name: "Sarah Williams",
            designation: "Treasurer",
            message: "Managing resources to maximize our community impact",
            image: groupPic
        }
    ]

    return (
        <section className="team-section section">
            <div className="container">
                <h2 className="section-title">Our Team</h2>

                <div className="team-grid">
                    {teamMembers
                        .filter(member =>
                            ["President", "Secretary", "Immediate Past President"].includes(member.designation)
                        )
                        .map((member) => (
                            <TeamMemberCard
                                key={member.id}
                                name={member.name}
                                role={member.designation}
                                image={member.image}
                                message={member.message}
                            />
                        ))}
                </div>

                <div className="team-view-more">
                    <Link to="/team" className="btn btn-primary">
                        View Team
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default OurTeamSection
