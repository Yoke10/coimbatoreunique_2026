import React, { useState, useEffect } from 'react';
import { Save, Edit, Building2, Upload, X } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { AdminInput } from '../common/FormComponents';
import '../layout/AdminLayout.css';

const DEFAULTS = {
    clubName: 'Rotaract Club of Coimbatore Unique',
    sponsorClub: 'Rotary Club of Thondamuthur',
    clubId: '50295',
    group: '1',
    district: '3206',
    presidentName: '',
    secretaryName: '',
    rotaryLogo: null,
    districtLogo: null,
    clubLogo: null,
    aboutImage1: null,
    aboutImage2: null,
    aboutImage3: null,
    aboutImage4: null,
};

import { compressImage } from '../../../utils/imageUtils';

const LogoUploadBox = ({ label, value, field, onChange, isEditing }) => {
    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'image/webp') {
            alert('Only .webp format is allowed for logos.');
            e.target.value = null;
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Logo file must be under 2MB.');
            e.target.value = null;
            return;
        }
        try {
            // Compress to high resolution (1200px max width) with high quality to ensure clear, crisp pixels
            const base64 = await compressImage(file, 1200, 0.9);
            onChange(field, base64);
        } catch (error) {
            console.error("Compression failed:", error);
            alert("Failed to process image.");
        }
    };

    const inputId = `logo-upload-${field}`;

    return (
        <div className="club-logo-box">
            <div className="club-logo-label">{label}</div>
            <div className="club-logo-preview-wrap">
                {value ? (
                    <img src={value} alt={label} className="club-logo-preview-img" />
                ) : (
                    <div className="club-logo-placeholder">
                        <Upload size={28} />
                        <span>No logo</span>
                    </div>
                )}
            </div>
            {isEditing && (
                <>
                    <label htmlFor={inputId} className="admin-btn-secondary club-logo-upload-btn">
                        <Upload size={14} /> {value ? 'Replace' : 'Upload'} .webp
                    </label>
                    <input
                        id={inputId}
                        type="file"
                        accept="image/webp"
                        onChange={handleFile}
                        style={{ display: 'none' }}
                        disabled={!isEditing}
                    />
                    {value && (
                        <button
                            className="action-btn delete club-logo-clear-btn"
                            title="Remove logo"
                            onClick={() => onChange(field, null)}
                        >
                            <X size={14} /> Remove
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const ClubDetailsView = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState(DEFAULTS);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadConfig(); }, []);

    const loadConfig = async () => {
        setIsLoading(true);
        try {
            const cfg = await firebaseService.getClubConfig();
            setFormData({ ...DEFAULTS, ...cfg });
        } catch {
            toast({ title: 'Failed to load config', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Firebase crashes if any object value is strictly undefined
            const cleanData = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== undefined)
            );
            
            await firebaseService.saveClubConfig(cleanData);
            // Invalidate the shared 'config' query so all components re-fetch
            queryClient.invalidateQueries({ queryKey: ['config'] });
            toast({ title: 'Club details saved successfully', variant: 'success' });
            setIsEditing(false);
        } catch (error) {
            console.error("Save config error:", error);
            toast({ title: 'Save failed', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadConfig();
    };

    if (isLoading) return <div className="admin-view"><p className="empty-state">Loading club details...</p></div>;

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Club Details</h2>
                {!isEditing ? (
                    <button className="btn-add-new" onClick={() => setIsEditing(true)}>
                        <Edit size={18} /> Edit Details
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="admin-btn-secondary" onClick={handleCancel} style={{ width: 'auto' }}>
                            Cancel
                        </button>
                        <button className="admin-btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: 'auto' }}>
                            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {/* LOGO PREVIEW HEADER */}
            <div className="club-detail-brand-preview admin-card">
                <div className="club-brand-logos">
                    {formData.rotaryLogo && <img src={formData.rotaryLogo} alt="Rotary Logo" className="brand-preview-logo" />}
                    {formData.districtLogo && <img src={formData.districtLogo} alt="District Logo" className="brand-preview-logo" />}
                    {formData.clubLogo && <img src={formData.clubLogo} alt="Club Logo" className="brand-preview-logo" />}
                    {!formData.rotaryLogo && !formData.districtLogo && !formData.clubLogo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray)', fontSize: '0.9rem' }}>
                            <Building2 size={20} /> Upload logos below to preview them here
                        </div>
                    )}
                </div>
                <div className="club-brand-meta">
                    <div className="club-brand-name">{formData.clubName || 'Club Name'}</div>
                    <div className="club-brand-sub">
                        {formData.sponsorClub && <span>Parented by {formData.sponsorClub}</span>}
                        {formData.clubId && <span> · Club ID: {formData.clubId}</span>}
                        {formData.group && <span> · Group {formData.group}</span>}
                        {formData.district && <span> · RI District {formData.district}</span>}
                    </div>
                    {(formData.presidentName || formData.secretaryName) && (
                        <div className="club-brand-officials">
                            {formData.presidentName && <span>President: <strong>{formData.presidentName}</strong></span>}
                            {formData.secretaryName && <span>Secretary: <strong>{formData.secretaryName}</strong></span>}
                        </div>
                    )}
                </div>
            </div>

            {/* LOGO UPLOADS */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 className="admin-section-title" style={{ marginTop: 0 }}>Logos <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 'normal' }}>(WebP format only, max 2MB each)</span></h3>
                <div className="club-logos-row">
                    <LogoUploadBox
                        label="Rotary Logo"
                        value={formData.rotaryLogo}
                        field="rotaryLogo"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                    <LogoUploadBox
                        label="District Logo"
                        value={formData.districtLogo}
                        field="districtLogo"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                    <LogoUploadBox
                        label="Club Logo"
                        value={formData.clubLogo}
                        field="clubLogo"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                </div>
            </div>

            {/* ABOUT US IMAGES */}
            <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 className="admin-section-title" style={{ marginTop: 0 }}>About Section Images <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 'normal' }}>(WebP format only, max 2MB each)</span></h3>
                <div className="club-logos-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <LogoUploadBox
                        label="About Image 1"
                        value={formData.aboutImage1}
                        field="aboutImage1"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                    <LogoUploadBox
                        label="About Image 2"
                        value={formData.aboutImage2}
                        field="aboutImage2"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                    <LogoUploadBox
                        label="About Image 3"
                        value={formData.aboutImage3}
                        field="aboutImage3"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                    <LogoUploadBox
                        label="About Image 4"
                        value={formData.aboutImage4}
                        field="aboutImage4"
                        onChange={handleLogoChange}
                        isEditing={isEditing}
                    />
                </div>
            </div>

            {/* TEXT FIELDS */}
            <div className="admin-card" style={{ padding: '1.5rem' }}>
                <h3 className="admin-section-title" style={{ marginTop: 0 }}>Club Information</h3>
                <div className="detail-grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <AdminInput
                        label="Club Name"
                        name="clubName"
                        value={formData.clubName}
                        onChange={handleInput}
                        disabled={!isEditing}
                    />
                    <AdminInput
                        label="Parent Rotary Club Name"
                        name="sponsorClub"
                        value={formData.sponsorClub}
                        onChange={handleInput}
                        disabled={!isEditing}
                    />
                    <AdminInput
                        label="Club ID"
                        name="clubId"
                        value={formData.clubId}
                        onChange={handleInput}
                        disabled={!isEditing}
                    />
                    <AdminInput
                        label="Group Number"
                        name="group"
                        value={formData.group}
                        onChange={handleInput}
                        disabled={!isEditing}
                    />
                    <AdminInput
                        label="RI District"
                        name="district"
                        value={formData.district}
                        onChange={handleInput}
                        disabled={!isEditing}
                    />
                </div>

                <h3 className="admin-section-title">Officials</h3>
                <div className="detail-grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <AdminInput
                        label="President Name"
                        name="presidentName"
                        value={formData.presidentName}
                        onChange={handleInput}
                        disabled={!isEditing}
                        placeholder="Enter President's full name"
                    />
                    <AdminInput
                        label="Secretary Name"
                        name="secretaryName"
                        value={formData.secretaryName}
                        onChange={handleInput}
                        disabled={!isEditing}
                        placeholder="Enter Secretary's full name"
                    />
                </div>
            </div>
        </div>
    );
};

export default ClubDetailsView;
