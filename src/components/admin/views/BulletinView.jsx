import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, FileText } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminFile } from '../common/FormComponents';
import { fileToBase64, validateFile } from '../../../utils/fileHelpers';
import '../layout/AdminLayout.css';

const BulletinView = () => {
    const { toast } = useToast();
    const [bulletins, setBulletins] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({ title: '', month: '', poster: '', pdfUrl: '' });

    useEffect(() => { loadBulletins(); }, []);

    const loadBulletins = async () => {
        setBulletins(await firebaseService.getBulletins());
    };

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = async (e, field, type) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!validateFile(file, type).valid) return;
        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, [field]: base64 }));
        } catch { }
    };

    const openAdd = () => { setFormData({ title: '', month: '', poster: '', pdfUrl: '' }); setIsEditing(false); setIsFormModalOpen(true); };

    const openEdit = (item) => {
        setFormData({ ...item });
        setSelectedItem(item);
        setIsEditing(true);
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) await firebaseService.updateBulletin(selectedItem.id, formData);
            else await firebaseService.addBulletin(formData);
            toast({ title: "Success", description: "Saved successfully", variant: "success" });
            setIsFormModalOpen(false);
            loadBulletins();
        } catch { toast({ title: "Error", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this bulletin?")) {
            await firebaseService.deleteBulletin(id);
            loadBulletins();
        }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Bulletins</h2>
                <button onClick={openAdd} className="btn-add-new"><Plus size={18} /> Add Bulletin</button>
            </div>

            <div className="admin-list-container">
                {bulletins.map(item => (
                    <div key={item.id} className="list-row-card">
                        <div className="row-content">
                            <h3 className="row-title">{item.title}</h3>
                            <p className="row-subtitle">Edition: {item.month}</p>
                        </div>
                        <div className="row-actions">
                            <button onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true); }} className="action-btn view"><Eye size={18} /></button>
                            <button onClick={() => openEdit(item)} className="action-btn edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Bulletin" : "Add Bulletin"}>
                <form onSubmit={handleSubmit}>
                    <AdminInput label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
                    <AdminInput label="Month/Edition" name="month" value={formData.month} onChange={handleInputChange} required />
                    <AdminFile label="Cover Image" accept="image/webp" onChange={(e) => handleFileChange(e, 'poster', 'image')} />
                    <AdminFile label="PDF File" accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdfUrl', 'pdf')} />
                    <AdminInput name="pdfUrl" value={formData.pdfUrl} onChange={handleInputChange} placeholder="Or PDF URL" />
                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>{isEditing ? "Update" : "Create"}</button>
                </form>
            </AdminModal>

            <AdminModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Bulletin Details">
                {selectedItem && (
                    <div className="detail-view">
                        <img src={selectedItem.poster} alt="Cover" style={{ width: '150px', borderRadius: '8px', marginBottom: '1rem' }} />
                        <h3>{selectedItem.title}</h3>
                        <p><strong>Month:</strong> {selectedItem.month}</p>
                        <a href={selectedItem.pdfUrl} target="_blank" rel="noreferrer" className="admin-btn-primary" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>View PDF</a>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default BulletinView;
