import React from 'react'

const BulletinCard = (props) => {
    // Gracefully handle either <BulletinCard bulletin={item} /> or <BulletinCard {...item} />
    const data = props.bulletin || props || {};
    const priority = props.priority || false;

    const title = data.title || props.title || 'Club Bulletin';
    const month = data.month || data.date || props.month || props.date || '';
    const poster = data.poster || data.coverImage || data.image || props.poster || props.coverImage || props.image || '';
    const driveFileId = data.driveFileId || props.driveFileId;
    const pdfUrl = data.pdfUrl || props.pdfUrl;

    const handleCardClick = () => {
        if (driveFileId) {
            const driveUrl = driveFileId.startsWith('http')
                ? driveFileId
                : `https://drive.google.com/file/d/${driveFileId}/view`;
            window.open(driveUrl, '_blank', 'noopener,noreferrer');
        } else if (pdfUrl) {
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            onClick={handleCardClick}
            style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                cursor: (driveFileId || pdfUrl) ? 'pointer' : 'default',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            className="bulletin-card"
        >
            <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#f5f5f5' }}>
                {poster ? (
                    <img
                        src={poster}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s ease'
                        }}
                        className="bulletin-poster"
                        width="300"
                        height="400"
                        loading={priority ? "eager" : "lazy"}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(64, 7, 99, 0.08) 0%, rgba(237, 7, 117, 0.08) 100%)',
                        color: 'var(--primary-magenta)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        padding: '1rem',
                        textAlign: 'center'
                    }}>
                        {title}
                    </div>
                )}
            </div>
            <div style={{ padding: '1.2rem 1rem' }}>
                {month && (
                    <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        background: 'rgba(237, 7, 117, 0.08)',
                        color: 'var(--primary-pink)',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        marginBottom: '0.4rem',
                        letterSpacing: '0.5px'
                    }}>
                        {month}
                    </span>
                )}
                <h2 style={{
                    margin: '0',
                    color: 'var(--primary-magenta)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    lineHeight: '1.3'
                }}>
                    {title}
                </h2>
            </div>

            <style>{`
                .bulletin-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.12) !important;
                }
                .bulletin-card:hover .bulletin-poster {
                    transform: scale(1.08) !important;
                }
            `}</style>
        </div>
    )
}

export default BulletinCard
