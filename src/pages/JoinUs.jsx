import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firebaseService } from '../services/firebaseService'
import ConfettiButton from '../components/ui/ConfettiButton'
import './JoinUs.css'
import { useToast } from '../components/ui/Toast/ToastContext'
import { InputGroup, SelectGroup, TextAreaGroup } from '../components/common/FormElements'

const JoinUs = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        location: '',
        profession: '',
        otherNGO: '',
        reason: '',
        source: '',
        terms: false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.terms) {
            toast({
                title: "Terms Required",
                description: "Please accept the terms and conditions.",
                variant: "warning"
            })
            return
        }

        try {
            await firebaseService.addJoinRequest(formData)

            toast({
                title: "Welcome Aboard!",
                description: "Application submitted successfully! We will contact you soon.",
                variant: "success",
                duration: 5000
            })

            setFormData({
                fullName: '',
                dob: '',
                age: '',
                gender: '',
                email: '',
                phone: '',
                location: '',
                profession: '',
                otherNGO: '',
                reason: '',
                source: '',
                terms: false
            })
            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="join-us-page">
            <div className="join-container">
                <h1 className="main-title">Join Us</h1>
                <div className="join-card">
                    <div className="join-card-header">
                        <div className="join-header-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h2 className="join-title">Join Our Community</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="join-form">
                        <div className="form-row">
                            <InputGroup
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                }
                            />

                            <SelectGroup
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                placeholder="Select Gender"
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4" />
                                        <path d="M12 8h.01" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="form-row">
                            <InputGroup
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                }
                            />

                            <InputGroup
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                placeholder="Age"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 11a9 9 0 0 1 9 9" />
                                        <path d="M4 4a16 16 0 0 1 16 16" />
                                        <circle cx="5" cy="19" r="1" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="form-row">
                            <InputGroup
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                }
                            />

                            <InputGroup
                                label="Contact Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+91 9876543210"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="form-row">
                            <InputGroup
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="City / Area"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                }
                            />

                            <InputGroup
                                label="Profession"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                required
                                placeholder="Student / Professional"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Member of any other NGO?</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    name="otherNGO"
                                    value={formData.otherNGO}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="If yes, please specify"
                                />
                            </div>
                        </div>

                        <TextAreaGroup
                            label="Reason for joining the club"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            placeholder="Why do you want to join?"
                        />

                        <SelectGroup
                            label="Where did you hear about us?"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            required
                            placeholder="Select Option"
                            options={[
                                { value: 'Friends', label: 'Friends' },
                                { value: 'Family', label: 'Family' },
                                { value: 'Social Media', label: 'Social Media' },
                                { value: 'Others', label: 'Others' },
                            ]}
                            icon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            }
                        />

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                required
                                id="terms"
                            />
                            <label htmlFor="terms">
                                I accept the <Link to="/terms" className="link-text">terms and conditions</Link>
                            </label>
                        </div>

                        <div className="form-footer">
                            <ConfettiButton
                                type="submit"
                                disabled={!formData.terms}
                                className="submit-btn"
                                confettiOptions={{ particleCount: 150, spread: 100 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Join Now
                            </ConfettiButton>
                        </div>
                    </form>
                </div>

                <div className="social-follow" style={{ textAlign: 'center', marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                    <h3 style={{ color: 'var(--dark-gray)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Follow Us</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <a href="#" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#eee', color: '#555' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#eee', color: '#555' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#eee', color: '#555' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#eee', color: '#555' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinUs
