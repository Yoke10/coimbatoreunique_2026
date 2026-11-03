import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FAQ_DATA } from '../../pages/FAQ'

const BASE_URL = 'https://www.raccoimbatoreunique.in'

/**
 * SEO metadata configuration for each page route.
 * Dynamically updates <title>, <meta description>, <link canonical>, og:*, twitter:*
 * and structured data JSON-LD schemas.
 */
const SEO_CONFIG = {
    '/': {
        title: 'Rotaract Club of Coimbatore Unique | Rotaract District 3206',
        description: 'Official portal of Rotaract Club of Coimbatore Unique (RAC CBE Unique). Chartered 21 Nov 2000 under Rotary International District 3206. Youth leadership & community service in Coimbatore.',
        breadcrumbName: 'Home',
        schemaType: 'WebPage',
    },
    '/about': {
        title: 'About Us | Rotaract Club of Coimbatore Unique – RID 3206',
        description: 'Discover the 25-year legacy of Rotaract Club of Coimbatore Unique (RAC Coimbatore Unique, District 3206). Learn about our history, charter, mission, and youth leadership in Coimbatore.',
        breadcrumbName: 'About Us',
        schemaType: 'AboutPage',
    },
    '/team': {
        title: 'Board of Directors | Rotaract Club of Coimbatore Unique – RID 3206',
        description: 'Meet the President, Secretary, and Board of Directors of Rotaract Club of Coimbatore Unique, Rotaract District 3206. Dedicated youth leaders serving Coimbatore, Tamil Nadu.',
        breadcrumbName: 'Our Team',
        schemaType: 'AboutPage',
    },
    '/events': {
        title: 'Upcoming & Past Events | Rotaract Club of Coimbatore Unique',
        description: 'Explore community service projects, professional workshops, district meets, and youth conferences hosted by Rotaract Club of Coimbatore Unique, Rotaract District 3206.',
        breadcrumbName: 'Events',
        schemaType: 'CollectionPage',
    },
    '/bulletin': {
        title: 'Club Bulletins & Newsletters | RAC Coimbatore Unique',
        description: 'Read the latest monthly newsletters, project reports, and bulletins from Rotaract Club of Coimbatore Unique, Rotary International District 3206.',
        breadcrumbName: 'Bulletins',
        schemaType: 'CollectionPage',
    },
    '/gallery': {
        title: 'Photo Gallery & Memories | Rotaract Club of Coimbatore Unique',
        description: 'Browse photos and memorable highlights from community service drives, blood donation camps, and fellowship gatherings of RAC Coimbatore Unique.',
        breadcrumbName: 'Gallery',
        schemaType: 'ImageGallery',
    },
    '/scrapbook': {
        title: 'Project Scrapbook & Archives | RAC Coimbatore Unique',
        description: 'View the official digital scrapbook of Rotaract Club of Coimbatore Unique — celebrated milestones, memories, and project archives under District 3206.',
        breadcrumbName: 'Scrapbook',
        schemaType: 'CollectionPage',
    },
    '/contact': {
        title: 'Contact Us | Rotaract Club of Coimbatore Unique – Coimbatore',
        description: 'Get in touch with Rotaract Club of Coimbatore Unique (RID 3206). Connect with club officers for collaborations, sponsorships, or membership inquiries.',
        breadcrumbName: 'Contact Us',
        schemaType: 'ContactPage',
    },
    '/join': {
        title: 'Join Rotaract Club of Coimbatore Unique | Youth Membership',
        description: 'Join RAC Coimbatore Unique (RID 3206). Open to youth & young professionals aged 18–30 in Coimbatore for leadership development and impactful community service.',
        breadcrumbName: 'Join Us',
        schemaType: 'WebPage',
    },
    '/faq': {
        title: 'Frequently Asked Questions (FAQ) | RAC Coimbatore Unique',
        description: 'Find answers to common questions about Rotaract Club of Coimbatore Unique, District 3206, membership requirements, club dues, and community service projects.',
        breadcrumbName: 'FAQ',
        schemaType: 'FAQPage',
    },
    '/terms': {
        title: 'Terms & Conditions | Rotaract Club of Coimbatore Unique',
        description: 'Read the terms and conditions and website privacy policies for the official portal of Rotaract Club of Coimbatore Unique, Coimbatore, Tamil Nadu.',
        breadcrumbName: 'Terms & Conditions',
        schemaType: 'WebPage',
    },
    '/resources': {
        title: 'Resources & Downloads | Rotaract Club of Coimbatore Unique',
        description: 'Access official resources, brand guidelines, and documents from Rotaract Club of Coimbatore Unique, Rotary International District 3206.',
        breadcrumbName: 'Resources',
        schemaType: 'CollectionPage',
    },
}

