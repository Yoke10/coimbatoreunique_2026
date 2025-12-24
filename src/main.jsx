import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Fonts
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/800.css'
import '@fontsource/overpass/800.css'
import '@fontsource/overpass/900.css'

import { AuthProvider } from "./context/AuthContext"

import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 60 * 24, // 24 hours (Aggressive caching since we persist)
            gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

const persister = createSyncStoragePersister({
    storage: window.localStorage,
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <AuthProvider>
                <App />
            </AuthProvider>
        </PersistQueryClientProvider>
    </React.StrictMode>,
)
