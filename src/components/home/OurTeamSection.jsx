import React from 'react'
import { Link } from 'react-router-dom'
import TeamMemberCard from '../team/TeamMemberCard'
import './OurTeamSection.css'
import TeamMemberCardSkeleton from '../team/TeamMemberCardSkeleton'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const OurTeamSection = () => {
    const { data: members = [], isLoading: loading } = useQuery({
        queryKey: ['boardMembers'],
        queryFn: firebaseService.getBoardMembers,
        staleTime: 0,
        refetchOnMount: true,
    })

    const topMembers = members.slice(0, 3)

    return (
        <section className="team-section section">
            <div className="container">
                <h2 className="section-title">Our Team</h2>

                <div className="team-grid">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <TeamMemberCardSkeleton key={i} />
                        ))
                    ) : topMembers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666', width: '100%' }}>No team members added yet.</div>
                    ) : (
                        topMembers.map((member, index) => (
                            <TeamMemberCard
                                key={member.id}
                                name={member.name}
                                role={member.role}
                                image={member.image}
                                message={member.message}
                                priority={index < 3}
                            />
                        ))
                    )}
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
