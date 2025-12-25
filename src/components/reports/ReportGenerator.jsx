import React, { useState, useEffect } from 'react'
import { compressImage } from '../../utils/imageUtils'
import './ReportGenerator.css'

const ReportGenerator = ({ user, reportData, onSave, onCancel, isAdmin = false }) => {
    // --- PDF GENERATION ---
    const generatePDF = async (action = 'download') => {
        const fullData = {
            ...formData,
            poster: poster?.base64,
            images: gallery.map(g => g.base64),
            logos: logos.map(l => l?.base64)
        }

        try {
            const { generateReportPDF } = await import('../../utils/pdfGenerator')
            generateReportPDF(fullData, action)
        } catch (error) {
            console.error("Failed to load PDF generator", error)
            alert("Failed to load PDF generator")
        }
    }

    const [formData, setFormData] = useState({
        eventName: '',
        eventChair: '',
        eventDate: '',
        avenue: 'Club Service',
        location: '',
        description: '',
        rotaractors: 0,
        rotary: 0,
        others: 0,
        total: 0,
        report: '',
        why: '',
        impact: '',
        income: [], // { desc, amount }
        expense: [], // { desc, amount }
        rotaractorsDetails: [], // { name, club }
        rotaryDetails: [],
        othersDetails: [],
        clubName: 'ROTARACT CLUB OF COIMBATORE UNIQUE',
        parentClub: 'FAMILY OF ROTARY CLUB OF THONDAMUTHUR',
        group: 'GROUP 1',
        rid: 'RI DISTRICT : 3206',
        clubId: 'CLUB ID : 50295'
    })

    const [poster, setPoster] = useState(null) // { file, preview, base64 }
    const [gallery, setGallery] = useState([]) // Array of { file, preview, base64 }
    const [logos, setLogos] = useState([null, null, null]) // Left, Center, Right logos

    useEffect(() => {
        if (reportData) {
            setFormData(reportData)
            if (reportData.poster) setPoster({ base64: reportData.poster, preview: reportData.poster })
            if (reportData.images) setGallery(reportData.images.map(img => ({ base64: img, preview: img })))
            if (reportData.logos) setLogos(reportData.logos.map(l => l ? { base64: l, preview: l } : null))
        }
    }, [reportData])

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAttendanceChange = (e) => {
        const { name, value } = e.target
        const val = parseInt(value) || 0
        setFormData(prev => {
            const newData = { ...prev, [name]: val }
            newData.total = (parseInt(newData.rotaractors) || 0) + (parseInt(newData.rotary) || 0) + (parseInt(newData.others) || 0)

            const type = name
            const currentDetails = prev[`${type}Details`] || []
            if (val > currentDetails.length) {
                const added = Array(val - currentDetails.length).fill({ name: '', club: '' })
                newData[`${type}Details`] = [...currentDetails, ...added]
            } else if (val < currentDetails.length) {
                newData[`${type}Details`] = currentDetails.slice(0, val)
            } else {
                newData[`${type}Details`] = currentDetails
            }

            if (name === 'rotaractors') newData.rotaractors = val
            if (name === 'rotary') newData.rotary = val
            if (name === 'others') newData.others = val

            return newData
        })
    }

    const handleDetailChange = (type, index, field, value) => {
        setFormData(prev => {
            const details = [...prev[`${type}Details`]]
            details[index] = { ...details[index], [field]: value }
            return { ...prev, [`${type}Details`]: details }
        })
    }

    const addFinancial = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], { desc: '', amount: '' }]
        }))
    }

    const removeFinancial = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }))
    }

    const handleFinancialChange = (type, index, field, value) => {
        setFormData(prev => {
            const list = [...prev[type]]
            list[index] = { ...list[index], [field]: value }
            return { ...prev, [type]: list }
        })
    }

    const handleFileChange = async (e, type, index = 0) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.type !== 'image/webp') {
            alert("Only .webp format images are allowed.")
            e.target.value = null
            return
        }

        try {
            const compressedBase64 = await compressImage(file, 800, 0.5)
            const fileObj = { file, preview: compressedBase64, base64: compressedBase64 }

            if (type === 'poster') {
                setPoster(fileObj)
            }
            else if (type === 'gallery') {
                if (index === -1) {
                    if (gallery.length >= 3) return alert("Max 3 images allowed")
                    setGallery(prev => [...prev, fileObj])
                } else {
                    setGallery(prev => {
                        const match = [...prev]
                        match[index] = fileObj
                        return match
                    })
                }
            }
            else if (type === 'logo') {
                setLogos(prev => {
                    const newLogos = [...prev]
                    newLogos[index] = fileObj
                    return newLogos
                })
            }
        } catch (error) {
            console.error("Image processing failed", error)
            alert("Failed to process image")
        }
    }

    const handleSave = () => {
        if (!onSave) {
            alert("Error: onSave handler is missing!")
            return
        }
        try {
            const dataToSave = {
                ...formData,
                poster: poster?.base64,
                images: gallery.map(g => g.base64),
                logos: logos.map(l => l?.base64)
            }
            onSave(dataToSave)
        } catch (error) {
            alert("Error in handleSave: " + error.message)
        }
    }

    // --- RENDER ---
    return (
        <div className="report-container">
            <h2 className="report-header">{reportData ? 'Edit Report' : 'New Project Report'}</h2>

            {/* LOGOS CONFIG */}
            <div className="logos-container">
                {[0, 1, 2].map(idx => (
                    <div key={idx} className="logo-upload-box">
                        <label htmlFor={`logo-${idx}`} className="logo-preview">
                            {logos[idx] ? <img src={logos[idx].preview} alt={`Logo ${idx + 1}`} /> : <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Logo {idx + 1}</span>}
                        </label>
                        <input id={`logo-${idx}`} type="file" accept=".webp" onChange={(e) => handleFileChange(e, 'logo', idx)} style={{ display: 'none' }} />
                        <label htmlFor={`logo-${idx}`} style={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Change</label>
                    </div>
                ))}
            </div>


            <div className="form-grid">
                <div className="input-group">
                    <label className="report-input-label">Event Name</label>
                    <input className="report-form-input" name="eventName" value={formData.eventName} onChange={handleChange} placeholder="e.g. Charter Day" />
                </div>
                <div className="input-group">
                    <label className="report-input-label">Event Chair</label>
                    <input className="report-form-input" name="eventChair" value={formData.eventChair} onChange={handleChange} placeholder="Chairperson Name" />
                </div>
                <div className="input-group">
                    <label className="report-input-label">Date</label>
                    <input className="report-form-input" type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label className="report-input-label">Avenue</label>
                    <select className="report-form-input" name="avenue" value={formData.avenue} onChange={handleChange}>
                        <option>Club Service</option>
                        <option>Community Service</option>
                        <option>International Service</option>
                        <option>Professional Development</option>
                        <option>District Priority Project</option>
                    </select>
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="report-input-label">Location</label>
                    <input className="report-form-input" name="location" value={formData.location} onChange={handleChange} placeholder="Event Venue" />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="report-input-label">Description</label>
                    <textarea className="report-form-input" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the event..." />
                </div>
            </div>

            {/* Attendance */}
            <h3 className="report-section-title">
                Attendance
            </h3>
            <div className="attendance-grid">
                {['rotaractors', 'rotary', 'others'].map(type => (
                    <div key={type} className="input-group">
                        <label className="report-input-label">{type.toUpperCase()}</label>
                        <input className="report-form-input" type="number" name={type} value={formData[type]} onChange={handleAttendanceChange} />
                    </div>
                ))}
                <div className="input-group attendance-total">
                    <label className="report-input-label">TOTAL</label>
                    <input className="report-form-input" value={formData.total} readOnly />
                </div>
            </div>

            {/* Attendance Details */}
            {['rotaractors', 'rotary', 'others'].some(type => formData[type] > 0 && formData[`${type}Details`]?.length > 0) && (
                <div className="attendee-details-section">
                    {['rotaractors', 'rotary', 'others'].map(type => (
                        (formData[type] > 0 && formData[`${type}Details`]?.length > 0) && (
                            <div key={type + 'details'} style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.8rem', fontWeight: '600' }}>{type.toUpperCase()} Attendees ({formData[type]})</h4>
                                {formData[`${type}Details`].map((detail, index) => (
                                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>
                                        <input
                                            className="report-form-input"
                                            placeholder="Name"
                                            value={detail.name || ''}
                                            onChange={(e) => handleDetailChange(type, index, 'name', e.target.value)}
                                            style={{ padding: '0.6rem' }}
                                        />
                                        <input
                                            className="report-form-input"
                                            placeholder="Club / Designation"
                                            value={detail.club || ''}
                                            onChange={(e) => handleDetailChange(type, index, 'club', e.target.value)}
                                            style={{ padding: '0.6rem' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Content */}
            <h3 className="report-section-title">
                Report Content
            </h3>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="input-group">
                    <label className="report-input-label">Completion Report</label>
                    <textarea className="report-form-input" name="report" value={formData.report} onChange={handleChange} placeholder="Detailed report of what happened..." />
                </div>
                <div className="input-group">
                    <label className="report-input-label">Why this event?</label>
                    <textarea className="report-form-input" name="why" value={formData.why} onChange={handleChange} placeholder="Purpose and rationale..." />
                </div>
                <div className="input-group">
                    <label className="report-input-label">Impact</label>
                    <textarea className="report-form-input" name="impact" value={formData.impact} onChange={handleChange} placeholder="Outcome and benefits..." />
                </div>
            </div>

            {/* Financials */}
            <h3 className="report-section-title">
                Financials
            </h3>
            <div className="financials-section">
                <div>
                    <div className="financial-header">
                        <span>Income</span>
                        <button className="add-btn-small" onClick={() => addFinancial('income')} title="Add Income Source">+</button>
                    </div>
                    {formData.income.map((item, i) => (
                        <div key={i} className="financial-row">
                            <input className="report-form-input" placeholder="Source" value={item.desc} onChange={(e) => handleFinancialChange('income', i, 'desc', e.target.value)} />
                            <input className="report-form-input" placeholder="Amount" type="number" value={item.amount} onChange={(e) => handleFinancialChange('income', i, 'amount', e.target.value)} style={{ width: '100px' }} />
                            <button className="remove-btn-small" onClick={() => removeFinancial('income', i)} title="Remove Income">×</button>
                        </div>
                    ))}
                    {formData.income.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No income recorded</p>}
                </div>
                <div>
                    <div className="financial-header">
                        <span>Expense</span>
                        <button className="add-btn-small" onClick={() => addFinancial('expense')} title="Add Expense">+</button>
                    </div>
                    {formData.expense.map((item, i) => (
                        <div key={i} className="financial-row">
                            <input className="report-form-input" placeholder="Purpose" value={item.desc} onChange={(e) => handleFinancialChange('expense', i, 'desc', e.target.value)} />
                            <input className="report-form-input" placeholder="Amount" type="number" value={item.amount} onChange={(e) => handleFinancialChange('expense', i, 'amount', e.target.value)} style={{ width: '100px' }} />
                            <button className="remove-btn-small" onClick={() => removeFinancial('expense', i)} title="Remove Expense">×</button>
                        </div>
                    ))}
                    {formData.expense.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No expenses recorded</p>}
                </div>
            </div>

            {/* Images */}
            <h3 className="report-section-title">
                Images
            </h3>
            <div className="file-upload-container">
                <label className="report-input-label">Poster (WebP Only)</label>
                <div className="file-input-wrapper">
                    <label htmlFor="poster-upload" className="custom-file-label">
                        Choose Poster Image
                    </label>
                    <input id="poster-upload" type="file" accept=".webp" onChange={(e) => handleFileChange(e, 'poster')} className="custom-file-input" />
                </div>
                {poster && <img src={poster.preview} className="poster-image" alt="Poster Preview" />}
            </div>
            <div className="file-upload-container">
                <label className="report-input-label">Gallery (Max 3, WebP Only)</label>
                <div className="file-input-wrapper">
                    <label htmlFor="gallery-upload" className="custom-file-label">
                        Add Gallery Image
                    </label>
                    <input id="gallery-upload" type="file" accept=".webp" onChange={(e) => handleFileChange(e, 'gallery', -1)} className="custom-file-input" />
                </div>
                <div className="gallery-row">
                    {gallery.map((g, i) => (
                        <div key={i} className="gallery-box">
                            <img src={g.preview} alt={`Gallery ${i + 1}`} />
                        </div>
                    ))}
                    {[...Array(3 - gallery.length)].map((_, i) => (
                        <div key={`empty-${i}`} className="gallery-box" style={{ background: '#f8fafc', borderStyle: 'dashed', opacity: 0.5 }}>
                            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Empty Slot</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="button-group">
                <button onClick={() => generatePDF('preview')} className="report-btn report-btn-preview">
                    Preview PDF
                </button>
                <button onClick={() => generatePDF('download')} className="report-btn report-btn-preview">
                    Download PDF
                </button>
                <div style={{ flex: 1 }}></div>
                {onCancel && <button onClick={onCancel} className="report-btn report-btn-outline">Cancel</button>}
                <button onClick={handleSave} className="report-btn report-btn-primary">{isAdmin ? "Update Report" : "Save to Portal"}</button>
            </div>
        </div>
    )
}

export default ReportGenerator
