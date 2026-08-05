import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, ArrowLeft, Plus, Minus, Trash2, Check, 
  ShoppingBag, Info, ShieldCheck, Key, Phone, ChevronRight,
  ArrowUp, ArrowDown,
  Mail, Lock, User, Package, Settings, Clock, AlertCircle,
  TrendingUp, CheckCircle, XCircle, Calendar, DollarSign,
  MapPin, Truck, ChevronLeft, Search, Heart
} from 'lucide-react';
import { SiteTheme } from '../types';
import { 
  WEBSHOP_CATEGORIES, 
  WEBSHOP_SUBCATEGORIES, 
  WEBSHOP_BRANDS, 
  WEBSHOP_PRODUCTS,
  WebshopCategory,
  WebshopSubcategory,
  WebshopBrand,
  WebshopProduct
} from '../webshopData';

interface CartItem {
  product: WebshopProduct;
  quantity: number;
}

interface WebshopComponentProps {
  isPreviewMode: boolean;
  theme: SiteTheme;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
  el?: any;
  onUpdateElement?: (id: string, updatedStyles: any, updatedContent?: string, updatedLink?: string, updatedSectionId?: string, extraFields?: any) => void;
}

interface Account {
  email: string;
  name: string;
  phone: string;
  address: string;
  password?: string;
}

interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: {
    carrier: 'gls' | 'postnord';
    type: 'pickup' | 'home';
    id: string;
    name: string;
    address: string;
  } | null;
  total: number;
  status: 'modtaget' | 'godkendt' | 'afsendt' | 'annulleret';
  refundRequested?: boolean;
  refundReason?: string;
}

type ShopView = 'categories' | 'subcategories' | 'subcategory-detail' | 'brand-products' | 'product-detail' | 'cart' | 'checkout' | 'login' | 'reset-password' | 'admin' | 'search-results' | 'profile';




const EditableText = ({ tag: Tag = 'span', className, style, html, onBlur, onClick, isPreviewMode }: any) => {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Only update innerHTML if it's not the currently focused element (prevents cursor jump)
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.innerHTML !== (html || '')) {
        ref.current.innerHTML = html || '';
      }
    }
  }, [html]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      contentEditable={!isPreviewMode}
      suppressContentEditableWarning
      onBlur={onBlur}
      onClick={(e: any) => {
        if (!isPreviewMode) e.stopPropagation();
        if (onClick) onClick(e);
      }}
    />
  );
};

