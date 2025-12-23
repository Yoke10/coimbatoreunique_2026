import React, { useState, useEffect } from 'react'

// Layout
import AdminLayout from './layout/AdminLayout'

const EventsView = React.lazy(() => import('./views/EventsView'))
const BulletinView = React.lazy(() => import('./views/BulletinView'))
const ScrapbookView = React.lazy(() => import('./views/ScrapbookView'))
const GalleryView = React.lazy(() => import('./views/GalleryView'))
const BoardMembersView = React.lazy(() => import('./views/BoardMembersView'))
const SupportView = React.lazy(() => import('./views/SupportView'))
const JoiningEnquiryView = React.lazy(() => import('./views/JoiningEnquiryView'))
const MembersView = React.lazy(() => import('./views/MembersView'))
const ReportsView = React.lazy(() => import('./views/ReportsView'))

// Legacy/External components
const EmailManager = React.lazy(() => import('./EmailManager'))
const ResourceManager = React.lazy(() => import('./ResourceManager'))

// Styles
import './AdminDashboard.css'

const AdminDashboard = ({ user, onLogout }) => {
    const [activeSection, setActiveSection] = useState('events')
    const [storageUsage, setStorageUsage] = useState('0.00')

    // Load common admin data like storage usage
    useEffect(() => {
        loadStorageInfo()
    }, [])

    const loadStorageInfo = async () => {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate()
                setStorageUsage((estimate.usage / 1024 / 1024).toFixed(2))
            }
        } catch (error) {
            console.error("Failed to load storage info")
        }
    }

    const handleClearData = async () => {
        if (window.confirm("Are you sure? This will clear local session data.")) {
            sessionStorage.clear();
            window.location.reload()
        }
    }

    // Router Logic
    const renderContent = () => {
        return (
            <React.Suspense fallback={<div className="p-8 text-center">Loading section...</div>}>
                {(() => {
                    switch (activeSection) {
                        case 'events': return <EventsView />
                        case 'bulletin': return <BulletinView />
                        case 'scrapbook': return <ScrapbookView />
                        case 'gallery': return <GalleryView />
                        case 'board': return <BoardMembersView />
                        case 'support': return <SupportView />
                        case 'joining': return <JoiningEnquiryView />
                        case 'members': return <MembersView />
                        case 'reports': return <ReportsView />
                        case 'email': return <EmailManager />
                        case 'resources': return <ResourceManager />
                        default: return <EventsView />
                    }
                })()}
            </React.Suspense>
        )
    }

    return (
        <AdminLayout
            activeSection={activeSection}
            onNavigate={setActiveSection}
            user={user}
            onLogout={onLogout}
            storageUsage={storageUsage}
            onClearData={handleClearData}
        >
            {renderContent()}
        </AdminLayout>
    )
}

export default AdminDashboard
