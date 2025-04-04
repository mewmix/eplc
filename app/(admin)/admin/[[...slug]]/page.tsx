// Filename: app/(admin)/admin/[[...slug]]/page.tsx
"use client";

import React, { useEffect } from 'react';
import CMS from 'decap-cms-app'; // Make sure 'decap-cms-app' is installed

// Attempt to import the default CMS styles
try {
  require('decap-cms-app/dist/main.css');
  console.log("Decap CMS CSS imported successfully.");
} catch (error) {
  console.warn("Could not import decap-cms-app/dist/main.css directly. Ensure styles are loaded globally or manually include the CSS content in your global styles.", error);
  // Fallback: You might need to copy the CSS content into e.g., app/globals.css
}

// Define the CMS Configuration Object
const cmsConfig = {
  backend: {
    name: 'git-gateway',
    branch: 'main', // Ensure this matches your default Git branch
  },
  media_folder: 'public/uploads/images', // Relative to repo root
  public_folder: '/uploads/images',     // URL path for media
  collections: [
    {
      name: 'plant_inventory',
      label: 'Plant Inventory',
      description: 'Manage all plant listings. Retail price is Base Price x 1.75 (calculated automatically).',
      files: [
        {
          label: 'All Plants',
          name: 'plants',
          file: 'public/plant-data.json', // Path from repo root to your data file
          widget: 'list',
          label_singular: "plant",
          summary: "{{fields.commonName}} ({{fields.containerSize}})", // Summary for list items in UI
          fields: [ // Fields for each object in the plant list
            { label: 'ID', name: 'id', widget: 'string', hint: "Unique ID (e.g., 'apple-fuji'). Avoid changing." },
            { label: 'Display Name', name: 'displayName', widget: 'string', hint: "Full name in catalog (e.g., Apple 'Fuji' 10/15 gal)" },
            { label: 'Common Name', name: 'commonName', widget: 'string', hint: "Simpler name (e.g., Fuji Apple)" },
            { label: 'Botanical Name', name: 'botanicalName', widget: 'string', required: false },
            { label: 'Container Size', name: 'containerSize', widget: 'string', hint: 'e.g., 5 gallon, 10/15 gallon' },
            { label: 'Base Price ($)', name: 'basePrice', widget: 'number', value_type: 'float', min: 0, step: 0.01, hint: 'Wholesale/cost. Retail is auto-calculated.' },
            { label: 'Available Quantity', name: 'available', widget: 'number', value_type: 'int', default: 0, min: 0 },
            // Use the 'image' widget for better UX (upload/media library)
            { label: "Image (Upload or Path)", name: "image", widget: "image", required: false, allow_multiple: false, hint: "Upload an image or enter a URL/path." }
          ],
        },
      ],
    },
    // Add other collections here if needed
  ],
};

// The React component that will initialize and render the CMS
const AdminCMSPage = () => {
  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined' && CMS && !window.CMS_INITIALIZED) {
      console.log("Initializing Decap CMS manually...");
      try {
        CMS.init({ config: cmsConfig });
        // Add a flag to prevent re-initialization on fast refresh/HMR
        (window as any).CMS_INITIALIZED = true;
        console.log("Decap CMS Initialized.");
      } catch (error) {
        console.error("Error initializing Decap CMS:", error);
      }
    } else if (typeof window !== 'undefined' && window.CMS_INITIALIZED) {
       console.log("Decap CMS already initialized.");
    } else if (typeof window !== 'undefined') {
       console.error("CMS object not available on window for initialization.");
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Decap CMS injects its UI into the DOM. A simple placeholder is needed.
  // The `id="nc-root"` is sometimes used by CMS styling/scripts.
  return <div id="nc-root" />;
};

export default AdminCMSPage;
