import React from 'react';
import {
    Calendar, FileText, BookOpen, Image, Users, MessagesSquare,
    UserPlus, BarChart, HardDrive, Mail, Trash2, LogOut, LayoutDashboard, X
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "../../ui/AlertDialog/AlertDialog";
import './AdminLayout.css';

const Sidebar = ({
    activeSection,
    onNavigate,
    user,
    onLogout,
    storageUsage,
    onClearData,
    isOpen,
    onClose
}) => {
    const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

    const menuItems = [
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'bulletin', label: 'Bulletin', icon: FileText },
        { id: 'scrapbook', label: 'Scrapbook', icon: BookOpen },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'board', label: 'Board Members', icon: Users },
        { id: 'members', label: 'Members', icon: Users },
        { id: 'support', label: 'Support', icon: MessagesSquare },
        { id: 'joining', label: 'Joining Enquiry', icon: UserPlus },
        { id: 'reports', label: 'Reports', icon: BarChart },
        { id: 'resources', label: 'Resources', icon: HardDrive },
        { id: 'email', label: 'Email Manager', icon: Mail },
    ];

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LayoutDashboard className="sidebar-logo-icon" size={28} />
                    <h2 className="sidebar-title">Admin Panel</h2>
                </div>
                <button className="mobile-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        {(user?.profile?.fullName || user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <span className="user-name">
                            {user?.profile?.fullName || user?.email || 'System Admin'}
                        </span>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>

                <div className="storage-indicator">
                    <div className="storage-header">
                        <span>Storage</span>
                        <span>{storageUsage} MB</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min((parseFloat(storageUsage) / 5) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <span className="storage-limit">of 5.00 MB Used</span>
                </div>

                <div className="footer-actions">
                    <button onClick={onClearData} className="footer-action-btn danger">
                        <Trash2 size={18} />
                        <span>Clear Data</span>
                    </button>
                    <button onClick={() => setShowLogoutAlert(true)} className="footer-action-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to log out of the admin panel?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onLogout}>Logout</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </aside>
    );
};

export default Sidebar;
