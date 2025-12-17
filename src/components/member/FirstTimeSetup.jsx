import React, { useState } from 'react'
import { firebaseService } from '../../services/firebaseService'
import { useToast } from '../ui/Toast/ToastContext'

const FirstTimeSetup = ({ user, onComplete }) => {
    const { toast } = useToast()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Profile Fields
        fullName: '',
        riId: '',
        email: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        contact: '',
        emergencyContact: '',
        addressLine1: '',
        addressLine2: '',
        parentName: '',
        parentContact: '',
        profession: 'Student',
        hobbies: '',

        // Password Fields
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateStrongPassword = (password) => {
        // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return regex.test(password)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (step === 1) {
            // Validate Password
            if (formData.newPassword !== formData.confirmPassword) {
                setError("Passwords do not match")
                setLoading(false)
                return
            }
            if (!validateStrongPassword(formData.newPassword)) {
                setError("Password must contain at least 8 characters, one UPPERCASE letter, one lowercase letter, one number, and one special character (@$!%*?&).")
                setLoading(false)
                return
            }

            // Move to next step (Profile)
            setStep(2)
            setLoading(false)
        } else {
            // Submit Profile
            try {
                // 1. Change Password
                await firebaseService.changePassword(user.id, formData.newPassword)

                // 2. Generate Member ID
                const memberId = await firebaseService.generateMemberId()

                // 3. Update Profile
                const profileData = {
                    fullName: formData.fullName,
                    riId: formData.riId,
                    email: formData.email,
                    dob: formData.dob,
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup,
                    contact: formData.contact,
                    emergencyContact: formData.emergencyContact,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    parentName: formData.parentName,
                    parentContact: formData.parentContact,
                    profession: formData.profession,
                    hobbies: formData.hobbies
                }

                await firebaseService.updateUser(user.id, {
                    profile: profileData,
                    memberId: memberId,
                    isFirstLogin: false
                })

                // Update Session Storage manually to ensure immediate consistency
                const updatedUser = { ...user, profile: profileData, memberId, isFirstLogin: false }
                sessionStorage.setItem('rotaract_session_user', JSON.stringify(updatedUser))

                toast({ title: "Setup Complete", description: "Welcome to Rotaract! Your profile is ready.", variant: "success", duration: 5000 })
                onComplete(updatedUser)

            } catch (err) {
                console.error("Registration Error:", err)
                const msg = "Failed to save profile. " + (err.message || "Please try again.")
                setError(msg)
                toast({ title: "Setup Failed", description: msg, variant: "destructive" })
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: 'var(--primary-magenta)', marginBottom: '1rem' }}>
                {step === 1 ? "Secure Your Account" : "Complete Your Profile"}
            </h2>

            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                {step === 1
                    ? "Please set a strong password for your new account."
                    : "Welcome to Rotaract! Please verify your details."}
            </p>

            {error && <div style={{ background: '#ffe6e6', color: 'red', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>

                {step === 1 ? (
                    <>
                        <div>
                            <label style={labelStyle}>New Password</label>
                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                            Password must contain:
                            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.2rem' }}>
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character (@$!%*?&)</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={grid2}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} required />
                            </div>
                            <div>
                                <label style={labelStyle}>RI ID</label>
                                <input name="riId" value={formData.riId} onChange={handleChange} style={inputStyle} required />
                            </div>
                        </div>

                        <div style={grid2}>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} required />
                            </div>
                        </div>

                        <div style={grid2}>
                            <div>
                                <label style={labelStyle}>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Blood Group</label>
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={inputStyle} required>
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>

                        <div style={grid2}>
                            <div>
                                <label style={labelStyle}>Contact Number</label>
                                <input name="contact" value={formData.contact} onChange={handleChange} style={inputStyle} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Emergency Contact</label>
                                <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} style={inputStyle} required />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Address Line 1</label>
                            <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Address Line 2</label>
                            <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} style={inputStyle} />
                        </div>

                        <div style={grid2}>
                            <div>
                                <label style={labelStyle}>Parent Name</label>
                                <input name="parentName" value={formData.parentName} onChange={handleChange} style={inputStyle} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Parent Contact</label>
                                <input name="parentContact" value={formData.parentContact} onChange={handleChange} style={inputStyle} required />
                            </div>
                        </div>

                        <div style={grid2}>
                            <div>
                                <label style={labelStyle}>Profession</label>
                                <select name="profession" value={formData.profession} onChange={handleChange} style={inputStyle} required>
                                    <option value="Student">Student</option>
                                    <option value="Working Professional">Working Professional</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Hobbies</label>
                                <input name="hobbies" value={formData.hobbies} onChange={handleChange} style={inputStyle} placeholder="Reading, Sports, etc." />
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? "Processing..." : (step === 1 ? "Next Step" : "Complete Registration")}
                </button>
            </form>
        </div>
    )
}

const grid2 = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#333'
}

const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.9rem'
}

const buttonStyle = {
    padding: '1rem',
    background: 'var(--gradient-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '1rem'
}

export default FirstTimeSetup