export default function WebshopComponent({ 
  isPreviewMode, 
  theme, 
  viewportMode = 'desktop',
  el,
  onUpdateElement
}: WebshopComponentProps) {
  // Webshop text overrides state mapping
  const s = el?.settings || {};
  const logoBadge = s.logoBadge || 'MM';
  const logoText = s.logoText || 'MM LÅSESMED';
  const tagline = s.tagline || 'Døgnvagt i Storkøbenhavn';
  const searchPlaceholder = s.searchPlaceholder || 'Søg efter produkt, underkategori eller mærke...';
  const productsTitle = s.productsTitle || 'Vores produkter';
  const categoriesTitle = s.categoriesTitle || 'Populære Kategorier';
  const banner1Title = s.banner1Title || 'MMLoqz- Innovativ og Trådløs Låseløsning til Hjem og Erhverv';
  const banner2Title = s.banner2Title || 'Adgangskontrol – Forøg sikkerheden til din dør';
  const banner3Title = s.banner3Title || 'Branchevalg sikkerhed eller brand fabrikant - Ajax Systems';
  const newsletterTitle = s.newsletterTitle || 'Tilmeld dig vores nyhedsbrev';
  const newsletterDesc = s.newsletterDesc || 'Modtag eksklusive tilbud og sikkerhedsråd direkte i din indbakke hver uge.';
  const newsletterPlaceholder = s.newsletterPlaceholder || 'Skriv din e-mailadresse...';
  const newsletterBtnText = s.newsletterBtnText || 'Tilmeld dig';
  const badge1Title = s.badge1Title || 'Gratis fragt';
  const badge1Desc = s.badge1Desc || 'Alle køb over 555 Dkk er berettiget til gratis forsendelse via USPS First Class Mail';
  const badge2Title = s.badge2Title || 'Nem betaling';
  const badge2Desc = s.badge2Desc || 'Alle betalinger behandles øjeblikkeligt over en sikker betalingsprotokol';
  const badge3Title = s.badge3Title || 'Penge-tilbage-garanti';
  const badge3Desc = s.badge3Desc || 'Hvis en vare ankom beskadiget, eller du har ombestemt dig, kan du sende den tilbage til fuld refusion.';
  const badge4Title = s.badge4Title || 'Fineste kvalitet';
  const badge4Desc = s.badge4Desc || 'Designet til at holde, hvert af vores produkter er blevet fremstillet med de fineste materialer.';
  
  const badge1Image = s.badge1Image || '🚚';
  const badge2Image = s.badge2Image || '💳';
  const badge3Image = s.badge3Image || '🛡️';
  const badge4Image = s.badge4Image || '⭐️';
  const badgeSize = s.badgeSize ? parseInt(String(s.badgeSize).replace('px', '')) : 30;
  const badgeTitleSize = s.badgeTitleSize ? parseInt(String(s.badgeTitleSize)) : 12;
  const badgeTextSize = s.badgeTextSize ? parseInt(String(s.badgeTextSize)) : 10;
  const categoryImageWidth = s.categoryImageWidth ? parseInt(String(s.categoryImageWidth)) : 35;
  const navMenuFontSize = s.navMenuFontSize || 12;
  const navMenuColor = s.navMenuColor || '#cbd5e1';
  const produkterBgColor = s.produkterBgColor || '#fbbf24';
  const produkterTextColor = s.produkterTextColor || '#0f172a';
  const megaMenuFontSize = s.megaMenuFontSize || 12;
  const megaMenuTextColor = s.megaMenuTextColor || '#475569';
  const megaMenuActiveColor = s.megaMenuActiveColor || '#f59e0b';
  
  // Login / Register Form Texts
  const loginTitle = s.loginTitle || 'Log ind på din konto';
  const loginDesc = s.loginDesc || 'Log ind for at hente dine gemte leveringsoplysninger.';
  const registerTitle = s.registerTitle || 'Opret ny konto';
  const registerDesc = s.registerDesc || 'Opret en konto for at gemme dine oplysninger til næste gang.';
  const loginEmailLabel = s.loginEmailLabel || 'E-mail Adresse';
  const loginPasswordLabel = s.loginPasswordLabel || 'Adgangskode';
  const loginButtonText = s.loginButtonText || 'Log ind';
  const noAccountText = s.noAccountText || 'Har du ikke en konto endnu?';
  const createAccountLink = s.createAccountLink || 'Opret konto her';
  const backToShopText = s.backToShopText || 'Tilbage til butikken';
  
  const registerNameLabel = s.registerNameLabel || 'Fulde Navn';
  const registerEmailLabel = s.registerEmailLabel || 'E-mail Adresse';
  
  // Cart Page Texts
  const cartTrust1Icon = s.cartTrust1Icon || '🚚';
  const cartTrust1Title = s.cartTrust1Title || 'Hurtig Levering';
  const cartTrust1Desc = s.cartTrust1Desc || 'Sendes inden for 24 timer fra vores lager med fuld tracking.';
  
  const cartTrust2Icon = s.cartTrust2Icon || '🛡️';
  const cartTrust2Title = s.cartTrust2Title || '14 Dages Returret';
  const cartTrust2Desc = s.cartTrust2Desc || 'Nem returret hvis produktet ikke lever op til dine forventninger.';
  
  const cartTrust3Icon = s.cartTrust3Icon || '🔒';
  const cartTrust3Title = s.cartTrust3Title || 'Sikker Betaling';
  const cartTrust3Desc = s.cartTrust3Desc || 'Alle betalinger behandles over en sikker og krypteret SSL-forbindelse.';
  
  const cartFaqTitle = s.cartFaqTitle || 'Ofte stillede spørgsmål (FAQ)';
  const cartFaq1Question = s.cartFaq1Question || 'Hvor lang er leveringstiden?';
  const cartFaq1Answer = s.cartFaq1Answer || 'Vi pakker og sender ordrer hver dag. Du kan normalt forvente at modtage dine varer inden for 1-2 hverdage via GLS pakkeshop eller hjemmelevering.';
  
  const cartFaq2Question = s.cartFaq2Question || 'Kan jeg returnere eller bytte varen?';
  const cartFaq2Answer = s.cartFaq2Answer || 'Ja, vi tilbyder 14 dages fuld returret på alle uåbnede produkter i original emballage. Du betaler selv for returfragten.';
  const registerPasswordLabel = s.registerPasswordLabel || 'Vælg Adgangskode';
  const registerButtonText = s.registerButtonText || 'Opret konto nu';
  const hasAccountText = s.hasAccountText || 'Har du allerede en konto?';
  const loginAccountLink = s.loginAccountLink || 'Log ind her';
  const updateSetting = (key: string, value: string) => {
    if (onUpdateElement && el) {
      onUpdateElement(el.id, {}, undefined, undefined, undefined, {
        settings: {
          ...(el.settings || {}),
          [key]: value
        }
      });
    }
  };

  const updateCategoryField = (id: string, field: string, value: string) => {
    if (isPreviewMode) return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (isPreviewMode) return;
    setCategories(prev => {
      const newCats = [...prev];
      if (direction === 'up' && index > 0) {
        [newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]];
      } else if (direction === 'down' && index < newCats.length - 1) {
        [newCats[index + 1], newCats[index]] = [newCats[index], newCats[index + 1]];
      }
      return newCats;
    });
  };

  const updateSubcategoryField = (id: string, field: string, value: string) => {
    if (isPreviewMode) return;
    setSubcategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateProductField = (id: string, field: string, value: string) => {
    if (isPreviewMode) return;
    setProducts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const promptEditImage = (type: 'category'|'subcategory'|'product'|'setting', id: string, field: string) => {
    if (isPreviewMode) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const b64 = reader.result as string;
          if (type === 'category') updateCategoryField(id, field, b64);
          else if (type === 'subcategory') updateSubcategoryField(id, field, b64);
          else if (type === 'product') updateProductField(id, field, b64);
          else if (type === 'setting') updateSetting(field, b64);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Helper for responsive grid columns based on preview viewportMode
  const getGridCols = (colsMobile: number, colsTablet: number, colsDesktop: number) => {
    if (viewportMode === 'mobile') return `grid-cols-${colsMobile}`;
    if (viewportMode === 'tablet') return `grid-cols-${colsTablet}`;
    return `grid-cols-${colsMobile} @sm:grid-cols-${colsTablet} @lg:grid-cols-${colsDesktop}`;
  };

  const getCardPadding = (paddingMobile: string, paddingTablet: string, paddingDesktop: string) => {
    if (viewportMode === 'mobile') return paddingMobile;
    if (viewportMode === 'tablet') return paddingTablet;
    return `${paddingMobile} @sm:${paddingTablet} @md:${paddingDesktop}`;
  };

  const getHeaderFlexClass = () => {
    if (viewportMode === 'mobile') return 'flex-col gap-4 items-center';
    if (viewportMode === 'tablet') return 'flex-row items-center justify-between';
    return 'flex-col @sm:flex-row gap-4 @sm:gap-0 items-center justify-between';
  };

  const getMockCityName = (zip: string) => {
    const cities: Record<string, string> = {
      "1000": "København K", "2000": "Frederiksberg", "2100": "København Ø",
      "2200": "København N", "2300": "København S", "2400": "København NV",
      "2500": "Valby", "2600": "Glostrup", "2700": "Brønshøj", "2800": "Kongens Lyngby",
      "2900": "Hellerup", "3000": "Helsingør", "3400": "Hillerød", "4000": "Roskilde",
      "5000": "Odense C", "8000": "Aarhus C", "9000": "Aalborg"
    };
    return cities[zip] || "København";
  };

  // Navigation states
  const [view, setView] = useState<ShopView>(() => {
    // If not preview mode and we have a forcedView in settings, use it as default
    const s = el?.settings || {};
    if (!isPreviewMode && s.forcedView) {
      return s.forcedView;
    }
    return 'categories';
  });
  const [backendLang, setBackendLang] = useState<'da' | 'en'>(() => (localStorage.getItem('mm_lase_backend_lang') as 'da' | 'en') || 'da');

  // Sync view with forcedView in editor mode
  useEffect(() => {
    if (!isPreviewMode && el?.settings?.forcedView) {
      setView(el.settings.forcedView);
    }
  }, [el?.settings?.forcedView, isPreviewMode]);

  useEffect(() => {
    const handleStorage = () => {
      const lang = (localStorage.getItem('mm_lase_backend_lang') as 'da' | 'en') || 'da';
      setBackendLang(lang);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('backend-lang-change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('backend-lang-change', handleStorage);
    };
  }, []);

  const setAndDispatchBackendLang = (lang: 'da' | 'en') => {
    localStorage.setItem('mm_lase_backend_lang', lang);
    setBackendLang(lang);
    window.dispatchEvent(new Event('backend-lang-change'));
  };

  const bt = (da: string, en: string) => {
    return backendLang === 'da' ? da : en;
  };

  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedSubcatId, setSelectedSubcatId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Checkout states
  const [customerType, setCustomerType] = useState<'private' | 'company'>('private');
  const [companyName, setCompanyName] = useState('');
  const [cvrNumber, setCvrNumber] = useState('');

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search Helper
  const productMatchesQuery = (product: WebshopProduct, query: string): boolean => {
    const q = query.toLowerCase().trim();
    if (!q) return false;
    if (product.name.toLowerCase().includes(q)) return true;
    if (product.description.toLowerCase().includes(q)) return true;
    if (product.color && product.color.toLowerCase().includes(q)) return true;
    if (product.shape && product.shape.toLowerCase().includes(q)) return true;
    if (product.size && product.size.toLowerCase().includes(q)) return true;
    if (product.tags && product.tags.some(t => t.toLowerCase().includes(q))) return true;
    
    const brand = WEBSHOP_BRANDS.find(b => b.id === product.brandId);
    if (brand && brand.name.toLowerCase().includes(q)) return true;
    
    const subcat = subcategories.find(s => s.id === product.subcategoryId);
    if (subcat) {
      if (subcat.name.toLowerCase().includes(q)) return true;
      const cat = categories.find(c => c.id === subcat.categoryId);
      if (cat && cat.name.toLowerCase().includes(q)) return true;
    }
    return false;
  };

  const getSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return products.filter(p => productMatchesQuery(p, query)).slice(0, 5);
  };

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setView('search-results');
    setShowSuggestions(false);
    if (isPreviewMode) {
      window.location.hash = `shop/search/${encodeURIComponent(trimmed)}`;
    }
  };

  // Cart states
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_cart') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        } else if (parsed && parsed.items) {
          const session = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_session') : null;
          if (!session && parsed.expiry && Date.now() > parsed.expiry) {
            localStorage.removeItem('mm_lase_cart');
            return [];
          }
          return parsed.items || [];
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('mm_lase_session');
      const expiry = session ? null : Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('mm_lase_cart', JSON.stringify({ items: cart, expiry }));
    }
  }, [cart]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_wishlist') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Backward compatibility for old arrays
          return parsed;
        } else if (parsed && parsed.items) {
          // Check expiration only if there's no active session
          const session = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_session') : null;
          if (!session && parsed.expiry && Date.now() > parsed.expiry) {
            localStorage.removeItem('mm_lase_wishlist');
            return [];
          }
          return parsed.items || [];
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('mm_lase_session');
        const expiry = session ? null : Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days for guests
        localStorage.setItem('mm_lase_wishlist', JSON.stringify({ items: next, expiry }));
      }
      return next;
    });
  };

  // Mega Menu State
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [megaMenuHoverCatId, setMegaMenuHoverCatId] = useState<string | null>(null);
  const [megaMenuHoverSubcatId, setMegaMenuHoverSubcatId] = useState<string | null>(null);
  const [megaMenuHoverProdId, setMegaMenuHoverProdId] = useState<string | null>(null);

  // Checkout form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');

  // Shipmondo Carrier & Delivery states
  const [selectedCarrier, setSelectedCarrier] = useState<'gls' | 'postnord' | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);
  const [homeDeliveryOptions, setHomeDeliveryOptions] = useState<any[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);

  // Account & Auth states
  const [loggedInUser, setLoggedInUser] = useState<Account | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState<{ to: string; subject: string; body: string; tempPass: string } | null>(null);
  
  // Admin & Order states
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<WebshopCategory[]>(() => {
    const catsStr = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_categories') : null;
    if (catsStr) {
      try {
        return JSON.parse(catsStr);
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
    return WEBSHOP_CATEGORIES;
  });

  const [subcategories, setSubcategories] = useState<WebshopSubcategory[]>(() => {
    const subcatsStr = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_subcategories') : null;
    if (subcatsStr) {
      try {
        return JSON.parse(subcatsStr);
      } catch (e) {
        console.error('Failed to parse subcategories', e);
      }
    }
    return WEBSHOP_SUBCATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('mm_lase_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mm_lase_subcategories', JSON.stringify(subcategories));
  }, [subcategories]);

  const [products, setProducts] = useState<WebshopProduct[]>(() => {
    const productsStr = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_products') : null;
    if (productsStr) {
      try {
        return JSON.parse(productsStr);
      } catch (e) {
        console.error('Failed to parse products', e);
      }
    }
    // Initialize mock stock levels
    return WEBSHOP_PRODUCTS.map((p, idx) => {
      let stock = 15;
      if (idx % 7 === 0) {
        stock = 0; // Udsolgt
      } else if (idx % 7 === 2) {
        stock = 3; // Få på lager
      } else {
        stock = Math.floor(Math.random() * 20) + 8;
      }
      return { ...p, stock };
    });
  });

  useEffect(() => {
    localStorage.setItem('mm_lase_products', JSON.stringify(products));
  }, [products]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'modtaget' | 'godkendt' | 'afsendt' | 'annulleret'>('all');
  const [activeDetailOrder, setActiveDetailOrder] = useState<Order | null>(null);
  const [adminTab, setAdminTab] = useState<'orders' | 'inventory' | 'categories' | 'subcategories' | 'products'>('orders');
  const [editingItem, setEditingItem] = useState<{
    type: 'category' | 'subcategory' | 'product';
    isNew: boolean;
    data: any;
  } | null>(null);

  // Synchronize category subcatIds when subcategories change
  useEffect(() => {
    setCategories(prevCats => {
      let changed = false;
      const updated = prevCats.map(cat => {
        const subIds = subcategories.filter(sub => sub.categoryId === cat.id).map(sub => sub.id);
        const subcatIds = cat.subcatIds || [];
        // Check if lists are identical
        const isSame = subIds.length === subcatIds.length && subIds.every(id => subcatIds.includes(id));
        if (!isSame) {
          changed = true;
          return { ...cat, subcatIds: subIds };
        }
        return cat;
      });
      return changed ? updated : prevCats;
    });
  }, [subcategories]);

  const [invSearchQuery, setInvSearchQuery] = useState('');
  
  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Reset password form states
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Local state for active items to render
  const activeCategory = categories.find(c => c.id === selectedCatId);
  const activeSubcategory = subcategories.find(s => s.id === selectedSubcatId);
  const activeBrand = WEBSHOP_BRANDS.find(b => b.id === selectedBrandId);
  const activeProduct = products.find(p => p.id === selectedProductId) || 
    WEBSHOP_PRODUCTS.find(p => p.id === selectedProductId) || 
    products[0] || 
    WEBSHOP_PRODUCTS[0];

  const filteredInvProducts = products.filter(p => {
    const q = invSearchQuery.toLowerCase().trim();
    if (!q) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    const subcat = subcategories.find(s => s.id === p.subcategoryId);
    if (subcat && subcat.name.toLowerCase().includes(q)) return true;
    const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
    if (brand && brand.name.toLowerCase().includes(q)) return true;
    return false;
  });

  // Update hash dynamically for browser address bar if in preview/visitor mode
  useEffect(() => {
    if (isPreviewMode) {
      if (view === 'categories') {
        window.location.hash = 'shop';
      } else if (view === 'subcategories' && selectedCatId) {
        window.location.hash = `shop/cat/${selectedCatId}`;
      } else if (view === 'subcategory-detail' && selectedSubcatId) {
        window.location.hash = `shop/subcat/${selectedSubcatId}`;
      } else if (view === 'brand-products' && selectedSubcatId && selectedBrandId) {
        window.location.hash = `shop/brand/${selectedSubcatId}/${selectedBrandId}`;
      } else if (view === 'product-detail' && selectedProductId) {
        window.location.hash = `shop/product/${selectedProductId}`;
      } else if (view === 'cart') {
        window.location.hash = 'shop/cart';
      } else if (view === 'checkout') {
        window.location.hash = 'shop/checkout';
      } else if (view === 'login') {
        window.location.hash = 'shop/login';
      } else if (view === 'reset-password') {
        window.location.hash = `shop/reset-password${resetEmail ? '?email=' + encodeURIComponent(resetEmail) : ''}`;
      } else if (view === 'admin') {
        window.location.hash = 'shop/admin';
      } else if (view === 'search-results') {
        window.location.hash = `shop/search/${encodeURIComponent(searchQuery)}`;
      } else if (view === 'profile') {
        window.location.hash = 'shop/profile';
      }
    }
  }, [view, selectedCatId, selectedSubcatId, selectedBrandId, selectedProductId, resetEmail, searchQuery, isPreviewMode]);

  // Handle hash navigation back/forward in browser
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#shop') {
        setView('categories');
        setSelectedCatId(null);
        setSelectedSubcatId(null);
        setSelectedBrandId(null);
        setSelectedProductId(null);
      } else if (hash.startsWith('#shop/cat/')) {
        const catId = hash.replace('#shop/cat/', '');
        setView('subcategories');
        setSelectedCatId(catId);
        setSelectedSubcatId(null);
        setSelectedBrandId(null);
        setSelectedProductId(null);
      } else if (hash.startsWith('#shop/subcat/')) {
        const subcatId = hash.replace('#shop/subcat/', '');
        const sub = subcategories.find(s => s.id === subcatId);
        if (sub) {
          setView('subcategory-detail');
          setSelectedCatId(sub.categoryId);
          setSelectedSubcatId(subcatId);
          setSelectedBrandId(null);
          setSelectedProductId(null);
        }
      } else if (hash.startsWith('#shop/brand/')) {
        const parts = hash.replace('#shop/brand/', '').split('/');
        if (parts.length === 2) {
          const [subcatId, brandId] = parts;
          const sub = subcategories.find(s => s.id === subcatId);
          if (sub) {
            setView('brand-products');
            setSelectedCatId(sub.categoryId);
            setSelectedSubcatId(subcatId);
            setSelectedBrandId(brandId);
            setSelectedProductId(null);
          }
        }
      } else if (hash.startsWith('#shop/product/')) {
        const productId = hash.replace('#shop/product/', '');
        const product = products.find(p => p.id === productId) || WEBSHOP_PRODUCTS.find(p => p.id === productId);
        if (product) {
          setView('product-detail');
          setSelectedProductId(productId);
          setSelectedSubcatId(product.subcategoryId);
          setSelectedBrandId(product.brandId);
          const sub = subcategories.find(s => s.id === product.subcategoryId);
          if (sub) {
            setSelectedCatId(sub.categoryId);
          }
        }
      } else if (hash === '#shop/cart') {
        setView('cart');
      } else if (hash === '#shop/checkout') {
        setView('checkout');
      } else if (hash === '#shop/login') {
        setView('login');
      } else if (hash.startsWith('#shop/reset-password')) {
        setView('reset-password');
        const emailParam = new URLSearchParams(hash.split('?')[1] || '').get('email');
        if (emailParam) {
          setResetEmail(emailParam);
        }
      } else if (hash === '#shop/admin') {
        setView('admin');
      } else if (hash.startsWith('#shop/search/')) {
        const query = decodeURIComponent(hash.replace('#shop/search/', ''));
        setSearchQuery(query);
        setSearchInputValue(query);
        setView('search-results');
      } else if (hash === '#shop/profile') {
        const sessionStr = localStorage.getItem('mm_lase_session');
        if (sessionStr) {
          setView('profile');
        } else {
          setView('login');
          window.location.hash = 'shop/login';
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger on mount if hash is already present
    if (window.location.hash.startsWith('#shop')) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [subcategories, products, isPreviewMode]);

  // Click outside detection for search suggestions and profile dropdown
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container-root')) {
        setShowSuggestions(false);
      }
      if (!target.closest('.profile-dropdown-root')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Initialize session & orders on mount
  useEffect(() => {
    const sessionStr = localStorage.getItem('mm_lase_session');
    if (sessionStr) {
      try {
        const user = JSON.parse(sessionStr);
        setLoggedInUser(user);
      } catch (e) {
        console.error('Failed to parse session', e);
      }
    }
    const ordersStr = localStorage.getItem('mm_lase_orders');
    if (ordersStr) {
      try {
        const parsed = JSON.parse(ordersStr);
        setOrders(parsed);
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
  }, []);

  // Prefill/clear checkout form based on session status
  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.name);
      setEmail(loggedInUser.email);
      setPhone(loggedInUser.phone);
      setAddress(loggedInUser.address);
      
      // Auto-extract postcode for logged-in users if possible (Danish postcodes are 4 digits)
      const match = loggedInUser.address.match(/\b\d{4}\b/);
      if (match) {
        setPostcode(match[0]);
      } else {
        setPostcode('');
      }
      setCity('');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPostcode('');
      setCity('');
    }
    setSelectedCarrier(null);
    setSelectedDelivery(null);
  }, [loggedInUser]);

  // Fetch delivery options from Shipmondo via our Django backend
  useEffect(() => {
    const isZipValid = /^\d{4}$/.test(postcode.trim());
    if (isZipValid && selectedCarrier) {
      setShippingLoading(true);
      setShippingError('');
      setPickupPoints([]);
      setHomeDeliveryOptions([]);
      setSelectedDelivery(null);

      const backendBase = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
      const fetchUrl = `${backendBase}/api/shipmondo-delivery-options/?zipcode=${encodeURIComponent(postcode.trim())}&carrier=${selectedCarrier}`;

      fetch(fetchUrl)
        .then(res => {
          if (!res.ok) throw new Error('Kunne ikke hente leveringsmetoder');
          return res.json();
        })
        .then(data => {
          setPickupPoints(data.pickup_points || []);
          setHomeDeliveryOptions(data.home_delivery || []);
          
          // Auto-select first pickup point or home delivery if available
          if (data.pickup_points && data.pickup_points.length > 0) {
            const first = data.pickup_points[0];
            setSelectedDelivery({
              type: 'pickup',
              id: first.id,
              name: first.company_name,
              address: `${first.address}, ${first.zipcode} ${first.city}`,
              carrier: selectedCarrier
            });
          } else if (data.home_delivery && data.home_delivery.length > 0) {
            const first = data.home_delivery[0];
            setSelectedDelivery({
              type: 'home',
              id: first.code,
              name: first.name,
              address: 'Levering til privat adresse',
              carrier: selectedCarrier
            });
          }
        })
        .catch(err => {
          console.warn('Backend Shipmondo fetch failed, falling back to local mock data:', err);
          
          const city_name = getMockCityName(postcode.trim());
          const mockPickupPoints = [];
          const mockHomeDelivery = [];

          if (selectedCarrier === 'gls') {
            mockPickupPoints.push(
              {
                id: 'gls_p1',
                company_name: 'Spar Supermarked GLS Pakkeshop',
                address: 'Hovedgade 42',
                zipcode: postcode,
                city: city_name,
                carrier_code: 'gls',
                carrier_name: 'GLS'
              },
              {
                id: 'gls_p2',
                company_name: 'OK Plus GLS Pakkeshop',
                address: 'Jernbanegade 5',
                zipcode: postcode,
                city: city_name,
                carrier_code: 'gls',
                carrier_name: 'GLS'
              }
            );
            mockHomeDelivery.push({
              code: 'gls',
              name: 'GLS Privatlevering',
              service: 'Home Delivery',
              description: 'Direkte levering til din dør – 1-2 hverdage'
            });
          } else if (selectedCarrier === 'postnord') {
            mockPickupPoints.push(
              {
                id: 'pnd_p1',
                company_name: 'Coop SuperBrugsen PostNord Pakkeboks',
                address: 'Bymidten 11',
                zipcode: postcode,
                city: city_name,
                carrier_code: 'postnord',
                carrier_name: 'PostNord'
              },
              {
                id: 'pnd_p2',
                company_name: 'Circle K PostNord Pakkeshop',
                address: 'Ringvejen 105',
                zipcode: postcode,
                city: city_name,
                carrier_code: 'postnord',
                carrier_name: 'PostNord'
              }
            );
            mockHomeDelivery.push({
              code: 'postnord',
              name: 'PostNord Hjemmelevering',
              service: 'Home Delivery',
              description: 'Sikker levering til din adresse med omdeling – 1-2 hverdage'
            });
          }

          setPickupPoints(mockPickupPoints);
          setHomeDeliveryOptions(mockHomeDelivery);

          // Auto-select first pickup point
          if (mockPickupPoints.length > 0) {
            const first = mockPickupPoints[0];
            setSelectedDelivery({
              type: 'pickup',
              id: first.id,
              name: first.company_name,
              address: `${first.address}, ${first.zipcode} ${first.city}`,
              carrier: selectedCarrier
            });
          } else if (mockHomeDelivery.length > 0) {
            const first = mockHomeDelivery[0];
            setSelectedDelivery({
              type: 'home',
              id: first.code,
              name: first.name,
              address: 'Levering til privat adresse',
              carrier: selectedCarrier
            });
          }
        })
        .finally(() => {
          setShippingLoading(false);
        });
    } else {
      setPickupPoints([]);
      setHomeDeliveryOptions([]);
      setSelectedDelivery(null);
    }
  }, [postcode, selectedCarrier]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError('Udfyld venligst alle felter.');
      return;
    }
    const accountsStr = typeof window !== 'undefined' ? localStorage.getItem('mm_lase_accounts') || '[]' : '[]';
    let accounts: Account[] = [];
    try {
      accounts = JSON.parse(accountsStr);
    } catch (err) {}
    
    if (accounts.some(a => a.email.toLowerCase() === registerEmail.toLowerCase())) {
      setRegisterError('En konto med denne e-mail findes allerede.');
      return;
    }

    const newUser: Account = {
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      phone: '',
      address: ''
    };
    
    accounts.push(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_lase_accounts', JSON.stringify(accounts));
      localStorage.setItem('mm_lase_session', JSON.stringify(newUser));
    }
    
    setLoggedInUser(newUser);
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterError('');
    if (isPreviewMode) {
      window.location.hash = 'shop';
    } else {
      setView('categories');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isLocalAdmin = (loginEmail.toLowerCase() === 'admin' || loginEmail.toLowerCase() === 'admin@mmlaseshop.dk') && loginPassword === 'admin';
    if (isLocalAdmin) {
      const adminUser: Account = {
        email: 'admin@mmlaseshop.dk',
        name: 'Admin',
        phone: '12345678',
        address: 'Admin Center, DK'
      };
      localStorage.setItem('mm_lase_session', JSON.stringify(adminUser));
      setLoggedInUser(adminUser);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
      if (isPreviewMode) {
        window.location.hash = 'shop/admin';
      } else {
        setView('admin');
      }
      return;
    }

    const accountsStr = localStorage.getItem('mm_lase_accounts') || '[]';
    const accounts: Account[] = JSON.parse(accountsStr);
    const user = accounts.find(a => a.email.toLowerCase() === loginEmail.toLowerCase() && a.password === loginPassword);
    if (user) {
      localStorage.setItem('mm_lase_session', JSON.stringify(user));
      setLoggedInUser(user);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
      if (isPreviewMode) {
        window.location.hash = 'shop';
      } else {
        setView('categories');
      }
    } else {
      setLoginError('Ugyldig e-mail eller adgangskode. Prøv venligst igen.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError('Adgangskoderne er ikke ens.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Adgangskoden skal være mindst 6 tegn lang.');
      return;
    }
    
    const accountsStr = localStorage.getItem('mm_lase_accounts') || '[]';
    const accounts: Account[] = JSON.parse(accountsStr);
    const userIdx = accounts.findIndex(a => a.email.toLowerCase() === resetEmail.toLowerCase());
    
    if (userIdx !== -1) {
      accounts[userIdx].password = newPassword;
      localStorage.setItem('mm_lase_accounts', JSON.stringify(accounts));
      
      setResetSuccess(true);
      setResetError('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Update session if they reset password while logged in
      const sessionStr = localStorage.getItem('mm_lase_session');
      if (sessionStr) {
        const sessionUser = JSON.parse(sessionStr);
        if (sessionUser.email.toLowerCase() === resetEmail.toLowerCase()) {
          sessionUser.password = newPassword;
          localStorage.setItem('mm_lase_session', JSON.stringify(sessionUser));
          setLoggedInUser(sessionUser);
        }
      }
    } else {
      setResetError('Kontoen blev ikke fundet.');
    }
  };

  // Cart helper functions
  const addToCart = (product: WebshopProduct) => {
    const dbProd = products.find(p => p.id === product.id) || product;
    const currentStock = dbProd.stock !== undefined ? dbProd.stock : 15;
    
    const existingItem = cart.find(item => item.product.id === product.id);
    const existingQty = existingItem ? existingItem.quantity : 0;
    
    if (existingQty + 1 > currentStock) {
      alert(`Beklager! Der er kun ${currentStock} stk. af dette produkt på lager.`);
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    if (isPreviewMode) {
      window.location.hash = 'shop/cart';
    } else {
      setView('cart');
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    const dbProd = products.find(p => p.id === productId);
    const currentStock = (dbProd && dbProd.stock !== undefined) ? dbProd.stock : 15;

    setCart(prevCart => {
      let isOverLimit = false;
      const updated = prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          if (newQty > currentStock) {
            isOverLimit = true;
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
      
      if (isOverLimit) {
        alert(`Beklager! Der er kun ${currentStock} stk. af dette produkt på lager.`);
      }
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartItemQty = (productId: string) => {
    const item = cart.find(it => it.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Udfyld venligst alle personlige oplysninger.');
      return;
    }

    const finalAddress = loggedInUser ? address : `${address}, ${postcode} ${city}`;
    if (!finalAddress || finalAddress.replace(/,/g, '').trim() === '') {
      alert('Udfyld venligst din leveringsadresse.');
      return;
    }

    if (selectedCarrier && !selectedDelivery) {
      alert('Vælg venligst en leveringsmetode (Pakkeshop eller Hjemmelevering).');
      return;
    }

    let deliveryDetails = '';
    if (selectedDelivery) {
      deliveryDetails = `\n\nForsendelse: ${selectedDelivery.carrier.toUpperCase()} - ${selectedDelivery.name}\nLeveringsadresse: ${selectedDelivery.address}`;
    }

    if (!loggedInUser) {
      const accountsStr = localStorage.getItem('mm_lase_accounts') || '[]';
      const accounts: Account[] = JSON.parse(accountsStr);
      const exists = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());

      if (!exists) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const tempPass = `MM-${randomNum}`;
        
        const newAccount: Account = {
          email: email.toLowerCase(),
          name,
          phone,
          address: finalAddress,
          password: tempPass
        };
        
        accounts.push(newAccount);
        localStorage.setItem('mm_lase_accounts', JSON.stringify(accounts));
        
        setSimulatedEmail({
          to: email,
          subject: 'Velkommen til MM Låseshop - Din konto er oprettet!',
          body: `Kære ${name},\n\nTak for din bestilling hos MM Låseshop. Vi har automatisk oprettet en konto til dig for at gøre fremtidige køb nemmere.\n\nLogin E-mail: ${email}\nMidlertidig Password: ${tempPass}${deliveryDetails}\n\nKlik på nedenstående link for at nulstille din adgangskode og logge ind:`,
          tempPass
        });
      }
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MM-ORD-${orderIdSuffix}`;
    const orderDate = new Date().toLocaleString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newOrder: Order = {
      id: orderId,
      date: orderDate,
      customer: {
        name,
        email,
        phone,
        address: finalAddress
      },
      items: [...cart],
      subtotal,
      shipping: selectedCarrier && selectedDelivery ? {
        carrier: selectedCarrier,
        type: selectedDelivery.type,
        id: selectedDelivery.id,
        name: selectedDelivery.name,
        address: selectedDelivery.address
      } : null,
      total: subtotal,
      status: 'modtaget'
    };

    const currentOrdersStr = localStorage.getItem('mm_lase_orders') || '[]';
    try {
      const currentOrders: Order[] = JSON.parse(currentOrdersStr);
      const updatedOrders = [newOrder, ...currentOrders];
      localStorage.setItem('mm_lase_orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      // Deduct stock levels for cart items
      const updatedProducts = products.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, (p.stock ?? 15) - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
      localStorage.setItem('mm_lase_products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Failed to save order to localStorage', err);
    }

    setCheckoutSuccess(true);
    setCart([]);
    if (!loggedInUser) {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPostcode('');
      setCity('');
    }
    setSelectedCarrier(null);
    setSelectedDelivery(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: 'modtaget' | 'godkendt' | 'afsendt' | 'annulleret') => {
    if (newStatus === 'annulleret') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.status !== 'annulleret') {
        const updatedProducts = products.map(p => {
          const item = order.items.find(it => it.product.id === p.id);
          if (item) {
            return { ...p, stock: (p.stock ?? 15) + item.quantity };
          }
          return p;
        });
        localStorage.setItem('mm_lase_products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
      }
    }

    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    localStorage.setItem('mm_lase_orders', JSON.stringify(updated));
    setOrders(updated);
    
    if (activeDetailOrder && activeDetailOrder.id === orderId) {
      setActiveDetailOrder({ ...activeDetailOrder, status: newStatus });
    }
  };

  const requestOrderRefund = (orderId: string, reason: string) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, refundRequested: true, refundReason: reason || 'Kunden anmodede om refundering.' };
      }
      return ord;
    });
    localStorage.setItem('mm_lase_orders', JSON.stringify(updated));
    setOrders(updated);
    
    if (activeDetailOrder && activeDetailOrder.id === orderId) {
      setActiveDetailOrder({
        ...activeDetailOrder,
        refundRequested: true,
        refundReason: reason || 'Kunden anmodede om refundering.'
      });
    }
  };

  const adjustStockLevel = (productId: string, change: number) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, (p.stock ?? 15) + change);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const setStockValue = (productId: string, value: number) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, value) };
        }
        return p;
      })
    );
  };

  const handleDeleteItem = (type: 'category' | 'subcategory' | 'product', id: string) => {
    if (type === 'category') {
      const confirmDelete = window.confirm(
        'Advarsel: Hvis du sletter denne kategori, vil alle dens tilknyttede underkategorier og produkter også blive slettet. Vil du fortsætte?'
      );
      if (confirmDelete) {
        const subcatIdsToDelete = subcategories.filter(s => s.categoryId === id).map(s => s.id);
        setProducts(prev => prev.filter(p => !subcatIdsToDelete.includes(p.subcategoryId)));
        setSubcategories(prev => prev.filter(s => s.categoryId !== id));
        setCategories(prev => prev.filter(c => c.id !== id));
        if (selectedCatId === id) {
          setSelectedCatId(null);
          setSelectedSubcatId(null);
          setSelectedBrandId(null);
          setSelectedProductId(null);
          setView('categories');
        }
      }
    } else if (type === 'subcategory') {
      const confirmDelete = window.confirm(
        'Advarsel: Hvis du sletter denne underkategori, vil alle dens produkter også blive slettet. Vil du fortsætte?'
      );
      if (confirmDelete) {
        setProducts(prev => prev.filter(p => p.subcategoryId !== id));
        setSubcategories(prev => prev.filter(s => s.id !== id));
        if (selectedSubcatId === id) {
          setSelectedSubcatId(null);
          setSelectedBrandId(null);
          setSelectedProductId(null);
          setView('categories');
        }
      }
    } else if (type === 'product') {
      const confirmDelete = window.confirm('Er du sikker på, at du vil slette dette produkt?');
      if (confirmDelete) {
        setProducts(prev => prev.filter(p => p.id !== id));
        if (selectedProductId === id) {
          setSelectedProductId(null);
          setView('categories');
        }
      }
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { type, isNew, data } = editingItem;

    if (!data.id || !data.id.trim()) {
      alert('Id/Slug må ikke være tomt.');
      return;
    }
    const cleanId = data.id.trim().toLowerCase().replace(/\s+/g, '-');

    if (type === 'category') {
      if (!data.name || !data.name.trim()) {
        alert('Navn må ikke være tomt.');
        return;
      }
      if (isNew && categories.some(c => c.id === cleanId)) {
        alert('En kategori med dette ID eksisterer allerede.');
        return;
      }

      const itemToSave: WebshopCategory = {
        id: isNew ? cleanId : data.id,
        name: data.name.trim(),
        icon: data.icon ? data.icon.trim() : '🔒',
        description: data.description ? data.description.trim() : '',
        subcatIds: data.subcatIds || []
      };

      if (isNew) {
        setCategories(prev => [...prev, itemToSave]);
      } else {
        setCategories(prev => prev.map(c => c.id === data.id ? itemToSave : c));
      }

    } else if (type === 'subcategory') {
      if (!data.name || !data.name.trim()) {
        alert('Navn må ikke være tomt.');
        return;
      }
      if (!data.categoryId) {
        alert('Vælg venligst en overordnet kategori.');
        return;
      }
      if (isNew && subcategories.some(s => s.id === cleanId)) {
        alert('En underkategori med dette ID eksisterer allerede.');
        return;
      }

      const itemToSave: WebshopSubcategory = {
        id: isNew ? cleanId : data.id,
        categoryId: data.categoryId,
        name: data.name.trim(),
        description: data.description ? data.description.trim() : '',
        detailedDescription: data.detailedDescription ? data.detailedDescription.trim() : '',
        brandIds: data.brandIds || []
      };

      if (isNew) {
        setSubcategories(prev => [...prev, itemToSave]);
      } else {
        setSubcategories(prev => prev.map(s => s.id === data.id ? itemToSave : s));
      }

    } else if (type === 'product') {
      if (!data.name || !data.name.trim()) {
        alert('Navn må ikke være tomt.');
        return;
      }
      if (!data.subcategoryId) {
        alert('Vælg venligst en underkategori.');
        return;
      }
      if (data.price === undefined || isNaN(Number(data.price)) || Number(data.price) < 0) {
        alert('Pris skal være et positivt tal.');
        return;
      }
      if (isNew && products.some(p => p.id === cleanId)) {
        alert('Et produkt med dette ID (varenr) eksisterer allerede.');
        return;
      }

      const itemToSave: WebshopProduct = {
        id: isNew ? cleanId : data.id,
        subcategoryId: data.subcategoryId,
        brandId: data.brandId || '',
        name: data.name.trim(),
        price: Number(data.price),
        description: data.description ? data.description.trim() : '',
        image: data.image ? data.image.trim() : 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80',
        badges: Array.isArray(data.badges) ? data.badges : (data.badges ? data.badges.split(',').map((b: string) => b.trim()).filter(Boolean) : []),
        color: data.color ? data.color.trim() : '',
        shape: data.shape ? data.shape.trim() : '',
        size: data.size ? data.size.trim() : '',
        tags: Array.isArray(data.tags) ? data.tags : [data.name.toLowerCase(), cleanId],
        stock: data.stock !== undefined ? Number(data.stock) : 10
      };

      if (isNew) {
        setProducts(prev => [...prev, itemToSave]);
      } else {
        setProducts(prev => prev.map(p => p.id === data.id ? itemToSave : p));
      }
    }

    setEditingItem(null);
  };

  const generateMockOrders = () => {
    const mockCustNames = ['Morten Hansen', 'Sofia Nielsen', 'Lars Pedersen', 'Freja Møller', 'Christian Poulsen'];
    const mockCustEmails = ['morten@hansen.dk', 'sofia@nielsen.dk', 'lars@pedersen.dk', 'freja@moeller.dk', 'christian@poulsen.dk'];
    const mockCustPhones = ['45123456', '45234567', '45345678', '45456789', '45567890'];
    const mockZips = ['2100', '5000', '8000', '2900', '4000'];
    const mockCarriers: Array<'gls' | 'postnord'> = ['gls', 'postnord'];
    
    const generated: Order[] = [];
    
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * mockCustNames.length);
      const name = mockCustNames[idx];
      const email = mockCustEmails[idx];
      const phone = mockCustPhones[idx];
      const zip = mockZips[i % mockZips.length];
      const city = getMockCityName(zip);
      const carrier = mockCarriers[i % 2];
      const address = `Søndergade ${12 + i * 5}, ${zip} ${city}`;
      
      const product = products[Math.floor(Math.random() * products.length)] || WEBSHOP_PRODUCTS[Math.floor(Math.random() * WEBSHOP_PRODUCTS.length)];
      const items: CartItem[] = [{ product, quantity: Math.floor(1 + Math.random() * 2) }];
      const subtotal = product.price * items[0].quantity;
      
      const orderIdSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderId = `MM-ORD-${orderIdSuffix}`;
      
      const date = new Date(Date.now() - i * 3600000 * 4).toLocaleString('da-DK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const statuses: Array<'modtaget' | 'godkendt' | 'afsendt'> = ['modtaget', 'godkendt', 'afsendt'];
      const status = statuses[i];
      
      generated.push({
        id: orderId,
        date,
        customer: { name, email, phone, address },
        items,
        subtotal,
        shipping: {
          carrier,
          type: i % 2 === 0 ? 'pickup' : 'home',
          id: carrier === 'gls' ? 'gls_p1' : 'pnd_p1',
          name: carrier === 'gls' ? 'Spar Supermarked GLS Pakkeshop' : 'PostNord Hjemmelevering',
          address: i % 2 === 0 ? `Hovedgade 42, ${zip} ${city}` : 'Levering til privat adresse'
        },
        total: subtotal,
        status
      });
    }
    const updated = [...generated, ...orders];
    localStorage.setItem('mm_lase_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  return (
    <div className="@container w-full bg-white text-slate-800 relative overflow-hidden font-sans py-2 px-4 @md:px-8 @lg:px-12">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Webshop Header Bar */}
      <div className="pb-4 @md:pb-5 mb-4 relative z-[100] grid grid-cols-2 @md:flex @md:flex-row items-center @md:justify-between gap-y-4 gap-x-2 @md:gap-4 border-b border-slate-150">
        <div className="flex items-center justify-start gap-3 cursor-pointer select-none order-1 @md:order-none"
          onClick={() => {
            setView('categories');
            setSelectedCatId(null);
            setSelectedSubcatId(null);
            setSelectedBrandId(null);
            setSelectedProductId(null);
            if (isPreviewMode) window.location.hash = 'shop';
          }}
        >
          {(() => {
            const logoType = s.logoType || 'text';
            const logoFontSize = s.logoFontSize ? Number(s.logoFontSize) : 18;
            const logoSrc = s.logoSrc || '';
            const ratio = logoFontSize / 18;

            if (logoType === 'image' && logoSrc) {
              return (
                <div className="relative group">
                  <div 
                    className={`flex items-center justify-center shrink-0 ${!isPreviewMode ? 'cursor-pointer outline-dashed outline-1 outline-transparent hover:outline-slate-300' : ''}`}
                    onClick={(e) => {
                      if (!isPreviewMode) {
                        e.stopPropagation();
                        promptEditImage('setting', '', 'logoSrc');
                      }
                    }}
                  >
                    <img src={logoSrc} alt="Logo" className="max-h-32 object-contain" style={{ height: `${48 * ratio}px` }} />
                  </div>
                  {!isPreviewMode && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-white border border-slate-200 rounded-md shadow-sm p-1 z-50">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateSetting('logoFontSize', String(Math.max(10, logoFontSize - 2))); }}
                        className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold leading-none cursor-pointer border-none"
                      >
                        -
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateSetting('logoFontSize', String(Math.min(72, logoFontSize + 2))); }}
                        className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold leading-none cursor-pointer border-none"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <>
                <div 
                  className="rounded-full border border-amber-400 flex items-center justify-center text-slate-800 font-black font-mono bg-white shadow-sm shrink-0"
                  style={{ width: `${48 * ratio}px`, height: `${48 * ratio}px` }}
                >
                  <EditableText tag="span" isPreviewMode={isPreviewMode} html={logoBadge} 
                    className="text-amber-455 font-extrabold outline-none focus:bg-slate-100 px-0.5 rounded"
                    style={{ fontSize: `${14 * ratio}px` }}
                                                            onBlur={(e) => updateSetting('logoBadge', e.currentTarget.innerHTML)}
                   />
                </div>
                <div className="text-left">
                  <EditableText tag="h2" isPreviewMode={isPreviewMode} html={logoText} 
                    className="font-black tracking-tighter text-slate-900 leading-none uppercase outline-none focus:bg-slate-100 px-0.5 rounded"
                    style={{ fontSize: `${logoFontSize}px` }}
                                                            onBlur={(e) => updateSetting('logoText', e.currentTarget.innerHTML)}
                   />
                  <EditableText tag="span" isPreviewMode={isPreviewMode} html={tagline} 
                    className="text-slate-400 font-bold tracking-widest uppercase block outline-none focus:bg-slate-100 px-0.5 rounded"
                    style={{ fontSize: `${8 * ratio}px`, marginTop: `${4 * ratio}px` }}
                                                            onBlur={(e) => updateSetting('tagline', e.currentTarget.innerHTML)}
                   />
                </div>
              </>
            );
          })()}
        </div>

        {/* Search Bar Container */}
        <div className="search-container-root relative flex-grow w-full @md:max-w-md z-20 order-3 @md:order-none col-span-2 @md:col-span-1">
          <div className="flex items-stretch rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-amber-400 transition-colors">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchInputValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchInputValue(val);
                setShowSuggestions(val.trim().length >= 1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchInputValue);
                }
              }}
              className="w-full text-xs pl-3 pr-8 py-2 border-none bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchInputValue && (
              <button
                onClick={() => {
                  setSearchInputValue('');
                  setShowSuggestions(false);
                }}
                className="px-2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => handleSearchSubmit(searchInputValue)}
              className="px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 flex items-center justify-center border-none cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-slate-955" />
            </button>
          </div>

          {/* Autocomplete Dropdown suggestions list */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-slate-850">
              {getSuggestions(searchInputValue).length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">
                  Ingen resultater fundet
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {getSuggestions(searchInputValue).map((p) => {
                    const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setView('product-detail');
                          setShowSuggestions(false);
                          setSearchInputValue('');
                          if (isPreviewMode) {
                            window.location.hash = `shop/product/${p.id}`;
                          }
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer transition-colors text-left"
                      >
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] text-amber-500 font-bold uppercase tracking-wider leading-none">
                            {brand ? brand.name : ''}
                          </div>
                          <div className="text-xs text-slate-700 font-bold truncate mt-0.5">
                            {p.name}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono font-bold text-slate-900 whitespace-nowrap">
                          {p.price.toLocaleString('da-DK')},- DKK
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-end gap-3 @md:gap-5 order-2 @md:order-none">
          {/* Account Icon */}
          <div className="relative profile-dropdown-root">
            <div 
              onClick={() => {
                if (loggedInUser) {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                } else {
                  setView('login');
                  if (isPreviewMode) window.location.hash = 'shop/login';
                }
              }}
              className="flex flex-col items-center gap-0.5 cursor-pointer text-slate-500 hover:text-slate-900 transition-colors select-none"
            >
              {loggedInUser ? (
                <>
                  <div className="w-5 h-5 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-[10px]">
                    {loggedInUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider truncate max-w-[40px] text-center" title={loggedInUser.name}>
                    {loggedInUser.name.split(' ')[0]}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-slate-750" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">Konto</span>
                </>
              )}
            </div>
            
            {loggedInUser && isProfileDropdownOpen && (
              <div className="absolute top-full right-1/2 translate-x-1/2 @sm:translate-x-0 @sm:right-0 mt-3 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <button
                  onClick={() => {
                    setView('profile');
                    setIsProfileDropdownOpen(false);
                    if (isPreviewMode) window.location.hash = 'shop/profile';
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  Min Profil
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('mm_lase_session');
                    setLoggedInUser(null);
                    setCart([]);
                    setWishlist([]);
                    localStorage.removeItem('mm_lase_cart');
                    localStorage.removeItem('mm_lase_wishlist');
                    setIsProfileDropdownOpen(false);
                    setView('categories');
                    if (isPreviewMode) window.location.hash = 'shop';
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  Log ud
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div 
            onClick={() => alert('Ønskeliste er ikke tilgængelig i denne demo.')}
            className="relative flex flex-col items-center gap-0.5 cursor-pointer text-slate-500 hover:text-slate-900 transition-colors select-none"
          >
            <Heart className="w-5 h-5 text-slate-750" />
            <span className="text-[9px] font-extrabold uppercase tracking-wider">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlist.length}
              </span>
            )}
          </div>

          {/* Cart */}
          <div 
            onClick={() => {
              setView('cart');
              if (isPreviewMode) window.location.hash = 'shop/cart';
            }}
            className="relative flex flex-col items-center gap-0.5 cursor-pointer text-slate-500 hover:text-slate-900 transition-colors select-none"
          >
            <ShoppingCart className="w-5 h-5 text-slate-755" />
            <span className="text-[9px] font-extrabold uppercase tracking-wider">cart</span>
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {getCartItemsCount()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nav Link Bar */}
      <div 
        className={`bg-[#333333] flex items-center justify-between py-1 px-4 @md:px-8 @lg:px-12 -mx-4 @md:-mx-8 @lg:-mx-12 mb-6 relative z-50 select-none ${!isPreviewMode ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all' : ''}`}
        onClick={() => !isPreviewMode && promptEditImage('setting', '', 'navMenuSettings')}
      >
        <div className="flex items-center gap-4 @md:relative">
          <div 
            className="@md:relative"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => {
              setIsMegaMenuOpen(false);
              setMegaMenuHoverCatId(null);
              setMegaMenuHoverSubcatId(null);
            }}
          >
            <button 
              onClick={() => {
                setView('categories');
                setSelectedCatId(null);
                setSelectedSubcatId(null);
                setSelectedBrandId(null);
                setSelectedProductId(null);
                setIsMegaMenuOpen(false);
                if (isPreviewMode) window.location.hash = 'shop';
              }}
              className="flex items-center gap-2 px-4 py-2 font-extrabold uppercase tracking-wider rounded-lg transition-opacity hover:opacity-90 border-none cursor-pointer"
              style={{ backgroundColor: produkterBgColor, color: produkterTextColor, fontSize: `${navMenuFontSize}px` }}
            >
              <span>☰</span>
              <span>Produkter</span>
            </button>

            {/* Mega Menu Flyout */}
            {isMegaMenuOpen && (
              <div 
                className="absolute top-full left-4 right-4 @md:left-0 @md:right-auto mt-2 w-auto @md:w-[800px] min-h-[400px] max-h-[80vh] overflow-y-auto @md:overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col @md:flex-row z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Column 1: Categories */}
                <div className="w-full @md:w-1/3 bg-slate-50 border-b @md:border-b-0 @md:border-r border-slate-200 py-4 shrink-0">
                  <h4 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kategorier</h4>
                  <ul className="space-y-1">
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <button
                          onMouseEnter={() => {
                            setMegaMenuHoverCatId(cat.id);
                            setMegaMenuHoverSubcatId(null);
                          }}
                          onClick={() => {
                            setSelectedCatId(cat.id);
                            setView('subcategories');
                            setIsMegaMenuOpen(false);
                            if (isPreviewMode) window.location.hash = `shop/cat/${cat.id}`;
                          }}
                          className={`w-full text-left px-6 py-2.5 font-bold transition-colors flex justify-between items-center ${
                            megaMenuHoverCatId === cat.id ? 'bg-amber-100' : 'hover:bg-slate-100'
                          }`}
                          style={{ 
                            fontSize: `${megaMenuFontSize}px`,
                            color: megaMenuHoverCatId === cat.id ? megaMenuActiveColor : megaMenuTextColor
                          }}
                        >
                          <span>{cat.name}</span>
                          <span style={{ color: megaMenuTextColor, opacity: 0.5 }}>&rsaquo;</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Subcategories (if category hovered) */}
                {megaMenuHoverCatId && (
                  <div className="w-full @md:w-1/3 bg-white border-b @md:border-b-0 @md:border-r border-slate-100 py-4 shrink-0">
                    <h4 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Underkategorier</h4>
                    <ul className="space-y-1">
                      {subcategories
                        .filter(sub => sub.categoryId === megaMenuHoverCatId)
                        .map(sub => (
                          <li key={sub.id}>
                            <button
                              onMouseEnter={() => setMegaMenuHoverSubcatId(sub.id)}
                              onClick={() => {
                                setSelectedCatId(megaMenuHoverCatId);
                                setSelectedSubcatId(sub.id);
                                setView('subcategory-detail');
                                setIsMegaMenuOpen(false);
                                if (isPreviewMode) window.location.hash = `shop/subcat/${sub.id}`;
                              }}
                              className={`w-full text-left px-6 py-2 font-semibold transition-colors flex justify-between items-center ${
                                megaMenuHoverSubcatId === sub.id ? 'bg-slate-50' : 'hover:bg-slate-50'
                              }`}
                              style={{ 
                                fontSize: `${megaMenuFontSize}px`,
                                color: megaMenuHoverSubcatId === sub.id ? megaMenuActiveColor : megaMenuTextColor
                              }}
                            >
                              <span>{sub.name}</span>
                              <span style={{ color: megaMenuTextColor, opacity: 0.3 }}>&rsaquo;</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Column 3: Products (if subcategory hovered) */}
                {megaMenuHoverSubcatId && (
                  <div className="w-full @md:w-1/3 bg-white py-4 overflow-y-auto max-h-[400px] shrink-0">
                    <h4 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Udvalgte Produkter</h4>
                    <ul className="space-y-3 px-6">
                      {products
                        .filter(p => p.subcategoryId === megaMenuHoverSubcatId)
                        .slice(0, 5) // Show only up to 5 products in mega menu
                        .map(prod => (
                          <li 
                            key={prod.id} 
                            className="group cursor-pointer" 
                            onMouseEnter={() => setMegaMenuHoverProdId(prod.id)}
                            onMouseLeave={() => setMegaMenuHoverProdId(null)}
                            onClick={() => {
                              setSelectedProductId(prod.id);
                              setView('product-detail');
                              setIsMegaMenuOpen(false);
                              if (isPreviewMode) window.location.hash = `shop/product/${prod.id}`;
                            }}
                          >
                            <div className="flex gap-3 items-center">
                              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                              </div>
                              <div>
                                <h5 className="font-bold transition-colors leading-tight line-clamp-1" style={{ 
                                  fontSize: `${megaMenuFontSize}px`,
                                  color: megaMenuHoverProdId === prod.id ? megaMenuActiveColor : megaMenuTextColor
                                }}>
                                  {prod.name}
                                </h5>
                                <span className="font-bold text-slate-400" style={{ fontSize: `${Math.max(8, megaMenuFontSize - 2)}px` }}>{prod.price} kr.</span>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                    <div className="px-6 mt-4 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          setSelectedCatId(megaMenuHoverCatId);
                          setSelectedSubcatId(megaMenuHoverSubcatId);
                          setView('subcategory-detail');
                          setIsMegaMenuOpen(false);
                          if (isPreviewMode) window.location.hash = `shop/subcat/${megaMenuHoverSubcatId}`;
                        }}
                        className="text-[10px] font-black uppercase text-amber-500 hover:text-amber-600 tracking-wider"
                      >
                        Se alle produkter &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 font-bold" style={{ color: navMenuColor, fontSize: `${navMenuFontSize}px` }}>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                if (loggedInUser) {
                  setView('profile');
                  if (isPreviewMode) window.location.hash = 'shop/profile';
                } else {
                  setView('login');
                  if (isPreviewMode) window.location.hash = 'shop/login';
                }
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Order status
            </span>
            <span 
              onClick={(e) => { e.stopPropagation(); alert('Dette er en demo webshop.'); }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              om os
            </span>
            <span 
              onClick={(e) => { e.stopPropagation(); alert('Kontakt os på info@mmlaasesmed.dk'); }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Kontakt os
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Breadcrumbs Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-6 flex-wrap relative z-10">
        <button 
          onClick={() => {
            setView('categories');
            setSelectedCatId(null);
            setSelectedSubcatId(null);
            setSelectedBrandId(null);
            setSelectedProductId(null);
            if (isPreviewMode) {
              window.location.hash = 'shop';
            }
          }}
          className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[10px]"
        >
          Shop Hjem
        </button>
        
        {selectedCatId && activeCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button 
              onClick={() => {
                setView('subcategories');
                setSelectedSubcatId(null);
                setSelectedBrandId(null);
                setSelectedProductId(null);
                if (isPreviewMode) {
                  window.location.hash = `shop/cat/${selectedCatId}`;
                }
              }}
              className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[10px]"
            >
              {activeCategory.name}
            </button>
          </>
        )}

        {selectedSubcatId && activeSubcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button 
              onClick={() => {
                setView('subcategory-detail');
                setSelectedBrandId(null);
                setSelectedProductId(null);
                if (isPreviewMode) {
                  window.location.hash = `shop/subcat/${selectedSubcatId}`;
                }
              }}
              className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[10px]"
            >
              {activeSubcategory.name}
            </button>
          </>
        )}

        {selectedBrandId && activeBrand && selectedCatId !== 'pengeskabe' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              onClick={() => {
                setView('brand-products');
                setSelectedProductId(null);
                if (isPreviewMode) {
                  window.location.hash = `shop/brand/${selectedSubcatId}/${selectedBrandId}`;
                }
              }}
              className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[10px]"
            >
              {activeBrand.name} Produkter
            </button>
          </>
        )}

        {view === 'product-detail' && activeProduct && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white uppercase tracking-wider text-[10px] font-bold">
              {activeProduct.name}
            </span>
          </>
        )}

        {view === 'search-results' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white uppercase tracking-wider text-[10px] font-bold">
              Søgning: {searchQuery}
            </span>
          </>
        )}

        {view === 'cart' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white uppercase tracking-wider text-[10px] font-bold">
              Indkøbskurv
            </span>
          </>
        )}

        {view === 'checkout' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white uppercase tracking-wider text-[10px] font-bold">
              Kasse
            </span>
          </>
        )}

        {view === 'admin' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white uppercase tracking-wider text-[10px] font-bold">
              🔑 Admin Kontrolpanel
            </span>
          </>
        )}

        {view === 'profile' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white uppercase tracking-wider text-[10px] font-bold">
              👤 Min Profil
            </span>
          </>
        )}
      </div>

      <div className="relative z-10">
        {/* VIEW: PROFILE */}
        {view === 'profile' && loggedInUser && (
          <div className="space-y-6 animate-in fade-in duration-300 text-left">
            {/* Back button & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setView('categories');
                  if (isPreviewMode) {
                    window.location.hash = 'shop';
                  }
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Bruger</span>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase">Min Profil</h3>
              </div>
            </div>

            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <User className="w-6 h-6 text-amber-500" />
                Min Profil & Ordrehistorik
              </h3>
              <p className="text-xs text-slate-500 mt-1">Se dine profiloplysninger og følg dine ordrer her.</p>
            </div>

            <div className="grid @md:grid-cols-3 gap-6">
              {/* Left Column: User Profile Info */}
              <div className="@md:col-span-1 space-y-4">
                <div className="bg-white border border-slate-200 p-5 rounded-3xl relative overflow-hidden space-y-4 shadow-xs">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    Kontooplysninger
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Navn</span>
                      <span className="text-slate-800 font-semibold text-sm">{loggedInUser.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">E-mail</span>
                      <span className="text-slate-800 font-semibold">{loggedInUser.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Telefon</span>
                      <span className="text-slate-800 font-semibold">{loggedInUser.phone || 'Ikke angivet'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Standardadresse</span>
                      <span className="text-slate-800 font-semibold leading-relaxed block">{loggedInUser.address || 'Ikke angivet'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order History list */}
              <div className="@md:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 p-5 rounded-3xl relative overflow-hidden space-y-4 shadow-xs">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    Dine Bestillinger
                  </h4>

                  {orders.filter(o => o.customer.email.toLowerCase() === loggedInUser.email.toLowerCase()).length === 0 ? (
                    <div className="py-8 text-center text-slate-450 text-xs">
                      Du har endnu ikke foretaget nogen ordrer hos os.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders
                        .filter(o => o.customer.email.toLowerCase() === loggedInUser.email.toLowerCase())
                        .map(order => {
                          const isRefunded = order.status === 'annulleret' || order.refundRequested;
                          return (
                            <div key={order.id} className="border border-slate-200 bg-slate-50 rounded-2xl p-4 space-y-3 transition-all hover:border-slate-300">
                              {/* Order summary header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                                <div>
                                  <span className="font-mono text-xs font-black text-amber-600">{order.id}</span>
                                  <span className="text-[10px] text-slate-400 block">{order.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                    order.status === 'modtaget' ? 'bg-indigo-50 text-indigo-600 border border-indigo-150' :
                                    order.status === 'godkendt' ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                                    order.status === 'afsendt' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                                    'bg-rose-50 text-rose-700 border border-rose-150'
                                  }`}>
                                    {order.status === 'modtaget' ? 'Modtaget' :
                                     order.status === 'godkendt' ? 'Godkendt' :
                                     order.status === 'afsendt' ? 'Afsendt' : 'Annulleret'}
                                  </span>

                                  {order.refundRequested && (
                                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-150 text-[8px] font-black uppercase tracking-wider">
                                      Refundering Anmodet
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Order items list */}
                              <div className="space-y-1.5">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600">
                                      {item.quantity}x {item.product.name}
                                    </span>
                                    <span className="font-mono text-slate-500">
                                      {(item.product.price * item.quantity).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Total and Refund action */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-200">
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Beløb</span>
                                  <span className="text-sm font-black text-slate-800 font-mono">
                                    {order.subtotal.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK
                                  </span>
                                </div>

                                {!isRefunded && (
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Indtast venligst årsagen til din refunderingsanmodning:');
                                      if (reason !== null) {
                                        requestOrderRefund(order.id, reason);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                                  >
                                    Anmod om refundering
                                  </button>
                                )}
                              </div>

                              {order.refundRequested && order.refundReason && (
                                <div className="p-2.5 bg-rose-50 border border-rose-100 text-[11px] rounded-lg text-slate-500 leading-normal">
                                  <span className="font-bold text-rose-600 uppercase text-[9px] tracking-wider block mb-0.5">Din refunderingsårsag</span>
                                  "{order.refundReason}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SEARCH RESULTS */}
        {view === 'search-results' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 cursor-pointer hover:text-amber-500 transition-colors mb-6 select-none"
              onClick={() => {
                setView('categories');
                if (isPreviewMode) {
                  window.location.hash = 'shop';
                }
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Tilbage til shop</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Søgeresultater for "{searchQuery}"</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fundet {products.filter(p => productMatchesQuery(p, searchQuery)).length} produkter
              </p>
            </div>

            {products.filter(p => productMatchesQuery(p, searchQuery)).length === 0 ? (
              <div className="py-12 text-center bg-slate-800/40 border border-slate-800 rounded-3xl p-8">
                <p className="text-slate-400 text-sm">Ingen produkter matcher din søgning.</p>
                <p className="text-slate-505 text-xs mt-1">Prøv med andre søgeord (f.eks. cylinder, hængelås, sølv, rund, kube).</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${getGridCols(1, 2, 3)}`}>
                {products.filter(p => productMatchesQuery(p, searchQuery)).map(p => {
                  const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
                  const brandName = brand ? brand.name : '';
                  const badgeHTML = p.badges && p.badges.length > 0 ? p.badges[0] : (p.badge || '');
                  return (
                    <div key={p.id} className="group relative bg-slate-800/40 border border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                      {badgeHTML && (
                        <span className="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                          {badgeHTML}
                        </span>
                      )}
                      <div 
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setView('product-detail');
                          if (isPreviewMode) {
                            window.location.hash = `shop/product/${p.id}`;
                          }
                        }}
                        className="relative w-full aspect-square bg-slate-800 overflow-hidden cursor-pointer"
                      >
                        <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div 
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setView('product-detail');
                            if (isPreviewMode) {
                              window.location.hash = `shop/product/${p.id}`;
                            }
                          }}
                          className="cursor-pointer"
                        >
                          <div className="text-[10px] text-amber-450 font-bold uppercase tracking-wider mb-1">{brandName}</div>
                          <h4 className="text-base font-extrabold text-white leading-snug tracking-tight mb-2 truncate group-hover:text-amber-400 transition-colors">{p.name}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{p.description}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between gap-4 mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris</span>
                            <span className="text-base font-black text-white mt-1 leading-none">{p.price.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setView('product-detail');
                              if (isPreviewMode) {
                                window.location.hash = `shop/product/${p.id}`;
                              }
                            }}
                            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none flex items-center gap-1.5 select-none shrink-0"
                          >
                            <span>Se Produkt</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 1: MAIN CATEGORIES */}
        {view === 'categories' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="text-center max-w-lg mx-auto mb-4">
              <EditableText tag="h3" isPreviewMode={isPreviewMode} html={productsTitle} 
                className="text-3xl font-extrabold text-slate-900 outline-none focus:bg-slate-100 px-1 rounded inline-block"
                                                onBlur={(e) => updateSetting('productsTitle', e.currentTarget.innerHTML)}
               />
            </div>

            {/* Dynamic Categories Banners */}
            <div className="space-y-6 pb-6">
              {categories.map((cat, index) => {
                const imgUrl = cat.image || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80';
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={cat.id} 
                    className="relative group/catblock flex flex-col @md:flex-row bg-slate-50 min-h-[320px]"
                    style={{
                      '--cat-img-w': `${categoryImageWidth}%`,
                      '--cat-txt-w': `${100 - categoryImageWidth}%`
                    } as React.CSSProperties}
                  >
                    {!isPreviewMode && (
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 opacity-0 group-hover/catblock:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveCategory(index, 'up'); }}
                          disabled={index === 0}
                          className="w-10 h-10 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-amber-500 hover:border-amber-400 disabled:opacity-30 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                          title="Flyt Kategori Op"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveCategory(index, 'down'); }}
                          disabled={index === categories.length - 1}
                          className="w-10 h-10 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-amber-500 hover:border-amber-400 disabled:opacity-30 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                          title="Flyt Kategori Ned"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {isEven ? (
                      <>
                        <div className="w-full @md:w-[length:var(--cat-img-w)] h-48 @md:h-auto relative shrink-0">
                          <img 
                            src={imgUrl} 
                            alt={cat.name} 
                            className={`absolute inset-0 w-full h-full object-cover ${!isPreviewMode ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                            onClick={() => promptEditImage('category', cat.id, 'image')}
                          />
                        </div>
                        <div className="w-full @md:w-[length:var(--cat-txt-w)] p-6 @md:p-12 @lg:p-16 flex flex-col items-center justify-center text-center space-y-6">
                          <div className="text-xl @md:text-2xl @lg:text-3xl text-slate-900 leading-snug max-w-2xl">
                            <EditableText tag="span" isPreviewMode={isPreviewMode} html={cat.name} 
                              className="font-black outline-none focus:bg-white px-1 py-0.5 rounded inline-block"
                                                                                          onBlur={(e) => updateCategoryField(cat.id, 'name', e.currentTarget.innerHTML)}
                                                           />
                            {cat.description && (
                              <>
                                <span className="font-medium mx-1.5">-</span>
                                <EditableText tag="span" isPreviewMode={isPreviewMode} html={cat.description} 
                                  className="font-medium outline-none focus:bg-white px-1 py-0.5 rounded inline-block"
                                                                                                      onBlur={(e) => updateCategoryField(cat.id, 'description', e.currentTarget.innerHTML)}
                                                                   />
                              </>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedCatId(cat.id);
                              setView('subcategories');
                              setSelectedSubcatId(null);
                              setSelectedBrandId(null);
                              setSelectedProductId(null);
                              if (isPreviewMode) window.location.hash = `shop/cat/${cat.id}`;
                            }}
                            className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm @lg:text-base rounded-sm transition-colors border-none cursor-pointer"
                          >
                            {bt('Se produkter', 'See products')}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full @md:w-[length:var(--cat-txt-w)] p-6 @md:p-12 @lg:p-16 flex flex-col items-center justify-center text-center space-y-6 order-2 @md:order-1">
                          <div className="text-xl @md:text-2xl @lg:text-3xl text-slate-900 leading-snug max-w-2xl">
                            <EditableText tag="span" isPreviewMode={isPreviewMode} html={cat.name} 
                              className="font-black outline-none focus:bg-white px-1 py-0.5 rounded inline-block"
                                                                                          onBlur={(e) => updateCategoryField(cat.id, 'name', e.currentTarget.innerHTML)}
                                                           />
                            {cat.description && (
                              <>
                                <span className="font-medium mx-1.5">-</span>
                                <EditableText tag="span" isPreviewMode={isPreviewMode} html={cat.description} 
                                  className="font-medium outline-none focus:bg-white px-1 py-0.5 rounded inline-block"
                                                                                                      onBlur={(e) => updateCategoryField(cat.id, 'description', e.currentTarget.innerHTML)}
                                                                   />
                              </>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedCatId(cat.id);
                              setView('subcategories');
                              setSelectedSubcatId(null);
                              setSelectedBrandId(null);
                              setSelectedProductId(null);
                              if (isPreviewMode) window.location.hash = `shop/cat/${cat.id}`;
                            }}
                            className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm @lg:text-base rounded-sm transition-colors border-none cursor-pointer"
                          >
                            {bt('Se produkter', 'See products')}
                          </button>
                        </div>
                        <div className="w-full @md:w-[length:var(--cat-img-w)] h-48 @md:h-auto relative shrink-0 order-1 @md:order-2">
                          <img 
                            src={imgUrl} 
                            alt={cat.name} 
                            className={`absolute inset-0 w-full h-full object-cover ${!isPreviewMode ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                            onClick={() => promptEditImage('category', cat.id, 'image')}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Newsletter Sign-up */}
            <div className="bg-[#1f2937] text-white rounded-3xl p-6 @md:p-8 flex flex-col @md:flex-row items-center justify-between gap-4 border border-slate-800 text-left shadow-lg">
              <div 
                className="space-y-1 w-full"
                style={{
                  maxWidth: s.newsletterLeftWidth !== undefined ? `${s.newsletterLeftWidth}px` : '512px',
                  paddingLeft: s.newsletterLeftPaddingLeft !== undefined ? `${s.newsletterLeftPaddingLeft}px` : '0px',
                  paddingRight: s.newsletterLeftPaddingRight !== undefined ? `${s.newsletterLeftPaddingRight}px` : '0px',
                }}
              >
                <EditableText tag="h4" isPreviewMode={isPreviewMode} html={newsletterTitle} 
                  className="text-lg font-extrabold uppercase tracking-wider outline-none focus:bg-slate-700 focus:text-white px-1 rounded -ml-1 transition-colors"
                                                      onBlur={(e) => updateSetting('newsletterTitle', e.currentTarget.innerHTML)}
                 />
                <EditableText tag="p" isPreviewMode={isPreviewMode} html={newsletterDesc} 
                  className="text-xs text-slate-400 outline-none focus:bg-slate-700 focus:text-white px-1 rounded -ml-1 transition-colors mt-1"
                                                      onBlur={(e) => updateSetting('newsletterDesc', e.currentTarget.innerHTML)}
                 />
              </div>
              <div 
                className="flex items-stretch rounded-xl overflow-hidden bg-white w-full @md:w-auto border border-slate-700"
                style={{
                  minWidth: s.newsletterRightWidth !== undefined ? `${s.newsletterRightWidth}px` : '300px',
                  paddingLeft: s.newsletterRightPaddingLeft !== undefined ? `${s.newsletterRightPaddingLeft}px` : '0px',
                  paddingRight: s.newsletterRightPaddingRight !== undefined ? `${s.newsletterRightPaddingRight}px` : '0px',
                }}
              >
                <input 
                  type="email" 
                  placeholder={newsletterPlaceholder} 
                  className={`px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full border-none ${!isPreviewMode ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                  onClick={(e) => {
                    if (!isPreviewMode) {
                      e.preventDefault();
                      const val = window.prompt('Rediger placeholder tekst:', newsletterPlaceholder);
                      if (val !== null) updateSetting('newsletterPlaceholder', val);
                    }
                  }}
                  readOnly={!isPreviewMode}
                />
                <button 
                  onClick={(e) => {
                    if (isPreviewMode) {
                      alert('Tak for din tilmelding!');
                    } else {
                      e.preventDefault();
                    }
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider border-none cursor-pointer transition-colors shrink-0 outline-none focus:ring-2 focus:ring-slate-900"
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateSetting('newsletterBtnText', e.currentTarget.innerText)}
                >
                  {newsletterBtnText}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-6 pt-6">
              {[
                { title: badge1Title, desc: badge1Desc, img: badge1Image, tKey: 'badge1Title', dKey: 'badge1Desc', iKey: 'badge1Image' },
                { title: badge2Title, desc: badge2Desc, img: badge2Image, tKey: 'badge2Title', dKey: 'badge2Desc', iKey: 'badge2Image' },
                { title: badge3Title, desc: badge3Desc, img: badge3Image, tKey: 'badge3Title', dKey: 'badge3Desc', iKey: 'badge3Image' },
                { title: badge4Title, desc: badge4Desc, img: badge4Image, tKey: 'badge4Title', dKey: 'badge4Desc', iKey: 'badge4Image' },
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="relative group">
                    <div 
                      className={`cursor-pointer ${!isPreviewMode ? 'hover:opacity-80 transition-opacity outline-dashed outline-1 outline-transparent hover:outline-slate-300' : ''}`}
                      onClick={() => promptEditImage('setting', '', badge.iKey)}
                      style={{ width: `${badgeSize}px`, height: `${badgeSize}px` }}
                    >
                      {badge.img.startsWith('data:image') || badge.img.startsWith('http') ? (
                        <img src={badge.img} className="w-full h-full object-contain" alt={badge.title} />
                      ) : (
                        <span className="text-3xl flex items-center justify-center w-full h-full" style={{ fontSize: `${badgeSize * 0.8}px` }}>{badge.img}</span>
                      )}
                    </div>
                    {!isPreviewMode && (
                      <div className="absolute -bottom-4 right-0 @md:-right-4 flex items-center gap-1 bg-indigo-600 border border-indigo-700 rounded-lg shadow-xl p-1 z-30">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateSetting('badgeSize', String(Math.max(4, badgeSize - 10))); }}
                          className="w-6 h-6 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 rounded text-white font-bold text-lg leading-none cursor-pointer border-none"
                          title="Gør mindre"
                        >
                          -
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateSetting('badgeSize', String(Math.min(600, badgeSize + 10))); }}
                          className="w-6 h-6 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 rounded text-white font-bold text-lg leading-none cursor-pointer border-none"
                          title="Gør større"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                  <EditableText tag="h5" isPreviewMode={isPreviewMode} html={badge.title} 
                    className="font-black uppercase text-slate-900 tracking-wider outline-none focus:bg-slate-100 px-1 rounded"
                    style={{ fontSize: `${badgeTitleSize}px` }}
                                                            onBlur={(e) => updateSetting(badge.tKey, e.currentTarget.innerHTML)}
                   />
                  <EditableText tag="p" isPreviewMode={isPreviewMode} html={badge.desc} 
                    className="text-slate-500 leading-relaxed max-w-[200px] outline-none focus:bg-slate-100 px-1 rounded"
                    style={{ fontSize: `${badgeTextSize}px` }}
                                                            onBlur={(e) => updateSetting(badge.dKey, e.currentTarget.innerHTML)}
                   />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: SUBCATEGORIES LIST */}
        {view === 'subcategories' && activeCategory && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center gap-3 mb-6 text-left">
              <button 
                onClick={() => {
                  setView('categories');
                  if (isPreviewMode) {
                    window.location.hash = 'shop';
                  }
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Kategori</span>
                <EditableText tag="h3" isPreviewMode={isPreviewMode} html={activeCategory.name} 
                  className="text-xl font-extrabold text-white uppercase outline-none focus:bg-slate-800 px-1 rounded"
                                                      onBlur={(e) => updateCategoryField(activeCategory.id, 'name', e.currentTarget.innerHTML)}
                 />
              </div>
            </div>

            <div className={`grid gap-6 ${getGridCols(1, 2, 3)}`}>
              {subcategories
                .filter(sub => sub.categoryId === selectedCatId)
                .map(subcategory => {
                  const subImg = subcategory.image || 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600&auto=format&fit=crop&q=80';
                  return (
                    <div 
                      key={subcategory.id}
                      onClick={() => {
                        setSelectedSubcatId(subcategory.id);
                        setView('subcategory-detail');
                        if (isPreviewMode) {
                          window.location.hash = `shop/subcat/${subcategory.id}`;
                        }
                      }}
                      className={`bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400/50 rounded-2xl cursor-pointer group transition-all duration-300 text-left flex flex-col overflow-hidden shadow-sm`}
                    >
                      {/* Image Block */}
                      <div className="w-full h-40 bg-slate-100 border-b border-slate-100 relative">
                        <img 
                          src={subImg} 
                          alt={subcategory.name} 
                          className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity ${!isPreviewMode ? 'hover:opacity-80' : ''}`}
                          onClick={(e) => {
                            if (!isPreviewMode) {
                              e.stopPropagation();
                              promptEditImage('subcategory', subcategory.id, 'image');
                            }
                          }}
                        />
                      </div>
                      <div className={`flex flex-col justify-between flex-grow ${getCardPadding('p-4', 'p-5', 'p-5')}`}>
                        <div>
                          <EditableText tag="h4" isPreviewMode={isPreviewMode} html={subcategory.name} 
                            className="text-sm font-extrabold uppercase text-slate-900 group-hover:text-amber-600 transition-colors outline-none focus:bg-slate-100 px-1 rounded"
                                                                                    onBlur={(e) => updateSubcategoryField(subcategory.id, 'name', e.currentTarget.innerHTML)}
                                                       />
                          <EditableText tag="p" isPreviewMode={isPreviewMode} html={subcategory.description} 
                            className="text-xs text-slate-600 mt-2 leading-relaxed outline-none focus:bg-slate-100 px-1 rounded line-clamp-3 font-medium"
                                                                                    onBlur={(e) => updateSubcategoryField(subcategory.id, 'description', e.currentTarget.innerHTML)}
                                                       />
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Se beskrivelse</span>
                          <span className="text-amber-500 text-xs font-black">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* VIEW 3: SUBCATEGORY DETAIL & LINKED BRANDS */}
        {view === 'subcategory-detail' && activeSubcategory && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Back button & Breadcrumb header */}
            <div className="flex items-center gap-3 text-left">
              <button 
                onClick={() => {
                  setView('categories');
                  if (isPreviewMode) {
                    window.location.hash = 'shop';
                  }
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Kategori</span>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase">
                  {activeCategory ? activeCategory.name : 'Adgangskontrol'} &gt; {activeSubcategory.name}
                </h3>
              </div>
            </div>

            {/* Banner Header Image with overlay text */}
            <div 
              className="relative h-64 overflow-hidden shadow-md flex items-center justify-center bg-[#f3f4f6] -mx-4 @md:-mx-8 @lg:-mx-12 group"
              onClick={() => { if (!isPreviewMode) promptEditImage('subcategory', activeSubcategory.id, 'image'); }}
            >
              <img 
                src={activeSubcategory.image || "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=80"} 
                alt={activeSubcategory.name}
                className={`absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity ${!isPreviewMode ? 'group-hover:opacity-100 cursor-pointer' : ''}`}
              />
              <div className="absolute inset-0 bg-black/35 pointer-events-none" />
              
              {!isPreviewMode && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" /> Skift Banner
                </div>
              )}
              <EditableText tag="h2" isPreviewMode={isPreviewMode} html={activeSubcategory.name} 
                className="relative z-10 text-4xl @md:text-5xl font-black text-white uppercase tracking-wider font-sans outline-none focus:bg-slate-900 px-2 rounded"
                                                onBlur={(e) => updateSubcategoryField(activeSubcategory.id, 'name', e.currentTarget.innerHTML)}
               />
            </div>

            {/* Section 1: Intro + Vigtige Fordele */}
            <div className="grid grid-cols-1 @md:grid-cols-3 gap-8 text-left">
              <div className="@md:col-span-2 space-y-4">
                <h4 
                  className="text-xl font-extrabold text-slate-900 outline-none focus:bg-slate-100 px-1 rounded"
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateSetting(`subcatIntroTitle_${activeSubcategory.id}`, e.currentTarget.innerText)}
                >
                  {s[`subcatIntroTitle_${activeSubcategory.id}`] || `${activeSubcategory.name}-forbedrede løsninger til sikre og holdbare døre`}
                </h4>
                <EditableText tag="p" isPreviewMode={isPreviewMode} html={activeSubcategory.detailedDescription || activeSubcategory.description} 
                  className="text-sm text-slate-500 leading-relaxed font-medium outline-none focus:bg-slate-100 px-2 rounded"
                                                      onBlur={(e) => updateSubcategoryField(activeSubcategory.id, 'detailedDescription', e.currentTarget.innerHTML)}
                 />
              </div>
              <div className="bg-amber-400 text-slate-900 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h5 
                    className="text-sm font-black uppercase tracking-wider mb-4 outline-none focus:bg-amber-300 px-1 rounded"
                    contentEditable={!isPreviewMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateSetting(`subcatBenefitsTitle_${activeSubcategory.id}`, e.currentTarget.innerText)}
                  >
                    {s[`subcatBenefitsTitle_${activeSubcategory.id}`] || 'Vigtige fordele'}
                  </h5>
                  <ul 
                    className="text-xs space-y-2.5 list-none p-0 font-extrabold outline-none focus:bg-amber-300 px-1 rounded"
                    contentEditable={!isPreviewMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateSetting(`subcatBenefitsList_${activeSubcategory.id}`, e.currentTarget.innerText)}
                  >
                    {(s[`subcatBenefitsList_${activeSubcategory.id}`] || '• Kan bruges til nødudgang og flugtveje\n• Kan opsætte med passagetid (låses kun uden for åbningstid)\n• Kan montere med rigtig lås selvom bruger blot åbner døren med håndtaget.\n• Kan låses remote eller via tidsindstilling.').split('\n').map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Video + Finding Right Locks */}
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 text-left items-center">
              <div className="space-y-4">
                <h4 
                  className="text-xl font-extrabold text-slate-900 outline-none focus:bg-slate-100 px-1 rounded"
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateSetting(`subcatVideoTitle_${activeSubcategory.id}`, e.currentTarget.innerText)}
                >
                  {s[`subcatVideoTitle_${activeSubcategory.id}`] || `Find de rette elektroniske ${activeSubcategory.name.toLowerCase()} hos mmlaasesmed`}
                </h4>
                <p 
                  className="text-xs text-slate-505 leading-relaxed font-medium outline-none focus:bg-slate-100 px-1 rounded"
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateSetting(`subcatVideoDesc1_${activeSubcategory.id}`, e.currentTarget.innerText)}
                >
                  {s[`subcatVideoDesc1_${activeSubcategory.id}`] || `Her finder du vores nøje udvalgte sortiment af elektroniske ${activeSubcategory.name.toLowerCase()} fra vores leverandører. Vi har elektroniske ${activeSubcategory.name.toLowerCase()} til praktisk talt alle formål, uanset dit behov og hvilken opgave, du står overfor.`}
                </p>
                <p 
                  className="text-xs text-slate-505 leading-relaxed font-medium outline-none focus:bg-slate-100 px-1 rounded"
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateSetting(`subcatVideoDesc2_${activeSubcategory.id}`, e.currentTarget.innerText)}
                >
                  {s[`subcatVideoDesc2_${activeSubcategory.id}`] || `Om du skal bruge elektroniske ${activeSubcategory.name.toLowerCase()} i dit daglige arbejde eller blot en gang imellem, er professionel eller gør-det-selv'er, så har vi produkter, der passer til dit behov.`}
                </p>
              </div>
              {/* Video placeholder */}
              {(() => {
                let embedUrl = s[`subcatVideoUrl_${activeSubcategory.id}`] || '';
                if (embedUrl) {
                  if (embedUrl.includes('youtube.com/watch?v=')) {
                    embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
                    const ampIdx = embedUrl.indexOf('&');
                    if (ampIdx !== -1) embedUrl = embedUrl.substring(0, ampIdx);
                  } else if (embedUrl.includes('youtu.be/')) {
                    embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                  } else if (embedUrl.includes('vimeo.com/') && !embedUrl.includes('player.vimeo.com')) {
                    const match = embedUrl.match(/vimeo\.com\/(\d+)/);
                    if (match) {
                      embedUrl = `https://player.vimeo.com/video/${match[1]}`;
                    }
                  }
                }
                
                return (
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-md group bg-[#1f2937] flex items-center justify-center border border-slate-200">
                    {embedUrl ? (
                      <iframe 
                        src={embedUrl} 
                        title="Video" 
                        className="absolute inset-0 w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <img 
                          src={s[`subcatVideoImg_${activeSubcategory.id}`] || "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80"} 
                          alt="Video explanation" 
                          className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 ${!isPreviewMode ? 'group-hover:opacity-100' : 'group-hover:scale-102'}`}
                        />
                        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                        <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                          <span className="text-slate-900 text-xl font-extrabold ml-1">▶</span>
                        </div>
                      </>
                    )}
                    
                    {!isPreviewMode && (
                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            promptEditImage('setting', '', `subcatVideoImg_${activeSubcategory.id}`);
                          }}
                          className="bg-white/90 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow hover:bg-white transition-colors border-none cursor-pointer"
                        >
                          Skift Billede
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = window.prompt("Indtast video URL (f.eks. YouTube eller Vimeo):", s[`subcatVideoUrl_${activeSubcategory.id}`] || "");
                            if (url !== null) {
                              updateSetting(`subcatVideoUrl_${activeSubcategory.id}`, url);
                            }
                          }}
                          className="bg-white/90 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow hover:bg-white transition-colors border-none cursor-pointer"
                        >
                          Skift Video URL
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Brands Promotional Cards Grid or Direct Products Grid if no brands associated */}
            {(!activeSubcategory.brandIds || activeSubcategory.brandIds.length === 0) ? (
              <>
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="text-left">
                    <h4 className="text-lg font-extrabold text-slate-900 uppercase">Produkter i {activeSubcategory.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">Udforsk vores udvalg af {activeSubcategory.name.toLowerCase()} godkendt til det nordiske marked.</p>
                  </div>

                  {products.filter(p => p.subcategoryId === activeSubcategory.id).length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-500 text-xs">
                      Der blev ikke fundet nogen produkter under denne kategori.
                    </div>
                  ) : (
                    <div className={`grid gap-6 ${getGridCols(1, 2, 3)}`}>
                      {products
                        .filter(p => p.subcategoryId === activeSubcategory.id)
                        .map(p => {
                          const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
                          const brandName = brand ? brand.name : '';
                          const badgeText = p.badges && p.badges.length > 0 ? p.badges[0] : (p.badge || '');
                          const formattedPrice = p.price.toLocaleString('da-DK', { minimumFractionDigits: 2 });
                          
                          return (
                            <div key={p.id} className="group relative bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                              {badgeText && (
                                <span className="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                                  {badgeText}
                                </span>
                              )}
                              <div 
                                onClick={() => {
                                  setSelectedProductId(p.id);
                                  setView('product-detail');
                                  if (isPreviewMode) {
                                    window.location.hash = `shop/product/${p.id}`;
                                  }
                                }}
                                className="relative w-full aspect-square bg-slate-50 overflow-hidden cursor-pointer"
                              >
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              </div>
                              <div className="p-6 flex-1 flex flex-col justify-between">
                                <div 
                                  onClick={() => {
                                    setSelectedProductId(p.id);
                                    setView('product-detail');
                                    if (isPreviewMode) {
                                      window.location.hash = `shop/product/${p.id}`;
                                    }
                                  }}
                                  className="cursor-pointer flex-1"
                                >
                                  <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-1">{brandName}</div>
                                  <h4 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight mb-2 truncate group-hover:text-amber-550 transition-colors">{p.name}</h4>
                                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{p.description}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris</span>
                                    <span className="text-base font-black text-slate-950 mt-1 leading-none">{formattedPrice} DKK</span>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      setSelectedProductId(p.id);
                                      setView('product-detail');
                                      if (isPreviewMode) {
                                        window.location.hash = `shop/product/${p.id}`;
                                      }
                                    }}
                                    className="bg-amber-400 hover:bg-amber-500 text-slate-955 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none flex items-center gap-1.5 select-none shrink-0"
                                  >
                                    <span>Se Produkt</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Recommendations Block */}
                <div className="space-y-6 pt-10 border-t border-slate-150 text-left">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900 uppercase">Andre kategorier</h4>
                    <p className="text-xs text-slate-400 mt-1">Udforsk vores andre relaterede sikringsløsninger.</p>
                  </div>
                  <div className="grid grid-cols-1 @md:grid-cols-3 gap-6">
                    {subcategories
                      .filter(s => s.categoryId === activeSubcategory.categoryId && s.id !== activeSubcategory.id)
                      .map(s => {
                        let icon = activeCategory?.icon || '🗄️';
                        if (s.id === 'vaerdiskabe') icon = '🏢';
                        if (s.id === 'brandskabe') icon = '🔥';
                        if (s.id === 'noegleskabe') icon = '🔑';
                        
                        return (
                          <div 
                            key={s.id}
                            onClick={() => {
                              setSelectedSubcatId(s.id);
                              setView('subcategory-detail');
                              if (isPreviewMode) {
                                window.location.hash = `shop/subcat/${s.id}`;
                              }
                            }}
                            className="group flex items-center gap-4 p-5 rounded-3xl border border-slate-150 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="text-3xl shrink-0">{icon}</div>
                            <div className="flex-grow min-w-0">
                              <h5 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-500 transition-colors truncate">{s.name}</h5>
                              <p className="text-slate-400 text-[11px] truncate mt-0.5">{s.description}</p>
                            </div>
                            <span className="text-xs font-bold text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                {(!isPreviewMode || s[`hideBrandHeader_${activeSubcategory.id}`] !== 'true') && (
                  <div className={`text-left relative group/brandheader ${s[`hideBrandHeader_${activeSubcategory.id}`] === 'true' ? 'opacity-30' : ''}`}>
                    <h4 
                      className="text-lg font-extrabold text-slate-900 outline-none focus:bg-slate-100 px-1 rounded inline-block"
                      contentEditable={!isPreviewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => updateSetting(`subcatBrandTitle_${activeSubcategory.id}`, e.currentTarget.innerText)}
                    >
                      {s[`subcatBrandTitle_${activeSubcategory.id}`] ?? 'Vælg Producent (Brand)'}
                    </h4>
                    <br/>
                    <p 
                      className="text-xs text-slate-400 mt-1 outline-none focus:bg-slate-100 px-1 rounded inline-block"
                      contentEditable={!isPreviewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => updateSetting(`subcatBrandDesc_${activeSubcategory.id}`, e.currentTarget.innerText)}
                    >
                      {s[`subcatBrandDesc_${activeSubcategory.id}`] ?? 'Vi fører kun forsikringsgodkendte mærker, der er testet til det barske nordiske klima.'}
                    </p>
                    
                    {!isPreviewMode && (
                      <button 
                        onClick={() => updateSetting(`hideBrandHeader_${activeSubcategory.id}`, s[`hideBrandHeader_${activeSubcategory.id}`] === 'true' ? 'false' : 'true')}
                        className="absolute top-0 right-0 opacity-0 group-hover/brandheader:opacity-100 px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-full text-[10px] font-bold transition-all border-none cursor-pointer"
                      >
                        {s[`hideBrandHeader_${activeSubcategory.id}`] === 'true' ? 'Vis igen' : 'Skjul i preview'}
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
                  {WEBSHOP_BRANDS
                    .filter(brand => activeSubcategory.brandIds.includes(brand.id))
                    .map(brand => {
                      const bgImg = brand.id === 'stroxx' 
                        ? "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80";
                      const startingPrice = brand.id === 'stroxx' ? '2.299,00 DKK' : '2.580,00 DKK';
                      const brandSubtext = brand.id === 'stroxx' ? 'Unlock the future with STROXX' : 'Adgangskontrol (ADK) – nemt at gøre det sikkert';

                      return (
                        <div 
                          key={brand.id}
                          onClick={() => {
                            setSelectedBrandId(brand.id);
                            setView('brand-products');
                            if (isPreviewMode) {
                              window.location.hash = `shop/brand/${selectedSubcatId}/${brand.id}`;
                            }
                          }}
                          className="relative h-64 rounded-3xl overflow-hidden shadow-md group cursor-pointer flex flex-col justify-end p-6 text-left"
                        >
                          <img 
                            src={bgImg} 
                            alt={brand.name} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
                          <div className="relative z-10 space-y-2">
                            <h5 className="text-2xl font-black text-white uppercase tracking-wide leading-none">{brand.name}</h5>
                            <p className="text-xs text-slate-200 font-medium max-w-sm">{brandSubtext}</p>
                            <button 
                              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all border-none"
                            >
                              Fra {startingPrice}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: BRAND PRODUCTS (PRODUCTS LIST) */}
        {view === 'brand-products' && activeSubcategory && activeBrand && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Breadcrumbs / Back button */}
            <div className="flex items-center gap-3 text-left">
              <button 
                onClick={() => {
                  setView('subcategory-detail');
                  if (isPreviewMode) {
                    window.location.hash = `shop/subcat/${selectedSubcatId}`;
                  }
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                  {activeBrand.name} Produkter
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase leading-tight">
                  {activeSubcategory.name}
                </h3>
              </div>
            </div>

            {/* Two column layout: Sidebar filters on left, product rows on right */}
            <div className="flex flex-col @lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="w-full @lg:w-64 shrink-0 text-left space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-905 tracking-wider">Kategorier</h4>
                  <ul className="text-xs font-bold text-slate-600 space-y-2 list-none p-0">
                    <li className="text-amber-500 font-black cursor-pointer uppercase">▶ {activeSubcategory.name}</li>
                    <li className="hover:text-slate-900 cursor-pointer pl-4">Cylindre</li>
                    <li className="hover:text-slate-900 cursor-pointer pl-4">Software & Tilbehør</li>
                    <li className="hover:text-slate-900 cursor-pointer pl-4">Væglæsere & Styreenheder</li>
                  </ul>
                </div>

                <div className="border-t border-slate-150 pt-4 space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-905 tracking-wider">Filtrér efter</h4>
                  
                  {/* Filter Group: Anvendes til */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Avendes til</h5>
                    <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                          Evolo/Exivo
                        </span>
                        <span className="text-slate-400 text-[10px]">5</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                          Evolo
                        </span>
                        <span className="text-slate-400 text-[10px]">3</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer opacity-50">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" disabled className="rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                          Smart lock
                        </span>
                        <span className="text-slate-400 text-[10px]">0</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                          dKey
                        </span>
                        <span className="text-slate-400 text-[10px]">1</span>
                      </label>
                    </div>
                  </div>

                  {/* Filter Group: Type */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Type</h5>
                    <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-slate-300 text-amber-500" />
                          Evolo/Exivo
                        </span>
                        <span className="text-slate-400 text-[10px]">5</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-slate-300 text-amber-500" />
                          Evolo
                        </span>
                        <span className="text-slate-400 text-[10px]">3</span>
                      </label>
                    </div>
                  </div>

                  {/* Filter Group: Overflade */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Overflade</h5>
                    <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-slate-300 text-amber-500" />
                          Rustfrit stål A2 børstet
                        </span>
                        <span className="text-slate-400 text-[10px]">5</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer opacity-50">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" disabled className="rounded border-slate-300 text-amber-500" />
                          Rustfrit stål A2
                        </span>
                        <span className="text-slate-400 text-[10px]">0</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Area */}
              <div className="flex-1 space-y-4">
                <div className="text-left border-b border-slate-150 pb-2 flex justify-between items-center">
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{activeSubcategory.name}</h4>
                  <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">
                    {products.filter(p => p.subcategoryId === selectedSubcatId && p.brandId === selectedBrandId).length} produkter
                  </span>
                </div>

                <div className="space-y-4">
                  {products
                    .filter(p => p.subcategoryId === selectedSubcatId && p.brandId === selectedBrandId)
                    .map(product => {
                      const inCartQty = getCartItemQty(product.id);
                      const formattedPrice = (product.price / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 });
                      return (
                        <div 
                          key={product.id}
                          className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col @md:flex-row gap-5 items-stretch hover:shadow-md transition-shadow"
                        >
                          {/* Image Box */}
                          <div 
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setView('product-detail');
                              if (isPreviewMode) window.location.hash = `shop/product/${product.id}`;
                            }}
                            className="@md:w-40 shrink-0 flex items-center justify-center bg-[#f9fafb] rounded-2xl border border-slate-150 p-2 cursor-pointer relative"
                          >
                            <img src={product.image} alt={product.name} className="max-h-32 max-w-full object-contain rounded-xl" />
                          </div>

                          {/* Info Column */}
                          <div className="flex-grow text-left space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 tracking-wider uppercase">
                                <span>{activeBrand.name}</span>
                                <span>VARENR: {product.id}</span>
                              </div>
                              <h4 
                                onClick={() => {
                                  setSelectedProductId(product.id);
                                  setView('product-detail');
                                  if (isPreviewMode) window.location.hash = `shop/product/${product.id}`;
                                }}
                                className="text-sm font-extrabold text-slate-800 uppercase leading-snug cursor-pointer hover:text-amber-500 transition-colors mt-0.5"
                              >
                                {product.name}
                              </h4>
                              
                              {/* Specs Table */}
                              <div className="border-t border-slate-100 pt-2.5 mt-2 grid grid-cols-1 @sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-slate-500 font-medium">
                                <div className="flex justify-between border-b border-slate-50 pb-0.5">
                                  <span className="text-slate-400">Overflade:</span>
                                  <span>Rustfrit stål A2 børstet</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-50 pb-0.5">
                                  <span className="text-slate-400">Bredde mm:</span>
                                  <span>39</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-50 pb-0.5">
                                  <span className="text-slate-400">Højde mm:</span>
                                  <span>{product.id === '40009100' ? '298' : '310'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Purchase/Price Actions */}
                          <div className="@md:w-48 shrink-0 @md:border-l border-slate-150 @md:pl-5 flex flex-col justify-between items-stretch text-left @md:text-right gap-3 pt-3 @md:pt-0">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris Ekskl. moms</span>
                              <span className="text-lg font-black text-slate-900 font-mono mt-1.5 leading-none">
                                {formattedPrice} DKK /Styk
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5 @md:justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Levering 1-2 hverdage
                              </span>

                              {inCartQty === 0 ? (
                                <button 
                                  onClick={() => addToCart(product)}
                                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-955 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer text-center"
                                >
                                  Læg i kurv
                                </button>
                              ) : (
                                <div className="flex items-center justify-center @md:justify-end gap-1">
                                  <button 
                                    onClick={() => updateQuantity(product.id, -1)}
                                    className="w-7 h-7 bg-amber-400 hover:bg-amber-500 rounded-lg font-black text-sm flex items-center justify-center border-none cursor-pointer text-slate-955 transition-all active:scale-95"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center font-mono font-bold text-xs">{inCartQty}</span>
                                  <button 
                                    onClick={() => updateQuantity(product.id, 1)}
                                    className="w-7 h-7 bg-amber-400 hover:bg-amber-500 rounded-lg font-black text-sm flex items-center justify-center border-none cursor-pointer text-slate-955 transition-all active:scale-95"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {products.filter(p => p.subcategoryId === selectedSubcatId && p.brandId === selectedBrandId).length === 0 && (
                    <div className="p-10 bg-slate-50 rounded-3xl text-center border border-dashed border-slate-200">
                      <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-xs text-slate-500">Der er i øjeblikket ingen tilgængelige produkter for denne producent.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: PRODUCT DETAIL VIEW */}
        {view === 'product-detail' && activeProduct && (() => {
          const dbProduct = products.find(p => p.id === activeProduct.id) || activeProduct;
          const currentStock = dbProduct.stock !== undefined ? dbProduct.stock : 15;
          const inCartQty = getCartItemQty(activeProduct.id);
          const brand = WEBSHOP_BRANDS.find(b => b.id === activeProduct.brandId);
          const brandName = brand ? brand.name : '';
          
          return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Back button & Breadcrumbs */}
              <div className="flex items-center gap-3 text-left">
                <button 
                  onClick={() => {
                    const isSafeProduct = activeProduct && activeProduct.subcategoryId && subcategories.find(s => s.id === activeProduct.subcategoryId)?.categoryId === 'pengeskabe';
                    if (isSafeProduct) {
                      setView('subcategory-detail');
                      if (isPreviewMode) {
                        window.location.hash = `shop/subcat/${selectedSubcatId}`;
                      }
                    } else {
                      setView('brand-products');
                      if (isPreviewMode) {
                        window.location.hash = `shop/brand/${selectedSubcatId}/${selectedBrandId}`;
                      }
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-700" />
                </button>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                    {brandName}
                  </span>
                  <EditableText tag="h3" isPreviewMode={isPreviewMode} html={activeProduct.name} 
                    className="text-xl font-extrabold text-slate-900 uppercase leading-tight outline-none focus:bg-slate-100 px-1 rounded"
                                                            onBlur={(e) => updateProductField(activeProduct.id, 'name', e.currentTarget.innerHTML)}
                   />
                </div>
              </div>

              {/* Grid block: Left side image gallery, right side info */}
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 text-left items-start">
                
                {/* Left Side: Main Image and Thumbnails */}
                <div className="space-y-4">
                  <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 p-4 aspect-square flex items-center justify-center">
                    <img 
                      src={activeProduct.image} 
                      alt={activeProduct.name}
                      className={`max-h-full max-w-full object-contain rounded-2xl ${!isPreviewMode ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                      onClick={() => promptEditImage('product', activeProduct.id, 'image')}
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {activeProduct.badges.map((badge, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 text-[9px] font-bold bg-[#0f172a] text-[#FFC502] uppercase rounded-full shadow-sm"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Thumbnail gallery */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="aspect-square bg-slate-50 border-2 border-amber-400 rounded-2xl p-1 flex items-center justify-center cursor-pointer">
                      <img src={activeProduct.image} className="max-h-full max-w-full object-contain rounded-lg" />
                    </div>
                    <div className="aspect-square bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-2xl p-1 flex items-center justify-center cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=150&auto=format&fit=crop&q=80" className="max-h-full max-w-full object-cover rounded-lg" />
                    </div>
                    <div className="aspect-square bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-2xl p-1 flex items-center justify-center cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1558002038-1055907df827?w=150&auto=format&fit=crop&q=80" className="max-h-full max-w-full object-cover rounded-lg" />
                    </div>
                    <div className="aspect-square bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-2xl p-1 flex items-center justify-center cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=150&auto=format&fit=crop&q=80" className="max-h-full max-w-full object-cover rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Product Info, Price & Cart buttons */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 tracking-wider uppercase">
                      <span>{brandName}</span>
                      <span>VARENR: {activeProduct.id}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase leading-snug">{activeProduct.name}</h2>
                  </div>

                  {/* Price Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris Ekskl. moms</span>
                      <span className="text-3xl font-black text-slate-900 font-mono mt-1.5 leading-none">
                        {(activeProduct.price / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        {(activeProduct.price).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK inkl. moms
                      </span>
                    </div>
                  </div>

                  {/* Delivery Info Box */}
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-3xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      På lager - Afsendes inden for 24 timer
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium">Fragt fra kun 39,00 DKK • Gratis levering på ordrer over 555 DKK</p>
                  </div>

                  {/* Quantity and Cart action */}
                  <div className="pt-2 space-y-3">
                    {inCartQty === 0 ? (
                      <button 
                        onClick={() => addToCart(activeProduct)}
                        disabled={currentStock === 0}
                        className={`w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-955 font-extrabold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-98 border-none cursor-pointer text-center ${currentStock === 0 ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400 shadow-none' : ''}`}
                      >
                        Tilføj til kurv
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                        <span className="text-xs font-extrabold text-slate-600">Allerede i din kurv:</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(activeProduct.id, -1)}
                            className="w-8 h-8 bg-amber-400 hover:bg-amber-500 rounded-xl font-black text-sm flex items-center justify-center border-none cursor-pointer text-slate-950 transition-all active:scale-95"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-xs">{inCartQty}</span>
                          <button 
                            onClick={() => updateQuantity(activeProduct.id, 1)}
                            className="w-8 h-8 bg-amber-400 hover:bg-amber-500 rounded-xl font-black text-sm flex items-center justify-center border-none cursor-pointer text-slate-955 transition-all active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => toggleWishlist(activeProduct.id)}
                      className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className={wishlist.includes(activeProduct.id) ? 'text-red-500' : 'text-slate-300'}>
                        {wishlist.includes(activeProduct.id) ? '♥' : '♡'}
                      </span>
                      {wishlist.includes(activeProduct.id) ? 'Fjern fra ønskeliste' : 'Tilføj til ønskeliste'}
                    </button>
                  </div>

                  {/* Specs Accordions */}
                  <div className="border-t border-slate-200 pt-4 space-y-4">
                    {/* Collapsible 1: Beskrivelse */}
                    <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between select-none">
                        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Beskrivelse</h4>
                        <span className="text-xs text-slate-400 font-bold">&#9662;</span>
                      </div>
                      <EditableText tag="div" isPreviewMode={isPreviewMode} html={activeProduct.description} 
                        className="p-5 text-xs text-slate-500 leading-relaxed font-medium outline-none focus:bg-slate-100 rounded"
                                                                        onBlur={(e) => updateProductField(activeProduct.id, 'description', e.currentTarget.innerHTML)}
                       />
                    </div>

                    {/* Collapsible 2: Specifikationer Table */}
                    <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between select-none">
                        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Specifikationer</h4>
                        <span className="text-xs text-slate-400 font-bold">&#9662;</span>
                      </div>
                      <div className="p-5">
                        <table className="w-full text-left text-xs border-collapse font-medium text-slate-600">
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold w-1/3">Varenummer:</td>
                              <td className="py-2 text-slate-900 font-bold">{activeProduct.id}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold">Producent:</td>
                              <td className="py-2 text-slate-900 font-bold">{brandName}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold">Overflade:</td>
                              <td className="py-2 text-slate-900 font-bold">Rustfrit stål A2 børstet</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold">Model:</td>
                              <td className="py-2 text-slate-900 font-bold">Evolo/Exivo</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold">Bredde mm:</td>
                              <td className="py-2 text-slate-900 font-bold">39</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold">Højde mm:</td>
                              <td className="py-2 text-slate-900 font-bold">310</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-400 font-semibold">Låsesystem:</td>
                              <td className="py-2 text-slate-900 font-bold">Kaba evolo</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* VIEW 6: CART PAGE */}
        {view === 'cart' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-3 text-left">
              <button 
                onClick={() => {
                  setView('categories');
                  if (isPreviewMode) {
                    window.location.hash = 'shop';
                  }
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Kurv</span>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase">Din Indkøbskurv</h3>
              </div>
            </div>

            {cart.length > 0 ? (
              <div className="space-y-10">
                <div className={`grid gap-8 text-left ${viewportMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 @lg:grid-cols-3'}`}>
                  {/* Cart Items list */}
                  <div className="@lg:col-span-2 space-y-4">
                    {cart.map(item => {
                      const formattedPriceExcl = (item.product.price / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 });
                      return (
                        <div 
                          key={item.product.id}
                          className="flex justify-between gap-4 p-5 bg-white border border-slate-200 rounded-3xl items-center flex-col @sm:flex-row"
                        >
                          <div className="flex items-center gap-4 w-full @sm:w-auto">
                            <div className="w-16 h-16 shrink-0 bg-slate-50 border border-slate-150 rounded-xl p-1 flex items-center justify-center">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="max-h-full max-w-full object-contain rounded-lg"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase leading-snug tracking-wide">{item.product.name}</h4>
                              <span className="text-xs text-slate-400 font-bold mt-1 block">Pris pr. stk: {formattedPriceExcl} DKK excl. moms</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-6 w-full @sm:w-auto pt-3 @sm:pt-0 border-t @sm:border-t-0 border-slate-100">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-200">
                              <button 
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="w-6 h-6 rounded-lg bg-amber-400 hover:bg-amber-500 font-black text-xs flex items-center justify-center border-none cursor-pointer text-slate-900"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold text-slate-800 px-2 min-w-[20px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="w-6 h-6 rounded-lg bg-amber-400 hover:bg-amber-500 font-black text-xs flex items-center justify-center border-none cursor-pointer text-slate-900"
                              >
                                +
                              </button>
                            </div>

                            {/* Total & Remove */}
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono font-black text-slate-900">{(item.product.price * item.quantity / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                              <button 
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary card */}
                  <div className="border border-slate-200 rounded-3xl h-fit space-y-6 bg-white p-6 shadow-sm">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-widest pb-3 border-b border-slate-100">Ordreoversigt</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>Antal varer:</span>
                        <span className="text-slate-850 font-bold">{getCartItemsCount()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>Subtotal (excl. moms):</span>
                        <span className="text-slate-850 font-bold font-mono">{(getCartTotal() / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-505 font-semibold">
                        <span>Moms (25%):</span>
                        <span className="text-slate-850 font-bold font-mono">{(getCartTotal() - getCartTotal() / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>Levering:</span>
                        <span className="text-emerald-500 font-bold uppercase tracking-wider">Gratis</span>
                      </div>
                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between font-bold">
                        <span className="text-xs text-slate-900">Total (inkl. moms):</span>
                        <span className="text-base font-black text-amber-500 font-mono">{(getCartTotal()).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setView('checkout');
                        if (isPreviewMode) {
                          window.location.hash = 'shop/checkout';
                        }
                      }}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/10 cursor-pointer border-none text-center block"
                    >
                      Fortsæt til kassen
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 @sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                  <div className="flex flex-col items-center text-center space-y-2 p-4">
                    <EditableText
                      html={cartTrust1Icon}
                      onBlur={(e: any) => updateSetting('cartTrust1Icon', e.target.innerHTML)}
                      className="text-3xl"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                    <EditableText
                      html={cartTrust1Title}
                      onBlur={(e: any) => updateSetting('cartTrust1Title', e.target.innerHTML)}
                      className="text-xs font-black uppercase text-slate-900 tracking-wider"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                    <EditableText
                      html={cartTrust1Desc}
                      onBlur={(e: any) => updateSetting('cartTrust1Desc', e.target.innerHTML)}
                      className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2 p-4">
                    <EditableText
                      html={cartTrust2Icon}
                      onBlur={(e: any) => updateSetting('cartTrust2Icon', e.target.innerHTML)}
                      className="text-3xl"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                    <EditableText
                      html={cartTrust2Title}
                      onBlur={(e: any) => updateSetting('cartTrust2Title', e.target.innerHTML)}
                      className="text-xs font-black uppercase text-slate-900 tracking-wider"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                    <EditableText
                      html={cartTrust2Desc}
                      onBlur={(e: any) => updateSetting('cartTrust2Desc', e.target.innerHTML)}
                      className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2 p-4">
                    <EditableText
                      html={cartTrust3Icon}
                      onBlur={(e: any) => updateSetting('cartTrust3Icon', e.target.innerHTML)}
                      className="text-3xl"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                    <EditableText
                      html={cartTrust3Title}
                      onBlur={(e: any) => updateSetting('cartTrust3Title', e.target.innerHTML)}
                      className="text-xs font-black uppercase text-slate-900 tracking-wider"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                    <EditableText
                      html={cartTrust3Desc}
                      onBlur={(e: any) => updateSetting('cartTrust3Desc', e.target.innerHTML)}
                      className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]"
                      isPreviewMode={isPreviewMode}
                      onClick={(e: any) => {
                        if (!isPreviewMode) e.stopPropagation();
                      }}
                    />
                  </div>
                </div>

                {/* FAQ section */}
                <div className="space-y-4 pt-6 border-t border-slate-100 text-left">
                  <EditableText
                    html={cartFaqTitle}
                    onBlur={(e: any) => updateSetting('cartFaqTitle', e.target.innerHTML)}
                    className="text-sm font-black uppercase tracking-wider text-slate-900 block"
                    isPreviewMode={isPreviewMode}
                    onClick={(e: any) => {
                      if (!isPreviewMode) e.stopPropagation();
                    }}
                  />
                  <div className="space-y-3">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between select-none">
                        <EditableText
                          html={cartFaq1Question}
                          onBlur={(e: any) => updateSetting('cartFaq1Question', e.target.innerHTML)}
                          className="text-xs font-black uppercase text-slate-700 tracking-wider"
                          isPreviewMode={isPreviewMode}
                          onClick={(e: any) => {
                            if (!isPreviewMode) e.stopPropagation();
                          }}
                        />
                        <span className="text-xs text-slate-400 font-bold">&#9662;</span>
                      </div>
                      <EditableText
                        html={cartFaq1Answer}
                        onBlur={(e: any) => updateSetting('cartFaq1Answer', e.target.innerHTML)}
                        className="p-5 text-xs text-slate-505 leading-relaxed block"
                        isPreviewMode={isPreviewMode}
                        onClick={(e: any) => {
                          if (!isPreviewMode) e.stopPropagation();
                        }}
                      />
                    </div>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between select-none">
                        <EditableText
                          html={cartFaq2Question}
                          onBlur={(e: any) => updateSetting('cartFaq2Question', e.target.innerHTML)}
                          className="text-xs font-black uppercase text-slate-700 tracking-wider"
                          isPreviewMode={isPreviewMode}
                          onClick={(e: any) => {
                            if (!isPreviewMode) e.stopPropagation();
                          }}
                        />
                        <span className="text-xs text-slate-400 font-bold">&#9662;</span>
                      </div>
                      <EditableText
                        html={cartFaq2Answer}
                        onBlur={(e: any) => updateSetting('cartFaq2Answer', e.target.innerHTML)}
                        className="p-5 text-xs text-slate-505 leading-relaxed block"
                        isPreviewMode={isPreviewMode}
                        onClick={(e: any) => {
                          if (!isPreviewMode) e.stopPropagation();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 bg-slate-55 rounded-3xl text-center border border-dashed border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-sm font-extrabold text-slate-800 uppercase">Din indkøbskurv er tom</h4>
                <p className="text-xs text-slate-400 mt-2">Tilføj nogle af vores kvalitetssikrede produkter for at fortsætte.</p>
                <button 
                  onClick={() => {
                    setView('categories');
                    if (isPreviewMode) {
                      window.location.hash = 'shop';
                    }
                  }}
                  className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none active:scale-95 transition-all"
                >
                  Se produkter
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 7: CHECKOUT PAGE */}
        {view === 'checkout' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-3 text-left">
              <button 
                onClick={() => {
                  setView('cart');
                  if (isPreviewMode) {
                    window.location.hash = 'shop/cart';
                  }
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Kasse</span>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase">Gennemfør Bestilling</h3>
              </div>
            </div>

            <div className={`grid gap-8 text-left grid-cols-1 @lg:grid-cols-3`}>
              {/* Form container */}
              <div className="border border-slate-200 rounded-3xl @lg:col-span-2 bg-white p-6 shadow-sm">
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  
                  {/* Customer Type Toggle */}
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-wide block">Kunde type</label>
                    <div className="flex gap-2 p-1 bg-slate-50 border border-slate-200 rounded-2xl w-fit">
                      <button 
                        type="button" 
                        onClick={() => setCustomerType('private')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all border-none cursor-pointer ${customerType === 'private' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
                      >
                        Personlig
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomerType('company')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all border-none cursor-pointer ${customerType === 'company' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
                      >
                        Selskab
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider pb-2 border-b border-slate-100">Leverings- & Faktureringsoplysninger</h4>
                  
                  {/* Company Fields (if Company customer type selected) */}
                  {customerType === 'company' && (
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Firma Navn</label>
                        <input 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="F.eks. MMLåsesmed ApS" 
                          required 
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">CVR Nummer</label>
                        <input 
                          type="text" 
                          value={cvrNumber}
                          onChange={(e) => setCvrNumber(e.target.value)}
                          placeholder="F.eks. 12345678" 
                          required 
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Fulde Navn</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="F.eks. Anders Jensen" 
                        required 
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">E-mail Adresse</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="F.eks. anders@jensen.dk" 
                        required 
                        disabled={!!loggedInUser}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Phone and Address fields */}
                  {loggedInUser ? (
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Telefonnummer</label>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="F.eks. +45 12 34 56 78" 
                          required 
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Leveringsadresse</label>
                        <textarea 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Gadenavn, husnummer, etage, postnummer og by" 
                          required 
                          rows={2}
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Telefonnummer</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="F.eks. +45 12 34 56 78" 
                            required 
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-505 uppercase tracking-wide">Gade & Husnummer</label>
                          <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="F.eks. Hovedgade 12, 1. th" 
                            required 
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-505 uppercase tracking-wide">Postnummer</label>
                          <input 
                            type="text" 
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            placeholder="F.eks. 2100" 
                            required 
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-505 uppercase tracking-wide">By</label>
                          <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="F.eks. København Ø" 
                            required 
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shipmondo Carrier Selection */}
                  <div className="space-y-2.5 pt-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block font-sans">Vælg Transportør (Forsendelse)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCarrier('gls')}
                        className={`flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${selectedCarrier === 'gls' ? 'bg-amber-400 text-slate-955 border-amber-400 shadow-md shadow-amber-400/10' : 'bg-slate-55 text-slate-600 border-slate-200 hover:border-slate-350 hover:text-slate-800'}`}
                      >
                        <span className="text-xl mb-1">📦</span>
                        <span>GLS Pakkeshop/Privat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCarrier('postnord')}
                        className={`flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border text-xs font-bold transition-all duration-305 cursor-pointer ${selectedCarrier === 'postnord' ? 'bg-amber-400 text-slate-955 border-amber-400 shadow-md shadow-amber-400/10' : 'bg-slate-55 text-slate-600 border-slate-200 hover:border-slate-350 hover:text-slate-800'}`}
                      >
                        <span className="text-xl mb-1">✉️</span>
                        <span>PostNord Pakkeshop/Hjem</span>
                      </button>
                    </div>
                  </div>

                  {/* Shipmondo Delivery Options */}
                  {selectedCarrier && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[10.5px] font-extrabold uppercase text-slate-900 tracking-wide">Leveringsmuligheder ({selectedCarrier.toUpperCase()})</h5>
                        {shippingLoading && <span className="text-[10px] text-amber-500 font-bold animate-pulse">Henter fra Shipmondo...</span>}
                      </div>

                      {shippingError && (
                        <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-500 text-xs font-medium">
                          {shippingError}
                        </div>
                      )}

                      {!shippingLoading && !shippingError && (
                        <div className="space-y-4">
                          {/* 1. PICKUP POINTS LIST */}
                          {pickupPoints.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wide block">Pakkeshops & Udleveringssteder</span>
                              <div className="grid gap-2">
                                {pickupPoints.map(point => {
                                  const isSelected = selectedDelivery?.type === 'pickup' && selectedDelivery?.id === point.id;
                                  return (
                                    <div
                                      key={point.id}
                                      onClick={() => setSelectedDelivery({
                                        type: 'pickup',
                                        id: point.id,
                                        name: point.company_name,
                                        address: `${point.address}, ${point.zipcode} ${point.city}`,
                                        carrier: selectedCarrier
                                      })}
                                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-left transition-all ${isSelected ? 'bg-amber-55 border-[#FFC502] text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                    >
                                      <input
                                        type="radio"
                                        name="delivery_point"
                                        checked={isSelected}
                                        onChange={() => {}}
                                        className="mt-0.5 accent-amber-400 cursor-pointer"
                                      />
                                      <div>
                                        <p className="text-xs font-bold text-slate-800 leading-tight">{point.company_name}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{point.address}, {point.zipcode} {point.city}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* 2. HOME DELIVERY LIST */}
                          {homeDeliveryOptions.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wide block">Hjemmelevering</span>
                              <div className="grid gap-2">
                                {homeDeliveryOptions.map(option => {
                                  const isSelected = selectedDelivery?.type === 'home' && selectedDelivery?.id === option.code;
                                  return (
                                    <div
                                      key={option.code}
                                      onClick={() => setSelectedDelivery({
                                        type: 'home',
                                        id: option.code,
                                        name: option.name,
                                        address: 'Levering til privat adresse',
                                        carrier: selectedCarrier
                                      })}
                                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-left transition-all ${isSelected ? 'bg-amber-55 border-[#FFC502] text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                    >
                                      <input
                                        type="radio"
                                        name="delivery_point"
                                        checked={isSelected}
                                        onChange={() => {}}
                                        className="mt-0.5 accent-amber-400 cursor-pointer"
                                      />
                                      <div>
                                        <p className="text-xs font-bold text-slate-800 leading-tight">{option.name}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{option.description}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {pickupPoints.length === 0 && homeDeliveryOptions.length === 0 && (
                            <p className="text-xs text-slate-400 italic">Ingen leveringsmetoder tilgængelige for dette postnummer.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-400/10 cursor-pointer border-none"
                    >
                      Placer Ordre (Gennemfør)
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary side-card */}
              <div className="border border-slate-200 rounded-3xl h-fit space-y-4 bg-white p-6 shadow-sm">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-widest pb-3 border-b border-slate-100">Din Bestilling</h4>
                
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-start gap-2 text-left">
                      <div className="flex-1">
                        <span className="text-[10.5px] font-bold text-slate-800 uppercase block leading-tight">{item.product.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Antal: {item.quantity} x {(item.product.price / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 shrink-0">{(item.product.price * item.quantity / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-505 font-semibold">
                    <span>Subtotal (excl. moms):</span>
                    <span className="text-slate-850 font-bold font-mono">{(getCartTotal() / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-505 font-semibold">
                    <span>Moms (25%):</span>
                    <span className="text-slate-850 font-bold font-mono">{(getCartTotal() - getCartTotal() / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-505 font-semibold">
                    <span>Levering:</span>
                    <span className="text-emerald-500 font-bold uppercase tracking-wider">Gratis</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between font-black">
                    <span className="text-xs text-slate-900">Total:</span>
                    <span className="text-sm font-mono text-amber-505">{(getCartTotal()).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: LOGIN */}
        {view === 'login' && (
          <div className="max-w-md mx-auto p-4 @sm:p-6 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl text-left space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <EditableText tag="h3" isPreviewMode={isPreviewMode} html={authMode === 'login' ? loginTitle : registerTitle} 
                className="text-xl font-extrabold text-slate-900 uppercase tracking-wider outline-none focus:bg-slate-100 rounded px-1"
                                                onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                onBlur={(e) => updateSetting(authMode === 'login' ? 'loginTitle' : 'registerTitle', e.currentTarget.innerHTML)}
               />
              <EditableText tag="p" isPreviewMode={isPreviewMode} html={authMode === 'login' ? loginDesc : registerDesc} 
                className="text-xs text-slate-500 mt-2 outline-none focus:bg-slate-100 rounded px-1"
                                                onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                onBlur={(e) => updateSetting(authMode === 'login' ? 'loginDesc' : 'registerDesc', e.currentTarget.innerHTML)}
               />
            </div>

            {authMode === 'login' ? (
              <>
                {loginError && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed">
                    ⚠️ {loginError}
                  </div>
                )}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <EditableText tag="label" isPreviewMode={isPreviewMode} html={loginEmailLabel} 
                      className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide outline-none focus:bg-slate-100 rounded px-1"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('loginEmailLabel', e.currentTarget.innerHTML)}
                     />
                    <input 
                      type="email" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="F.eks. anders@jensen.dk" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <EditableText tag="label" isPreviewMode={isPreviewMode} html={loginPasswordLabel} 
                      className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide outline-none focus:bg-slate-100 rounded px-1"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('loginPasswordLabel', e.currentTarget.innerHTML)}
                     />
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Indtast din adgangskode" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none"
                  >
                    <EditableText tag="span" isPreviewMode={isPreviewMode} html={loginButtonText} 
                      className="outline-none focus:bg-amber-500 rounded px-2 block"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('loginButtonText', e.currentTarget.innerHTML)}
                     />
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <EditableText tag="p" isPreviewMode={isPreviewMode} html={noAccountText} 
                    className="text-[11px] text-slate-500 font-medium outline-none focus:bg-slate-100 rounded px-1 inline-block"
                                                            onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                    onBlur={(e) => updateSetting('noAccountText', e.currentTarget.innerHTML)}
                   />
                  <button
                    onClick={() => setAuthMode('register')}
                    className="mt-3 text-xs text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer block w-full"
                  >
                    <EditableText tag="span" isPreviewMode={isPreviewMode} html={createAccountLink}                       className="outline-none focus:bg-slate-100 rounded px-2 block"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('createAccountLink', e.currentTarget.innerHTML)}
                     />
                  </button>
                  <button
                    onClick={() => {
                      setView('categories');
                      if (isPreviewMode) {
                        window.location.hash = 'shop';
                      }
                    }}
                    className="mt-3 text-xs text-slate-500 hover:text-slate-800 font-bold bg-transparent border-none cursor-pointer"
                  >
                    <EditableText tag="span" isPreviewMode={isPreviewMode} html={backToShopText}                       className="outline-none focus:bg-slate-100 rounded px-2 block"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('backToShopText', e.currentTarget.innerHTML)}
                     />
                  </button>
                </div>
              </>
            ) : (
              <>
                {registerError && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed">
                    ⚠️ {registerError}
                  </div>
                )}
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <EditableText tag="label" isPreviewMode={isPreviewMode} html={registerNameLabel} 
                      className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide outline-none focus:bg-slate-100 rounded px-1"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('registerNameLabel', e.currentTarget.innerHTML)}
                     />
                    <input 
                      type="text" 
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="F.eks. Anders Jensen" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <EditableText tag="label" isPreviewMode={isPreviewMode} html={registerEmailLabel} 
                      className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide outline-none focus:bg-slate-100 rounded px-1"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('registerEmailLabel', e.currentTarget.innerHTML)}
                     />
                    <input 
                      type="email" 
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="F.eks. anders@jensen.dk" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <EditableText tag="label" isPreviewMode={isPreviewMode} html={registerPasswordLabel} 
                      className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide outline-none focus:bg-slate-100 rounded px-1"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('registerPasswordLabel', e.currentTarget.innerHTML)}
                     />
                    <input 
                      type="password" 
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Indtast adgangskode" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none"
                  >
                    <EditableText tag="span" isPreviewMode={isPreviewMode} html={registerButtonText} 
                      className="outline-none focus:bg-amber-500 rounded px-2 block"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('registerButtonText', e.currentTarget.innerHTML)}
                     />
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <EditableText tag="p" isPreviewMode={isPreviewMode} html={hasAccountText} 
                    className="text-[11px] text-slate-500 font-medium outline-none focus:bg-slate-100 rounded px-1 inline-block"
                                                            onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                    onBlur={(e) => updateSetting('hasAccountText', e.currentTarget.innerHTML)}
                   />
                  <button
                    onClick={() => setAuthMode('login')}
                    className="mt-3 text-xs text-amber-400 hover:underline font-bold bg-transparent border-none cursor-pointer block w-full"
                  >
                    <EditableText tag="span" isPreviewMode={isPreviewMode} html={loginAccountLink}                       className="outline-none focus:bg-slate-100 rounded px-2 block"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('loginAccountLink', e.currentTarget.innerHTML)}
                     />
                  </button>
                  <button
                    onClick={() => {
                      setView('categories');
                      if (isPreviewMode) {
                        window.location.hash = 'shop';
                      }
                    }}
                    className="mt-3 text-xs text-slate-500 hover:text-slate-800 font-bold bg-transparent border-none cursor-pointer"
                  >
                    <EditableText tag="span" isPreviewMode={isPreviewMode} html={backToShopText}                       className="outline-none focus:bg-slate-100 rounded px-2 block"
                                                                  onClick={(e) => { if (!isPreviewMode) { e.preventDefault(); e.stopPropagation(); } }}
                      onBlur={(e) => updateSetting('backToShopText', e.currentTarget.innerHTML)}
                     />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* VIEW: RESET PASSWORD */}
        {view === 'reset-password' && (
          <div className="max-w-md mx-auto p-4 @sm:p-6 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl text-left space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-wider">Nulstil Adgangskode</h3>
              <p className="text-xs text-slate-500 mt-2">Vælg en ny adgangskode til din konto.</p>
            </div>

            {resetSuccess ? (
              <div className="space-y-4 text-center">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold leading-relaxed">
                  ✓ Din adgangskode er blevet nulstillet med succes! Du kan nu logge ind.
                </div>
                <button
                  onClick={() => {
                    setView('login');
                    if (isPreviewMode) {
                      window.location.hash = 'shop/login';
                    }
                    setResetSuccess(false);
                  }}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none"
                >
                  Gå til login
                </button>
              </div>
            ) : (
              <>
                {resetError && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed">
                    ⚠️ {resetError}
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-550 uppercase tracking-wide">E-mail Adresse</label>
                    <input 
                      type="email" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="F.eks. anders@jensen.dk" 
                      required
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-550 uppercase tracking-wide">Ny Adgangskode</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mindst 6 tegn" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-550 uppercase tracking-wide">Bekræft Ny Adgangskode</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Gentag ny adgangskode" 
                      required 
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none"
                  >
                    Gem ny adgangskode
                  </button>
                </form>
              </>
            )}

            <div className="border-t border-slate-100 pt-4 text-center">
              <button
                onClick={() => {
                  setView('categories');
                  if (isPreviewMode) {
                    window.location.hash = 'shop';
                  }
                }}
                className="text-xs text-slate-400 hover:text-white font-bold bg-transparent border-none cursor-pointer"
              >
                Annuller og gå tilbage
              </button>
            </div>
          </div>
        )}
        {/* VIEW: ADMIN CONTROL PANEL */}
        {view === 'admin' && !(loggedInUser?.email === 'admin@mmlaseshop.dk' || isPreviewMode) && (
          <div className="max-w-sm mx-auto mt-24 mb-32 p-8 bg-slate-900 rounded-3xl shadow-2xl text-left border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
              <h3 className="text-xl font-black text-white uppercase tracking-wider">System Access</h3>
            </div>
            {loginError && (
              <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold">
                ⚠️ {loginError}
              </div>
            )}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mb-1.5 block">Access ID</label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Enter ID..."
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mb-1.5 block">Passcode</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Enter passcode..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all border-none mt-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Authenticate
              </button>
            </form>
          </div>
        )}

        {view === 'admin' && (loggedInUser?.email === 'admin@mmlaseshop.dk' || isPreviewMode) && (
          <div className="space-y-6 animate-in fade-in duration-300 text-left">
            <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  {bt('Admin Kontrolpanel', 'Admin Control Panel')}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{bt('Administrer og hold styr på indkomne ordrer og leveringer.', 'Manage and keep track of incoming orders and deliveries.')}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 select-none shrink-0 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setAndDispatchBackendLang('da')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                      backendLang === 'da' 
                        ? 'bg-amber-400 text-slate-950 shadow-sm' 
                        : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    DA
                  </button>
                  <button
                    type="button"
                    onClick={() => setAndDispatchBackendLang('en')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                      backendLang === 'en' 
                        ? 'bg-amber-400 text-slate-950 shadow-sm' 
                        : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  onClick={generateMockOrders}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-indigo-600/15 whitespace-nowrap"
                >
                  {bt('Generer Testordrer', 'Generate Test Orders')}
                </button>
                <button
                  onClick={() => {
                    setView('categories');
                    if (isPreviewMode) {
                      window.location.hash = 'shop';
                    }
                  }}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-300 shadow-md whitespace-nowrap"
                >
                  {bt('Luk Admin', 'Close Admin')}
                </button>
              </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute -right-2 -bottom-2 opacity-5 text-slate-900">
                  <DollarSign className="w-20 h-20" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">{bt('Total Omsætning', 'Total Revenue')}</span>
                <p className="text-xl font-mono font-black text-amber-400 mt-1.5">
                  {orders
                    .filter(o => o.status !== 'annulleret')
                    .reduce((sum, o) => sum + o.total, 0)
                    .toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute -right-2 -bottom-2 opacity-5 text-slate-900">
                  <ShoppingBag className="w-20 h-20" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">{bt('Samlet Antal Ordrer', 'Total Orders')}</span>
                <p className="text-xl font-mono font-black text-slate-900 mt-1.5">{orders.length} {bt('stk', 'pcs')}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute -right-2 -bottom-2 opacity-5 text-slate-900">
                  <Clock className="w-20 h-20" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">{bt('Nye Ordrer', 'New Orders')}</span>
                <p className="text-xl font-mono font-black text-indigo-400 mt-1.5">
                  {orders.filter(o => o.status === 'modtaget').length} {bt('stk', 'pcs')}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute -right-2 -bottom-2 opacity-5 text-slate-900">
                  <CheckCircle className="w-20 h-20" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">{bt('Under Behandling', 'In Progress')}</span>
                <p className="text-xl font-mono font-black text-emerald-450 mt-1.5">
                  {orders.filter(o => o.status === 'godkendt').length} {bt('stk', 'pcs')}
                </p>
              </div>
            </div>

            {/* Admin Tab Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
              {(['orders', 'inventory', 'categories', 'subcategories', 'products'] as const).map(tab => {
                const label = tab === 'orders' ? bt('Ordrer', 'Orders') :
                              tab === 'inventory' ? bt('Lagerstyring', 'Inventory') :
                              tab === 'categories' ? bt('Kategorier', 'Categories') :
                              tab === 'subcategories' ? bt('Underkategorier', 'Subcategories') : bt('Produkter', 'Products');
                return (
                  <button
                    key={tab}
                    onClick={() => setAdminTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-none transition-all cursor-pointer ${
                      adminTab === tab 
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' 
                        : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {adminTab === 'orders' && (
              <>
                {/* Filters Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 border-b border-slate-200">
                  {(['all', 'modtaget', 'godkendt', 'afsendt', 'annulleret'] as const).map(f => {
                    const label = f === 'all' ? bt('Alle Ordrer', 'All Orders') : 
                                  f === 'modtaget' ? bt('Nye (Modtaget)', 'New (Received)') : 
                                  f === 'godkendt' ? bt('Godkendte', 'Approved') : 
                                  f === 'afsendt' ? bt('Afsendte', 'Shipped') : bt('Annullerede', 'Cancelled');
                    const count = f === 'all' ? orders.length : orders.filter(o => o.status === f).length;
                    const isActive = activeFilter === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                          isActive 
                            ? 'bg-amber-400 text-slate-955 border-amber-400 shadow-md shadow-amber-400/30' 
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Orders Cards Grid */}
                <div className="space-y-3">
                  {orders.filter(o => activeFilter === 'all' || o.status === activeFilter).length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl">
                      <Package className="w-10 h-10 text-slate-600 mx-auto mb-2.5" />
                      <p className="text-xs text-slate-500 italic">{bt('Ingen ordrer fundet i denne kategori.', 'No orders found in this category.')}</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {orders
                        .filter(o => activeFilter === 'all' || o.status === activeFilter)
                        .map(order => {
                          const isModtaget = order.status === 'modtaget';
                          const isGodkendt = order.status === 'godkendt';
                          const isAfsendt = order.status === 'afsendt';
                          const isAnnulleret = order.status === 'annulleret';

                          return (
                            <div
                              key={order.id}
                              onClick={() => setActiveDetailOrder(order)}
                              className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer flex flex-col @sm:flex-row @sm:items-center justify-between gap-4"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-black text-amber-400">{order.id}</span>
                                  <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">• {order.date}</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 leading-tight">{order.customer.name}</h4>
                                <div className="flex items-center gap-2.5 text-[10px] text-slate-600">
                                  <span>{order.items.reduce((sum, it) => sum + it.quantity, 0)} {bt('produkter', 'products')}</span>
                                  <span>•</span>
                                  <span className="font-bold text-slate-700">{order.total.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                                  {order.shipping && (
                                    <>
                                      <span>•</span>
                                      <span className="text-slate-600 flex items-center gap-1">
                                        <Truck className="w-3 h-3 text-amber-505" />
                                        {order.shipping.carrier.toUpperCase()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between @sm:justify-end gap-3" onClick={e => e.stopPropagation()}>
                                {/* Status Badges */}
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  isModtaget ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                  isGodkendt ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                  isAfsendt ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' :
                                  'bg-rose-500/10 text-rose-455 border border-rose-500/20'
                                }`}>
                                  {order.status === 'modtaget' ? bt('Nye (Modtaget)', 'New (Received)') :
                                   order.status === 'godkendt' ? bt('Godkendt', 'Approved') :
                                   order.status === 'afsendt' ? bt('Afsendt', 'Shipped') : bt('Annulleret', 'Cancelled')}
                                </span>

                                {order.refundRequested && (
                                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-455 border border-rose-500/20">
                                    {bt('Refundering Anmodet', 'Refund Requested')}
                                  </span>
                                )}

                                {/* Direct Actions */}
                                <div className="flex items-center gap-1.5">
                                  {isModtaget && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'godkendt')}
                                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-955 font-extrabold text-[10px] rounded-lg transition-all border-none cursor-pointer"
                                    >
                                      {bt('Godkend', 'Approve')}
                                    </button>
                                  )}
                                  {isGodkendt && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'afsendt')}
                                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-955 font-extrabold text-[10px] rounded-lg transition-all border-none cursor-pointer"
                                    >
                                      {bt('Afsend', 'Ship')}
                                    </button>
                                  )}
                                  {!isAfsendt && !isAnnulleret && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'annulleret')}
                                      className="px-2.5 py-1 bg-slate-200 hover:bg-rose-955 hover:text-rose-455 text-slate-600 font-bold text-[10px] rounded-lg border border-slate-300 hover:border-rose-900 transition-all cursor-pointer"
                                    >
                                      {bt('Annuller', 'Cancel')}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </>
            )}

            {adminTab === 'inventory' && (
              <>
                {/* Inventory Filter/Search Header */}
                <div className="flex flex-col @md:flex-row gap-4 justify-between items-stretch @md:items-center bg-white p-4 border border-slate-200 rounded-2xl">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder={bt('Søg efter produkt, underkategori eller mærke...', 'Search for product, subcategory, or brand...')}
                      value={invSearchQuery}
                      onChange={e => setInvSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 pl-9 pr-8 py-2 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                    />
                    {invSearchQuery && (
                      <button
                        onClick={() => setInvSearchQuery('')}
                        className="absolute right-3 top-2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] font-bold border-none cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="text-right text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    {bt('Viser', 'Showing')} {filteredInvProducts.length} {bt('af', 'of')} {products.length} {bt('varer', 'items')}
                  </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[9px] font-black tracking-wider">
                          <th className="p-4">{bt('Vare / Model', 'Item / Model')}</th>
                          <th className="p-4">{bt('Underkategori', 'Subcategory')}</th>
                          <th className="p-4">{bt('Pris', 'Price')}</th>
                          <th className="p-4">{bt('Status', 'Status')}</th>
                          <th className="p-4 text-center w-40">{bt('Lagerbeholdning', 'Stock Level')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredInvProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                              {bt('Ingen produkter matcher din søgning.', 'No products match your search.')}
                            </td>
                          </tr>
                        ) : (
                          filteredInvProducts.map(p => {
                            const subcat = subcategories.find(s => s.id === p.subcategoryId);
                            const currentStock = p.stock !== undefined ? p.stock : 15;
                            
                            let badgeColor = '';
                            let badgeText = '';
                            if (currentStock === 0) {
                              badgeColor = 'bg-rose-500/10 text-rose-450 border border-rose-500/20';
                              badgeText = bt('Udsolgt', 'Out of stock');
                            } else if (currentStock <= 4) {
                              badgeColor = 'bg-amber-450/10 text-amber-400 border border-amber-450/20';
                              badgeText = bt('Få på lager', 'Low stock');
                            } else {
                              badgeColor = 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
                              badgeText = bt('På lager', 'In stock');
                            }

                            return (
                              <tr key={p.id} className="hover:bg-slate-100 transition-colors">
                                {/* Product Details */}
                                <td className="p-4 flex items-center gap-3">
                                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-white border border-slate-200 shrink-0" />
                                  <div>
                                    <h5 className="font-bold text-slate-900 leading-tight uppercase text-[11px]">{p.name}</h5>
                                    <span className="text-[9px] font-bold text-slate-500 tracking-wider font-mono">ID: {p.id}</span>
                                  </div>
                                </td>
                                {/* Subcategory */}
                                <td className="p-4 text-slate-700 font-medium">
                                  {subcat?.name || 'N/A'}
                                </td>
                                {/* Price */}
                                <td className="p-4 font-mono font-bold text-slate-700">
                                  {p.price.toLocaleString('da-DK')},- DKK
                                </td>
                                {/* Status */}
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeColor}`}>
                                    {badgeText}
                                  </span>
                                </td>
                                {/* Actions / Stock adjust */}
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => adjustStockLevel(p.id, -1)}
                                      className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 active:scale-95 transition-all text-slate-900 font-extrabold text-sm flex items-center justify-center border-none cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={currentStock}
                                      onChange={e => {
                                        const val = parseInt(e.target.value);
                                        setStockValue(p.id, isNaN(val) ? 0 : Math.max(0, val));
                                      }}
                                      className="w-12 h-7 bg-white border border-slate-200 text-center font-mono font-bold text-xs text-slate-900 rounded-lg focus:outline-none focus:border-amber-400"
                                    />
                                    <button
                                      onClick={() => adjustStockLevel(p.id, 1)}
                                      className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 active:scale-95 transition-all text-slate-900 font-extrabold text-sm flex items-center justify-center border-none cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {adminTab === 'categories' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">
                    {bt('Administrer butikkens hovedkategorier', 'Manage main shop categories')}
                  </span>
                  <button
                    onClick={() => setEditingItem({
                      type: 'category',
                      isNew: true,
                      data: { id: '', name: '', icon: '', description: '', subcatIds: [] }
                    })}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {bt('Tilføj Kategori', 'Add Category')}
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[9px] font-black tracking-wider">
                          <th className="p-4 w-12 text-center">{bt('Ikon', 'Icon')}</th>
                          <th className="p-4">{bt('Navn', 'Name')}</th>
                          <th className="p-4">{bt('ID (Slug)', 'ID (Slug)')}</th>
                          <th className="p-4">{bt('Beskrivelse', 'Description')}</th>
                          <th className="p-4 text-right w-40">{bt('Handlinger', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                              {bt('Ingen kategorier fundet.', 'No categories found.')}
                            </td>
                          </tr>
                        ) : (
                          categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-slate-100 transition-colors">
                              <td className="p-4 text-center text-xl">{cat.icon}</td>
                              <td className="p-4 font-bold text-slate-900 uppercase">{cat.name}</td>
                              <td className="p-4 text-slate-600 font-mono">{cat.id}</td>
                              <td className="p-4 text-slate-700 font-medium max-w-xs truncate">{cat.description}</td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingItem({
                                      type: 'category',
                                      isNew: false,
                                      data: { ...cat }
                                    })}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-355 font-bold text-[10px] rounded-lg border border-slate-300 transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <Settings className="w-3 h-3 text-amber-500" />
                                    {bt('Rediger', 'Edit')}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem('category', cat.id)}
                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-900 text-rose-400 font-bold text-[10px] rounded-lg border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    {bt('Slet', 'Delete')}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'subcategories' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">
                    {bt('Administrer underkategorier og deres mærke-tilknytninger', 'Manage subcategories and their brand associations')}
                  </span>
                  <button
                    onClick={() => setEditingItem({
                      type: 'subcategory',
                      isNew: true,
                      data: { id: '', categoryId: categories[0]?.id || '', name: '', description: '', detailedDescription: '', brandIds: [] }
                    })}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {bt('Tilføj Underkategori', 'Add Subcategory')}
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[9px] font-black tracking-wider">
                          <th className="p-4">{bt('Overordnet Kategori', 'Parent Category')}</th>
                          <th className="p-4">{bt('Navn', 'Name')}</th>
                          <th className="p-4">{bt('ID (Slug)', 'ID (Slug)')}</th>
                          <th className="p-4">{bt('Tilknyttede Mærker', 'Associated Brands')}</th>
                          <th className="p-4 text-right w-40">{bt('Handlinger', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {subcategories.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-600 italic">
                              {bt('Ingen underkategorier fundet.', 'No subcategories found.')}
                            </td>
                          </tr>
                        ) : (
                          subcategories.map(sub => {
                            const parentCat = categories.find(c => c.id === sub.categoryId);
                            const brandNames = WEBSHOP_BRANDS
                              .filter(b => sub.brandIds?.includes(b.id))
                              .map(b => b.name)
                              .join(', ') || bt('Ingen (Direkte produkter)', 'None (Direct products)');
                            return (
                              <tr key={sub.id} className="hover:bg-slate-100 transition-colors">
                                <td className="p-4 text-amber-405 font-bold uppercase">{parentCat?.name || sub.categoryId}</td>
                                <td className="p-4 font-bold text-slate-900">{sub.name}</td>
                                <td className="p-4 text-slate-600 font-mono">{sub.id}</td>
                                <td className="p-4 text-slate-700 font-medium max-w-xs truncate">{brandNames}</td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditingItem({
                                        type: 'subcategory',
                                        isNew: false,
                                        data: { ...sub }
                                      })}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-300 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Settings className="w-3 h-3 text-amber-505" />
                                      {bt('Rediger', 'Edit')}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem('subcategory', sub.id)}
                                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-900 text-rose-400 font-bold text-[10px] rounded-lg border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      {bt('Slet', 'Delete')}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-col @md:flex-row gap-4 justify-between items-stretch @md:items-center bg-white p-4 border border-slate-200 rounded-2xl">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder={bt('Søg efter produkt...', 'Search for product...')}
                      value={invSearchQuery}
                      onChange={e => setInvSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 pl-9 pr-8 py-2 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                    />
                    {invSearchQuery && (
                      <button
                        onClick={() => setInvSearchQuery('')}
                        className="absolute right-3 top-2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] font-bold border-none cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingItem({
                      type: 'product',
                      isNew: true,
                      data: { id: '', subcategoryId: subcategories[0]?.id || '', brandId: '', name: '', price: 0, description: '', image: '', badges: [], color: '', shape: '', size: '', tags: [], stock: 10 }
                    })}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none flex items-center gap-1 self-end @md:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {bt('Tilføj Produkt', 'Add Product')}
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[9px] font-black tracking-wider">
                          <th className="p-4">{bt('Billede & Vare', 'Image & Item')}</th>
                          <th className="p-4">{bt('Underkategori', 'Subcategory')}</th>
                          <th className="p-4">{bt('Mærke', 'Brand')}</th>
                          <th className="p-4">{bt('Pris', 'Price')}</th>
                          <th className="p-4">{bt('Lager', 'Stock')}</th>
                          <th className="p-4 text-right w-40">{bt('Handlinger', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredInvProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-600 italic">
                              {bt('Ingen produkter fundet.', 'No products found.')}
                            </td>
                          </tr>
                        ) : (
                          filteredInvProducts.map(p => {
                            const subcat = subcategories.find(s => s.id === p.subcategoryId);
                            const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
                            const currentStock = p.stock !== undefined ? p.stock : 15;
                            return (
                              <tr key={p.id} className="hover:bg-slate-100 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-white border border-slate-200 shrink-0" />
                                  <div>
                                    <h5 className="font-bold text-slate-900 leading-tight uppercase text-[11px]">{p.name}</h5>
                                    <span className="text-[9px] font-bold text-slate-500 tracking-wider font-mono">ID: {p.id}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-slate-700 font-medium">{subcat?.name || p.subcategoryId}</td>
                                <td className="p-4 text-slate-700 font-medium">{brand?.name || bt('Intet (Direkte)', 'None (Direct)')}</td>
                                <td className="p-4 font-mono font-bold text-slate-700">{p.price.toLocaleString('da-DK')},- DKK</td>
                                <td className="p-4 text-slate-700 font-bold font-mono">{currentStock} {bt('stk', 'pcs')}</td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditingItem({
                                        type: 'product',
                                        isNew: false,
                                        data: { ...p }
                                      })}
                                      className="px-2.5 py-1 bg-slate-855 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-300 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Settings className="w-3 h-3 text-amber-505" />
                                      {bt('Rediger', 'Edit')}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem('product', p.id)}
                                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-900 text-rose-400 font-bold text-[10px] rounded-lg border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      {bt('Slet', 'Delete')}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EDIT ITEM DIALOG MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full text-left space-y-4 my-8">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">
                  {editingItem.isNew ? bt('Tilføj', 'Add') : bt('Rediger', 'Edit')}{' '}
                  {editingItem.type === 'category' ? bt('Kategori', 'Category') :
                   editingItem.type === 'subcategory' ? bt('Underkategori', 'Subcategory') : bt('Produkt', 'Product')}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-transparent hover:text-slate-900 text-slate-600 font-bold border-none cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-semibold text-slate-700">
                {editingItem.type === 'category' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-600 tracking-wider">{bt('Kategorinavn', 'Category Name')}</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.name || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, name: e.target.value }
                        })}
                        placeholder={bt('F.eks. Låse & Cylindre', 'E.g. Locks & Cylinders')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Kategori ID / Slug (Unik, små bogstaver & bindestreg)', 'Category ID / Slug (Unique, lowercase & hyphen)')}</label>
                      <input
                        type="text"
                        required
                        disabled={!editingItem.isNew}
                        value={editingItem.data.id || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, id: e.target.value }
                        })}
                        placeholder={bt('F.eks. lase-cylindre', 'E.g. locks-cylinders')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Ikon (Emoji eller tegn)', 'Icon (Emoji or character)')}</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.icon || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, icon: e.target.value }
                        })}
                        placeholder="F.eks. 🔒"
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Beskrivelse', 'Description')}</label>
                      <textarea
                        rows={3}
                        value={editingItem.data.description || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, description: e.target.value }
                        })}
                        placeholder={bt('Beskriv kategorien...', 'Describe the category...')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Billede URL', 'Image URL')}</label>
                      <input
                        type="text"
                        value={editingItem.data.image || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, image: e.target.value }
                        })}
                        placeholder={bt('Billede URL til banner (f.eks. Unsplash link)...', 'Image URL for banner (e.g. Unsplash link)...')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>
                  </>
                )}

                {editingItem.type === 'subcategory' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Navn', 'Name')}</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.name || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, name: e.target.value }
                        })}
                        placeholder={bt('F.eks. Hængelåse (Padlocks)', 'E.g. Padlocks')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Underkategori ID / Slug (Unik)', 'Subcategory ID / Slug (Unique)')}</label>
                      <input
                        type="text"
                        required
                        disabled={!editingItem.isNew}
                        value={editingItem.data.id || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, id: e.target.value }
                        })}
                        placeholder={bt('F.eks. haengelaase', 'E.g. padlocks')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Overordnet Kategori', 'Parent Category')}</label>
                      <select
                        required
                        value={editingItem.data.categoryId || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, categoryId: e.target.value }
                        })}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      >
                        <option value="">{bt('Vælg kategori...', 'Select category...')}</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Kort Beskrivelse', 'Short Description')}</label>
                      <textarea
                        rows={2}
                        value={editingItem.data.description || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, description: e.target.value }
                        })}
                        placeholder={bt('Kort introduktion til underkategorien...', 'Short introduction to subcategory...')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-450 focus:ring-1 focus:ring-amber-450 transition-all font-sans font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Detaljeret Beskrivelse', 'Detailed Description')}</label>
                      <textarea
                        rows={3}
                        value={editingItem.data.detailedDescription || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, detailedDescription: e.target.value }
                        })}
                        placeholder={bt('Uddybende produkttekst vist øverst på kategorisiden...', 'Detailed description shown at the top of category page...')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-450 focus:ring-1 focus:ring-amber-450 transition-all font-sans font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider mb-1">{bt('Tilknyttede Mærker', 'Associated Brands')}</label>
                      <div className="grid grid-cols-2 gap-2 bg-white p-3 border border-slate-200 rounded-xl">
                        {WEBSHOP_BRANDS.map(brand => {
                          const isChecked = editingItem.data.brandIds?.includes(brand.id);
                          return (
                            <label key={brand.id} className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer hover:text-slate-900">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  const currentBrands = editingItem.data.brandIds || [];
                                  const updated = e.target.checked
                                    ? [...currentBrands, brand.id]
                                    : currentBrands.filter((bid: string) => bid !== brand.id);
                                  setEditingItem({
                                    ...editingItem,
                                    data: { ...editingItem.data, brandIds: updated }
                                  });
                                }}
                                className="rounded border-slate-200 text-amber-500 focus:ring-amber-500 bg-slate-100"
                              />
                              <span>{brand.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {editingItem.type === 'product' && (
                  <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-1.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Produktnavn', 'Product Name')}</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.name || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, name: e.target.value }
                        })}
                        placeholder={bt('F.eks. Ruko Triton 501 Cylinder', 'E.g. Cylinder Lock Triton 501')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Varenr / ID / Slug (Unik)', 'Item no. / ID / Slug (Unique)')}</label>
                      <input
                        type="text"
                        required
                        disabled={!editingItem.isNew}
                        value={editingItem.data.id || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, id: e.target.value }
                        })}
                        placeholder={bt('F.eks. prod-ruko-triton', 'E.g. prod-lock-triton')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Underkategori', 'Subcategory')}</label>
                      <select
                        required
                        value={editingItem.data.subcategoryId || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, subcategoryId: e.target.value }
                        })}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      >
                        <option value="">{bt('Vælg underkategori...', 'Select subcategory...')}</option>
                        {subcategories.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Producent / Mærke (Valgfrit)', 'Manufacturer / Brand (Optional)')}</label>
                      <select
                        value={editingItem.data.brandId || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, brandId: e.target.value }
                        })}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      >
                        <option value="">{bt('Intet (Direkte produkt uden mærke)', 'None (Direct product without brand)')}</option>
                        {WEBSHOP_BRANDS.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Pris (DKK, inkl. moms)', 'Price (DKK, incl. VAT)')}</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={editingItem.data.price === undefined ? '' : editingItem.data.price}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, price: parseFloat(e.target.value) }
                        })}
                        placeholder="F.eks. 1249"
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Billede URL', 'Image URL')}</label>
                      <input
                        type="text"
                        value={editingItem.data.image || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, image: e.target.value }
                        })}
                        placeholder={bt('Billede URL link...', 'Image URL link...')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Mærkater / Badges (Komma-separeret)', 'Tags / Badges (Comma-separated)')}</label>
                      <input
                        type="text"
                        value={Array.isArray(editingItem.data.badges) ? editingItem.data.badges.join(', ') : (editingItem.data.badges || '')}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, badges: e.target.value }
                        })}
                        placeholder={bt('F.eks. Høj Sikkerhed, Patenteret, Udsolgt', 'E.g. High Security, Patented')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase text-slate-455 tracking-wider font-semibold">{bt('Farve', 'Color')}</label>
                        <input
                          type="text"
                          value={editingItem.data.color || ''}
                          onChange={e => setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, color: e.target.value }
                          })}
                          placeholder={bt('sølv', 'silver')}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase text-slate-455 tracking-wider font-semibold">{bt('Form', 'Shape')}</label>
                        <input
                          type="text"
                          value={editingItem.data.shape || ''}
                          onChange={e => setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, shape: e.target.value }
                          })}
                          placeholder={bt('rund', 'round')}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase text-slate-455 tracking-wider font-semibold">{bt('Størrelse', 'Size')}</label>
                        <input
                          type="text"
                          value={editingItem.data.size || ''}
                          onChange={e => setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, size: e.target.value }
                          })}
                          placeholder={bt('standard', 'standard')}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Lagerbeholdning', 'Stock Level')}</label>
                      <input
                        type="number"
                        min="0"
                        value={editingItem.data.stock === undefined ? '' : editingItem.data.stock}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, stock: parseInt(e.target.value) || 0 }
                        })}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase text-slate-455 tracking-wider">{bt('Beskrivelse', 'Description')}</label>
                      <textarea
                        rows={3}
                        value={editingItem.data.description || ''}
                        onChange={e => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, description: e.target.value }
                        })}
                        placeholder={bt('Produktbeskrivelse...', 'Product description...')}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans font-medium"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all cursor-pointer border border-slate-300 uppercase tracking-wide"
                  >
                    {bt('Annuller', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-955 font-black rounded-xl transition-all cursor-pointer border-none uppercase tracking-wide"
                  >
                    {bt('Gem ændringer', 'Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CHECKOUT SUCCESS MODAL */}
      {checkoutSuccess && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            setCheckoutSuccess(false);
            setView('categories');
            setSelectedCatId(null);
            setSelectedSubcatId(null);
            setSelectedBrandId(null);
            setSelectedProductId(null);
            if (isPreviewMode) {
              window.location.hash = 'shop';
            }
          }}
        >
          <div 
            className="w-full max-w-sm bg-white border border-slate-200 p-6 rounded-3xl text-center shadow-lg shadow-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">Tak for din bestilling!</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Vi har modtaget din bestilling på låse- og sikringsudstyr. En låsesmed vil kontakte dig hurtigst muligt angående bekræftelse og eventuel montering.
            </p>
            <button 
              onClick={() => {
                setCheckoutSuccess(false);
                setView('categories');
                setSelectedCatId(null);
                setSelectedSubcatId(null);
                setSelectedBrandId(null);
                setSelectedProductId(null);
                if (isPreviewMode) {
                  window.location.hash = 'shop';
                }
              }}
              className="mt-5 w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none transition-all active:scale-95"
            >
              Luk vindue
            </button>
          </div>
        </div>
      )}

      {/* SIMULATED EMAIL INBOX MODAL */}
      {simulatedEmail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div 
            className="w-full max-w-lg bg-slate-100 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-left text-slate-700 font-sans max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window bar */}
            <div className="bg-white px-4 py-3 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-600 font-bold ml-2 tracking-wide uppercase">Simuleret E-mail Klient</span>
              </div>
              <button 
                onClick={() => setSimulatedEmail(null)}
                className="text-slate-600 hover:text-slate-900 text-xs font-bold bg-transparent border-none cursor-pointer"
              >
                Luk [X]
              </button>
            </div>

            {/* Email Headers */}
            <div className="p-4 bg-slate-100 border-b border-slate-850 space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider">Fra:</span>
                <span className="text-amber-400 font-bold ml-2">MM Låseshop &lt;no-reply@mmlaseshop.dk&gt;</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider">Til:</span>
                <span className="text-slate-700 font-medium ml-2">{simulatedEmail.to}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider">Emne:</span>
                <span className="text-slate-900 font-extrabold ml-2">{simulatedEmail.subject}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-5 space-y-4 text-xs leading-relaxed text-slate-700 max-h-[250px] overflow-y-auto font-mono flex-1">
              <p>Kære kunde,</p>
              <p>
                Tak for din bestilling hos <strong>MM Låseshop</strong>.
              </p>
              <p>
                Da du ikke var logget ind, har vi automatisk oprettet en konto til dig for at gøre dine fremtidige bestillinger nemmere.
              </p>
              <div className="p-3 bg-white/80 border border-slate-200 rounded-xl space-y-1">
                <div><strong>Login E-mail:</strong> {simulatedEmail.to}</div>
                <div><strong>Midlertidig Password:</strong> <span className="text-amber-400 font-bold">{simulatedEmail.tempPass}</span></div>
              </div>
              <p>
                For at aktivere din konto og vælge din egen adgangskode, skal du klikke på linket herunder:
              </p>
              
              <div className="pt-2 text-center font-sans">
                <button
                  onClick={() => {
                    const emailVal = simulatedEmail.to;
                    setSimulatedEmail(null);
                    setResetEmail(emailVal);
                    setView('reset-password');
                    if (isPreviewMode) {
                      window.location.hash = `shop/reset-password?email=${encodeURIComponent(emailVal)}`;
                    }
                  }}
                  className="inline-block px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide text-[10.5px] border-none"
                >
                  Nulstil Adgangskode & Log Ind
                </button>
              </div>
            </div>

            {/* Email Footer */}
            <div className="bg-slate-100 px-4 py-3 border-t border-slate-850 text-[10px] text-slate-500 text-center font-medium">
              Dette er en simuleret e-mail for at demonstrere flowet. I produktion sendes denne e-mail til kundens indbakke.
            </div>
          </div>
        </div>
      )}
      {/* ORDER DETAIL MODAL */}
      {activeDetailOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveDetailOrder(null)}
        >
          <div 
            className="w-full max-w-2xl bg-slate-100 border border-slate-200 p-6 rounded-3xl text-left shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <span className="font-mono text-sm font-black text-amber-400">{activeDetailOrder.id}</span>
                <p className="text-[10px] text-slate-600 font-bold tracking-wide mt-0.5">Bestillingsdato: {activeDetailOrder.date}</p>
              </div>
              <button
                onClick={() => setActiveDetailOrder(null)}
                className="w-8 h-8 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 flex items-center justify-center font-bold transition-all border border-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid @md:grid-cols-2 gap-6">
              {/* Left Column: Customer & Shipping Details */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-[10.5px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    Kundeoplysninger
                  </h4>
                  <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl space-y-1 text-xs">
                    <p className="text-slate-900 font-bold">{activeDetailOrder.customer.name}</p>
                    <p className="text-slate-700"><span className="text-slate-500">Email:</span> {activeDetailOrder.customer.email}</p>
                    <p className="text-slate-700"><span className="text-slate-500">Tlf:</span> {activeDetailOrder.customer.phone}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10.5px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    Forsendelse & Shipmondo
                  </h4>
                  <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl space-y-1.5 text-xs">
                    {activeDetailOrder.shipping ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[9px] font-black uppercase rounded">
                            {activeDetailOrder.shipping.carrier.toUpperCase()}
                          </span>
                          <span className="font-bold text-slate-900 text-[11px]">{activeDetailOrder.shipping.name}</span>
                        </div>
                        <p className="text-slate-700 leading-tight">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold mt-1.5">Leveringsadresse/Udlevering</span>
                          {activeDetailOrder.shipping.address}
                        </p>
                      </>
                    ) : (
                      <p className="text-slate-600 italic">Ingen leveringsmetode valgt (standard levering).</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10.5px] font-black uppercase text-slate-600 tracking-wider">Ordre Status</h4>
                  <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        activeDetailOrder.status === 'modtaget' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        activeDetailOrder.status === 'godkendt' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                        activeDetailOrder.status === 'afsendt' ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' :
                        'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                      }`}>
                        {activeDetailOrder.status === 'modtaget' ? 'Modtaget' :
                         activeDetailOrder.status === 'godkendt' ? 'Godkendt / Behandles' :
                         activeDetailOrder.status === 'afsendt' ? 'Afsendt / Gennemført' : 'Annulleret'}
                      </span>
                    </div>
                    {activeDetailOrder.refundRequested && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed">
                        ⚠️ Refundering Anmodet
                        {activeDetailOrder.refundReason && (
                          <span className="block text-[10px] text-slate-600 font-normal mt-1 leading-normal">Årsag: "{activeDetailOrder.refundReason}"</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Ordered Items & Total */}
              <div className="space-y-4">
                <h4 className="text-[10.5px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-500" />
                  Bestilte Varer
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 max-h-56 overflow-y-auto">
                  {activeDetailOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex gap-2.5 items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-sm">
                        🔑
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate leading-tight uppercase">{item.product.name}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{item.quantity} x {item.product.price.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</p>
                      </div>
                      <span className="font-mono text-xs text-slate-900 font-bold shrink-0">
                        {(item.product.price * item.quantity).toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Subtotal:</span>
                    <span>{activeDetailOrder.subtotal.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Forsendelse:</span>
                    <span>0,00 DKK</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 text-slate-900">
                    <span>Total beløb:</span>
                    <span className="text-amber-400">{activeDetailOrder.total.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Block */}
            <div className="border-t border-slate-200 pt-4 mt-6 flex justify-end gap-2.5">
              {activeDetailOrder.refundRequested && activeDetailOrder.status !== 'annulleret' && (
                <button
                  onClick={() => updateOrderStatus(activeDetailOrder.id, 'annulleret')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-slate-900 font-extrabold text-xs uppercase tracking-wide rounded-xl transition-all border-none cursor-pointer"
                >
                  Godkend Refundering
                </button>
              )}
              {activeDetailOrder.status === 'modtaget' && (
                <button
                  onClick={() => updateOrderStatus(activeDetailOrder.id, 'godkendt')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-955 font-extrabold text-xs uppercase tracking-wide rounded-xl transition-all border-none cursor-pointer"
                >
                  Godkend Ordre
                </button>
              )}
              {activeDetailOrder.status === 'godkendt' && (
                <button
                  onClick={() => updateOrderStatus(activeDetailOrder.id, 'afsendt')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-955 font-extrabold text-xs uppercase tracking-wide rounded-xl transition-all border-none cursor-pointer"
                >
                  Marker som Afsendt
                </button>
              )}
              {activeDetailOrder.status !== 'afsendt' && activeDetailOrder.status !== 'annulleret' && (
                <button
                  onClick={() => updateOrderStatus(activeDetailOrder.id, 'annulleret')}
                  className="px-4 py-2 bg-slate-200 hover:bg-rose-950 hover:text-rose-400 text-slate-600 font-bold text-xs uppercase tracking-wide rounded-xl border border-slate-300 hover:border-rose-900 transition-all cursor-pointer"
                >
                  Annuller Ordre
                </button>
              )}
              <button
                onClick={() => setActiveDetailOrder(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wide rounded-xl border border-slate-300 transition-all cursor-pointer"
              >
                Luk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-150 pt-8 mt-12 pb-4 text-left relative z-10 select-none">
        <div className="grid grid-cols-1 @md:grid-cols-4 gap-8">
          {/* Logo Column */}
          <div className="space-y-3">
            {(() => {
              const fLogoType = s.footerLogoType || s.logoType || 'text';
              const fLogoFontSize = s.footerLogoFontSize ? Number(s.footerLogoFontSize) : 14;
              const fLogoSrc = s.footerLogoSrc || s.logoSrc || '';
              const ratio = fLogoFontSize / 14;

              return (
                <div className="flex items-center gap-3">
                  {fLogoType === 'image' && fLogoSrc ? (
                    <div className="relative group">
                      <div 
                        className={`flex items-center justify-center shrink-0 ${!isPreviewMode ? 'cursor-pointer outline-dashed outline-1 outline-transparent hover:outline-slate-300' : ''}`}
                        onClick={(e) => {
                          if (!isPreviewMode) {
                            e.stopPropagation();
                            promptEditImage('setting', '', 'footerLogoSrc');
                            // Ensure it's treated as image type when uploaded
                            updateSetting('footerLogoType', 'image');
                          }
                        }}
                      >
                        <img src={fLogoSrc} alt="Footer Logo" className="object-contain" style={{ height: `${40 * ratio}px` }} />
                      </div>
                      {!isPreviewMode && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-white border border-slate-200 rounded-md shadow-sm p-1 z-50">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateSetting('footerLogoFontSize', String(Math.max(10, fLogoFontSize - 2))); }}
                            className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold leading-none cursor-pointer border-none"
                          >
                            -
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateSetting('footerLogoFontSize', String(Math.min(72, fLogoFontSize + 2))); }}
                            className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold leading-none cursor-pointer border-none"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center text-slate-800 font-black font-mono bg-white shadow-sm shrink-0"
                      style={{ width: `${40 * ratio}px`, height: `${40 * ratio}px` }}
                    >
                      <EditableText tag="span" isPreviewMode={isPreviewMode} html={s.footerLogoBadge || s.logoBadge || 'MM'} 
                        className="text-amber-455 font-extrabold outline-none focus:bg-slate-100 px-0.5 rounded"
                        style={{ fontSize: `${12 * ratio}px` }}
                                                                        onBlur={(e) => updateSetting('footerLogoBadge', e.currentTarget.innerHTML)}
                       />
                    </div>
                  )}
                  {(!fLogoType || fLogoType === 'text') && (
                    <EditableText tag="h4" isPreviewMode={isPreviewMode} html={s.footerLogoText || s.logoText || 'MM LÅSESMED'} 
                      className="font-black text-slate-900 leading-none uppercase outline-none focus:bg-slate-100 px-0.5 rounded"
                      style={{ fontSize: `${fLogoFontSize}px` }}
                                                                  onBlur={(e) => updateSetting('footerLogoText', e.currentTarget.innerHTML)}
                     />
                  )}
                  {/* Invisible dropzone to switch from text to image */}
                  {!isPreviewMode && fLogoType !== 'image' && (
                    <button 
                      className="text-[8px] bg-slate-100 px-1 py-0.5 rounded ml-2 text-slate-400 hover:text-slate-600 cursor-pointer border border-slate-200"
                      onClick={(e) => { e.stopPropagation(); updateSetting('footerLogoType', 'image'); promptEditImage('setting', '', 'footerLogoSrc'); }}
                    >
                      Billede
                    </button>
                  )}
                </div>
              );
            })()}
            <EditableText tag="p" isPreviewMode={isPreviewMode} html={s.footerDesc || 'Låsesystemer af høj kvalitet lavet af miljøvenlige materialer. Designet til moderne og minimalistiske lejligheder.'} 
              className="text-xs text-slate-400 leading-relaxed max-w-xs outline-none focus:bg-slate-50 px-1 rounded"
                                          onBlur={(e) => updateSetting('footerDesc', e.currentTarget.innerHTML)}
             />
          </div>

          {/* Areas Column */}
          <div>
            <EditableText tag="h5" isPreviewMode={isPreviewMode} html={s.footerCol2Title || 'Områder'} 
              className="text-[10px] font-black uppercase text-slate-900 tracking-wider mb-3 outline-none focus:bg-slate-100 px-1 rounded"
                                          onBlur={(e) => updateSetting('footerCol2Title', e.currentTarget.innerHTML)}
             />
            <ul 
              className="text-xs text-slate-500 space-y-1.5 list-none p-0 outline-none focus:bg-slate-50 px-1 rounded"
              contentEditable={!isPreviewMode}
              suppressContentEditableWarning
              onBlur={(e) => updateSetting('footerCol2Items', e.currentTarget.innerText)}
            >
              {(s.footerCol2Items || 'København\nAmager\nValby\nRødovre\nHvidovre').split('\n').map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Address Column */}
          <div>
            <EditableText tag="h5" isPreviewMode={isPreviewMode} html={s.footerCol3Title || 'Adresse'} 
              className="text-[10px] font-black uppercase text-slate-900 tracking-wider mb-3 outline-none focus:bg-slate-100 px-1 rounded"
                                          onBlur={(e) => updateSetting('footerCol3Title', e.currentTarget.innerHTML)}
             />
            <ul 
              className="text-xs text-slate-505 space-y-1.5 list-none p-0 outline-none focus:bg-slate-50 px-1 rounded"
              contentEditable={!isPreviewMode}
              suppressContentEditableWarning
              onBlur={(e) => updateSetting('footerCol3Items', e.currentTarget.innerText)}
            >
              {(s.footerCol3Items || 'Kulvej 10, 2 TV\n2450 København\nDenmark').split('\n').map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <EditableText tag="h5" isPreviewMode={isPreviewMode} html={s.footerCol4Title || 'Information'} 
              className="text-[10px] font-black uppercase text-slate-900 tracking-wider mb-3 outline-none focus:bg-slate-100 px-1 rounded"
                                          onBlur={(e) => updateSetting('footerCol4Title', e.currentTarget.innerHTML)}
             />
            <ul 
              className="text-xs text-slate-505 space-y-1.5 list-none p-0 outline-none focus:bg-slate-50 px-1 rounded"
              contentEditable={!isPreviewMode}
              suppressContentEditableWarning
              onBlur={(e) => updateSetting('footerCol4Items', e.currentTarget.innerText)}
            >
              {(s.footerCol4Items || 'Om os\nKarriere\n+45 31 11 11 15\ninfo@mmlaasesmed.dk').split('\n').map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-8 pt-4 flex flex-col @sm:flex-row justify-center @sm:justify-end items-center relative gap-4 @sm:gap-0 text-[10px] text-slate-400">
          <div className="text-center @sm:absolute @sm:left-1/2 @sm:-translate-x-1/2">
            <EditableText tag="span" isPreviewMode={isPreviewMode} html={s.footerCopyright || 'Copyright © 2019 MM-COMMERCE. All Rights Reserved.'}             className="outline-none focus:bg-slate-50 px-1 rounded"
                                      onBlur={(e: any) => updateSetting('footerCopyright', e.currentTarget.innerHTML)}
             />
          </div>
          <div className="flex gap-3">
            <EditableText tag="span" isPreviewMode={isPreviewMode} html={s.footerTerms || 'Terms Of Use'} 
              className="hover:underline cursor-pointer outline-none focus:bg-slate-50 px-1 rounded"
                                          onBlur={(e: any) => updateSetting('footerTerms', e.currentTarget.innerHTML)}
             />
            <EditableText tag="span" isPreviewMode={isPreviewMode} html={s.footerPrivacy || 'Privacy Policy'} 
              className="hover:underline cursor-pointer outline-none focus:bg-slate-50 px-1 rounded"
                                          onBlur={(e: any) => updateSetting('footerPrivacy', e.currentTarget.innerHTML)}
             />
          </div>
        </div>
      </footer>
    </div>
  );
}
