import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, Calendar, Tag } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminTextarea, AdminFile, AdminSelect } from '../common/FormComponents';
import { fileToBase64, validateFile } from '../../../utils/fileHelpers';
import '../layout/AdminLayout.css';

const EventsView = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Selection State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: '',
        description: '',
        poster: '',
        images: []
    });

    useEffect(() => { loadEvents(); }, []);

    const loadEvents = async () => {
        try {
            const data = await firebaseService.getEvents();
            // Sort by date descending
            setEvents(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) { toast({ title: "Error", description: "Failed to load events", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePosterChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const res = validateFile(file, 'image');
        if (!res.valid) { toast({ title: "Invalid File", description: res.error, variant: "destructive" }); return; }

        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, poster: base64 }));
        } catch (e) { toast({ title: "Error", description: "File processing failed", variant: "destructive" }); }
    };

    const handleImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        for (const file of files) {
            const res = validateFile(file, 'image');
            if (res.valid) {
                try { newImages.push(await fileToBase64(file)); } catch (e) { }
            }
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    // OPEN ACTIONS
    const openAddModal = () => {
        setFormData({ title: '', date: '', category: '', description: '', poster: '', images: [] });
        setIsEditing(false);
        setIsFormModalOpen(true);
    };

    const openEditModal = (event) => {
        setFormData({
            title: event.title,
            date: event.date,
            category: event.category,
            description: event.description,
            poster: event.poster,
            images: event.images || []
        });
        setSelectedEvent(event);
        setIsEditing(true);
        setIsFormModalOpen(true);
    };

    const openDetailModal = (event) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedEvent) {
                await firebaseService.updateEvent(selectedEvent.id, formData);
                toast({ title: "Updated", description: "Event updated successfully", variant: "success" });
            } else {
                await firebaseService.addEvent(formData);
                toast({ title: "Created", description: "Event created successfully", variant: "success" });
            }
            setIsFormModalOpen(false);
            loadEvents();
        } catch (error) { toast({ title: "Error", description: "Operation failed", variant: "destructive" }); }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (window.confirm("Delete this event?")) {
            await firebaseService.deleteEvent(id);
            loadEvents();
            toast({ title: "Deleted", variant: "default" });
        }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Events</h2>
                <button onClick={openAddModal} className="btn-add-new"><Plus size={18} /> Add Event</button>
            </div>

            {isLoading ? <div>Loading...</div> : (
                <div className="admin-list-container">
                    {events.map(item => (
                        <div key={item.id} className="list-row-card">
                            <div className="row-content">
                                <h3 className="row-title">{item.title}</h3>
                                <p className="row-subtitle">
                                    <span style={{ marginRight: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} /> {item.date}
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Tag size={14} /> {item.category}
                                    </span>
                                </p>
                            </div>
                            <div className="row-actions">
                                <button onClick={() => openDetailModal(item)} className="action-btn view" title="View Details"><Eye size={18} /></button>
                                <button onClick={() => openEditModal(item)} className="action-btn edit" title="Edit"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(item.id)} className="action-btn delete" title="Delete"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <p className="empty-state">No events found.</p>}
                </div>
            )}

            {/* ADD / EDIT FORM MODAL */}
            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Event" : "Add New Event"} size="large">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid-2">
                        <AdminInput label="Event Title" name="title" value={formData.title} onChange={handleInputChange} required />
                        <AdminSelect label="Category" name="category" value={formData.category} onChange={handleInputChange}
                            options={['Community Service', 'Professional Development', 'Club Service', 'International Service', 'District Priority Projects'].map(c => ({ value: c, label: c }))} required />
                    </div>
                    <AdminInput label="Date" type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                    <AdminTextarea label="Description" name="description" value={formData.description} onChange={handleInputChange} required />

                    <div className="form-grid-2">
                        <div className="file-input-group">
                            <AdminFile label="Poster Image (WebP)" accept="image/webp, image/*" onChange={handlePosterChange} />
                            {formData.poster && <img src={formData.poster} alt="Preview" className="file-preview-mini" />}
                        </div>
                        <div className="file-input-group">
                            <AdminFile label="Gallery Images (Multiple)" accept="image/webp, image/*" multiple onChange={handleImagesChange} />
                            <div className="multi-file-preview">
                                {formData.images.length > 0 && <span>{formData.images.length} images selected</span>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>
                        {isEditing ? "Update Event" : "Create Event"}
                    </button>
                </form>
            </AdminModal>

            {/* VIEW DETAILS MODAL */}
            <AdminModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Event Details" size="large">
                {selectedEvent && (
                    <div className="detail-view">
                        <div className="detail-header-section">
                            <h2 style={{ marginTop: 0 }}>{selectedEvent.title}</h2>
                            <div className="detail-meta">
                                <span className="admin-badge">{selectedEvent.category}</span>
                                <span className="date">{selectedEvent.date}</span>
                            </div>
                        </div>

                        {selectedEvent.poster && (
                            <div className="detail-poster">
                                <img src={selectedEvent.poster} alt="Poster" />
                            </div>
                        )}

                        <div className="detail-description">
                            <h4>Description</h4>
                            <p>{selectedEvent.description}</p>
                        </div>

                        {selectedEvent.images && selectedEvent.images.length > 0 && (
                            <div className="detail-gallery">
                                <h4>Gallery ({selectedEvent.images.length})</h4>
                                <div className="detail-grid-images">
                                    {selectedEvent.images.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Gallery ${idx}`} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default EventsView;
