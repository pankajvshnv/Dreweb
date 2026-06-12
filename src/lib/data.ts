export const BRAND = {
  name: "dreweb",
  tagline: "Design • Develop • Deliver",
  email: "info@dreweb.online",
  phone: "+91 6261029938",
  location: "Indore, Madhya Pradesh, India",
  instagram: "@dreweb.agency",
  founded: 2022
};

export const SERVICES = [
  { slug: "website-design", title: "Website Design & Development", category: "Development" },
  { slug: "ecommerce-development", title: "E-commerce Development", category: "Development" },
  { slug: "saas-development", title: "SaaS Development", category: "Development" },
  { slug: "ui-ux-design", title: "UI/UX Design", category: "Creative" },
  { slug: "seo-optimization", title: "SEO Optimization", category: "Marketing" },
  { slug: "branding", title: "Branding & Logo Design", category: "Creative" },
  { slug: "motion-graphics", title: "Motion Graphics", category: "Creative" },
  { slug: "custom-website", title: "Custom Website Development", category: "Development" },
  { slug: "wordpress", title: "WordPress Development", category: "Development" },
  { slug: "shopify", title: "Shopify Development", category: "Development" },
  { slug: "mobile-app", title: "Mobile App Development", category: "Development" },
  { slug: "api-integration", title: "API Integration Services", category: "Development" },
  { slug: "content-marketing", title: "Content Marketing", category: "Marketing" }
];

export const PROJECTS = [
  { slug: "ad-global-impex", title: "AD Global Impex", industry: "Manufacturing", year: "2024", link: "https://adglobalimpex.com" },
  { slug: "career-pilot-hr", title: "Career Pilot HR", industry: "Human Resources", year: "2023", link: "https://careerpilot.hr" },
  { slug: "shri-ram-healthcares", title: "Shri Ram Healthcares", industry: "Healthcare", year: "2023", link: "https://shriramhealthcares.com" },
  { slug: "fusiontech-research", title: "Fusiontech Research", industry: "Technology", year: "2024", link: "https://fusiontechresearch.com" },
  { slug: "ecommerce-brand", title: "E-commerce Brand Platform", industry: "Retail", year: "2024", link: "https://ecommerce-brand.com" },
  { slug: "saas-dashboard", title: "SaaS Analytics Dashboard", industry: "Software", year: "2023", link: "https://saas-dashboard.com" }
];

export const TESTIMONIALS = [
  { quote: "dreweb transformed our digital presence entirely. Their design is world-class.", author: "Founder, AD Global Impex" },
  { quote: "The best tech agency we have worked with. Delivered our SaaS platform 2 weeks early.", author: "CTO, Fusiontech Research" },
  { quote: "Our conversion rate doubled after the redesign by dreweb. Absolutely incredible team.", author: "Director, Career Pilot HR" }
];

export const INDUSTRIES = [
  "Healthcare", "Real Estate", "Startups", "E-commerce Brands", "Educational Institutes", "Agencies", "Restaurants"
];

export const SHOWCASE_CARDS = [
  {
    id: "card-1",
    type: "website-preview",
    title: "Rooted in Wind",
    subtitle: "Focused on Impact.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    width: 320,
    height: 240,
    initialX: 38,
    initialY: 28,
    rotation: 4,
    floatSpeed: 4,
    scale: 1,
    zIndex: 10
  },
  {
    id: "card-2",
    type: "text-editorial",
    title: "PRODUCT DESIGNER",
    subtitle: "USER-FIRST",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    width: 380,
    height: 280,
    initialX: -36,
    initialY: 30,
    rotation: -6,
    floatSpeed: 5,
    scale: 1.1,
    zIndex: 5
  },
  {
    id: "card-3",
    type: "story-card",
    title: "Our Story",
    subtitle: "At the heart of what we do...",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    width: 280,
    height: 160,
    initialX: -38,
    initialY: -22,
    rotation: -3,
    floatSpeed: 6,
    scale: 0.9,
    zIndex: 15
  },
  {
    id: "card-4",
    type: "stats-card",
    title: "Performance",
    subtitle: "Stats",
    width: 200,
    height: 280,
    initialX: -46,
    initialY: 6,
    rotation: 5,
    floatSpeed: 3,
    scale: 0.95,
    zIndex: 8,
    stats: { a: '40+', b: '20K+', c: '98%' }
  },
  {
    id: "card-5",
    type: "pricing-card",
    title: "Our Pricing Plan",
    subtitle: "Pro Plan",
    width: 260,
    height: 200,
    initialX: 42,
    initialY: -20,
    rotation: -8,
    floatSpeed: 4.5,
    scale: 0.85,
    zIndex: 12
  }
];
