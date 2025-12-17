import React, { useState, useEffect } from 'react';
import { Trash2, Eye, MessageSquare } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import '../layout/AdminLayout.css';

const SupportView = () => {
    const { toast } = useToast();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => { loadMessages(); }, []);
    const loadMessages = async () => {
        try { setMessages(await firebaseService.getSupportMessages()); }
        catch { toast({ title: "Error", description: "Failed to load messages", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this message?")) {
            await firebaseService.deleteSupportMessage(id);
            loadMessages();
            if (selectedMessage?.id === id) setSelectedMessage(null);
            toast({ title: "Deleted", variant: "default" });
        }
    };

    return (
        <div className="admin-view">
            <h2 className="view-title">Support Messages</h2>
            <div className="admin-list-container">
                {messages.length === 0 ? <p className="empty-state">No messages found.</p> : (
                    messages.map(msg => (
                        <div key={msg.id} className="list-row-card">
                            <div className="row-content">
                                <h4 className="row-title">{msg.fullName}</h4>
                                <p className="row-subtitle">{msg.email} • {msg.date || 'No Date'}</p>
                            </div>
                            <div className="row-actions">
                                <button onClick={() => setSelectedMessage(msg)} className="action-btn view"><Eye size={16} /> View</button>
                                <button onClick={() => handleDelete(msg.id)} className="action-btn delete"><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AdminModal isOpen={!!selectedMessage} onClose={() => setSelectedMessage(null)} title="Message Details">
                {selectedMessage && (
                    <div className="detail-view">
                        <div className="detail-grid">
                            <div className="detail-item"><strong>Name:</strong> {selectedMessage.fullName}</div>
                            <div className="detail-item"><strong>Email:</strong> {selectedMessage.email}</div>
                            <div className="detail-item"><strong>Phone:</strong> {selectedMessage.phone || '-'}</div>
                            <div className="detail-item"><strong>Location:</strong> {selectedMessage.location || '-'}</div>
                            <div className="detail-item"><strong>Profession:</strong> {selectedMessage.profession || '-'}</div>
                            <div className="detail-item"><strong>Purpose:</strong> {selectedMessage.purpose || '-'}</div>
                        </div>
                        <div className="detail-message-box">
                            <strong>Message:</strong>
                            <p>{selectedMessage.message}</p>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default SupportView;
