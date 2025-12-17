import React, { useState, useEffect } from 'react';
import { Trash2, Eye, UserPlus } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import '../layout/AdminLayout.css';

const JoiningEnquiryView = () => {
    const { toast } = useToast();
    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(() => { loadItems(); }, []);
    const loadItems = async () => {
        try { setEnquiries(await firebaseService.getJoinRequests()); }
        catch { toast({ title: "Error", description: "Failed to load", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this request?")) {
            await firebaseService.deleteJoinRequest(id);
            loadItems();
            if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
            toast({ title: "Deleted", variant: "default" });
        }
    };

    return (
        <div className="admin-view">
            <h2 className="view-title">Joining Enquiries</h2>
            <div className="admin-list-container">
                {enquiries.length === 0 ? <p className="empty-state">No enquiries found.</p> : (
                    enquiries.map(item => (
                        <div key={item.id} className="list-row-card">
                            <div className="row-content">
                                <h4 className="row-title">{item.fullName}</h4>
                                <p className="row-subtitle">{item.email} • {item.date || 'No Date'}</p>
                            </div>
                            <div className="row-actions">
                                <button onClick={() => setSelectedEnquiry(item)} className="action-btn view"><Eye size={16} /> View</button>
                                <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AdminModal isOpen={!!selectedEnquiry} onClose={() => setSelectedEnquiry(null)} title="Enquiry Details" size="large">
                {selectedEnquiry && (
                    <div className="detail-view">
                        <div className="detail-grid-3">
                            <div className="detail-item"><strong>Name:</strong> {selectedEnquiry.fullName}</div>
                            <div className="detail-item"><strong>Email:</strong> {selectedEnquiry.email}</div>
                            <div className="detail-item"><strong>Phone:</strong> {selectedEnquiry.phone || '-'}</div>
                            <div className="detail-item"><strong>DOB:</strong> {selectedEnquiry.dob || '-'}</div>
                            <div className="detail-item"><strong>Gender:</strong> {selectedEnquiry.gender || '-'}</div>
                            <div className="detail-item"><strong>Location:</strong> {selectedEnquiry.location || '-'}</div>
                            <div className="detail-item"><strong>Profession:</strong> {selectedEnquiry.profession || '-'}</div>
                            <div className="detail-item"><strong>NGO Exp:</strong> {selectedEnquiry.otherNGO || '-'}</div>
                            <div className="detail-item"><strong>Source:</strong> {selectedEnquiry.source || '-'}</div>
                        </div>
                        <div className="detail-message-box">
                            <strong>Reason for Joining:</strong>
                            <p>{selectedEnquiry.reason}</p>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default JoiningEnquiryView;
