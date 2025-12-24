import React from 'react'
import TeamMemberCard from './TeamMemberCard'
import Loading from '../common/Loading'
import './TeamGridSection.css'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const TeamGridSection = () => {
    const { data: members = [], isLoading: loading } = useQuery({
        queryKey: ['boardMembers'],
        queryFn: firebaseService.getBoardMembers,
        staleTime: 5 * 60 * 1000,
    })


    return (
        <section className="team-grid-section">
            <h1 className="team-grid-title">Meet Our Team</h1>
            {loading ? (
                <Loading fullScreen={false} />
            ) : members.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No team members added yet.</div>
            ) : (
                <div className="team-grid-container">
                    {members.map((member, index) => (
                        <TeamMemberCard
                            key={member.id}
                            name={member.name}
                            role={member.role}
                            image={member.image}
                            message={member.message}
                            priority={index < 4}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default TeamGridSection
