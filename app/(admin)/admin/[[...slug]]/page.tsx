// Filename: app/(admin)/admin/[[...slug]]/page.tsx
"use client";

import React, { useEffect } from 'react';
import CMS from 'decap-cms-app';
import type { CmsConfig } from 'decap-cms-core';

// Extend the global window object to add CMS_INITIALIZED
declare global {
  interface Window {
    CMS_INITIALIZED?: boolean;
  }
}

// Attempt to import the default CMS styles
try {
  require('decap-cms-app/dist/main.css');
  console.log("Decap CMS CSS imported successfully.");
} catch (error) {
  console.warn(
    "Could not import decap-cms-app/dist/main.css directly. Ensure styles are loaded globally or manually include the CSS content in your global styles.",
    error
  );
}

// Define the CMS Configuration Object
const cmsConfig: CmsConfig = {
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
      files: [
        {
          label: 'All Plants Data',
          name: 'plant_data_file',
          file: 'public/plant-data.json',
          fields: [
            {
              name: 'default', // satisfies TypeScript, not used in JSON
              widget: 'list',
              label: 'Plants',
              label_singular: 'Plant',
              summary: "{{fields.commonName}} ({{fields.containerSize}})",
              fields: [
                { label: 'ID', name: 'id', widget: 'string' },
                { label: 'Display Name', name: 'displayName', widget: 'string' },
                { label: 'Common Name', name: 'commonName', widget: 'string' },
                { label: 'Botanical Name', name: 'botanicalName', widget: 'string', required: false },
                { label: 'Container Size', name: 'containerSize', widget: 'string' },
                { label: 'Base Price ($)', name: 'basePrice', widget: 'number', value_type: 'float', min: 0, step: 0.01 },
                { label: 'Available Quantity', name: 'availability', widget: 'number', value_type: 'int', default: 0, min: 0 },
                { label: 'Image (Upload or Path)', name: 'image', widget: 'image', required: false, allow_multiple: false },
              ]
            }
          ],          
        },
      ],
    },
  ],
};

// React component that will initialize and render the CMS
const AdminCMSPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && CMS && !window.CMS_INITIALIZED) {
      console.log("Initializing Decap CMS manually...");
      try {
        CMS.init({ config: cmsConfig });
        window.CMS_INITIALIZED = true;
        console.log("Decap CMS Initialized.");
      } catch (error) {
        console.error("Error initializing Decap CMS:", error);
      }
    } else if (typeof window !== 'undefined' && window.CMS_INITIALIZED) {
      console.log("Decap CMS already initialized.");
    } else if (typeof window !== 'undefined') {
      console.error("CMS object not available on window for initialization.");
    }
  }, []);

  return <div id="nc-root" />;
};

export default AdminCMSPage;
