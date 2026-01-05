import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firebaseService } from '../../../services/firebaseService';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminTextarea } from '../common/FormComponents';
import '../layout/AdminLayout.css';

const CalendarManagerView = () => {
    const queryClient = useQueryClient();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    const [formData, setFormData] = useState({
        date: '',
        title: '',
        description: ''
    });

    const { data: days = [], isLoading } = useQuery({
        queryKey: ['calendar_days'],
        queryFn: firebaseService.getCalendarDays
    });

    const addMutation = useMutation({
        mutationFn: firebaseService.addCalendarDay,
        onSuccess: () => {
            queryClient.invalidateQueries(['calendar_days']);
            toast.success('Day added successfully');
            closeModal();
        },
        onError: () => toast.error('Failed to add day')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => firebaseService.updateCalendarDay(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['calendar_days']);
            toast.success('Day updated successfully');
            closeModal();
        },
        onError: () => toast.error('Failed to update day')
    });

    const deleteMutation = useMutation({
        mutationFn: firebaseService.deleteCalendarDay,
        onSuccess: () => {
            queryClient.invalidateQueries(['calendar_days']);
            toast.success('Day deleted successfully');
        },
        onError: () => toast.error('Failed to delete day')
    });

    // HANDLERS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setFormData({ date: '', title: '', description: '' });
        setIsEditing(false);
        setSelectedDay(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (day) => {
        setFormData({
            date: day.date,
            title: day.title,
            description: day.description || ''
        });
        setSelectedDay(day);
        setIsEditing(true);
        setIsFormModalOpen(true);
    };

    const closeModal = () => {
        setIsFormModalOpen(false);
        setSelectedDay(null);
        setFormData({ date: '', title: '', description: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure default type 'event' is sent for compatibility if backend requires it, 
        // though we removed it from UI.
        const payload = { ...formData, type: 'event' };

        if (isEditing && selectedDay) {
            updateMutation.mutate({ id: selectedDay.id, data: payload });
        } else {
            addMutation.mutate(payload);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this important day?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Important Days</h2>
                <button onClick={openAddModal} className="btn-add-new">
                    <Plus size={18} /> Add Date
                </button>
            </div>

            {isLoading ? <div>Loading...</div> : (
                <div className="admin-list-container">
                    {days.length === 0 ? (
                        <p className="empty-state">No important days added yet.</p>
                    ) : (
                        days
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map(day => (
                                <div key={day.id} className="list-row-card">
                                    <div className="row-content">
                                        <h3 className="row-title">{day.title}</h3>
                                        <p className="row-subtitle">
                                            <span style={{ marginRight: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} />
                                                {new Date(day.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            {day.description && (
                                                <span style={{ color: '#666', fontStyle: 'italic' }}>
                                                    - {day.description}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="row-actions">
                                        <button onClick={() => openEditModal(day)} className="action-btn edit" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(day.id)} className="action-btn delete" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            )}

            {/* ADD / EDIT FORM MODAL */}
            <AdminModal
                isOpen={isFormModalOpen}
                onClose={closeModal}
                title={isEditing ? "Edit Important Day" : "Add New Important Day"}
            >
                <form onSubmit={handleSubmit}>
                    <AdminInput
                        label="Date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />

                    <AdminInput
                        label="Title"
                        name="title"
                        placeholder="e.g., World Rotaract Day"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />

                    <AdminTextarea
                        label="Description (Optional)"
                        name="description"
                        placeholder="e.g., Celebrating the founding of Rotaract..."
                        value={formData.description}
                        onChange={handleInputChange}
                    />

                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }} disabled={addMutation.isPending || updateMutation.isPending}>
                        {isEditing ? (updateMutation.isPending ? 'Updating...' : 'Update Date') : (addMutation.isPending ? 'Adding...' : 'Save Date')}
                    </button>
                </form>
            </AdminModal>
        </div>
    );
};

export default CalendarManagerView;
