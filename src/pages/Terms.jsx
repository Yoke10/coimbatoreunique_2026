import React from 'react';
import { 
    FileText, 
    Heart, 
    UserCheck, 
    Shield, 
    Link as LinkIcon, 
    Phone, 
    FileSignature, 
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Info,
    Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
    return (
        <div className="terms-page-clean">
            <header className="terms-header-clean">
                <div className="terms-header-icon">
                    <FileText size={32} color="#fff" />
                </div>
                <h1>Terms & Conditions</h1>
                <p>Important guidelines for using the Rotaract Club of Coimbatore Unique platform</p>
            </header>

            <main className="terms-content-clean">
                
                {/* Section 1: Welcome */}
                <div className="t-card">
                    <div className="t-card-header">
                        <div className="t-icon-box pink">
                            <Heart size={20} />
                        </div>
                        <h2>Welcome to Rotaract Club</h2>
                    </div>
                    <div className="t-card-body">
                        <p>By using our platform, you agree to these terms and conditions. Please read them carefully to understand your rights and responsibilities as a user of our club's community website.</p>
                    </div>
                </div>

                {/* Section 2: Eligibility & Usage */}
                <div className="t-card">
                    <div className="t-card-header">
                        <div className="t-icon-box blue">
                            <UserCheck size={20} />
                        </div>
                        <h2>Platform Usage Requirements</h2>
                    </div>
                    <div className="t-card-body">
                        <div className="t-grid-2">
                            <div className="t-info-box blue">
                                <div className="t-info-box-header">
                                    <CheckCircle2 size={16} /> Eligibility
                                </div>
                                <ul className="t-list">
                                    <li>You must be at least 13 years old to use this website.</li>
                                    <li>Users must provide accurate information when registering or joining.</li>
                                </ul>
                            </div>
                            <div className="t-info-box green">
                                <div className="t-info-box-header">
                                    <CheckCircle2 size={16} /> Lawful Use
                                </div>
                                <ul className="t-list">
                                    <li>Use the platform responsibly and respectfully.</li>
                                    <li>Do not engage in activities that restrict others' enjoyment.</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="t-warning-box">
                            <AlertTriangle size={20} color="#856404" />
                            <p><strong>Important:</strong> Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Data Use & Privacy */}
                <div className="t-card">
                    <div className="t-card-header">
                        <div className="t-icon-box purple">
                            <Shield size={20} />
                        </div>
                        <h2>Data Use & Privacy</h2>
                    </div>
                    <div className="t-card-body">
                        <div className="t-info-box purple">
                            <div className="t-info-box-header">
                                <Info size={16} /> How We Use Your Data
                            </div>
                            <ul className="t-list">
                                <li>Information submitted via forms is used solely for club-related communications.</li>
                                <li>We implement reasonable security measures to protect your personal data.</li>
                                <li>We do not sell, trade, or share your details with third parties without your consent.</li>
                                <li>Your privacy and safety are our top priorities.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 4: Role of the Club */}
                <div className="t-card">
                    <div className="t-card-header">
                        <div className="t-icon-box green">
                            <LinkIcon size={20} />
                        </div>
                        <h2>Membership & Events</h2>
                    </div>
                    <div className="t-card-body">
                        <div className="t-grid-3">
                            <div className="t-info-box green" style={{ backgroundColor: 'var(--success-light)' }}>
                                <div className="t-info-box-header" style={{ color: 'var(--success)', justifyContent: 'center' }}>
                                    <Users size={16} /> Application
                                </div>
                                <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>Submitting a "Join Us" form does not guarantee immediate membership.</p>
                            </div>
                            <div className="t-info-box blue">
                                <div className="t-info-box-header" style={{ justifyContent: 'center' }}>
                                    <CheckCircle2 size={16} /> Registration
                                </div>
                                <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>Event registrations are subject to availability and confirmation.</p>
                            </div>
                            <div className="t-info-box yellow">
                                <div className="t-info-box-header" style={{ justifyContent: 'center' }}>
                                    <AlertTriangle size={16} /> Changes
                                </div>
                                <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>The Club reserves the right to modify or cancel events.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5: General Terms */}
                <div className="t-card">
                    <div className="t-card-header">
                        <div className="t-icon-box blue">
                            <FileSignature size={20} />
                        </div>
                        <h2>Intellectual Property</h2>
                    </div>
                    <div className="t-card-body">
                        <p style={{ marginBottom: '16px' }}>Unless otherwise stated, the Rotaract Club of Coimbatore Unique owns the intellectual property rights for all material on this website.</p>
                        
                        <div className="t-grid-2">
                            <div className="t-info-box green">
                                <div className="t-info-box-header">
                                    <CheckCircle2 size={16} /> Permitted
                                </div>
                                <ul className="t-check-list">
                                    <li><CheckCircle2 size={16} color="var(--success)" /> View pages for personal use</li>
                                    <li><CheckCircle2 size={16} color="var(--success)" /> Print pages for personal reference</li>
                                </ul>
                            </div>
                            <div className="t-info-box red">
                                <div className="t-info-box-header">
                                    <XCircle size={16} /> Not Permitted
                                </div>
                                <ul className="t-check-list">
                                    <li><XCircle size={16} color="var(--error)" /> Republish material without accreditation</li>
                                    <li><XCircle size={16} color="var(--error)" /> Sell or sub-license website material</li>
                                    <li><XCircle size={16} color="var(--error)" /> Reproduce content for commercial use</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 6: Disclaimer */}
                <div className="t-card">
                    <div className="t-card-header">
                        <div className="t-icon-box yellow">
                            <AlertTriangle size={20} />
                        </div>
                        <h2>Limitation of Liability</h2>
                    </div>
                    <div className="t-card-body">
                        <div className="t-info-box yellow">
                            <div className="t-info-box-header">
                                <Info size={16} /> No Warranties
                            </div>
                            <p style={{ fontSize: '0.95rem', margin: 0 }}>The information on this website is provided "as is," with all faults, and the Club makes no express or implied representations or warranties of any kind related to this website.</p>
                        </div>
                        <div className="t-info-box red" style={{ marginTop: '16px' }}>
                            <div className="t-info-box-header">
                                <AlertTriangle size={16} /> Limitation
                            </div>
                            <p style={{ fontSize: '0.95rem', margin: 0 }}>In no event shall the Club, nor any of its officers, directors, and members, be liable to you for anything arising out of your use of this website.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Confirmation Card */}
                <div className="t-confirmation-card">
                    <h2>Agreement Confirmation</h2>
                    <p>By continuing to use the Rotaract Club of Coimbatore Unique platform, you confirm that you have read, understood, and agree to these terms and conditions.</p>
                    <Link to="/contact" className="t-contact-btn">
                        <Mail size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', marginTop: '-2px' }} />
                        Contact Support
                    </Link>
                </div>

                <div className="t-footer-date">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | Rotaract Club of Coimbatore Unique
                </div>
            </main>
        </div>
    );
};

// Quick helper component for icon imports missing above
function Users(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

export default Terms;
