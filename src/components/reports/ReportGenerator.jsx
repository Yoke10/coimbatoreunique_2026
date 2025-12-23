import React, { useState, useEffect } from 'react'
// import { generateReportPDF } from '../../utils/pdfGenerator'

import { compressImage } from '../../utils/imageUtils'

const ReportGenerator = ({ user, reportData, onSave, onCancel, isAdmin = false }) => {
    // ... state ...

    // ... handlers ...

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
            // Load images logic if stored as base64...
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

            // Recalc total
            newData.total = (parseInt(newData.rotaractors) || 0) + (parseInt(newData.rotary) || 0) + (parseInt(newData.others) || 0)

            // Adjust details arrays: STRICTLY match count
            const type = name
            const currentDetails = prev[`${type}Details`] || []
            if (val > currentDetails.length) {
                // Add
                const added = Array(val - currentDetails.length).fill({ name: '', club: '' })
                newData[`${type}Details`] = [...currentDetails, ...added]
            } else if (val < currentDetails.length) {
                // Remove
                newData[`${type}Details`] = currentDetails.slice(0, val)
            } else {
                // Equal, do nothing
                newData[`${type}Details`] = currentDetails
            }

            // Recalc total specifically for this change (Redundancy safe)
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

        try {
            // Compress Image
            const compressedBase64 = await compressImage(file, 800, 0.5)
            const fileObj = { file, preview: compressedBase64, base64: compressedBase64 }

            if (type === 'poster') {
                setPoster(fileObj)
            }
            else if (type === 'gallery') {
                if (index === -1) {
                    // Add new
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
            console.error("Image compression failed", error)
            alert("Failed to process image")
        }
    }



    const handleSave = () => {
        // Debugging
        // alert("Save button clicked in ReportGenerator")

        if (!onSave) {
            alert("Error: onSave handler is missing!")
            return
        }

        try {
            // Collect data
            const dataToSave = {
                ...formData,
                poster: poster?.base64,
                images: gallery.map(g => g.base64),
                logos: logos.map(l => l?.base64)
            }
            // alert("Calling onSave with data...")
            onSave(dataToSave)
        } catch (error) {
            alert("Error in handleSave: " + error.message)
        }
    }

    // --- RENDER ---
    return (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--primary-magenta)', marginBottom: '1rem' }}>{reportData ? 'Edit Report' : 'New Project Report'}</h2>

            {/* LOGOS CONFIG */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {[0, 1, 2].map(idx => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '0.5rem' }}>
                            {logos[idx] ? <img src={logos[idx].preview} style={{ width: '100%' }} /> : <span style={{ fontSize: '0.7rem' }}>Logo {idx + 1}</span>}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo', idx)} style={{ width: '80px', fontSize: '0.7rem' }} />
                    </div>
                ))}
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" style={inputStyle} />
                <input name="eventChair" value={formData.eventChair} onChange={handleChange} placeholder="Event Chair" style={inputStyle} />
                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} style={inputStyle} />
                <select name="avenue" value={formData.avenue} onChange={handleChange} style={inputStyle}>
                    <option>Club Service</option>
                    <option>Community Service</option>
                    <option>International Service</option>
                    <option>Professional Development</option>
                    <option>District Priority Project</option>
                </select>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" style={{ ...inputStyle, gridColumn: '1/-1' }} />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" style={{ ...inputStyle, gridColumn: '1/-1', minHeight: '100px' }} />
            </div>

            {/* Attendance */}
            <h3 style={sectionTitle}>Attendance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                {['rotaractors', 'rotary', 'others'].map(type => (
                    <div key={type}>
                        <label style={{ fontSize: '0.8rem', display: 'block' }}>{type.toUpperCase()}</label>
                        <input type="number" name={type} value={formData[type]} onChange={handleAttendanceChange} style={inputStyle} />
                    </div>
                ))}
                <div>
                    <label style={{ fontSize: '0.8rem', display: 'block' }}>TOTAL</label>
                    <input value={formData.total} readOnly style={{ ...inputStyle, background: '#eee' }} />
                </div>
            </div>
            {/* Attendance Details */}
            <div style={{ marginTop: '1rem', borderTop: '1px dashed #eee', paddingTop: '1rem' }}>
                {['rotaractors', 'rotary', 'others'].map(type => (
                    (formData[type] > 0 && formData[`${type}Details`]?.length > 0) && (
                        <div key={type + 'details'} style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Key Attendees ({type.toUpperCase()}) - Enter {formData[type]} Names</h4>
                            {formData[`${type}Details`].map((detail, index) => (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        placeholder="Name"
                                        value={detail.name || ''}
                                        onChange={(e) => handleDetailChange(type, index, 'name', e.target.value)}
                                        style={inputStyle}
                                    />
                                    <input
                                        placeholder="Club / Designation"
                                        value={detail.club || ''}
                                        onChange={(e) => handleDetailChange(type, index, 'club', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                ))}
            </div>

            {/* Content */}
            <h3 style={sectionTitle}>Report Content</h3>
            <textarea name="report" value={formData.report} onChange={handleChange} placeholder="Completion Report..." style={{ ...inputStyle, width: '100%', minHeight: '80px', marginBottom: '1rem' }} />
            <textarea name="why" value={formData.why} onChange={handleChange} placeholder="Why this event?..." style={{ ...inputStyle, width: '100%', minHeight: '80px', marginBottom: '1rem' }} />
            <textarea name="impact" value={formData.impact} onChange={handleChange} placeholder="Impact..." style={{ ...inputStyle, width: '100%', minHeight: '80px' }} />

            {/* Financials - Simplified UI */}
            <h3 style={sectionTitle}>Financials</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h4>Income <button onClick={() => addFinancial('income')}>+</button></h4>
                    {formData.income.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input placeholder="Source" value={item.desc} onChange={(e) => handleFinancialChange('income', i, 'desc', e.target.value)} style={inputStyle} />
                            <input placeholder="Amt" type="number" value={item.amount} onChange={(e) => handleFinancialChange('income', i, 'amount', e.target.value)} style={{ ...inputStyle, width: '80px' }} />
                        </div>
                    ))}
                </div>
                <div>
                    <h4>Expense <button onClick={() => addFinancial('expense')}>+</button></h4>
                    {formData.expense.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input placeholder="Purpose" value={item.desc} onChange={(e) => handleFinancialChange('expense', i, 'desc', e.target.value)} style={inputStyle} />
                            <input placeholder="Amt" type="number" value={item.amount} onChange={(e) => handleFinancialChange('expense', i, 'amount', e.target.value)} style={{ ...inputStyle, width: '80px' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Images */}
            <h3 style={sectionTitle}>Images</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label>Poster: </label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'poster')} />
                {poster && <span style={{ fontSize: '0.8rem', color: 'green' }}> Loaded</span>}
            </div>
            <div>
                <label>Gallery (Max 3): </label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gallery', -1)} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {gallery.map((g, i) => (
                        <img key={i} src={g.preview} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <button onClick={() => generatePDF('preview')} style={{ ...btnStyle, background: '#6c757d' }}>Preview PDF</button>
                <button onClick={() => generatePDF('download')} style={{ ...btnStyle, background: '#17a2b8' }}>Download PDF</button>
                <div style={{ flex: 1 }}></div>
                {onCancel && <button onClick={onCancel} style={{ ...btnStyle, background: 'transparent', color: '#333', border: '1px solid #ccc' }}>Cancel</button>}
                <button onClick={handleSave} style={btnStyle}>{isAdmin ? "Update Report" : "Save to Portal"}</button>
            </div>
        </div>
    )
}

const inputStyle = {
    padding: '0.8rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%'
}

const sectionTitle = {
    color: 'var(--primary-dark)',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem',
    marginTop: '1.5rem',
    marginBottom: '1rem'
}

const btnStyle = {
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    background: 'var(--primary-magenta)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
}

export default ReportGenerator
