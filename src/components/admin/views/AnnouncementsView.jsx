import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminTextarea } from '../common/FormComponents';
import '../layout/AdminLayout.css';

const AnnouncementsView = () => {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({ text: '', link: '' });

    useEffect(() => { load(); }, []);
    
    const load = async () => {
        const announcements = await firebaseService.getAnnouncements();
        setItems(announcements);
    };

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const openAdd = () => { setFormData({ text: '', link: '' }); setIsEditing(false); setIsFormModalOpen(true); };
    const openEdit = (item) => { setFormData({ ...item }); setSelectedItem(item); setIsEditing(true); setIsFormModalOpen(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.text.trim()) {
            toast({ title: "Text is required", variant: "destructive" });
            return;
        }

        try {
            if (isEditing) await firebaseService.updateAnnouncement(selectedItem.id, formData);
            else await firebaseService.addAnnouncement(formData);
            toast({ title: "Success", variant: "success" });
            setIsFormModalOpen(false);
            load();
        } catch { toast({ title: "Error saving announcement", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this announcement?")) { 
            await firebaseService.deleteAnnouncement(id); 
            load(); 
        }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Announcements</h2>
                <button onClick={openAdd} className="btn-add-new"><Plus size={18} /> Add Announcement</button>
            </div>

            <div className="admin-list-container">
                {items.length === 0 && (
                    <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        No announcements added yet.
                    </div>
                )}
                {items.map(item => (
                    <div key={item.id} className="list-row-card">
                        <div className="row-content">
                            <h3 className="row-title" style={{ fontSize: '1rem', fontWeight: '500' }}>{item.text}</h3>
                            <p className="row-subtitle" style={{ color: 'var(--primary-purple)', fontSize: '0.85rem' }}>
                                Link: {item.link || 'None'}
                            </p>
                        </div>
                        <div className="row-actions">
                            <button onClick={() => openEdit(item)} className="action-btn edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Announcement" : "Add Announcement"}>
                <form onSubmit={handleSubmit}>
                    <AdminTextarea 
                        label="Announcement Text" 
                        name="text" 
                        value={formData.text} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="e.g. 🎉 New Project Launch: Join us this weekend!" 
                    />
                    <AdminInput 
                        label="Link URL or Path (Optional)" 
                        name="link" 
                        value={formData.link} 
                        onChange={handleInputChange} 
                        placeholder="e.g. /events OR https://google.com" 
                    />
                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>{isEditing ? "Update" : "Create"}</button>
                </form>
            </AdminModal>
        </div>
    );
};

export default AnnouncementsView;
