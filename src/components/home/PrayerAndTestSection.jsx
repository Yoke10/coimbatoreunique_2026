import React from 'react'
import './PrayerAndTestSection.css'

const PrayerAndTestSection = () => {
    return (
        <section className="prayer-test-section section">
            <div className="container">
                <h2 className="section-main-title">Rotaract Prayer & 4-Way Test</h2>
                <div className="container">
                    {/* Prayer Card */}
                    <div className="box">
                        <span></span>
                        <div className="content">
                            <h2 className="card-title">Rotaract Prayer</h2>
                            <p className="prayer-text">
                                <em> " Oh! God! Our Almighty Father & Ruler of the Universe, We thank thee for the inspiration you have given us for the Rotaract movement based upon Fellowship through Service. We humbly beg you to continue thy grace to enable us to do Our Service to ourselves and to our neighbors and to honor and glory of thy holy name. "</em><br />
                            </p>
                        </div>
                    </div>

                    {/* Four Way Test Card */}
                    <div className="box">
                        <span></span>
                        <div className="content">
                            <h2 className="card-title">Four Way Test</h2>
                            <p className="test-intro">Of the things we think, say or do:</p>
                            <ol className="test-list">
                                <li>Is it the <strong>TRUTH</strong>?</li>
                                <li>Is it <strong>FAIR</strong> to all concerned?</li>
                                <li>Will it build <strong>GOODWILL</strong> and better friendships?</li>
                                <li>Will it be <strong>BENEFICIAL</strong> to all concerned?</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PrayerAndTestSection
