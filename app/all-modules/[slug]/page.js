import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import PageHeader from '../../../components/layout/PageHeader';
import Footer from '../../../components/layout/footer/Footer';
import Header from '../../../components/layout/header/Header';
import CustomCursor from '../../../components/layout/CustomCursor';
import FaqSection from '../../../components/containers/modules/FaqSection';
import { FaHome } from 'react-icons/fa';
import VideoSection from '../../../components/containers/modules/VideoSection';
import CtaSection from '../../../components/containers/modules/CtaSection';
import WorkProcessSection from '../../../components/containers/modules/WorkProcessSection';
import metaInfo from '../../utils/metaInfo.json';
import { moduleFaqs } from '../../../data/moduleFaqs';
// import NewVideoSection from '../../../components/containers/modules/NewVideoSection';

const moduleSlugs = [
  'crm',
  'sales',
  'purchase',
  'inventory',
  'production',
  'job-work',
  'qc-qa',
  'fixed-assets',
  'plant-maintenance',
  'hrms',
  'finance-accounting',
  'imports-exports',
  'project',
  'design',
  'installation',
  'service',
  'pos',
];

// Function to check all modules metadata
function checkAllModulesMetadata() {
  console.log('=== Checking All Modules Metadata ===');
  const availableModules = Object.keys(metaInfo.modules);
  console.log('Available modules in metaInfo:', availableModules);
  
  moduleSlugs.forEach(slug => {
    const metaKey = slug === 'pos' ? 'POS' : slug;
    const hasMetadata = metaInfo.modules[metaKey];
    const hasTitle = hasMetadata?.title;
    const hasDescription = hasMetadata?.description;
    
    console.log(`${slug}: ${hasMetadata ? '✅' : '❌'} Metadata, ${hasTitle ? '✅' : '❌'} Title, ${hasDescription ? '✅' : '❌'} Description`);
  });
  console.log('=== End Check ===');
}

export async function generateStaticParams() {
  return moduleSlugs.map((slug) => ({ slug }));
}

