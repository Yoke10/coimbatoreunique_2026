import React from 'react'
import TeamMemberCard from './TeamMemberCard'
import TeamMemberCardSkeleton from './TeamMemberCardSkeleton'
import './TeamGridSection.css'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const TeamGridSection = () => {
    const { data: members = [], isLoading: loading } = useQuery({
        queryKey: ['boardMembers'],
        queryFn: firebaseService.getBoardMembers,
        staleTime: 0,           // Always refetch on mount — ensures new members appear immediately
        refetchOnMount: true,
    })


    return (
        <section className="team-grid-section">
            <h1 className="team-grid-title">Meet Our Team</h1>
            {loading ? (
                <div className="team-grid-container">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <TeamMemberCardSkeleton key={i} />
                    ))}
                </div>
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
