import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, Link as LinkIcon, FileText, Image } from 'lucide-react';
import { firebaseService } from '../../services/firebaseService';
import { useToast } from '../ui/Toast/ToastContext';
import AdminModal from './common/AdminModal';
import { AdminInput, AdminSelect, AdminFile } from './common/FormComponents';
import { fileToBase64, validateFile } from '../../utils/fileHelpers';
import './layout/AdminLayout.css';

const ResourceManager = () => {
    const { toast } = useToast();
    const [resources, setResources] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // For previewing content
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({ name: '', type: 'link', content: '' });
    const [uploadError, setUploadError] = useState('');

    useEffect(() => { load(); }, []);
    const load = async () => setResources((await firebaseService.getResources()).sort((a, b) => new Date(b.date) - new Date(a.date)));

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleTypeChange = (e) => setFormData(prev => ({ ...prev, type: e.target.value, content: '' }));

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setUploadError('Max 2MB'); return; }

        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, content: base64 }));
            setUploadError('');
        } catch { setUploadError('Read failed'); }
    };

    const openAdd = () => { setFormData({ name: '', type: 'link', content: '' }); setIsEditing(false); setIsFormModalOpen(true); };
    const openEdit = (item) => { setFormData({ ...item }); setSelectedItem(item); setIsEditing(true); setIsFormModalOpen(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content) { toast({ title: "Error", description: "Content required", variant: "destructive" }); return; }

        try {
            if (isEditing) await firebaseService.updateResource(selectedItem.id, formData);
            else await firebaseService.addResource(formData);
            toast({ title: "Success", variant: "success" });
            setIsFormModalOpen(false);
            load();
        } catch { toast({ title: "Error", variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete Resource?")) { await firebaseService.deleteResource(id); load(); }
    };

    const previewResource = (res) => {
        if (res.type === 'link') window.open(res.content, '_blank');
        else { setSelectedItem(res); setIsDetailModalOpen(true); }
    };

    const getTypeIcon = (type) => {
        if (type === 'link') return <LinkIcon size={16} />;
        if (type === 'pdf') return <FileText size={16} />;
        return <Image size={16} />;
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Resource Manager</h2>
                <button onClick={openAdd} className="btn-add-new"><Plus size={18} /> Add Resource</button>
            </div>

            <div className="admin-list-container">
                {resources.map(item => (
                    <div key={item.id} className="list-row-card">
                        <div className="row-content">
                            <h3 className="row-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'var(--admin-primary)' }}>{getTypeIcon(item.type)}</span>
                                {item.name}
                            </h3>
                            <p className="row-subtitle">{new Date(item.date).toLocaleDateString()} • {item.type.toUpperCase()}</p>
                        </div>
                        <div className="row-actions">
                            <button onClick={() => previewResource(item)} className="action-btn view" title={item.type === 'link' ? "Open Link" : "Preview"}><Eye size={18} /></button>
                            <button onClick={() => openEdit(item)} className="action-btn edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
                {resources.length === 0 && <p className="empty-state">No resources found.</p>}
            </div>

            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Resource" : "Add Resource"}>
                <form onSubmit={handleSubmit}>
                    <AdminInput label="Resource Name" name="name" value={formData.name} onChange={handleInputChange} required />
                    <AdminSelect label="Type" name="type" value={formData.type} onChange={handleTypeChange}
                        options={[{ value: 'link', label: 'External Link' }, { value: 'pdf', label: 'PDF Document' }, { value: 'image', label: 'Image File' }]} />

                    {formData.type === 'link' ? (
                        <AdminInput label="URL" name="content" value={formData.content} onChange={handleInputChange} placeholder="https://..." required />
                    ) : (
                        <div style={{ marginBottom: '1rem' }}>
                            <AdminFile label={formData.type === 'pdf' ? "PDF File (Max 2MB)" : "Image File (Max 2MB)"}
                                accept={formData.type === 'pdf' ? "application/pdf" : "image/*"}
                                onChange={handleFileChange} />
                            {uploadError && <p style={{ color: 'var(--admin-danger)', fontSize: '0.8rem' }}>{uploadError}</p>}
                            {isEditing && !formData.content.startsWith('data:') && <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Current file loaded.</p>}
                        </div>
                    )}

                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>{isEditing ? "Update" : "Create"}</button>
                </form>
            </AdminModal>

            <AdminModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Preview Resource" size="large">
                {selectedItem && (
                    <div className="detail-view" style={{ height: '60vh' }}>
                        {selectedItem.type === 'image' ? (
                            <img src={selectedItem.content} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <iframe src={selectedItem.content} title="Preview" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                        )}
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default ResourceManager;
