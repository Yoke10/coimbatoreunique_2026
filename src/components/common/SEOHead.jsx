import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'https://www.raccoimbatoreunique.in'

/**
 * SEO metadata configuration for each page route.
 * Dynamically updates <title>, <meta description>, <link canonical>, and og:url
 * so that Google indexes each page correctly (no redirect errors).
 */
const SEO_CONFIG = {
    '/': {
        title: 'Rotaract Club of Coimbatore Unique | Rotaract District 3206',
        description: 'Official website of Rotaract Club of Coimbatore Unique, under Rotary International District 3206. Explore our Unique 3206 initiatives, projects, events, team, gallery, and community service in Coimbatore.',
    },
    '/about': {
        title: 'About Us | Rotaract Club of Coimbatore Unique',
        description: 'Learn about the history, mission, vision, and goals of Rotaract Club of Coimbatore Unique under Rotary International District 3206.',
    },
    '/team': {
        title: 'Our Team | Rotaract Club of Coimbatore Unique',
        description: 'Meet the dedicated team members and leaders of Rotaract Club of Coimbatore Unique, District 3206.',
    },
    '/events': {
        title: 'Events | Rotaract Club of Coimbatore Unique',
        description: 'Explore upcoming and past events organized by Rotaract Club of Coimbatore Unique. Community service, workshops, and more.',
    },
    '/bulletin': {
        title: 'Bulletin | Rotaract Club of Coimbatore Unique',
        description: 'Read the latest bulletins and newsletters from Rotaract Club of Coimbatore Unique, District 3206.',
    },
    '/gallery': {
        title: 'Gallery | Rotaract Club of Coimbatore Unique',
        description: 'Browse photos and memories from Rotaract Club of Coimbatore Unique events and community service projects.',
    },
    '/scrapbook': {
        title: 'Scrapbook | Rotaract Club of Coimbatore Unique',
        description: 'View the scrapbook of Rotaract Club of Coimbatore Unique — highlights, memories, and moments from our journey.',
    },
    '/contact': {
        title: 'Contact Us | Rotaract Club of Coimbatore Unique',
        description: 'Get in touch with Rotaract Club of Coimbatore Unique. Send us a message, call us, or visit us in Coimbatore.',
    },
    '/join': {
        title: 'Join Us | Rotaract Club of Coimbatore Unique',
        description: 'Join Rotaract Club of Coimbatore Unique and be part of a community making a difference. Open to youth ages 18-30.',
    },
    '/faq': {
        title: 'FAQ | Rotaract Club of Coimbatore Unique',
        description: 'Frequently asked questions about Rotaract Club of Coimbatore Unique — membership, events, fees, and more.',
    },
    '/terms': {
        title: 'Terms & Conditions | Rotaract Club of Coimbatore Unique',
        description: 'Read the terms and conditions for using the Rotaract Club of Coimbatore Unique website and services.',
    },
    '/resources': {
        title: 'Resources | Rotaract Club of Coimbatore Unique',
        description: 'Access resources and materials from Rotaract Club of Coimbatore Unique, District 3206.',
    },
}

const DEFAULT_SEO = {
    title: 'Rotaract Club of Coimbatore Unique | Rotaract District 3206',
    description: 'Official website of Rotaract Club of Coimbatore Unique, under Rotary International District 3206.',
}

/**
 * Dynamically manages SEO meta tags based on the current route.
 * Injects/updates: <title>, <meta name="description">, <link rel="canonical">, <meta property="og:url">
 */
const SEOHead = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        const config = SEO_CONFIG[pathname] || DEFAULT_SEO
        const canonicalUrl = `${BASE_URL}${pathname === '/' ? '/' : pathname}`

        // Update page title
        document.title = config.title

        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
            metaDesc.setAttribute('content', config.description)
        }

        // Manage canonical link
        let canonicalLink = document.querySelector('link[rel="canonical"]')
        if (!canonicalLink) {
            canonicalLink = document.createElement('link')
            canonicalLink.setAttribute('rel', 'canonical')
            document.head.appendChild(canonicalLink)
        }
        canonicalLink.setAttribute('href', canonicalUrl)

        // Update og:url
        let ogUrl = document.querySelector('meta[property="og:url"]')
        if (ogUrl) {
            ogUrl.setAttribute('content', canonicalUrl)
        }

        // Update og:title
        let ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) {
            ogTitle.setAttribute('content', config.title)
        }

        // Update og:description
        let ogDesc = document.querySelector('meta[property="og:description"]')
        if (ogDesc) {
            ogDesc.setAttribute('content', config.description)
        }

        // Update twitter:title
        let twTitle = document.querySelector('meta[name="twitter:title"]')
        if (twTitle) {
            twTitle.setAttribute('content', config.title)
        }

        // Update twitter:description
        let twDesc = document.querySelector('meta[name="twitter:description"]')
        if (twDesc) {
            twDesc.setAttribute('content', config.description)
        }

    }, [pathname])

    return null // This component doesn't render anything
}

export default SEOHead
