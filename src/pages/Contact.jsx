import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firebaseService } from '../services/firebaseService'
import './Contact.css'
import { useToast } from '../components/ui/Toast/ToastContext'
import { InputGroup, SelectGroup, TextAreaGroup } from '../components/common/FormElements'

const Contact = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        profession: '',
        location: '',
        purpose: '',
        message: '',
        agreed: false
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone Number is required'
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone Number must be 10 digits'
        }
        if (!formData.profession) newErrors.profession = 'Please select a profession'
        if (!formData.location.trim()) newErrors.location = 'Location is required'
        if (!formData.purpose) newErrors.purpose = 'Please select a purpose'
        if (!formData.message.trim()) newErrors.message = 'Message is required'
        if (!formData.agreed) newErrors.agreed = 'You must agree to the terms and conditions'

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) {
            toast({
                title: "Validation Error",
                description: "Please check the form for errors.",
                variant: "destructive"
            });
        }
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                await firebaseService.addSupportMessage(formData)

                toast({
                    title: "Message Sent!",
                    description: "Thank you for reaching out. We will get back to you shortly.",
                    variant: "success",
                    duration: 4000
                })

                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    profession: '',
                    location: '',
                    purpose: '',
                    message: '',
                    agreed: false
                })

                // Navigate after delay
                setTimeout(() => {
                    navigate('/')
                }, 3000)
            } catch (error) {
                console.error("Failed to send message", error)
                toast({
                    title: "Error",
                    description: "Failed to send message. Please try again.",
                    variant: "destructive"
                })
            }
        }
    }



    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1 className="main-title">Contact Us</h1>
                <div className="contact-card">
                    <div className="contact-header">
                        <div className="contact-header-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h2 className="contact-title">Send us a Message</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <InputGroup
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={errors.fullName}
                                required
                                placeholder="Enter your full name"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                }
                            />

                            <InputGroup
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                                placeholder="Enter your email"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="form-row">
                            <InputGroup
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                required
                                placeholder="+91 9876543210"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                }
                            />

                            <SelectGroup
                                label="I am a"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                error={errors.profession}
                                required
                                placeholder="Select user type"
                                options={[
                                    { value: 'Student', label: 'Student' },
                                    { value: 'Working Professional', label: 'Working Professional' },
                                    { value: 'Business', label: 'Business' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="form-row">
                            <SelectGroup
                                label="Subject Category"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                error={errors.purpose}
                                required
                                placeholder="Select subject"
                                options={[
                                    { value: 'Become Sponsor', label: 'Become Sponsor' },
                                    { value: 'Join the Organisation', label: 'Join the Organisation' },
                                    { value: 'Know About Us', label: 'Know About Us' },
                                    { value: 'Other Matters', label: 'Other Matters' },
                                ]}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                }
                            />

                            <InputGroup
                                label="Location/City"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                error={errors.location}
                                placeholder="Enter your city"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                }
                            />
                        </div>

                        <TextAreaGroup
                            label="Message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            error={errors.message}
                            required
                            placeholder="Please describe your query in detail."
                        />

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                name="agreed"
                                checked={formData.agreed}
                                onChange={handleChange}
                                id="agreed"
                            />
                            <label htmlFor="agreed">I agree to the <Link to="/terms" className="link-text">Terms & Conditions</Link> *</label>
                        </div>
                        {errors.agreed && <span className="error-text">{errors.agreed}</span>}

                        <div className="form-footer">
                            <button
                                type="submit"
                                disabled={!formData.agreed}
                                className="submit-btn"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
