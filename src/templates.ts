import { Section, SiteTheme } from './types';

export const COLOR_THEMES: SiteTheme[] = [
  {
    id: 'nordic',
    name: 'Nordic Slate',
    primary: '#1E293B',
    secondary: '#475569',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    accent: '#3B82F6',
    border: '#E2E8F0',
    fontFamily: 'sans'
  },
  {
    id: 'editorial',
    name: 'Editorial Cream',
    primary: '#1A1A1A',
    secondary: '#5E514D',
    background: '#FAF6F0',
    surface: '#FFFDFC',
    text: '#222222',
    accent: '#9A3412',
    border: '#E6DFD5',
    fontFamily: 'serif'
  },
  {
    id: 'cyberpunk',
    name: 'Terminal Mono',
    primary: '#00FF66',
    secondary: '#888888',
    background: '#040707',
    surface: '#0B0F0F',
    text: '#E2E8F0',
    accent: '#00FF66',
    border: '#1E2922',
    fontFamily: 'mono'
  },
  {
    id: 'lavender',
    name: 'Lavender Dusk',
    primary: '#4F46E5',
    secondary: '#7C3AED',
    background: '#FAF5FF',
    surface: '#FFFFFF',
    text: '#1E1B4B',
    accent: '#D946EF',
    border: '#F3E8FF',
    fontFamily: 'display'
  },
  {
    id: 'terracotta',
    name: 'Warm Earth',
    primary: '#7C2D12',
    secondary: '#9A3412',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    text: '#3C1E0A',
    accent: '#D97706',
    border: '#FED7AA',
    fontFamily: 'serif'
  }
];

export const STOCK_IMAGES = [
  {
    category: 'Technology & Work',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    description: 'Dev Workspace'
  },
  {
    category: 'Technology & Work',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    description: 'Tech Grid'
  },
  {
    category: 'Technology & Work',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    description: 'Team Collaboration'
  },
  {
    category: 'Food & Dining',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh Pastry Pizza'
  },
  {
    category: 'Food & Dining',
    url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
    description: 'Morning Coffee Setup'
  },
  {
    category: 'Minimal & Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Modern Architectural Lines'
  }
];

