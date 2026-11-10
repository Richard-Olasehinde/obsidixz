/**
 * Single source of truth for the Obsidixz parent website.
 *
 * Every page, link, email address and business description is read from here so
 * that a change (for example a business destination moving to HTTPS) happens in
 * exactly one place.
 *
 * Facts in this file are limited to the approved parent-brand foundation:
 * no founding date, headcount, clients, awards, revenue or legal-entity claims.
 */

export const site = {
  name: 'Obsidixz',
  /** Used in <title> suffixes and the footer. */
  tagline: 'Parent organisation',
  /** Production origin — also set in astro.config.mjs `site`. */
  url: 'https://obsidixz.pp.ua',
  description:
    'Discover Obsidixz, the parent brand behind Obsidixz Real Estate, Obsidixz Commercial and Obsidixz Game Studio.',
  /** Approved organisational description. */
  descriptionLong:
    'Obsidixz is a parent organisation focused on building, developing and growing distinctive businesses across different markets.',
  mission:
    'To build and develop focused businesses that create meaningful value in the markets they serve.',
  vision:
    'To grow into a respected international organisation recognised for building distinctive, capable and enduring businesses.',
  /** The individual who operates the brand today. Identification, not a legal entity. */
  operator: 'Richard Oluwadunmininu Olasehinde',
  operatorNote:
    'Obsidixz is an unregistered business brand operated by Richard Oluwadunmininu Olasehinde from Nigeria.',
  locality: 'Nigeria',
  /** Shown in policy pages and the footer. */
  lastUpdated: '9 November 2026',
} as const;

export const emails = {
  general: 'obsidixz@outlook.com',
  realEstate: 'obsidixz.realestate@outlook.com',
  commercial: 'obsidixz.commercial@outlook.com',
} as const;

/** The exact general-purpose mailto required for the primary call to action. */
export const GENERAL_MAILTO =
  'mailto:obsidixz@outlook.com?subject=Obsidixz%20%E2%80%94%20Website%20enquiry';

export const mailto = (address: string, subject?: string) =>
  subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;

export type NavItem = { href: string; label: string; short: string };

export const primaryNav: NavItem[] = [
  { href: '/', label: 'Home', short: 'Home' },
  { href: '/about/', label: 'About', short: 'About' },
  { href: '/businesses/', label: 'Our Businesses', short: 'Businesses' },
  { href: '/contact/', label: 'Contact', short: 'Contact' },
];

export type Business = {
  id: string;
  index: string;
  name: string;
  /** One-line descriptor used in the hero index and footer. */
  kicker: string;
  summary: string;
  body: string[];
  facts: { term: string; detail: string }[];
  scope: string;
  /** Shorter wording used by the homepage business overview. */
  homeSummary?: string;
  /** One supporting line under the homepage summary. */
  homeNote?: string;
  url?: string;
  urlLabel?: string;
  email?: string;
  emailLabel?: string;
  cta?: { href: string; label: string };
};

export const businesses: Business[] = [
  {
    id: 'real-estate',
    index: '01',
    name: 'Obsidixz Real Estate',
    kicker: 'Property research',
    summary:
      'Manual, criteria-based property prospect and lead research for US residential real-estate investors and acquisition operators.',
    body: [
      'Work begins with the requirements agreed with the client — market, budget band, property type and the criteria that matter to them. Available property information is then reviewed by hand and organised against those requirements.',
      'The result is a structured research deliverable: prospects and leads the client can review, rather than a promise of outcomes in the market.',
    ],
    facts: [
      { term: 'Prepared for', detail: 'US residential investors and acquisition operators' },
      { term: 'Method', detail: 'Manual, criteria-based property research' },
      { term: 'Deliverable', detail: 'Structured prospect and lead research' },
    ],
    scope:
      'Research only. Obsidixz Real Estate is not a brokerage, estate-management service, property seller, investment fund or listings marketplace, and does not promise available property or profitable opportunities.',
    homeSummary:
      'Manual property prospect and lead research for US residential real-estate investors and acquisition operators.',
    homeNote: 'Prepared against the market, budget and property criteria agreed with the client.',
    url: 'https://realestate.obsidixz.pp.ua/',
    urlLabel: 'Visit Obsidixz Real Estate',
    email: emails.realEstate,
    emailLabel: 'Email Obsidixz Real Estate',
  },
  {
    id: 'commercial',
    index: '02',
    name: 'Obsidixz Commercial',
    kicker: 'Procurement intelligence',
    summary:
      'International B2B procurement intelligence and sourcing support, with Supplier Discovery as its flagship service.',
    body: [
      'Supplier Discovery begins with packaging as its initial focus. Work is structured around supplier research and comparison: the sources found, the uncertainties that remain, and what a client should enquire about next.',
      'Every project receives an individually tailored quotation. There is no fixed package to buy from a webpage.',
    ],
    facts: [
      { term: 'Prepared for', detail: 'B2B buyers sourcing internationally' },
      { term: 'Flagship service', detail: 'Supplier Discovery, initially focused on packaging' },
      { term: 'Method', detail: 'Structured supplier research and comparison' },
    ],
    scope:
      'Research and sourcing support only. It does not include supplier verification, physical inspection, negotiation, purchasing authority, logistics or any guarantee of supplier performance.',
    homeSummary:
      'Supplier research and procurement intelligence for businesses sourcing internationally, with packaging as the initial focus.',
    homeNote: 'Quoted individually per project — there is no fixed package to buy from a page.',
    // HTTPS confirmed live on 10 November 2026 (HTTP now redirects to it).
    url: 'https://commercial.obsidixz.pp.ua/',
    urlLabel: 'Visit Obsidixz Commercial',
    email: emails.commercial,
    emailLabel: 'Email Obsidixz Commercial',
  },
  {
    id: 'game-studio',
    index: '03',
    name: 'Obsidixz Game Studio',
    kicker: 'Games',
    summary:
      'The games-focused business within Obsidixz. Word Quest is its current identified game project.',
    body: [
      'Word Quest is developed by Obsidixz Game Studio and carries its own product identity. The studio’s website is still to come.',
    ],
    facts: [
      { term: 'Focus', detail: 'Games development' },
      { term: 'Current project', detail: 'Word Quest' },
      { term: 'Studio website', detail: 'To follow — not yet published' },
    ],
    scope:
      'There is no public studio site, release date or store listing at present. Game Studio enquiries can be sent to the general Obsidixz inbox.',
  },
];

export const businessById = (id: string) => {
  const found = businesses.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown business: ${id}`);
  return found;
};

export type Value = { name: string; detail: string };

export const values: Value[] = [
  { name: 'Integrity', detail: 'Say what is true about the work, including its limits.' },
  { name: 'Excellence', detail: 'Care about the detail a client will actually notice.' },
  { name: 'Innovation', detail: 'Look for a better method, not novelty for its own sake.' },
  {
    name: 'Responsibility',
    detail: 'Treat information, money and trust as things held on behalf of others.',
  },
  { name: 'Adaptability', detail: 'Change the approach when the market says it is wrong.' },
  { name: 'Long-term thinking', detail: 'Build for the business that exists in five years.' },
];

export const footerLegal = [
  { href: '/privacy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Website Terms' },
];

/** Copy used by the shared email-helper blocks. */
export const emailCopy = {
  opensApp:
    'This opens your email application. Write your message and send it there. If nothing opens, copy the address into your preferred email service.',
  copied: 'Email address copied',
  copyFailed: 'Copy unavailable. Select and copy the email address above.',
  sensitive:
    'Please do not include banking credentials, identity documents or other sensitive information in an initial enquiry.',
} as const;
