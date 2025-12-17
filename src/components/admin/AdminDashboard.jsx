import React, { useState, useEffect } from 'react'

// Layout
import AdminLayout from './layout/AdminLayout'

// Views
import EventsView from './views/EventsView'
import BulletinView from './views/BulletinView'
import ScrapbookView from './views/ScrapbookView'
import GalleryView from './views/GalleryView'
import BoardMembersView from './views/BoardMembersView'
import SupportView from './views/SupportView'
import JoiningEnquiryView from './views/JoiningEnquiryView'
import MembersView from './views/MembersView'
import ReportsView from './views/ReportsView'

// Legacy/External components (assuming they work within the new layout or just ported as is)
import EmailManager from './EmailManager'
import ResourceManager from './ResourceManager'

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
