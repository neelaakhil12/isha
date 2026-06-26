-- SQL Migration Script to create new tables for administrative control
-- Run this in your Supabase dashboard SQL Editor

-- =========================================================================
-- PART 1: HOMEPAGE SECTIONS
-- =========================================================================

-- 1. About Company Section Table
CREATE TABLE IF NOT EXISTS public.about_company (
    id SERIAL PRIMARY KEY,
    badge TEXT NOT NULL DEFAULT 'About The Company',
    title TEXT NOT NULL DEFAULT 'Empowering Smart Businesses with Advanced Email Solutions',
    description_1 TEXT NOT NULL,
    description_2 TEXT NOT NULL,
    link_text TEXT NOT NULL DEFAULT 'Read Our Mission Story',
    link_url TEXT NOT NULL DEFAULT '/about',
    smtp_rate TEXT NOT NULL DEFAULT '99.8%',
    sender_score TEXT NOT NULL DEFAULT '98/100',
    queue_latency TEXT NOT NULL DEFAULT '< 150ms',
    queue_latency_pct TEXT NOT NULL DEFAULT '10',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_company DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_company
INSERT INTO public.about_company (id, badge, title, description_1, description_2, link_text, link_url, smtp_rate, sender_score, queue_latency, queue_latency_pct)
VALUES (
    1,
    'About The Company',
    'Empowering Smart Businesses with Advanced Email Solutions',
    'Isha Software Solutions helps businesses automate communication, improve marketing performance, and scale customer engagement through powerful email technologies.',
    'Our infrastructure is built for high volume, secure delivery, and smart tracking. We focus on giving business owners and marketers absolute control over their outbound and transactional mailing systems, without vendor lock-ins or restrictive contacts billing.',
    'Read Our Mission Story',
    '/about',
    '99.8%',
    '98/100',
    '< 150ms',
    '10'
) ON CONFLICT (id) DO UPDATE SET
    badge = EXCLUDED.badge,
    title = EXCLUDED.title,
    description_1 = EXCLUDED.description_1,
    description_2 = EXCLUDED.description_2,
    link_text = EXCLUDED.link_text,
    link_url = EXCLUDED.link_url,
    smtp_rate = EXCLUDED.smtp_rate,
    sender_score = EXCLUDED.sender_score,
    queue_latency = EXCLUDED.queue_latency,
    queue_latency_pct = EXCLUDED.queue_latency_pct;


-- 2. Platform Benefits Table
CREATE TABLE IF NOT EXISTS public.benefits (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'ShieldCheck',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.benefits DISABLE ROW LEVEL SECURITY;

-- Seed initial data for benefits
INSERT INTO public.benefits (id, title, description, icon_name, order_index) VALUES
(1, 'Fast & Secure Platform', 'Enterprise-grade security protocols alongside multi-node fast delivery networks.', 'ShieldCheck', 0),
(2, 'High Email Deliverability', 'Engineered to bypass spam filters and land directly in user inboxes.', 'CheckCircle2', 1),
(3, 'Advanced Automation', 'Build intricate drip sequences and behavior-based automated emails.', 'Settings', 2),
(4, 'Affordable Solutions', 'Pay for what you send. Flexible packages crafted to scale with your budget.', 'Coins', 3),
(5, '24/7 Dedicated Support', 'A team of expert system admins is ready to assist you at any time of day.', 'PhoneCall', 4),
(6, 'Scalable Infrastructure', 'Elastic mail queues built to process millions of transactions without breaking.', 'Clock', 5)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.benefits', 'id'), COALESCE(max(id), 1)) FROM public.benefits;


-- 3. Stats Counter Table
CREATE TABLE IF NOT EXISTS public.stats (
    id SERIAL PRIMARY KEY,
    target_num INTEGER,
    suffix TEXT,
    target_text TEXT,
    label TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Mail',
    color TEXT NOT NULL DEFAULT 'from-primary to-accent',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stats DISABLE ROW LEVEL SECURITY;

-- Seed initial data for stats
INSERT INTO public.stats (id, target_num, suffix, target_text, label, icon_name, color, order_index) VALUES
(1, 10000, '+', NULL, 'Campaigns Sent', 'Mail', 'from-primary to-accent', 0),
(2, 5000, '+', NULL, 'Happy Clients', 'Users', 'from-secondary to-accent', 1),
(3, 99, '%', NULL, 'Delivery Success', 'ShieldCheck', 'from-highlight to-primary', 2),
(4, NULL, NULL, '24/7', 'Technical Support', 'Headphones', 'from-accent to-secondary', 3)
ON CONFLICT (id) DO UPDATE SET
    target_num = EXCLUDED.target_num,
    suffix = EXCLUDED.suffix,
    target_text = EXCLUDED.target_text,
    label = EXCLUDED.label,
    icon_name = EXCLUDED.icon_name,
    color = EXCLUDED.color,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.stats', 'id'), COALESCE(max(id), 1)) FROM public.stats;


-- 4. Testimonials / Client Stories Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    avatar TEXT NOT NULL DEFAULT 'S',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;

-- Seed initial data for testimonials
INSERT INTO public.testimonials (id, quote, author, role, rating, avatar, order_index) VALUES
(1, 'The SMTP relay from Isha Software is blazing fast! Our transactional receipts reach inboxes in seconds, and the real-time analytics are incredibly detailed.', 'Sarah Jenkins', 'CTO, CloudScale Tech', 5, 'S', 0),
(2, 'We increased our outbound campaign open rates by 45% using their Bulk Email service and custom templates. The automated sequences save us hours every week.', 'David Miller', 'Head of Marketing, RetailFlow', 5, 'D', 1),
(3, 'The Email Extractor tool is a lifesaver. We generated over 2,500 highly targeted B2B leads in less than a week, helping us kickstart our outreach campaigns.', 'Priya Sharma', 'Founder, ScaleUp Agency', 5, 'P', 2),
(4, 'Exceptional infrastructure and customer service. Whenever we had a scaling question, their support team was there to guide us 24/7.', 'Marcus Vane', 'Ops Director, Apex Logistics', 5, 'M', 3)
ON CONFLICT (id) DO UPDATE SET
    quote = EXCLUDED.quote,
    author = EXCLUDED.author,
    role = EXCLUDED.role,
    rating = EXCLUDED.rating,
    avatar = EXCLUDED.avatar,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.testimonials', 'id'), COALESCE(max(id), 1)) FROM public.testimonials;


-- 5. FAQ Accordion Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faqs DISABLE ROW LEVEL SECURITY;

-- Seed initial data for faqs
INSERT INTO public.faqs (id, question, answer, order_index) VALUES
(1, 'What is SMTP relay and how does it benefit my business?', 'An SMTP relay service routes your transactional and marketing emails through high-reputation servers instead of your local server. This prevents your messages from landing in the spam folder, ensures fast delivery, and provides detailed tracking logs for every sent message.', 0),
(2, 'How does the Email Extractor Tool gather B2B leads?', 'Our extractor scans public business listings and domain structures based on targeted search queries. It filters duplicates and non-work emails, outputting clean lead lists that you can export in CSV format for immediate outreach campaigns.', 1),
(3, 'Can I scale my email sending volume dynamically?', 'Absolutely. Our cloud-native SMTP infrastructure is highly scalable. You can start with thousands of emails and seamlessly scale to millions of monthly sends. Dedicated IP addresses are also available to protect your sending reputation.', 2),
(4, 'Is there support for building email templates?', 'Yes, our Bulk Email service includes an interactive email template builder. You can choose from pre-designed layouts or customize your own responsive emails that look premium and render perfectly across mobile, desktop, and tablet clients.', 3),
(5, 'Do you offer APIs for developer integrations?', 'Yes, we provide robust SMTP credentials as well as REST APIs and webhook support. Developers can integrate transactional email workflows, track bounce events, and receive delivery notifications programmatically in minutes.', 4)
ON CONFLICT (id) DO UPDATE SET
    question = EXCLUDED.question,
    answer = EXCLUDED.answer,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.faqs', 'id'), COALESCE(max(id), 1)) FROM public.faqs;


-- =========================================================================
-- PART 2: ABOUT PAGE SECTIONS
-- =========================================================================

-- 6. About Page Headers Table
CREATE TABLE IF NOT EXISTS public.about_page_headers (
    id SERIAL PRIMARY KEY,
    header_title TEXT NOT NULL DEFAULT 'Powering Smart Digital Outreach',
    header_description TEXT NOT NULL DEFAULT 'Isha Software Solutions delivers secure, high-reputation SMTP networks and marketing tools that help scaling companies talk to their clients.',
    intro_title TEXT NOT NULL DEFAULT 'Next-Generation Email Solutions Crafted for Scalability',
    intro_desc_1 TEXT NOT NULL,
    intro_desc_2 TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_headers DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_page_headers
INSERT INTO public.about_page_headers (id, header_title, header_description, intro_title, intro_desc_1, intro_desc_2)
VALUES (
    1,
    'Powering Smart Digital Outreach',
    'Isha Software Solutions delivers secure, high-reputation SMTP networks and marketing tools that help scaling companies talk to their clients.',
    'Next-Generation Email Solutions Crafted for Scalability',
    'Founded with the goal of breaking vendor lock-ins in the marketing automation space, Isha Software Solutions has grown into a premier provider of email systems for digital agencies, developers, and global brands.',
    'We design software that eliminates complex billing rules. By offering fixed-price and volume-based SMTP services alongside smart extractor and bulk template capabilities, we give businesses the freedom to build outbound campaigns their way.'
) ON CONFLICT (id) DO UPDATE SET
    header_title = EXCLUDED.header_title,
    header_description = EXCLUDED.header_description,
    intro_title = EXCLUDED.intro_title,
    intro_desc_1 = EXCLUDED.intro_desc_1,
    intro_desc_2 = EXCLUDED.intro_desc_2;


-- 7. About Page Core Ideals Table
CREATE TABLE IF NOT EXISTS public.about_page_ideals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_ideals DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_page_ideals
INSERT INTO public.about_page_ideals (id, title, description, order_index) VALUES
(1, 'Reputation First', 'We manage IP warm-ups and routing lists to keep sender reputation at peak.', 0),
(2, 'Developer Freedom', 'Fully compliant REST APIs and SMTP relays that fit in any codebase in minutes.', 1),
(3, 'Fair Pricing Structures', 'No penalties for having larger contact lists. Pay only for the messages you send.', 2)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.about_page_ideals', 'id'), COALESCE(max(id), 1)) FROM public.about_page_ideals;


-- 8. About Page Mission & Vision Table
CREATE TABLE IF NOT EXISTS public.about_page_mission_vision (
    id SERIAL PRIMARY KEY,
    mission_text TEXT NOT NULL,
    vision_text TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_mission_vision DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_page_mission_vision
INSERT INTO public.about_page_mission_vision (id, mission_text, vision_text)
VALUES (
    1,
    'To simplify high-volume digital mailing by delivering reliable, self-scalable SMTP relays and analytical campaign creators. We aim to maximize delivery rates while lowering billing barriers for expanding businesses.',
    'To stand as the leading global infrastructure network for automated and transactional email deliveries, ensuring that every startup and growing enterprise can send and track outreach with zero speed limits.'
) ON CONFLICT (id) DO UPDATE SET
    mission_text = EXCLUDED.mission_text,
    vision_text = EXCLUDED.vision_text;


-- 9. About Page Expertise Header & Cards Table
CREATE TABLE IF NOT EXISTS public.about_page_expertise (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Built by Mail System Experts',
    description TEXT NOT NULL DEFAULT 'Our engineers focus on the specialized routing systems required to maintain high inbox deliverability.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_expertise DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_page_expertise
INSERT INTO public.about_page_expertise (id, title, description)
VALUES (
    1,
    'Built by Mail System Experts',
    'Our engineers focus on the specialized routing systems required to maintain high inbox deliverability.'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;


CREATE TABLE IF NOT EXISTS public.about_page_expertise_cards (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_expertise_cards DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_page_expertise_cards
INSERT INTO public.about_page_expertise_cards (id, title, description, order_index) VALUES
(1, 'IP Reputation Management', 'We monitor blacklist states and manage automated IP warm-ups to ensure your sending blocks are recognized as legitimate by ISPs.', 0),
(2, 'API Delivery Pipelines', 'Our REST endpoints utilize distributed queuing arrays, meaning massive spikes in transactional requests are routed with zero message drops.', 1),
(3, 'Lead Extraction Filtration', 'Our advanced filters look for spam traps, catch-all servers, and inactive email structures, saving you from bounces and ISP blocks.', 2)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.about_page_expertise_cards', 'id'), COALESCE(max(id), 1)) FROM public.about_page_expertise_cards;


-- 10. About Page Success Nodes (Achievements) Table
CREATE TABLE IF NOT EXISTS public.about_page_achievements (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'MailCheck',
    color TEXT NOT NULL DEFAULT 'text-primary',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.about_page_achievements DISABLE ROW LEVEL SECURITY;

-- Seed initial data for about_page_achievements
INSERT INTO public.about_page_achievements (id, value, label, icon_name, color, order_index) VALUES
(1, '5B+', 'Emails Successfully Routed', 'MailCheck', 'text-primary', 0),
(2, '99.8%', 'Average Delivery Rate', 'ShieldCheck', 'text-highlight', 1),
(3, '120+', 'Dedicated Server Clusters', 'Trophy', 'text-secondary', 2),
(4, '10K+', 'Active Enterprise Clients', 'Users', 'text-accent', 3)
ON CONFLICT (id) DO UPDATE SET
    value = EXCLUDED.value,
    label = EXCLUDED.label,
    icon_name = EXCLUDED.icon_name,
    color = EXCLUDED.color,
    order_index = EXCLUDED.order_index;

SELECT setval(pg_get_serial_sequence('public.about_page_achievements', 'id'), COALESCE(max(id), 1)) FROM public.about_page_achievements;


-- =========================================================================
-- PART 3: ADMIN DYNAMIC CREDENTIALS
-- =========================================================================

-- 11. Admin Settings Table
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;

-- Seed initial admin email and password (can be updated via forgot password link)
INSERT INTO public.admin_settings (key, value)
VALUES 
    ('admin_email', 'palamakularaju@gmail.com'),
    ('admin_password', 'adminpass123')
ON CONFLICT (key) DO NOTHING;


-- =========================================================================
-- PART 4: EXISTING TABLES SCHEMA PATCHES
-- =========================================================================

-- Patch existing contact_info table to support social media links in footer and admin panel
ALTER TABLE public.contact_info ADD COLUMN IF NOT EXISTS social_visible BOOLEAN DEFAULT true;
ALTER TABLE public.contact_info ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '';
ALTER TABLE public.contact_info ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT '';
ALTER TABLE public.contact_info ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT '';
ALTER TABLE public.contact_info ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '';
