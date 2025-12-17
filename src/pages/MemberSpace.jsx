import React, { useState, useEffect } from 'react'
import Login from '../components/admin/Login'
import AdminDashboard from '../components/admin/AdminDashboard'
import MemberDashboard from '../components/member/MemberDashboard'
import { firebaseService } from '../services/firebaseService'
import { useAuth } from '../context/AuthContext'
import ErrorBoundary from '../components/common/ErrorBoundary'

const MemberSpace = () => {
    // 🔥 CONNECT TO AUTH CONTEXT
    const { currentUser, loading } = useAuth()

    const handleLogin = (loggedInUser) => {
        // Login component might still pass user up, but Context will update automatically
        // No local state needed here really, but Login might need refactor next.
        // For now, if Login succeeds, it calls firebaseService.login -> auth changes -> Context updates.
    }

    const handleLogout = async () => {
        await firebaseService.logout()
        // Context will auto-update to null
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B30F54' }}>
                Loading Member Space...
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className="memberspace-page">
                {!currentUser ? (
                    <Login onLogin={handleLogin} />
                ) : (
                    currentUser.role === 'admin' ? (
                        <AdminDashboard user={currentUser} onLogout={handleLogout} />
                    ) : (
                        <MemberDashboard user={currentUser} onLogout={handleLogout} />
                    )
                )}
            </div>
        </ErrorBoundary>
    )
}

export default MemberSpace
