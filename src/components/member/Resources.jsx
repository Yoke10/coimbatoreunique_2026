import React from 'react'
import { firebaseService } from '../../services/firebaseService'
import { useQuery } from '@tanstack/react-query'

const Resources = () => {
    const { data: resources = [], isLoading: loading } = useQuery({
        queryKey: ['resources'],
        queryFn: async () => {
            const data = await firebaseService.getResources();
            return data.sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        staleTime: 5 * 60 * 1000
    })

    const openResource = (res) => {
        if (res.type === 'link') {
            window.open(res.content, '_blank')
        } else {
            const win = window.open()
            if (win) {
                win.document.write('<iframe src="' + res.content + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
            }
        }
    }

    return (
        <div style={{ padding: '2rem 5%', minHeight: '80vh', background: '#fafafa' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '3rem' }}>Resources & Downloads</h1>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Loading...</div>
            ) : resources.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888' }}>No resources available at the moment.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {resources.map(res => (
                        <div key={res.id} onClick={() => openResource(res)} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                {res.type === 'link' ? '🔗' : (res.type === 'pdf' ? '📄' : '🖼️')}
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem' }}>{res.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(res.date).toLocaleDateString()}</p>
                            <span style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                background: res.type === 'link' ? '#e3f2fd' : '#fce4ec',
                                color: res.type === 'link' ? '#1976d2' : '#c2185b',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {res.type === 'link' ? 'Open Link' : 'View File'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Resources