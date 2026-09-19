-- ==========================================================
-- DREWEB - PostgreSQL Database Schema for VPS & Docker
-- ==========================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  client VARCHAR(255),
  industry VARCHAR(255),
  year VARCHAR(50),
  duration VARCHAR(100),
  short_description TEXT,
  challenge TEXT,
  solution TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  github TEXT,
  hero_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  hero_video TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  meta_title TEXT,
  meta_desc TEXT,
  keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255),
  short_description TEXT,
  description TEXT,
  image TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRICING TABLE
CREATE TABLE IF NOT EXISTS pricing (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  headline VARCHAR(255),
  price VARCHAR(100) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  nots JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  cta VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BLOG TABLE
CREATE TABLE IF NOT EXISTS blog (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(255),
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category VARCHAR(255),
  read_time VARCHAR(100),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LEADS TABLE (Contact Inquiries)
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(100),
  company VARCHAR(255),
  service VARCHAR(255),
  currency VARCHAR(10) DEFAULT '$',
  budget VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(64) PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  company VARCHAR(255),
  quote TEXT NOT NULL,
  avatar TEXT,
  rating INT DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SHOWCASE HERO CARDS TABLE
CREATE TABLE IF NOT EXISTS showcase_hero_cards (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  image_url TEXT,
  width INT,
  height INT,
  initial_x INT,
  initial_y INT,
  rotation INT,
  float_speed NUMERIC,
  scale NUMERIC,
  z_index INT,
  stats JSONB DEFAULT '{}'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ADMINS TABLE (Users)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TEMPLATES TABLE (Shop)
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  price VARCHAR(100),
  currency VARCHAR(20) DEFAULT 'USD',
  description TEXT,
  hero_image TEXT,
  paypal_link TEXT,
  upi_qr_code TEXT,
  upi_id VARCHAR(255),
  access_link TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. MEDIA TABLE
CREATE TABLE IF NOT EXISTS media (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  size VARCHAR(50),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- INITIAL DATA SEED (Clean Industry Standard Paths)
-- ==========================================================

-- Default Admin User
INSERT INTO users (id, email, password_hash, role)
VALUES ('admin-1', 'info@dreweb.online', 'Macbook@123', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1780467935901', 'Léo Car Wash | Premium Website', 'le-o-car-wash-premium-website', 'Léo ', 'Automotive / Auto Detailing', '2026', '3 week', 'A premium, high-performance website designed and developed for a mobile auto detailing business in Marlborough, MA. Features include a dynamic transformations gallery and WhatsApp booking integration.', 'The client needed a premium digital presence that reflected the high-end, uncompromising quality of their mobile auto detailing services in Marlborough, MA. They required a professional way to showcase their meticulous vehicle transformations and a streamlined method for potential clients to book their specialized packages.', 'The client needed a premium digital presence that reflected the high-end, uncompromising quality of their mobile auto detailing services in Marlborough, MA. They required a professional way to showcase their meticulous vehicle transformations and a streamlined method for potential clients to book their specialized packages.', '["Next.js","React","Tailwind CSS"]'::jsonb, 'https://leocarwash.vercel.app/', '', '/uploads/projects/le-o-car-wash-premium-website.jpg', '[]'::jsonb, '', true, true, 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1785252144893', 'Elyse Residence — Luxury Real Estate Website', 'elyse-residence-luxury-real-estate', 'Elyse Residence', 'Real Estate', '2025', '1 Month', 'A high-end, immersive web showcase engineered for wellness-focused luxury residences in Dubai, featuring refined typography, smooth animations, and interactive tour booking.', 'The property developers needed a sophisticated, architecturally centered digital platform for Elyse Residence. The project required presenting ultra-luxury wellness residences in Dubai with an emphasis on privacy, architectural beauty, and restorative living while capturing high-value leads for private viewings.', 'We built a modern, visual-first landing platform designed around editorial aesthetics and smooth motion UI. The web application highlights residence features, curated amenities, brand philosophy, and location details alongside prominent lead capture CTA flows ("Book A Visit").', '["Next.js","React","React","Tailwind CSS","Lenis"]'::jsonb, 'https://customsites-real-estate.vercel.app/', '', '/uploads/projects/elyse-residence-luxury-real-estate.jpg', '[]'::jsonb, '', false, true, 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1785247442463', 'The Postcard Cuelim — Luxury Resort Website', 'luxury-resort-website', 'The Postcard Cuelim', 'Hospitality / Luxury Tourism', '2026', '3 Months', 'A modern luxury showcase website built for a boutique 350-year-old Portuguese estate in South Goa, featuring high-performance booking flows and immersive gallery experiences.', 'The client needed an elegant, high-performance digital showcase for The Postcard Cuelim, a historic boutique resort in South Goa centered around a 350-year-old chapel. The site needed to balance rich heritage branding with modern UX to reflect the property''s tranquility, bespoke dining offerings, and seamless guest experiences.', 'We crafted a clean, mobile-first web presence tailored for luxury travelers. The solution features high-resolution media galleries highlighting the property''s 3,500 acres of paddy fields, intuitive booking integration, dynamic experience showcases, and tailored micro-interactions that elevate brand perception.', '["Next.js","React","Tailwind CSS","Framer Motion"]'::jsonb, 'https://www.postcardresorts.com/hotels/the-postcard-cuelim', '', '/uploads/projects/luxury-resort-website.jpg', '[]'::jsonb, '', true, true, 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1785249460646', 'Anokhi Jewellery — E-Commerce Website & Brand Showcase', 'ewellery-ecommerce-website', 'Anokhi Jewellery', 'E-Commerce', '2025', '6 Months', 'A high-converting, modern e-commerce platform built for a premier Indian demifine and imitation jewellery brand, featuring shoppable media, customer reviews, and intuitive mobile checkout.', 'Anokhi Jewellery needed a elevated digital store to showcase their handcrafted Kundan, American Diamond, and demifine collections. Serving over 20,000 customers, the brand required a fast, highly visual, and trustworthy e-commerce experience capable of handling high traffic, video-shopping integrations, and celebrity-endorsed product showcases.', 'We engineered a mobile-first, performance-driven online store with a luxury aesthetic. Key features include dynamic product filtering, seamless checkout integration, interactive video shopping modules ("Watch and Shop"), integrated celebrity/influencer style galleries, and high-speed page loads to maximize conversions.', '["Shopify","Liquid","Tailwind CSS"]'::jsonb, 'https://anokhijewellery.in/', '', '/uploads/projects/ewellery-ecommerce-website.jpg', '[]'::jsonb, '', false, true, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1785249328062', 'Car Spa Dubai — Luxury Auto Detailing', 'car-spa-dubai-luxury-auto-detailing', 'Car Spa Dubai', 'Automotive / Auto Detailing', '2025', '2 weeks', 'A high-end, modern digital platform crafted for a luxury auto detailing business in Dubai, featuring dynamic service showcases and streamlined customer inquiry flows.', 'The client needed a sleek, high-converting web presence that matched the ultra-premium standards of the Dubai automotive market. They required an elegant platform to highlight specialized ceramic coating, paint protection film (PPF), and high-end interior detailing services while making it effortless for supercar owners to request bookings.', 'We designed and built a fast, responsive, and visual-first web application. The solution incorporates high-definition visual elements, tailored service breakdowns, interactive booking/inquiry pathways, and seamless mobile responsiveness to maximize conversion rates among local car enthusiasts.', '["Next.js","React","Tailwind CSS"]'::jsonb, 'https://carspadubai.vercel.app/', '', '/uploads/projects/car-spa-dubai-luxury-auto-detailing.jpg', '[]'::jsonb, '', false, true, 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1779098508357', 'SwiftHaul Logistics branding', 'swifthaul-logistics-branding', 'SwiftHaul Logistics', 'Cargo & Logistics', '2025', '4 Weeks', 'A modern logistics and cargo company website designed to showcase speed, reliability, and efficient delivery services through a clean UI, bold branding, and conversion-focused user experience.', 'SwiftHaul Logistics needed a modern digital identity that could reflect speed, trust, and professionalism in the highly competitive cargo and transportation industry. Their previous branding lacked consistency, visual impact, and a strong online presence. The challenge was to create a premium brand identity and website experience that communicated fast delivery, reliability, and operational efficiency while also improving user engagement and customer trust.', 'We created a complete premium brand identity for SwiftHaul Logistics focused on speed, reliability, and modern professionalism. The project included a custom wing-inspired logo, typography system, color palette, visual direction, brand guidelines, and marketing assets designed to establish a strong and memorable logistics brand presence. The final identity system was crafted to communicate fast delivery, trust, efficiency, and scalability across both digital and print platforms.', '[]'::jsonb, '', '', '/uploads/projects/swifthaul-logistics-branding.jpg', '[]'::jsonb, '', true, true, 7)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1780469700744', 'E-commerce Platform for Loomique Atelier', 'e-commerce-platform-for-loomique-atelier', 'Loomique Atelier', 'Fashion & Interior Textiles', '', '4 Week', 'A visually engaging, modern web platform developed for Loomique Atelier. The site was designed with a clean aesthetic to beautifully showcase their premium, handcrafted textiles for fashion and interiors, focusing on seamless user navigation and high-quality brand representation.', 'Loomique Atelier creates exquisite, premium handcrafted textiles, but their digital presence didn''t fully reflect the luxury and craftsmanship of their physical products. Relying primarily on Instagram, they lacked a centralized, professional platform to elegantly showcase their collections, tell their unique brand story, and provide a seamless, trustworthy browsing experience for high-end fashion and interior clients.', 'I designed and developed a bespoke, visually-driven website that serves as a digital extension of their atelier. By focusing on a minimalist and elegant UI/UX, the platform allows their high-resolution textile photography to take center stage. The site features intuitive navigation, smooth animations, and a fully responsive design, ensuring a premium browsing experience across all devices while making it easy for prospective clients to explore their work and get in touch.', '["Next.js","React"]'::jsonb, 'https://loomique-atelier.vercel.app/', '', '/uploads/projects/e-commerce-platform-for-loomique-atelier.jpg', '[]'::jsonb, '', true, true, 8)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1779099272844', 'Zigly Pet Care Platform', 'zigly-pet-care-platform', 'Zigly', '', '2026', '10 Weeks', 'A modern omnichannel pet care platform designed to deliver premium pet products, veterinary services, grooming solutions, and seamless digital experiences for pet parents across India.', 'Zigly needed a modern digital platform capable of combining e-commerce, veterinary services, pet grooming, and appointment booking into one seamless experience. The challenge was to create a trustworthy, engaging, and scalable ecosystem that simplified pet care services while improving customer experience, digital accessibility, and brand consistency across multiple touchpoints.', 'We designed a complete modern pet care platform experience focused on accessibility, engagement, and seamless user journeys. The project included premium UI/UX design, responsive layouts, service booking interfaces, pet product showcase systems, grooming and veterinary service flows, and conversion-focused e-commerce experiences. The final platform was crafted to create a warm, trustworthy, and user-friendly ecosystem for modern pet parents.', '["Figma, HTML5, CSS3, JavaScript, GSAP, Bootstrap, PHP, MySQL, Cloudinary, cPanel Hosting"]'::jsonb, '', '', '/uploads/projects/zigly-pet-care-platform.jpg', '[]'::jsonb, '', false, true, 9)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1779098887941', 'FusionTech Research Trading Platform', 'fusiontech-research-trading-platform', 'FusionTech Research', 'Finance', '2026', '10 Weeks', 'A modern stock market research and trading advisory platform designed to deliver real-time market insights, trading strategies, investment research, and SEBI-registered advisory services through a professional and data-driven digital experience.', 'FusionTech Research needed a modern and trustworthy digital platform that could communicate professionalism, financial expertise, and real-time market intelligence in the highly competitive trading and investment industry. The challenge was to create a premium fintech experience capable of simplifying complex financial services, improving user engagement, building investor trust, and presenting large volumes of trading information in a clean and accessible format.', 'We designed and developed a complete fintech platform experience for FusionTech Research focused on clarity, trust, performance, and user engagement. The project included a modern financial UI system, responsive layouts, service showcase pages, pricing systems, blog integration, investor-focused dashboards, and SEO-optimized architecture. The final experience was crafted to help traders and investors access research-backed insights through a clean, scalable, and professional digital platform. ', '["HTML5","CSS3","JavaScript","Bootstrap","PHP","MySQL"]'::jsonb, '', '', '/uploads/projects/fusiontech-research-trading-platform.jpg', '[]'::jsonb, '', true, true, 10)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1779098374018', 'Vokusm Academy E-Learning Platform', 'vokusm-academy-e-learning-platform', 'Vokusm Academy', 'Education', '2024', '6 Weeks', 'A modern online language learning platform designed to help students learn global languages through interactive courses, clean UI/UX, engaging visuals, and a conversion-focused educational experience.', 'Vokusm Academy needed a modern and engaging digital platform that could make online language learning feel more interactive, accessible, and visually appealing for students worldwide. Their challenge was creating a user-friendly educational experience that balanced premium design, easy course navigation, multilingual presentation, and strong student engagement while building trust and increasing course registrations.', 'We designed a complete modern e-learning platform experience for Vokusm Academy focused on accessibility, engagement, and conversion. The project included a clean educational UI system, multilingual-inspired visual identity, responsive layouts, course showcase sections, student-focused interactions, and conversion-driven CTA placements. The final platform was crafted to create a welcoming and professional online learning environment optimized for both desktop and mobile users.', '["Figma","React","Next.js","Tailwind CSS","TypeScript","Framer Motion","GSAP"]'::jsonb, '', '', '/uploads/projects/vokusm-academy-e-learning-platform.jpg', '[]'::jsonb, '', true, true, 11)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1786983498980', 'Lunarch Studio', 'Architecture', 'Lunarch', 'Architecture & Design', '2026', '1 month', 'At Lunarch Studio, architecture is approached as a lasting expression of place. Every project is composed with precision, restraint, and a deep respect for experience.', 'Lunarch Studio, a high-end architecture firm, needed a digital platform that perfectly matched their philosophy of precision, restraint, and timeless design. The challenge was to create a web presence that didn''t just display their portfolio, but visually communicated the sophisticated and immersive experience of their physical architectural projects. They required a visually stunning, highly responsive, and easy-to-manage website that put their high-quality imagery front and center without feeling cluttered.', 'We developed a sleek, minimalist website tailored to reflect the elegance of Lunarch''s architectural work. By leveraging clean typography, intuitive navigation, and subtle, fluid animations, the digital experience mirrors their premium physical spaces. The layout prioritizes large, immersive imagery to showcase their projects, ensuring a seamless and high-end user experience across all devices while providing a scalable, easy-to-maintain platform for the firm.', '["Framer","Framer motion","UI/UX Design","React","CSS"]'::jsonb, 'https://lunarch.framer.website/', '', '/uploads/projects/Architecture.jpg', '[]'::jsonb, '', false, true, 0)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO projects (id, title, slug, client, industry, year, duration, short_description, challenge, solution, technologies, link, github, hero_image, gallery, hero_video, is_featured, is_public, display_order)
VALUES ('1786985808232', 'Nortrade', 'nortrade', 'Karim BenBoukria', 'Architectural 3D Rendering & Animation', '2026', '4 Weeks', 'Nortrade brings architectural projects to life with 3D renders and animations of exceptional precision, offering high-end visual solutions and immersive experiences.', 'Karim BenBoukria required a premium digital platform for Nortrade that could effectively showcase their exceptional precision in architectural renders and animations. The primary challenge was building a site capable of handling heavy, high-quality visual assets and video animations seamlessly without compromising on load speeds or user experience, ensuring potential clients could fully appreciate the intricate details of their 3D work.', 'We designed and developed a sleek, high-performance portfolio website tailored specifically to highlight Nortrade''s architectural visualizations. By optimizing media delivery and implementing a minimalist, immersive gallery interface, the new site brings their projects to life. The fluid navigation and responsive design provide an engaging browsing experience that directly reflects the premium, precise quality of their renders and animations.', '["HTML","CSS","JS","MYSQL","GSAP"]'::jsonb, 'https://www.nortrade.ch/', '', '/uploads/projects/nortrade.jpg', '[]'::jsonb, '', false, true, 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, hero_image = EXCLUDED.hero_image, short_description = EXCLUDED.short_description;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-2', 'E-commerce Development', 'ecommerce-development', 'Development', 'E-commerce Development services tailored to your needs.', 'Detailed description of E-commerce Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-3', 'SaaS Development', 'saas-development', 'Development', 'SaaS Development services tailored to your needs.', 'Detailed description of SaaS Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-4', 'UI/UX Design', 'ui-ux-design', 'Creative', 'UI/UX Design services tailored to your needs.', 'Detailed description of UI/UX Design.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-5', 'SEO Optimization', 'seo-optimization', 'Marketing', 'SEO Optimization services tailored to your needs.', 'Detailed description of SEO Optimization.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-6', 'Branding & Logo Design', 'branding', 'Creative', 'Branding & Logo Design services tailored to your needs.', 'Detailed description of Branding & Logo Design.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-7', 'Motion Graphics', 'motion-graphics', 'Creative', 'Motion Graphics services tailored to your needs.', 'Detailed description of Motion Graphics.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-8', 'Custom Website Development', 'custom-website', 'Development', 'Custom Website Development services tailored to your needs.', 'Detailed description of Custom Website Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-9', 'WordPress Development', 'wordpress', 'Development', 'WordPress Development services tailored to your needs.', 'Detailed description of WordPress Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-10', 'Shopify Development', 'shopify', 'Development', 'Shopify Development services tailored to your needs.', 'Detailed description of Shopify Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-11', 'Mobile App Development', 'mobile-app', 'Development', 'Mobile App Development services tailored to your needs.', 'Detailed description of Mobile App Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-12', 'API Integration Services', 'api-integration', 'Development', 'API Integration Services services tailored to your needs.', 'Detailed description of API Integration Services.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-13', 'Content Marketing', 'content-marketing', 'Marketing', 'Content Marketing services tailored to your needs.', 'Detailed description of Content Marketing.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category, short_description, description, image, is_published, display_order)
VALUES ('service-1', 'Website Design & Development', 'website-design', 'Development', 'Website Design & Development services tailored to your needs.', 'Detailed description of Website Design & Development.', '', true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, author, role, company, quote, avatar, rating, is_published)
VALUES ('test-1', 'Founder, AD Global Impex', '', '', 'dreweb transformed our digital presence entirely. Their design is world-class.', '', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, author, role, company, quote, avatar, rating, is_published)
VALUES ('test-2', 'CTO, Fusiontech Research', '', '', 'The best tech agency we have worked with. Delivered our SaaS platform 2 weeks early.', '', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, author, role, company, quote, avatar, rating, is_published)
VALUES ('test-3', 'Director, Career Pilot HR', '', '', 'Our conversion rate doubled after the redesign by dreweb. Absolutely incredible team.', '', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO settings (key, data, updated_at)
VALUES ('branding', '{"logoLight":"/uploads/logo_light_0.jpeg","logoDark":"/uploads/logo_dark_1.jpeg","favicon":"/uploads/favicon_2.jpeg"}'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

INSERT INTO settings (key, data, updated_at)
VALUES ('general', '{"siteName":"dreweb","tagline":"Digital Creative Studio","description":"We build digital experiences that convert & scale."}'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

INSERT INTO settings (key, data, updated_at)
VALUES ('contact', '{"email":"hello@dreweb.online","phone":"+91 123 456 7890","location":"Indore, Madhya Pradesh, India","twitter":"https://twitter.com/dreweb","linkedin":"https://linkedin.com/company/dreweb","instagram":"https://instagram.com/drewebofficial","behance":"https://behance.net/dreweb"}'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

INSERT INTO settings (key, data, updated_at)
VALUES ('seo', '{"defaultMetaTitle":"Dreweb | Digital Creative Studio","defaultMetaDesc":"We build digital experiences that convert & scale.","googleAnalyticsId":"","metaPixelId":""}'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;