const DEFAULT_SEO = {
    title: 'Rotaract Club of Coimbatore Unique | Rotaract District 3206',
    description: 'Official website of Rotaract Club of Coimbatore Unique, under Rotary International District 3206. Youth leadership and community service in Coimbatore.',
    breadcrumbName: 'Home',
    schemaType: 'WebPage',
}

const SEOHead = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        const config = SEO_CONFIG[pathname] || DEFAULT_SEO
        const canonicalUrl = `${BASE_URL}${pathname === '/' ? '/' : pathname}`

        // 1. Update page title
        document.title = config.title

        // 2. Helper to set meta tags
        const setMeta = (selector, attribute, value) => {
            let el = document.querySelector(selector)
            if (!el) {
                el = document.createElement('meta')
                const [key, val] = selector.replace(/[\[\]]/g, '').split('=')
                el.setAttribute(key, val.replace(/["']/g, ''))
                document.head.appendChild(el)
            }
            el.setAttribute(attribute, value)
        }

        // 3. Update meta description & keywords
        setMeta('meta[name="description"]', 'content', config.description)

        // 4. Update canonical link
        let canonicalLink = document.querySelector('link[rel="canonical"]')
        if (!canonicalLink) {
            canonicalLink = document.createElement('link')
            canonicalLink.setAttribute('rel', 'canonical')
            document.head.appendChild(canonicalLink)
        }
        canonicalLink.setAttribute('href', canonicalUrl)

        // 5. Update Open Graph tags
        setMeta('meta[property="og:url"]', 'content', canonicalUrl)
        setMeta('meta[property="og:title"]', 'content', config.title)
        setMeta('meta[property="og:description"]', 'content', config.description)

        // 6. Update Twitter tags
        setMeta('meta[name="twitter:title"]', 'content', config.title)
        setMeta('meta[name="twitter:description"]', 'content', config.description)

        // 7. Dynamic JSON-LD Structured Data
        let schemaScript = document.getElementById('dynamic-seo-schema')
        if (!schemaScript) {
            schemaScript = document.createElement('script')
            schemaScript.setAttribute('type', 'application/ld+json')
            schemaScript.setAttribute('id', 'dynamic-seo-schema')
            document.head.appendChild(schemaScript)
        }

        const graph = []

        // Breadcrumbs (for all pages other than home)
        if (pathname !== '/') {
            graph.push({
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': `${BASE_URL}/`
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': config.breadcrumbName,
                        'item': canonicalUrl
                    }
                ]
            })
        }

        // Page-specific schema
        if (pathname === '/faq') {
            graph.push({
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                'mainEntity': FAQ_DATA.map(item => ({
                    '@type': 'Question',
                    'name': item.question,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': item.answer
                    }
                }))
            })
        } else if (pathname === '/about') {
            graph.push({
                '@type': 'AboutPage',
                '@id': `${canonicalUrl}#about`,
                'url': canonicalUrl,
                'name': config.title,
                'description': config.description,
                'mainEntity': {
                    '@id': `${BASE_URL}/#organization`
                }
            })
        } else if (pathname === '/contact') {
            graph.push({
                '@type': 'ContactPage',
                '@id': `${canonicalUrl}#contact`,
                'url': canonicalUrl,
                'name': config.title,
                'description': config.description,
                'mainEntity': {
                    '@id': `${BASE_URL}/#organization`
                }
            })
        } else if (pathname !== '/') {
            graph.push({
                '@type': config.schemaType || 'WebPage',
                '@id': `${canonicalUrl}#webpage`,
                'url': canonicalUrl,
                'name': config.title,
                'description': config.description,
                'isPartOf': {
                    '@id': `${BASE_URL}/#website`
                }
            })
        }

        if (graph.length > 0) {
            schemaScript.textContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': graph
            })
        } else {
            schemaScript.textContent = ''
        }

    }, [pathname])

    return null
}

export default SEOHead
