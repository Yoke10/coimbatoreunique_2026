import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Edit, UserPlus, Shield, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminSelect } from '../common/FormComponents';
import '../layout/AdminLayout.css';

const MembersView = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Add User State
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    // Edit User State
    const [editForm, setEditForm] = useState({});

    useEffect(() => { loadUsers(); }, []);
    const loadUsers = async () => {
        try {
            const data = await firebaseService.getUsers();
            setUsers(data);
        }
        catch { toast({ title: "Error", description: "Failed to load users", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const memberId = await firebaseService.generateMemberId();
            await firebaseService.addUser(newUser.username, newUser.password, memberId);
            toast({ title: "Success", description: `User added. ID: ${memberId}`, variant: "success" });
            setIsAddModalOpen(false);
            setNewUser({ username: '', password: '' });
            loadUsers();
        } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this user?")) {
            await firebaseService.deleteUser(id);
            loadUsers();
            toast({ title: "Deleted", variant: "default" });
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'deactive' : 'active';
        await firebaseService.updateUser(user.id, { status: newStatus });
        loadUsers();
        toast({ title: "Updated", description: `Status set to ${newStatus}`, variant: "success" });
    };

    const handleToggleLock = async (user) => {
        await firebaseService.updateUser(user.id, { isLocked: !user.isLocked });
        loadUsers();
        toast({ title: "Updated", description: user.isLocked ? "Unlocked" : "Locked", variant: "info" });
    };

    const openEditModal = (user, editMode = false) => {
        setSelectedUser(user);
        setIsEditing(editMode);
        setEditForm({
            username: user.username,
            role: user.role,
            memberId: user.memberId || '',
            ...user.profile
        });
    };

    const handleEditSave = async () => {
        try {
            // Separte profile fields from root user fields
            const { username, role, memberId, ...profileData } = editForm;
            // We update root fields and profile object
            await firebaseService.updateUser(selectedUser.id, {
                username,
                role,
                memberId, // Allow admin to edit Member ID? Usually restricted but useful for fixes.
                profile: profileData
            });
            toast({ title: "Saved", description: "User updated", variant: "success" });
            setSelectedUser(null);
            loadUsers();
        } catch (err) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Members Directory</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-add-new"><UserPlus size={18} /> Add Member</button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Member ID</th>
                            <th>Name / Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.memberId || 'Pending'}</td>
                                <td>{u.profile?.fullName || u.username}</td>
                                <td><span className={`status-badge status-${u.role}`}>{u.role}</span></td>
                                <td>
                                    <span className={`status-badge status-${u.status || 'active'}`}>{u.status || 'active'}</span>
                                    {u.isLocked && <span className="status-badge" style={{ background: '#e2e8f0', marginLeft: '0.5rem' }}>Locked</span>}
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button onClick={() => openEditModal(u, false)} className="action-btn view" title="View"><Eye size={16} /></button>
                                        <button onClick={() => openEditModal(u, true)} className="action-btn edit" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => handleToggleStatus(u)} className="action-btn" title={u.status === 'active' ? 'Deactivate' : 'Activate'} style={{ color: u.status === 'active' ? '#f59e0b' : '#10b981' }}>
                                            {u.status === 'active' ? <AlertTriangle size={16} /> : <Shield size={16} />}
                                        </button>
                                        <button onClick={() => handleToggleLock(u)} className="action-btn" title={u.isLocked ? 'Unlock' : 'Lock'}>
                                            {u.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                                        </button>
                                        <button onClick={() => handleDelete(u.id)} className="action-btn delete" title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD USER MODAL */}
            <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
                <form onSubmit={handleAddUser}>
                    <AdminInput label="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
                    <AdminInput label="Temp Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                    <button type="submit" className="admin-btn-primary">Create User</button>
                </form>
            </AdminModal>

            {/* EDIT/VIEW USER MODAL */}
            <AdminModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title={isEditing ? "Edit User" : "User Details"} size="large">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button onClick={() => setIsEditing(!isEditing)} className="btn-add-new" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </button>
                    {isEditing && <button onClick={handleEditSave} className="admin-btn-primary" style={{ width: 'auto', marginLeft: '1rem' }}>Save Changes</button>}
                </div>

                <div className="detail-grid-3">
                    {/* Basic Info */}
                    <AdminInput label="Member ID" value={editForm.memberId || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, memberId: e.target.value })} />
                    <AdminInput label="Username" value={editForm.username || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
                    <AdminSelect label="Role" value={editForm.role || 'member'} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, role: e.target.value })} options={[{ value: 'member', label: 'Member' }, { value: 'admin', label: 'Admin' }]} />

                    <AdminInput label="Full Name" value={editForm.fullName || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
                    <AdminSelect label="Gender" value={editForm.gender || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} options={['Male', 'Female', 'Other'].map(v => ({ value: v, label: v }))} />
                    <AdminInput label="Profession" value={editForm.profession || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, profession: e.target.value })} />

                    {/* Personal */}
                    <AdminInput label="Email" value={editForm.email || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                    <AdminInput label="Phone" value={editForm.contact || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, contact: e.target.value })} />
                    <AdminInput label="DOB" type="date" value={editForm.dob || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, dob: e.target.value })} />

                    {/* Extra */}
                    <AdminInput label="RI ID" value={editForm.riId || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, riId: e.target.value })} />
                    <AdminSelect label="Blood Group" value={editForm.bloodGroup || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                        options={['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(v => ({ value: v, label: v }))} />
                    <div />

                    <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <AdminInput label="Address Line 1" value={editForm.addressLine1 || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, addressLine1: e.target.value })} />
                        <AdminInput label="Address Line 2" value={editForm.addressLine2 || ''} disabled={!isEditing} onChange={e => setEditForm({ ...editForm, addressLine2: e.target.value })} />
                    </div>
                </div>
            </AdminModal>
        </div>
    );
};
export default MembersView;
