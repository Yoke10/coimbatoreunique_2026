import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, User } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminFile, AdminTextarea } from '../common/FormComponents';
import { fileToBase64, validateFile } from '../../../utils/fileHelpers';
import '../layout/AdminLayout.css';

const BoardMembersView = () => {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({ name: '', role: '', message: '', image: '' });

    useEffect(() => { load(); }, []);
    const load = async () => setItems(await firebaseService.getBoardMembers());

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !validateFile(file, 'image').valid) return;
        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, image: base64 }));
        } catch { }
    };

    const openAdd = () => { setFormData({ name: '', role: '', message: '', image: '' }); setIsEditing(false); setIsFormModalOpen(true); };
    const openEdit = (item) => { setFormData({ ...item }); setSelectedItem(item); setIsEditing(true); setIsFormModalOpen(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) await firebaseService.updateBoardMember(selectedItem.id, formData);
            else await firebaseService.addBoardMember(formData);
            toast({ title: "Success", variant: "success" });
            setIsFormModalOpen(false);
            load();
        } catch { toast({ title: "Error", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete?")) { await firebaseService.deleteBoardMember(id); load(); }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Board Members</h2>
                <button onClick={openAdd} className="btn-add-new"><Plus size={18} /> Add Member</button>
            </div>

            <div className="admin-list-container">
                {items.map(item => (
                    <div key={item.id} className="list-row-card">
                        <div className="row-content">
                            <h3 className="row-title">{item.name}</h3>
                            <p className="row-subtitle">{item.role}</p>
                        </div>
                        <div className="row-actions">
                            <button onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true); }} className="action-btn view"><Eye size={18} /></button>
                            <button onClick={() => openEdit(item)} className="action-btn edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Board Member" : "Add Board Member"}>
                <form onSubmit={handleSubmit}>
                    <AdminInput label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
                    <AdminInput label="Role" name="role" value={formData.role} onChange={handleInputChange} required />
                    <AdminTextarea label="Message" name="message" value={formData.message} onChange={handleInputChange} />
                    <AdminFile label="Photo" accept="image/webp" onChange={handleFileChange} />
                    {formData.image && <img src={formData.image} alt="Prev" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginTop: '1rem' }} />}
                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>{isEditing ? "Update" : "Create"}</button>
                </form>
            </AdminModal>

            <AdminModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Member Details">
                {selectedItem && (
                    <div className="detail-view" style={{ textAlign: 'center' }}>
                        <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1.5rem' }} />
                        <h3>{selectedItem.name}</h3>
                        <p style={{ color: '#666', fontWeight: '600' }}>{selectedItem.role}</p>
                        <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>"{selectedItem.message}"</p>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default BoardMembersView;
