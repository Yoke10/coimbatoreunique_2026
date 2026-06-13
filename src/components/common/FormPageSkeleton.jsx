import React from 'react'

const FormPageSkeleton = ({ title }) => {
    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '3rem',
            background: 'var(--off-white)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            fontFamily: 'var(--font-primary)'
        }}>
            <div style={{ width: '100%', maxWidth: '900px', padding: '1rem' }}>
                <h1 style={{
                    textAlign: 'center',
                    color: 'var(--primary-purple)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '3.5rem',
                    marginBottom: '2rem'
                }}>
                    {title}
                </h1>
                <div style={{
                    background: 'var(--white)',
                    borderRadius: '20px',
                    padding: '3rem',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.02)'
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--off-white)' }}>
                        <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '10px' }}></div>
                        <div className="skeleton" style={{ width: '200px', height: '28px', borderRadius: '4px' }}></div>
                    </div>

                    {/* Form Skeleton Layout */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ width: '100%', height: '44px', borderRadius: '8px' }}></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }}></div>
                                    <div className="skeleton" style={{ width: '100%', height: '44px', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Textarea Skeleton */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }}></div>
                            <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
                        </div>

                        {/* Button Skeleton */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <div className="skeleton" style={{ width: '160px', height: '48px', borderRadius: '8px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormPageSkeleton
