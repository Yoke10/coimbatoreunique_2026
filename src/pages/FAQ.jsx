import React from 'react'
import './FAQ.css'

const FAQ = () => {
    return (
        <main className="faq-page">
            <div className="faq-grid">
                {/* Intro Section - Item 1 */}
                <section className="faq-card faq-item-1">
                    <h1>Frequently Asked Questions</h1>
                    <p>Have questions? We have answers. Hover over the cards to discover more about our club.</p>
                </section>

                {/* Question 1 */}
                <section className="faq-card accent-pink">
                    <h2>How do I join?</h2>
                    <p>Membership is open to youth ages 18-30. Click 'Join Us' to start!</p>
                </section>

                {/* Spacer/Empty cards for visual effect if desired, or filled with more Qs */}
                <section className="faq-card accent-purple">
                    <h2>Membership Fee?</h2>
                    <p>Yes, with affordable annual membership.</p>
                </section>

                <section className="faq-card accent-magenta">
                    <h2>Time Commitment?</h2>
                    <p>Even if you spend just an hour with us, it'll be worth it.</p>
                </section>

                <section className="faq-card accent-pink">
                    <h2>Leadership Roles?</h2>
                    <p>Yes, through projects, teams and club initiatives.</p>
                </section>

                <section className="faq-card accent-purple">
                    <h2>Recognition?</h2>
                    <p>Your efforts never go unnoticed.</p>
                </section>

                <section className="faq-card accent-magenta">
                    <h2>Networking?</h2>
                    <p>Huge connection with professionals, Rotarians and fellow rotractors.</p>
                </section>

                <section className="faq-card accent-pink">
                    <h2>Events?</h2>
                    <p>Socials, workshops, fundraisers, and community cleanups regularly.</p>
                </section>

                <section className="faq-card accent-purple">
                    <h2>Guest Policy?</h2>
                    <p>Guests are always welcome to attend our meetings, events and see what we're about.</p>
                </section>

                <section className="faq-card accent-pink">
                    <h2>Beyond Service?</h2>
                    <p>Leadership, friendships, learning and unforgettable moments.</p>
                </section>

                <section className="faq-card accent-purple">
                    <h2>Club Culture?</h2>
                    <p>Friendly, supportive and driven by shared purpose</p>
                </section>

                <section className="faq-card accent-magenta">
                    <h2>Long Term Value?</h2>
                    <p>Years later, you'll still be grateful you joined</p>
                </section>

                <section className="faq-card accent-pink">
                    <h2>Contact?</h2>
                    <p>Reach out via our 'Contact Us' page or DM us on Instagram.</p>
                </section>

            </div>
        </main>
    )
}

export default FAQ