export const TEMPLATES: { id: string; name: string; description: string; sections: Section[] }[] = [
  {
    id: 'mmloqz-website-theme-layout',
    name: '🌟 MMLOQZ-WEBSITE-THEME-LAYOUT',
    description: 'Master MMLoqz Theme Layout with Green Hero Banner, Danish lock description, 4 bullet points, products collage, and custom header/footer. Apply to any page.',
    sections: [
      {
        id: 'fresh-webpage-section',
        name: '💚 Fresh Responsive Webpage (Clone)',
        fullWidth: true,
        paddingY: 'none',
        columns: [],
        tabletOverrides: { paddingY: 'none', fullWidth: true },
        mobileOverrides: { paddingY: 'none', fullWidth: true }
      }
    ]
  },
  {
    id: 'mmloqz-brand-pdf',
    name: '💚 MMLoqz PDF Brand Layout',
    description: 'Official MMLoqz brand layout matching PDF designs: Green launch hero, Danish lock description, 4 bullet points, products collage, and footer.',
    sections: [
      {
        id: 'mmloqz-nav-sec-tpl',
        name: 'Header & Navigation',
        fullWidth: true,
        paddingY: 'sm',
        columns: [
          {
            id: 'col-mmloqz-logo-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'mmloqz-logo-img-tpl',
                type: 'image',
                content: '/images/logo.png',
                style: { height: '64px', width: 'auto', objectFit: 'contain' }
              }
            ]
          },
          {
            id: 'col-mmloqz-navlinks-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'mmloqz-nav-text-tpl',
                type: 'text',
                content: 'Home         Contact us',
                style: { fontSize: '18px', fontWeight: '700', color: '#16a34a', textAlign: 'right' }
              }
            ]
          }
        ]
      },
      {
        id: 'mmloqz-green-hero-tpl',
        name: 'Green Hero Banner',
        fullWidth: true,
        paddingY: 'lg',
        bgColor: '#15803d',
        columns: [
          {
            id: 'col-hero-text-green-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'hero-sub-tpl',
                type: 'text',
                content: 'SOON WE ARE',
                style: { fontSize: '32px', fontWeight: '300', color: '#ffffff', letterSpacing: '0.05em', marginBottom: '8px' }
              },
              {
                id: 'hero-title-1-tpl',
                type: 'heading',
                content: 'LAUNCHING',
                style: { fontSize: '56px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', marginBottom: '4px' }
              },
              {
                id: 'hero-title-2-tpl',
                type: 'heading',
                content: 'OUR NEW BRAND SITE',
                style: { fontSize: '42px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1' }
              }
            ]
          },
          {
            id: 'col-hero-img-green-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'hero-lock-img-tpl',
                type: 'image',
                content: '/images/Hero.webp',
                style: { width: '80%', margin: '0 auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', transform: 'rotate(25deg)' }
              }
            ]
          }
        ]
      },
      {
        id: 'mmloqz-features-grid-sec-tpl',
        name: '3-Column Features Grid',
        fullWidth: false,
        paddingY: 'lg',
        bgColor: '#ffffff',
        columns: [
          {
            id: 'col-feat-1-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'feat-1-title-tpl',
                type: 'heading',
                content: '🔑 Keyless Remote Access',
                style: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }
              },
              {
                id: 'feat-1-desc-tpl',
                type: 'text',
                content: 'Always have instant access to your door or invite new users remotely without needing physical keys.',
                style: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' }
              }
            ]
          },
          {
            id: 'col-feat-2-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'feat-2-title-tpl',
                type: 'heading',
                content: '📱 Simple Mobile App',
                style: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }
              },
              {
                id: 'feat-2-desc-tpl',
                type: 'text',
                content: 'Total control over door permissions with unlimited users and real-time activity tracking in our mobile app.',
                style: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' }
              }
            ]
          },
          {
            id: 'col-feat-3-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'feat-3-title-tpl',
                type: 'heading',
                content: '⚡ No Subscription Fees',
                style: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }
              },
              {
                id: 'feat-3-desc-tpl',
                type: 'text',
                content: 'Fixed low prices with zero mandatory monthly subscription fees for standard battery-driven digital lock usage.',
                style: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' }
              }
            ]
          }
        ]
      },
      {
        id: 'mmloqz-content-sec-tpl',
        name: 'Brand Content & Products Collage',
        fullWidth: false,
        paddingY: 'lg',
        columns: [
          {
            id: 'col-content-text-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'content-main-title-tpl',
                type: 'heading',
                content: 'High quality digital locks and components',
                style: { fontSize: '26px', fontWeight: '700', color: '#111827', marginBottom: '20px' }
              },
              {
                id: 'content-p1-tpl',
                type: 'text',
                content: 'MMLoqz is a Danish company that manuface a series of quality digital locks and products that interacts with our digital locks. We ensure that safety goes hand in hand with making life easier and ensure only the right people have abscess to the door. At the same time we fokus to make high quality digital locks and components available to everyone, at fixed low prices without subscriptions fees for the standard use of the locks.',
                style: { fontSize: '15px', color: '#374151', lineHeight: '1.7', marginBottom: '16px' }
              },
              {
                id: 'content-p2-tpl',
                type: 'text',
                content: 'Therefor you will find our products being sold online from our resellers but with an option for having the installation done by a professional services engineer onsite our via a video installation. At MMLoqz.com we also make installation guides available online, so that it is simple for our endusers to install battery driven digital locks. Our enduser',
                style: { fontSize: '15px', color: '#374151', lineHeight: '1.7', marginBottom: '20px' }
              },
              {
                id: 'bullet-1-tpl',
                type: 'text',
                content: '•  Always have access to the door or make in possilbe to invite new users to the door. This can even be done remotely.',
                style: { fontSize: '15px', color: '#374151', fontWeight: '500', marginBottom: '10px' }
              },
              {
                id: 'bullet-2-tpl',
                type: 'text',
                content: '•  Have total control over who has access to the doors and can change this using our simple APP.',
                style: { fontSize: '15px', color: '#374151', fontWeight: '500', marginBottom: '10px' }
              },
              {
                id: 'bullet-3-tpl',
                type: 'text',
                content: '•  No limits on the number of APP users in our APP.',
                style: { fontSize: '15px', color: '#374151', fontWeight: '500', marginBottom: '10px' }
              },
              {
                id: 'bullet-4-tpl',
                type: 'text',
                content: '•  Resellers who can support them.',
                style: { fontSize: '15px', color: '#374151', fontWeight: '500', marginBottom: '20px' }
              },
              {
                id: 'closing-statement-tpl',
                type: 'heading',
                content: 'MMLoqz makes digital locks easy to use and to install!',
                style: { fontSize: '18px', fontWeight: '600', color: '#374151', marginTop: '16px' }
              }
            ]
          },
          {
            id: 'col-content-collage-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'collage-image-tpl',
                type: 'image',
                content: '/images/MMloqz%20products%20image.webp',
                style: { width: '100%', objectFit: 'contain' }
              }
            ]
          }
        ]
      },
      {
        id: 'mmloqz-footer-sec-tpl',
        name: 'MMLoqz Footer',
        fullWidth: false,
        paddingY: 'md',
        columns: [
          {
            id: 'col-foot-brand-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'foot-logo-img-tpl',
                type: 'image',
                content: '/images/logo.png',
                style: { height: '64px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }
              },
              {
                id: 'foot-sub-tpl',
                type: 'text',
                content: 'MMLoqz High quality products',
                style: { fontSize: '14px', color: '#111827', fontWeight: '600' }
              }
            ]
          },
          {
            id: 'col-foot-addr-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'foot-title-addr-tpl',
                type: 'heading',
                content: 'Adresse',
                style: { fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }
              },
              {
                id: 'foot-text-addr-tpl',
                type: 'text',
                content: 'Kulvej 10, 2 TV\n2450 København\nDenmark',
                style: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }
              }
            ]
          },
          {
            id: 'col-foot-info-tpl',
            width: 'md:flex-1',
            elements: [
              {
                id: 'foot-title-info-tpl',
                type: 'heading',
                content: 'Information',
                style: { fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }
              },
              {
                id: 'foot-text-info-tpl',
                type: 'text',
                content: 'info@mmlasesmed.dk\n+45 31 11 11 15',
                style: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'portfolio',
    name: '1. Home Creative Workspace',
    description: 'Rich home landing containing 5 horizontal section tiers (11 total fields) with clean spacing parameters.',
    sections: [
      {
        id: 'home-nav',
        name: 'Header Navigation',
        layout: 'two-col',
        paddingY: 'sm',
        backgroundColor: 'bg-transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'home-nav-c1',
            width: 'md:w-1/3',
            elements: [
              {
                id: 'home-nav-logo',
                type: 'text',
                content: 'STUDIO.ARCH',
                styles: {
                  fontSize: '20px',
                  fontWeight: '800',
                  letterSpacing: '2px',
                  lineHeight: '1.2'
                }
              }
            ]
          },
          {
            id: 'home-nav-c2',
            width: 'md:w-2/3',
            elements: [
              {
                id: 'home-nav-menu',
                type: 'text',
                content: 'Work   •   Services   •   Contact Us',
                styles: {
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'right',
                  color: '#475569',
                  wordSpacing: '6px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'home-hero',
        name: 'Hero Showcase Banner',
        layout: 'two-col',
        paddingY: 'lg',
        backgroundColor: 'bg-transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'home-hero-col1',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'home-hero-title',
                type: 'text',
                content: 'We craft structures with purposeful intent.',
                styles: {
                  fontSize: '44px',
                  fontWeight: '800',
                  lineHeight: '1.15',
                  marginBottom: '16px'
                }
              },
              {
                id: 'home-hero-desc',
                type: 'text',
                content: 'Copenhagen based visual design studio. We integrate high craftsmanship, light density, and architectural honesty directly into public and private spaces.',
                styles: {
                  fontSize: '15px',
                  color: '#475569',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }
              },
              {
                id: 'home-hero-button',
                type: 'button',
                content: 'Browse Interactive Showcases',
                link: '#',
                styles: {
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  paddingTop: '0.66em',
                  paddingBottom: '0.66em',
                  paddingLeft: '1.46em',
                  paddingRight: '1.46em',
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF'
                }
              }
            ]
          },
          {
            id: 'home-hero-col2',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'home-hero-img',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                alt: 'Modern Architecture',
                styles: {
                  borderRadius: '12px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'home-subtext',
        name: 'Philosophy Quote',
        layout: 'single-col',
        paddingY: 'md',
        backgroundColor: 'bg-transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'home-sub-col1',
            width: 'w-full',
            elements: [
              {
                id: 'home-philosophy-quote',
                type: 'text',
                content: '"Simplicity is not the lack of clutter, but the presence of clarity."',
                styles: {
                  fontSize: '22px',
                  fontWeight: '500',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  color: '#334155',
                  marginBottom: '8px'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bistro',
    name: '2. Artisanal Pastry Bistro',
    description: 'Cozy bakery menu template. Highlighted by split layouts and detailed list descriptions (7 total fields).',
    sections: [
      {
        id: 'bistro-top',
        name: 'Bistro Brand Identity',
        layout: 'single-col',
        paddingY: 'md',
        backgroundColor: 'transparent',
        textColor: '#3C1E0A',
        columns: [
          {
            id: 'bistro-top-col',
            width: 'w-full',
            elements: [
              {
                id: 'bistro-brand-logo',
                type: 'text',
                content: '🥐 MÈRE ROCHELLE BAKERY',
                styles: {
                  fontSize: '24px',
                  fontWeight: '800',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  marginBottom: '4px'
                }
              },
              {
                id: 'bistro-brand-tagline',
                type: 'text',
                content: 'PARISIAN TRADITIONS • ENTIRELY ORGANIC INGREDIENTS',
                styles: {
                  fontSize: '11px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#9A3412',
                  letterSpacing: '3px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'bistro-grid',
        name: 'Double-Column Highlights',
        layout: 'two-col',
        paddingY: 'md',
        backgroundColor: '#FFF7ED',
        textColor: '#3C1E0A',
        columns: [
          {
            id: 'bistro-grid-l',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'bistro-item1-title',
                type: 'text',
                content: '01 / Sourdough Baguette ($6.50)',
                styles: {
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '6px'
                }
              },
              {
                id: 'bistro-item1-desc',
                type: 'text',
                content: 'Fermented for a slow 36 hours for crisp, dark crust and highly hydrated internal texture.',
                styles: {
                  fontSize: '13px',
                  color: '#5E514D',
                  marginBottom: '16px'
                }
              }
            ]
          },
          {
            id: 'bistro-grid-r',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'bistro-item2-title',
                type: 'text',
                content: '02 / Golden Honey Croissant ($4.75)',
                styles: {
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '6px'
                }
              },
              {
                id: 'bistro-item2-desc',
                type: 'text',
                content: 'Hand-rolled butter layers using high-fat grade milk and local wild blackberry glaze.',
                styles: {
                  fontSize: '13px',
                  color: '#5E514D',
                  marginBottom: '16px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'bistro-cta',
        name: 'Action Button Section',
        layout: 'single-col',
        paddingY: 'sm',
        backgroundColor: 'transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'b-cta-col1',
            width: 'w-full',
            elements: [
              {
                id: 'b-cta-btn',
                type: 'button',
                content: 'Reserve Fresh Morning Basket',
                link: '#',
                styles: {
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '700',
                  paddingTop: '0.66em',
                  paddingBottom: '0.66em',
                  paddingLeft: '1.86em',
                  paddingRight: '1.86em',
                  backgroundColor: '#7C2D12',
                  color: '#FFFFFF',
                  textAlign: 'center'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'saas',
    name: '3. Technical SaaS Cloud Page',
    description: 'Technical page presenting 4 layout structures with features, divider indicators, and high densities (8 total fields).',
    sections: [
      {
        id: 'saas-hero',
        name: 'Action Header',
        layout: 'single-col',
        paddingY: 'lg',
        backgroundColor: 'bg-transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'saas-hero-col',
            width: 'w-full',
            elements: [
              {
                id: 'saas-badge',
                type: 'text',
                content: 'INTRODUCING PLATFORM v2.8',
                styles: {
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#4F46E5',
                  letterSpacing: '2px',
                  textAlign: 'center',
                  marginBottom: '12px'
                }
              },
              {
                id: 'saas-title',
                type: 'text',
                content: 'Fast database queries with zero configuration operations.',
                styles: {
                  fontSize: '36px',
                  fontWeight: '800',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  marginBottom: '16px'
                }
              },
              {
                id: 'saas-btn',
                type: 'button',
                content: 'Create Free Account',
                link: '#',
                styles: {
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  paddingTop: '0.66em',
                  paddingBottom: '0.66em',
                  paddingLeft: '1.3em',
                  paddingRight: '1.3em',
                  textAlign: 'center'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'saas-divider-sec',
        name: 'Structural Line Separator',
        layout: 'single-col',
        paddingY: 'sm',
        backgroundColor: 'transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'saas-div-col',
            width: 'w-full',
            elements: [
              {
                id: 'saas-line',
                type: 'divider',
                content: '',
                styles: {
                  borderColor: '#E2E8F0',
                  marginTop: '12px',
                  marginBottom: '12px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'saas-grid',
        name: 'Dual Key Metrics',
        layout: 'two-col',
        paddingY: 'md',
        backgroundColor: 'transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'saas-grid-col1',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'saas-val1',
                type: 'text',
                content: '99.997%',
                styles: {
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#4F46E5',
                  marginBottom: '4px'
                }
              },
              {
                id: 'saas-desc1',
                type: 'text',
                content: 'Guaranteed latency isolation on our local multi-region server shards routing clusters.',
                styles: {
                  fontSize: '13px',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'saas-grid-col2',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'saas-val2',
                type: 'text',
                content: '< 15ms',
                styles: {
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#7C3AED',
                  marginBottom: '4px'
                }
              },
              {
                id: 'saas-desc2',
                type: 'text',
                content: 'Global round-trip database queries response, cache synchronized with your local application memory.',
                styles: {
                  fontSize: '13px',
                  color: '#64748B'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'about',
    name: '4. Creative Team Profiles & About',
    description: 'About us page blueprint focusing on company bio and workspace images (6 fields).',
    sections: [
      {
        id: 'about-heading-s',
        name: 'General Header Title',
        layout: 'single-col',
        paddingY: 'md',
        backgroundColor: 'transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'about-head-c',
            width: 'w-full',
            elements: [
              {
                id: 'about-title-field',
                type: 'text',
                content: 'Meet the curators of modern architectural space.',
                styles: {
                  fontSize: '32px',
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: '8px'
                }
              },
              {
                id: 'about-sub-field',
                type: 'text',
                content: 'We are designers, artisans and builders working inside a unified Danish workspace.',
                styles: {
                  fontSize: '15px',
                  color: '#5E514D',
                  textAlign: 'center'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'about-bio-s',
        name: 'Workspace Picture & Story',
        layout: 'two-col',
        paddingY: 'md',
        backgroundColor: '#FAF6F0',
        textColor: '#222222',
        columns: [
          {
            id: 'abt-col1',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'abt-photo',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                alt: 'Our Workspace Collaboration',
                styles: {
                  borderRadius: '12px'
                }
              }
            ]
          },
          {
            id: 'abt-col2',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'abt-story',
                type: 'text',
                content: 'Our Collaborative Journey',
                styles: {
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }
              },
              {
                id: 'abt-bio-desc',
                type: 'text',
                content: 'Founded in Copenhagen in 2014, our workshop serves as a fertile testing ground for sustainable clay building blocks, zero-emission glue laminations, and daylight optimization research schemes.',
                styles: {
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#5E514D'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'terms',
    name: '5. Technical SLA Policy & Terms',
    description: 'Clean double vertical segment representing standard textual policy parameters (3 text fields).',
    sections: [
      {
        id: 'terms-sec-1',
        name: 'Minimal General Header',
        layout: 'single-col',
        paddingY: 'md',
        backgroundColor: 'transparent',
        textColor: 'text-default',
        columns: [
          {
            id: 'terms1-c',
            width: 'w-full',
            elements: [
              {
                id: 'terms-title-block',
                type: 'text',
                content: 'Standard License Agreement / Policy',
                styles: {
                  fontSize: '32px',
                  fontWeight: '800',
                  marginBottom: '6px'
                }
              },
              {
                id: 'terms-date-block',
                type: 'text',
                content: 'Last modified: June 15, 2026',
                styles: {
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#64748B'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'terms-sec-2',
        name: 'Detailed Legal Prose',
        layout: 'single-col',
        paddingY: 'md',
        backgroundColor: '#FFFFFF',
        textColor: 'text-default',
        columns: [
          {
            id: 'terms2-c',
            width: 'w-full',
            elements: [
              {
                id: 'terms-prose',
                type: 'text',
                content: 'By accessing this platform database and sync module, you acknowledge that all visual components, CSS configurations, and JSON-based sections are stored securely inside your Python Django model server.\n\nAll exported files are royalty-free and available for full production distribution without prior authorization constraints.',
                styles: {
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#334155'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'locksmith',
    name: '6. MM Låsesmed Copenhagen',
    description: 'Professional locksmith landing containing emergency dialer hero banner, quick service categorizations, quality badges, pricing table lists, and email newsletter subscription form.',
    sections: [
      {
        id: 'locksmith-hero',
        name: 'Hero Emergency Banner',
        layout: 'single-col',
        paddingY: 'none',
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
        fullWidth: true,
        columns: [
          {
            id: 'locksmith-hero-col',
            width: 'w-full',
            elements: [
              {
                id: 'locksmith-hero-banner',
                type: 'image-banner',
                content: '',
                src: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
                overlayPosition: 'center',
                overlayBgColor: '#000000',
                overlayBgOpacity: 35,
                styles: {
                  borderRadius: '0px',
                  marginTop: '0px',
                  marginBottom: '0px'
                },
                overlays: [
                  {
                    id: 'locksmith-logo',
                    type: 'logo',
                    content: '🔑 MM LÅSESMED',
                    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
                    styles: {
                      fontSize: '32px',
                      width: '60px',
                      borderRadius: '8px'
                    }
                  },
                  {
                    id: 'locksmith-nav-dropdowns',
                    type: 'dropdown-menu',
                    content: 'Erhverv,Privat,Boligforeninger,Karriere,Om os',
                    styles: {
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#ffffff'
                    }
                  },
                  {
                    id: 'locksmith-hero-h',
                    type: 'text',
                    content: 'Låseservice af låsesmed på KØBENHAVN.',
                    styles: {
                      fontSize: '36px',
                      fontWeight: '800',
                      textAlign: 'center',
                      marginBottom: '16px',
                      color: '#ffffff'
                    }
                  },
                  {
                    id: 'locksmith-hero-btn',
                    type: 'button',
                    content: '31 11 11 15\nDØGNTELEFON',
                    link: 'tel:31111115',
                    styles: {
                      fontSize: '15px',
                      fontWeight: '700',
                      textAlign: 'center',
                      color: '#ffffff',
                      backgroundColor: 'transparent',
                      borderColor: '#ffffff',
                      borderWidth: '2px',
                      borderRadius: '9999px',
                      paddingTop: '0.75em',
                      paddingBottom: '0.75em',
                      paddingLeft: '2.5em',
                      paddingRight: '2.5em',
                      marginBottom: '8px'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-quick-menu',
        name: 'Quick Services Bar',
        layout: 'custom',
        paddingY: 'sm',
        backgroundColor: '#1e293b',
        textColor: '#ffffff',
        columns: [
          {
            id: 'locksmith-quick-c1',
            width: 'md:w-1/4',
            elements: [
              {
                id: 'locksmith-quick-img1',
                type: 'image',
                content: '',
                src: '',
                styles: {
                  borderRadius: '9999px',
                  marginTop: '0px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-quick-t1',
                type: 'text',
                content: 'Privat',
                styles: {
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center'
                }
              }
            ]
          },
          {
            id: 'locksmith-quick-c2',
            width: 'md:w-1/4',
            elements: [
              {
                id: 'locksmith-quick-img2',
                type: 'image',
                content: '',
                src: '',
                styles: {
                  borderRadius: '9999px',
                  marginTop: '0px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-quick-t2',
                type: 'text',
                content: 'Erhverv',
                styles: {
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center'
                }
              }
            ]
          },
          {
            id: 'locksmith-quick-c3',
            width: 'md:w-1/4',
            elements: [
              {
                id: 'locksmith-quick-img3',
                type: 'image',
                content: '',
                src: '',
                styles: {
                  borderRadius: '9999px',
                  marginTop: '0px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-quick-t3',
                type: 'text',
                content: 'Foreninger',
                styles: {
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center'
                }
              }
            ]
          },
          {
            id: 'locksmith-quick-c4',
            width: 'md:w-1/4',
            elements: [
              {
                id: 'locksmith-quick-img4',
                type: 'image',
                content: '',
                src: '',
                styles: {
                  borderRadius: '9999px',
                  marginTop: '0px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-quick-t4',
                type: 'text',
                content: 'Indbrudssikring',
                styles: {
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-services',
        name: 'Services Badges',
        layout: 'three-col',
        paddingY: 'md',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        columns: [
          {
            id: 'locksmith-srv-c1',
            width: 'md:w-1/3',
            elements: [
              {
                id: 'locksmith-srv-img1',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
                styles: {
                  borderRadius: '9999px',
                  width: '100px',
                  height: '100px',
                  marginTop: '8px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-srv-t1',
                type: 'text',
                content: '⚡ Vi kan være der inden for ca. 30 min',
                styles: {
                  fontSize: '14px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1e293b'
                }
              }
            ]
          },
          {
            id: 'locksmith-srv-c2',
            width: 'md:w-1/3',
            elements: [
              {
                id: 'locksmith-srv-img2',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
                styles: {
                  borderRadius: '9999px',
                  width: '100px',
                  height: '100px',
                  marginTop: '8px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-srv-t2',
                type: 'text',
                content: '🏆 Vi bruger altid kvalitetsprodukter',
                styles: {
                  fontSize: '14px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1e293b'
                }
              }
            ]
          },
          {
            id: 'locksmith-srv-c3',
            width: 'md:w-1/3',
            elements: [
              {
                id: 'locksmith-srv-img3',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
                styles: {
                  borderRadius: '9999px',
                  width: '100px',
                  height: '100px',
                  marginTop: '8px',
                  marginBottom: '8px'
                }
              },
              {
                id: 'locksmith-srv-t3',
                type: 'text',
                content: '👮 Alle ansatte har en ren straffeattest',
                styles: {
                  fontSize: '14px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1e293b'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-intro',
        name: 'Google Rating & Intro',
        layout: 'two-col',
        paddingY: 'md',
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        columns: [
          {
            id: 'locksmith-intro-c1',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'locksmith-rating-title',
                type: 'text',
                content: 'Bedømmelser på Google',
                styles: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#64748B',
                  textAlign: 'center'
                }
              },
              {
                id: 'locksmith-rating-stars',
                type: 'text',
                content: '4.6 ⭐⭐⭐⭐⭐',
                styles: {
                  fontSize: '44px',
                  fontWeight: '800',
                  color: '#f59e0b',
                  textAlign: 'center',
                  marginTop: '10px',
                  marginBottom: '10px'
                }
              },
              {
                id: 'locksmith-rating-count',
                type: 'text',
                content: '60 Anmeldelser på Google MyBusiness',
                styles: {
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#64748B',
                  textAlign: 'center'
                }
              }
            ]
          },
          {
            id: 'locksmith-intro-c2',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'locksmith-intro-h',
                type: 'text',
                content: 'Din låsesmed i København & Storkøbenhavn',
                styles: {
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '12px'
                }
              },
              {
                id: 'locksmith-intro-p',
                type: 'text',
                content: 'Er du låst ude af din bolig eller kontor? MM Låsesmed er din låsesmed til akut låseservice i København samt resten af Storkøbenhavn, Nordsjælland og Amager. Vi kører i alle hverdage samt i weekenden.\n\nHos MM Låsesmed er du sikker på at få hurtig service, uanset om du befinder dig i Valby, Hvidovre, Hellerup eller en af de eftertragtede adresser.',
                styles: {
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#334155'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-pricing-sec',
        name: 'Pricing List',
        layout: 'two-col',
        paddingY: 'md',
        backgroundColor: '#eff6ff',
        textColor: '#1e3a8a',
        columns: [
          {
            id: 'locksmith-price-c1',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'locksmith-price-h',
                type: 'text',
                content: 'Priser på låseservice per påbegyndt time',
                styles: {
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#1e3a8a',
                  marginBottom: '12px'
                }
              },
              {
                id: 'locksmith-price-bullets',
                type: 'text',
                content: '• Akut låseservice dagtimer (8-20): 850 DKK inkl. moms\n• Akut låseservice aftentimer (20-8): 1350 DKK inkl. moms\n• Tillæg på helligdage samt lørdag - mandag: 500 DKK inkl. moms\n• BEMÆRK: Materialer og parkering er ikke inkl. i prisen.\n• Kørselsgebyr på 500 DKK ved afbestilling efter 5 minutter.',
                styles: {
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: '#1e293b'
                }
              }
            ]
          },
          {
            id: 'locksmith-price-c2',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'locksmith-price-vector',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
                styles: {
                  borderRadius: '12px',
                  marginTop: '8px',
                  marginBottom: '8px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-emergency-sec',
        name: 'Emergency & Emergency Assistance',
        layout: 'two-col',
        paddingY: 'md',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        columns: [
          {
            id: 'locksmith-emerg-c1',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'locksmith-emerg-pic',
                type: 'image',
                content: '',
                src: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=600&q=80',
                styles: {
                  borderRadius: '12px',
                  marginTop: '8px',
                  marginBottom: '8px'
                }
              }
            ]
          },
          {
            id: 'locksmith-emerg-c2',
            width: 'md:w-1/2',
            elements: [
              {
                id: 'locksmith-emerg-h',
                type: 'text',
                content: 'Akut låsesmed til alt slags låseservice',
                styles: {
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '10px'
                }
              },
              {
                id: 'locksmith-emerg-bullets',
                type: 'text',
                content: 'Hvis du har været så uheldig at låse dig ude af din bolig, eller har behov for hjælp af en låsesmed af anden årsag, så tøv ikke med at kontakte os. Vores låsesmede har mange års erfaring og leverer et kompetent og professionelt stykke arbejde.',
                styles: {
                  fontSize: '13px',
                  lineHeight: '1.7',
                  color: '#334155'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-newsletter-sec',
        name: 'Newsletter Subscription',
        layout: 'single-col',
        paddingY: 'none',
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
        fullWidth: true,
        columns: [
          {
            id: 'locksmith-news-col',
            width: 'w-full',
            elements: [
              {
                id: 'locksmith-news-banner',
                type: 'image-banner',
                content: '',
                src: 'https://images.unsplash.com/photo-1516216621174-bfa2196cfc02?auto=format&fit=crop&w=1200&q=80',
                overlayTitle: 'Tilmeld dig vores nyhedsbrev og modtage tilbud',
                overlaySubtext: 'Få ugentlige sikkerhedstips og eksklusive rabatter direkte i din indbakke.',
                overlayPosition: 'center',
                showButton: false,
                showOverlayButton: false,
                showSearchBox: true,
                showOverlaySearch: true,
                overlaySearchPlaceholder: 'Indtast din e-mail adresse...',
                overlaySearchButtonText: 'Tilmeld dig',
                overlayBgColor: '#000000',
                overlayBgOpacity: 0,
                styles: {
                  borderRadius: '0px',
                  marginTop: '0px',
                  marginBottom: '0px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'locksmith-foot',
        name: 'Footer',
        layout: 'custom',
        paddingY: 'md',
        backgroundColor: '#ffffff',
        textColor: '#64748B',
        columns: [
          {
            id: 'locksmith-foot-c1',
            width: 'md:w-4/12',
            elements: [
              {
                id: 'locksmith-foot-logo',
                type: 'text',
                content: `<div class="flex items-center gap-3 mb-4 select-none">
  <div class="w-12 h-12 rounded-full border border-[#FFC502] flex flex-col items-center justify-center bg-white shrink-0 p-1">
    <span class="text-slate-900 font-extrabold tracking-tighter text-xs leading-none">MM</span>
    <svg class="w-5 h-2.5 text-[#FFC502]" fill="currentColor" viewBox="0 0 24 12">
      <path d="M19.5 4.5c.3 0 .5.2.5.5v1h1v-1c0-.3.2-.5.5-.5s.5.2.5.5v1h1v-2c0-.3.2-.5.5-.5s.5.2.5.5v3.5c0 .3-.2.5-.5.5h-10.4c-.6 1.8-2.3 3-4.1 3-2.5 0-4.5-2-4.5-4.5S5.5 3 8 3c1.8 0 3.5 1.2 4.1 3h7.4v-1c0-.3.2-.5.5-.5zM8 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </svg>
  </div>
  <div class="flex flex-col text-left">
    <span class="font-bold tracking-wider leading-none text-slate-800 uppercase text-lg">LÅSESMED</span>
    <span class="text-[#FFC502] tracking-wide font-semibold text-[9px] mt-1">Døgnvagt i Storkøbenhavn</span>
  </div>
</div>
<p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Låsesystemer af høj kvalitet lavet af miljøvenlige materialer. Designet til moderne og minimalistiske lejligheder</p>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'locksmith-foot-c2',
            width: 'md:w-2/12',
            elements: [
              {
                id: 'locksmith-foot-t2',
                type: 'text',
                content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Områder</h4>
<ul class="space-y-2 text-xs text-slate-500">
  <li>KØBENHAVN</li>
  <li>AMAGER</li>
  <li>VALBY</li>
  <li>RØDOVRE</li>
  <li>HVIDOVRE</li>
</ul>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '2.0',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'locksmith-foot-c3',
            width: 'md:w-3/12',
            elements: [
              {
                id: 'locksmith-foot-t3',
                type: 'text',
                content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Adresse</h4>
<div class="space-y-2 text-xs text-slate-500">
  <p>Kulvej 10, 2 TV</p>
  <p>2450 København</p>
  <p>Denmark</p>
</div>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '1.8',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'locksmith-foot-c4',
            width: 'md:w-3/12',
            elements: [
              {
                id: 'locksmith-foot-t4',
                type: 'text',
                content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Information</h4>
<ul class="space-y-2 text-xs text-slate-500">
  <li>Om os</li>
  <li>Karriere</li>
  <li>+45 31 11 11 15</li>
  <li>info@mmlaasesmed.dk</li>
</ul>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '1.8',
                  color: '#64748B'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'webshop',
    name: '🛒 Webshop',
    description: 'Danish Locksmith eCommerce webshop template with dynamic categories grid.',
    sections: [
      {
        id: 'webshop-main-sec',
        name: 'Webshop Store',
        layout: 'single-col',
        paddingY: 'md',
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        columns: [
          {
            id: 'webshop-main-col',
            width: 'w-full',
            elements: [
              {
                id: 'webshop-store-element',
                type: 'webshop',
                content: '',
                styles: {
                  marginTop: '0px',
                  marginBottom: '0px'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'webshop-foot',
        name: 'Footer',
        layout: 'custom',
        paddingY: 'md',
        backgroundColor: '#ffffff',
        textColor: '#64748B',
        columns: [
          {
            id: 'webshop-foot-c1',
            width: 'md:w-4/12',
            elements: [
              {
                id: 'webshop-foot-logo',
                type: 'text',
                content: `<div class="flex items-center gap-3 mb-4 select-none">
  <div class="w-12 h-12 rounded-full border border-[#FFC502] flex flex-col items-center justify-center bg-white shrink-0 p-1">
    <span class="text-slate-900 font-extrabold tracking-tighter text-xs leading-none">MM</span>
    <svg class="w-5 h-2.5 text-[#FFC502]" fill="currentColor" viewBox="0 0 24 12">
      <path d="M19.5 4.5c.3 0 .5.2.5.5v1h1v-1c0-.3.2-.5.5-.5s.5.2.5.5v1h1v-2c0-.3.2-.5.5-.5s.5.2.5.5v3.5c0 .3-.2.5-.5.5h-10.4c-.6 1.8-2.3 3-4.1 3-2.5 0-4.5-2-4.5-4.5S5.5 3 8 3c1.8 0 3.5 1.2 4.1 3h7.4v-1c0-.3.2-.5.5-.5zM8 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </svg>
  </div>
  <div class="flex flex-col text-left">
    <span class="font-bold tracking-wider leading-none text-slate-800 uppercase text-lg">LÅSESMED</span>
    <span class="text-[#FFC502] tracking-wide font-semibold text-[9px] mt-1">Døgnvagt i Storkøbenhavn</span>
  </div>
</div>
<p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Låsesystemer af høj kvalitet lavet af miljøvenlige materialer. Designet til moderne og minimalistiske lejligheder</p>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'webshop-foot-c2',
            width: 'md:w-2/12',
            elements: [
              {
                id: 'webshop-foot-t2',
                type: 'text',
                content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Områder</h4>
<ul class="space-y-2 text-xs text-slate-500">
  <li>KØBENHAVN</li>
  <li>AMAGER</li>
  <li>VALBY</li>
  <li>RØDOVRE</li>
  <li>HVIDOVRE</li>
</ul>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '2.0',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'webshop-foot-c3',
            width: 'md:w-3/12',
            elements: [
              {
                id: 'webshop-foot-t3',
                type: 'text',
                content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Adresse</h4>
<div class="space-y-2 text-xs text-slate-500">
  <p>Kulvej 10, 2 TV</p>
  <p>2450 København</p>
  <p>Denmark</p>
</div>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '1.8',
                  color: '#64748B'
                }
              }
            ]
          },
          {
            id: 'webshop-foot-c4',
            width: 'md:w-3/12',
            elements: [
              {
                id: 'webshop-foot-t4',
                type: 'text',
                content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Information</h4>
<ul class="space-y-2 text-xs text-slate-500">
  <li>Om os</li>
  <li>Karriere</li>
  <li>+45 31 11 11 15</li>
  <li>info@mmlaasesmed.dk</li>
</ul>`,
                styles: {
                  fontSize: '12px',
                  lineHeight: '1.8',
                  color: '#64748B'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

