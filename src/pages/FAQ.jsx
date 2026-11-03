import React from 'react'
import './FAQ.css'

export const FAQ_DATA = [
    {
        question: "What is Rotaract Club of Coimbatore Unique (RAC CBE Unique)?",
        answer: "The Rotaract Club of Coimbatore Unique (also known as RAC Coimbatore Unique or CBE Unique, Club ID: 50295) is a premier youth leadership and community service organization chartered on 21st November 2000 in Coimbatore, Tamil Nadu, India.",
        accent: "accent-pink"
    },
    {
        question: "Which district does Coimbatore Unique belong to?",
        answer: "Our club proudly functions under Rotary International District 3206 (Rotaract District 3206), sponsored by the Rotary Club of Thondamuthur in Coimbatore, Tamil Nadu.",
        accent: "accent-purple"
    },
    {
        question: "Who is eligible to join Rotaract in Coimbatore?",
        answer: "Membership is open to young adults aged 18 to 30, including university students, working professionals, and entrepreneurs in and around Coimbatore who wish to develop leadership skills and serve the community.",
        accent: "accent-magenta"
    },
    {
        question: "How do I join RAC Coimbatore Unique?",
        answer: "You can apply directly by visiting our 'Join Us' page and submitting your details. Our club membership directors will get in touch to guide you through the orientation and induction process.",
        accent: "accent-pink"
    },
    {
        question: "What kind of community projects does the club undertake?",
        answer: "Our initiatives cover health awareness, blood donation camps, educational assistance, tree planting drives, skill-building workshops, and sustainable social impact projects throughout Coimbatore.",
        accent: "accent-purple"
    },
    {
        question: "What leadership opportunities are available?",
        answer: "Members can serve on the Board of Directors, lead project committees, coordinate district events, and build practical skills in project management, budgeting, and public speaking.",
        accent: "accent-magenta"
    },
    {
        question: "Is there a membership fee?",
        answer: "Yes, an affordable annual membership fee covers club operations, official District 3206 dues, induction kit, and access to all club and district events.",
        accent: "accent-pink"
    },
    {
        question: "What is the expected time commitment?",
        answer: "We hold bi-weekly meetings, monthly service projects, and fellowship activities. You can participate based on your availability—even a few hours each month makes a significant impact.",
        accent: "accent-purple"
    },
    {
        question: "Can guests attend club meetings before joining?",
        answer: "Yes! Prospective members and guests are warmly invited to attend our regular meetings and community projects to get to know our members and club culture before joining.",
        accent: "accent-pink"
    },
    {
        question: "What networking benefits does Coimbatore Unique offer?",
        answer: "Members connect with a vibrant network of young professionals across Rotaract District 3206, seasoned mentors in Rotary Club of Thondamuthur, and global Rotaractors worldwide.",
        accent: "accent-magenta"
    },
    {
        question: "How does the club recognize member contributions?",
        answer: "We celebrate dedication with annual club awards, district recognitions, leadership citations, and verified certificates of service for professional portfolios.",
        accent: "accent-purple"
    },
    {
        question: "How can brands or partners collaborate with the club?",
        answer: "We welcome CSR collaborations, community partnerships, and event sponsorships. Reach us via our 'Contact Us' page or email raccoimbatoreunique3206@gmail.com.",
        accent: "accent-pink"
    }
]

const FAQ = () => {
    return (
        <main className="faq-page" aria-label="Frequently Asked Questions">
            <div className="faq-grid">
                {/* Intro Section - Item 1 */}
                <section className="faq-card faq-item-1">
                    <h1>Frequently Asked Questions</h1>
                    <p>
                        Everything you need to know about Rotaract Club of Coimbatore Unique (RAC CBE Unique), Rotaract District 3206, membership, and community service.
                    </p>
                </section>

                {FAQ_DATA.map((item, idx) => (
                    <section key={idx} className={`faq-card ${item.accent}`}>
                        <h2>{item.question}</h2>
                        <p>{item.answer}</p>
                    </section>
                ))}
            </div>
        </main>
    )
}

export default FAQ
