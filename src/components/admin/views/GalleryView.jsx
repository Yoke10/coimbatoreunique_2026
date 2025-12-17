import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, Image } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminFile, AdminSelect } from '../common/FormComponents';
import { fileToBase64, validateFile } from '../../../utils/fileHelpers';
import '../layout/AdminLayout.css';

const GalleryView = () => {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({ eventName: '', image: '', orientation: 'landscape' });

    useEffect(() => { load(); }, []);
    const load = async () => setItems(await firebaseService.getGallery());

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !validateFile(file, 'image').valid) return;
        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, image: base64 }));
        } catch { }
    };

    const openAdd = () => { setFormData({ eventName: '', image: '', orientation: 'landscape' }); setIsEditing(false); setIsFormModalOpen(true); };
    const openEdit = (item) => { setFormData({ ...item }); setSelectedItem(item); setIsEditing(true); setIsFormModalOpen(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) await firebaseService.updateGalleryItem(selectedItem.id, formData);
            else await firebaseService.addGalleryItem(formData);
            toast({ title: "Success", variant: "success" });
            setIsFormModalOpen(false);
            load();
        } catch { toast({ title: "Error", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete?")) { await firebaseService.deleteGalleryItem(id); load(); }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Gallery</h2>
                <button onClick={openAdd} className="btn-add-new"><Plus size={18} /> Add Image</button>
            </div>

            <div className="admin-list-container">
                {items.map(item => (
                    <div key={item.id} className="list-row-card">
                        <div className="row-content">
                            <h3 className="row-title">{item.eventName}</h3>
                            <p className="row-subtitle">Orientation: {item.orientation}</p>
                        </div>
                        <div className="row-actions">
                            <button onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true); }} className="action-btn view"><Eye size={18} /></button>
                            <button onClick={() => openEdit(item)} className="action-btn edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Image" : "Add Image"}>
                <form onSubmit={handleSubmit}>
                    <AdminInput label="Event Name" name="eventName" value={formData.eventName} onChange={handleInputChange} required />
                    <AdminFile label="Image" accept="image/webp" onChange={handleFileChange} />
                    {formData.image && <img src={formData.image} alt="Prev" style={{ width: '100px', marginTop: '1rem' }} />}
                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>{isEditing ? "Update" : "Create"}</button>
                </form>
            </AdminModal>

            <AdminModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Image Details">
                {selectedItem && (
                    <div className="detail-view">
                        <h3>{selectedItem.eventName}</h3>
                        <p>Orientation: {selectedItem.orientation}</p>
                        <img src={selectedItem.image} alt="Full" style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default GalleryView;
