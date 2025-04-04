// Filename: app/(admin)/admin/[[...slug]]/page.tsx
"use client"

import React, { useEffect } from 'react'
import CMS from 'decap-cms-app'

// Optional: Extend the global window object if needed elsewhere
declare global {
  interface Window {
    CMS_INITIALIZED?: boolean
  }
}

// React component that provides the CMS mount point
const AdminCMSPage = () => {
  useEffect(() => {
    console.log("Decap CMS admin page mounted. CMS should auto-initialize from config.yml.")
  }, [])

  return <div id="nc-root" />
}

export default AdminCMSPage
