import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PricingPage } from './PublicPages.jsx'
import TermsPage from './TermsPage.jsx'
import PrivacyPage from './PrivacyPage.jsx'

// Lightweight path-based routing for the small set of public marketing/legal
// pages. This intentionally does not pull in a router library — App.jsx
// remains the single-page app it always was for every other route.
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const ROUTES = {
  '/pricing': PricingPage,
  '/terms': TermsPage,
  '/privacy': PrivacyPage,
}
const RouteComponent = ROUTES[path]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {RouteComponent ? <RouteComponent /> : <App />}
  </React.StrictMode>,
)
