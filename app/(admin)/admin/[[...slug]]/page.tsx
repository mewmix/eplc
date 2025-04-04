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
// Inside app/(admin)/admin/[[...slug]]/page.tsx

const cmsConfig = {
  backend: {
    name: 'git-gateway',
    branch: 'main',
  },
  media_folder: 'public/uploads/images',
  public_folder: '/uploads/images',
  collections: [
    {
      name: 'plant_inventory',
      label: 'Plant Inventory',
      description: 'Manage all plant listings. Retail price is Base Price x 1.75 (calculated automatically).',
      files: [ // Editing specific files
        {
          label: 'All Plants Data', // Label for the file entry
          name: 'plant_data_file', // Internal name for the file entry
          file: 'public/plant-data.json', // Path to the file

          // ** REMOVED 'widget: list' from here **

          // Fields describing the *content structure* of the file:
          fields: [
            {
              // ** THIS field represents the JSON array itself **
              label: 'Plants', // Label for the list editor in the UI
              name: 'plants_list', // Internal name for the list field (can be anything)
              widget: 'list', // The widget type for this field IS list
              label_singular: "Plant", // Label for the 'Add' button
              summary: "{{fields.commonName}} ({{fields.containerSize}})", // Summary for items

              // ** THIS 'fields' array describes objects WITHIN the list **
              fields: [
                { label: 'ID', name: 'id', widget: 'string', hint: "Unique ID (e.g., 'apple-fuji'). Avoid changing." },
                { label: 'Display Name', name: 'displayName', widget: 'string', hint: "Full name in catalog (e.g., Apple 'Fuji' 10/15 gal)" },
                { label: 'Common Name', name: 'commonName', widget: 'string', hint: "Simpler name (e.g., Fuji Apple)" },
                { label: 'Botanical Name', name: 'botanicalName', widget: 'string', required: false }, // Ensure required:false if might be missing
                { label: 'Container Size', name: 'containerSize', widget: 'string', hint: 'e.g., 5 gallon, 10/15 gallon' },
                { label: 'Base Price ($)', name: 'basePrice', widget: 'number', value_type: 'float', min: 0, step: 0.01, hint: 'Wholesale/cost. Retail is auto-calculated.' },
                { label: 'Available Quantity', name: 'available', widget: 'number', value_type: 'int', default: 0, min: 0 },
                // Ensure image field exists in JSON or is required:false here
                { label: "Image (Upload or Path)", name: "image", widget: "image", required: false, allow_multiple: false, hint: "Upload an image or enter a URL/path." }
              ]
              // ** END of fields for objects within the list **
            }
          ]
          // ** END of fields describing the file content **
        }
      ]
    }
    // Add other collections if needed
  ],
};

// ... rest of the page.tsx component (useEffect, export default) ...
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

export default AdminCMSPage;l