// Add metadata generation
export async function generateMetadata({ params }) {
  try {
    const awaitedParams = await params;
    // Check all modules metadata on first load
    if (awaitedParams.slug === 'crm') {
      checkAllModulesMetadata();
    }
    
    // Get module data (for fallback)
    const data = await getModuleData(awaitedParams.slug);
    
    if (!data) {
      throw new Error('Module data not found');
    }
    
    // Handle case sensitivity for POS/pos
    const metaKey = awaitedParams.slug === 'pos' ? 'POS' : awaitedParams.slug;
    
    // Get meta info for the module
    const moduleMeta = metaInfo.modules[metaKey];
    
    console.log(`Module: ${awaitedParams.slug}, MetaKey: ${metaKey}, Has Metadata: ${!!moduleMeta}, Has Title: ${!!moduleMeta?.title}`);
    
    if (moduleMeta && moduleMeta.title && moduleMeta.description) {
      const ogImage = moduleMeta.image || '/default-og-image.jpg';
      return {
        title: moduleMeta.title,
        description: moduleMeta.description,
        keywords: moduleMeta.keywords,
        openGraph: {
          title: moduleMeta.title,
          description: moduleMeta.description,
          type: 'website',
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: moduleMeta.title,
              type: 'image/jpeg'
            }
          ]
        },
        twitter: {
          card: 'summary_large_image',
          title: moduleMeta.title,
          description: moduleMeta.description,
          images: [ogImage]
        }
      };
    }
    
    console.log(`❌ No metadata found for ${metaKey}, using fallback`);
    
    // Fallback to module data if metaInfo not available
    const title = data?.mainHeaderSection?.heading || awaitedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `${title} - Tech Cloud ERP`,
      description: `Explore ${title} module features and benefits. Optimize your business operations with Tech Cloud ERP solutions.`,
      keywords: `${awaitedParams.slug.replace(/-/g, ' ')}, ERP module, business software`,
      openGraph: {
        title: `${title} - Tech Cloud ERP`,
        description: `Explore ${title} module features and benefits.`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - Tech Cloud ERP`,
        description: `Explore ${title} module features and benefits.`,
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Module Not Found - Tech Cloud ERP',
      description: 'The requested module page could not be found.',
    };
  }
}
 
async function getModuleData(slug) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'modules', `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading module data for ${slug}:`, error);
    return null;
  }
}

// Video schema data for different modules
const videoSchemas = {
  'imports-exports': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Imports and Exports Module Demo",
    "description": "Imports and exports module helps manage international trade documentation and shipment tracking.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/imports-exports/"
  },
  'project': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Project Management Module Demo",
    "description": "Project module helps manage project planning, tasks, deadlines, and team collaboration.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/project/"
  },
  'design': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Design Management Module Demo",
    "description": "Design module helps manage product designs, drawings, and design workflow processes.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/design/"
  },
  'fixed-assets': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Fixed Assets Management Module Demo",
    "description": "Fixed assets module helps track asset lifecycle, depreciation, and maintenance records.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/fixed-assets/"
  },
  'job-work': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Job Work Module Demo",
    "description": "Job work module helps manage outsourced manufacturing, track job orders, and monitor job work processes.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/job-work/"
  },
  'plant-maintenance': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Plant Maintenance Module Demo",
    "description": "Plant maintenance module helps track equipment maintenance schedules and manage repair activities.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/plant-maintenance/"
  },
  'service': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Service Management Module Demo",
    "description": "Service module helps manage customer service requests, maintenance activities, and service reports.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/service/"
  },
  'installation': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Installation Management Module Demo",
    "description": "Installation module helps track product installations, schedules, and service tasks.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/installation/"
  },
  'pos': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "POS System Module Demo",
    "description": "POS module helps track retail sales, manage billing, and monitor transactions in real time.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/pos/"
  },
  'hrms': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Human Resource Management Module Demo",
    "description": "HRM module helps manage employee records, attendance, payroll, and HR operations.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/hrm/"
  },
  'crm': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "CRM Module Demo",
    "description": "CRM module helps manage leads, customer communication and sales activities in one place.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1766400393/crm_vedio_ssr0jm.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1766400393/crm_vedio_ssr0jm.mp4?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/crm/"
  },
  'sales': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Sales Module Demo",
    "description": "Sales module helps track orders, manage invoices, and monitor sales performance in one place.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1766400743/sales_vedio_p4yllb.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1766400743/sales_vedio_p4yllb.mp4?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/sales/"
  },
  'purchase': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Purchase Module Demo",
    "description": "Purchase module helps manage vendors, purchase orders, and procurement tracking in one system.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1766400605/puchase_vedio_sefltd.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1766400605/puchase_vedio_sefltd.mp4?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/purchase/"
  },
  'inventory': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Inventory Management Module Demo",
    "description": "Inventory module helps track stock levels, manage warehouses, and monitor inventory movement in real time.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/inventory/"
  },
  'production': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Production Management Module Demo",
    "description": "Production module helps plan manufacturing, manage resources, and monitor production workflow efficiently.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/production/"
  },
  'qc-qa': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Quality Control and Quality Assurance Module Demo",
    "description": "QC and QA module helps maintain product quality, manage inspections, and track quality reports.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/qc-qa/"
  },
  'finance-accounting': {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Finance and Accounting Module Demo",
    "description": "Finance and accounting module helps manage financial transactions, reports, and accounting operations.",
    "thumbnailUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.jpg",
    "uploadDate": "2026-03-01",
    "contentUrl": "https://res.cloudinary.com/techclouderp/video/upload/v1749719811/crm-module_htem2g.webm?f_auto,q_70,w_1200,c_scale,so_0",
    "embedUrl": "https://techclouderp.com/all-modules/finance-accounting/"
  }
};

export default async function ModulePage({ params }) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;

  if (!moduleSlugs.includes(slug)) {
    notFound();
    return null;
  }

  const moduleData = await getModuleData(slug);
  
  if (!moduleData) {
    notFound();
    return null;
  }
// Create FAQ schema
const modulefaq = moduleFaqs[slug] || [];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "url": `https://techclouderp.com/all-modules/${slug}`,
  "mainEntity": modulefaq.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

// Create BreadcrumbList schema
const breadcrumbSchema = {
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://techclouderp.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Modules",
      "item": "https://techclouderp.com/all-modules/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": moduleData?.mainHeaderSection?.heading || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      "item": `https://techclouderp.com/all-modules/${slug}`
    }
  ]
};

  const breadcrumbs = [
    { label: 'Home', link: '/', icon: FaHome },
    { label: 'All Modules', link: '/all-modules' },
    { label: moduleData?.mainHeaderSection?.heading || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), link: null },
  ];

  return (
    <>
       {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {moduleData.videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(moduleData.videoSchema) }}
        />
      )}
      {videoSchemas[slug] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemas[slug]) }}
        />
      )}
      <Header />
      <PageHeader 
        title={moduleData?.mainHeaderSection?.heading || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} 
        breadcrumbs={breadcrumbs} 
      />
      <main>
        <WorkProcessSection moduleData={moduleData} />

        {moduleData.videosection && (
          <VideoSection moduleData={moduleData} />
        )}
        {/* <NewVideoSection /> */}

        {moduleData.faqs && (
          <FaqSection faqData={moduleData.faqs} />
        )}

        <CtaSection />
      </main>
      <Footer />
      <CustomCursor />
    </>
  );
}
