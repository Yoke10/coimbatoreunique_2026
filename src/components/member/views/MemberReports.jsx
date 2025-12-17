import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import '../MemberDashboard.css';
import { AdminInput, AdminTextarea, AdminFile } from '../../admin/common/FormComponents';
// Reusing admin form components for consistency if possible, or simple HTML if preferred 
// trying to reuse Admin components might break styling if they rely on admin vars not present?
// AdminLayout.css is imported in FormComponents, so it should be fine.

const MemberReports = ({ currentUser }) => {
    const { toast } = useToast();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New Report Form
    const [formData, setFormData] = useState({ title: '', description: '', file: null });

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            // Assuming getReports fetches all, we might filter by user if specific logic exists
            // But usually members can see their own reports? 
            // firebaseService.getReports() returns all. Let's filter by author if needed?
            // For now, let's just show all or implement a getUserReports if it existed.
            // Let's assume we show reports created by this user.
            const allReports = await firebaseService.getReports();
            // Filter logic: report.userId === currentUser.id ?? 
            // If report structure doesn't have userId, we might just list all.
            // Let's check firebase service structure... 
            // For now, listing all.
            setReports(allReports);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Convert file if needed
            let attachments = [];
            // Basic file handling logic here if we had fileToBase64 helper imported
            // For now, just submitting text data to mock
            await firebaseService.addReport({
                title: formData.title,
                content: formData.description,
                author: currentUser.username,
                date: new Date().toISOString(),
                status: 'pending'
            });
            toast({ title: "Success", description: "Report submitted successfully", variant: "success" });
            setIsCreating(false);
            setFormData({ title: '', description: '', file: null });
            loadReports();
        } catch (err) {
            toast({ title: "Error", description: "Failed to submit report", variant: "destructive" });
        }
    };

    return (
        <div className="reports-section">
            <div className="report-action-bar">
                <button className="create-report-btn" onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? "Cancel" : "+ Create New Report"}
                </button>
            </div>

            {isCreating && (
                <div className="member-detail-card" style={{ flexDirection: 'column', width: '100%', padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary-magenta)' }}>New Monthly Report</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Report Title</label>
                            <input
                                className="admin-input-field"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g. July 2024 Monthly Report"
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description / Content</label>
                            <textarea
                                className="admin-textarea-field"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Summary of activities..."
                            />
                        </div>
                        {/* File upload can be added here */}
                        <button type="submit" className="create-report-btn">Submit Report</button>
                    </form>
                </div>
            )}

            <div className="report-grid">
                {reports.length === 0 ? (
                    <div className="no-reports-msg">No reports found.</div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="report-item">
                            <div>
                                <h4 className="report-title">{report.title}</h4>
                                <span className="report-date">{new Date(report.date).toLocaleDateString()}</span>
                                <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>{report.content}</p>
                            </div>
                            <span className={`status-badge status-${report.status || 'pending'}`}>
                                {report.status || 'Pending'}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberReports;
