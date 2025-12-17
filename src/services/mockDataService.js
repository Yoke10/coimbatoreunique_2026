// Firebase-backed Data Service (Replaces Mock/IndexedDB)
import { firebaseService } from './firebaseService';

// Keep legacy constants if needed, or just remove.
// We preserve sendEmail logic which interacts with Google Apps Script, as it's not Firebase-dependent.

export const mockDataService = {
    // Spread all Firebase methods (getEvents, addEvent, login, etc.)
    ...firebaseService,

    // --- EMAIL SERVICE (Preserved from original) ---
    sendEmail: async (to, subject, body) => {
        console.log(`[EMAIL SERVICE] Initiating send to ${to}...`)
        try {
            // 1. Validate Payload
            if (!to || !to.includes('@')) {
                console.error("[EMAIL SERVICE] Invalid recipient:", to)
                alert("Error: Invalid Email Address")
                return false
            }
            if (!body || body.trim() === '') {
                console.error("[EMAIL SERVICE] Empty body")
                alert("Error: Email body is empty")
                return false
            }

            // 2. Get Config (Now from Firebase)
            const config = await firebaseService.getAll('club_config').then(docs => docs.find(d => d.id === 'config'));
            // Note: getAll returns array. We assume 'config' doc exists or we fallback.

            const appScriptUrl = config?.apps_script_url;

            if (!appScriptUrl) {
                console.warn("[EMAIL SERVICE] No App Script URL configured.")
                // alert("Error: Email Configuration missing (Web App URL). check Settings.")
                // Allow fallback or just fail silently/log?
                return false
            }

            const payload = {
                to: to,
                subject: subject,
                body: body,
                name: config?.name || 'Rotaract Club'
            }
            console.log("[EMAIL SERVICE] Sending Payload:", payload)

            // 3. Send Request
            const response = await fetch(appScriptUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
            }

            const result = await response.text()
            console.log(`[EMAIL SERVICE] Success:`, result)
            return true

        } catch (error) {
            console.error("[EMAIL SERVICE] Failed to send:", error)
            alert(`Email Failed: ${error.message}`)
            return false
        }
    },

    // Alias for compatibility
    mockSendEmail: async (to, subject, body) => {
        return await mockDataService.sendEmail(to, subject, body)
    },

    // --- LEGACY / UTILITY ---
    getStorageInfo: async () => {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate()
            return (estimate.usage / 1024 / 1024).toFixed(2)
        }
        return "Unknown"
    },

    // Placeholder for clearAllData - implementation for Firebase could mean clearing collections?
    // Dangerous for production. We'll leave it as a session clear.
    clearAllData: async () => {
        sessionStorage.clear();
        window.location.reload();
    }
};

