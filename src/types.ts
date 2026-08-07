export type ElementType = 'text' | 'button' | 'image' | 'divider' | 'spacer' | 'image-banner' | 'search-box' | 'webshop';

export interface ElementStyles {
  fontFamily?: string;
  fontSize?: string; // e.g., '14px', '24px', '48px'
  fontWeight?: '300' | '400' | '500' | '600' | '700' | '800';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string; // e.g., '1', '1.25', '1.5', '1.75', '2'
  letterSpacing?: string; // e.g., '-0.5px', '0px', '1px', '3px'
  color?: string; // Hex color code
  backgroundColor?: string; // Hex color code
  borderColor?: string; // Hex color code
  borderRadius?: string; // e.g., '0px', '4px', '8px', '9999px'
  borderWidth?: string; // e.g., '0px', '1px', '2px', '4px'
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  wordSpacing?: string;
}

export interface PageElement {
  id: string;
  type: ElementType;
  content: string;
  src?: string;    // For images
  alt?: string;    // Alt tag for images
  link?: string;   // For buttons
  styles: ElementStyles;
  stylesTablet?: ElementStyles;
  stylesMobile?: ElementStyles;
  
  // Overlay fields for images
  overlayTitle?: string;
  overlaySubtext?: string;
  overlayPosition?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  showOverlayButton?: boolean;
  showButton?: boolean; // Desktop version fallback
  overlayButtonText?: string;
  overlayButtonLink?: string;
  showOverlaySearch?: boolean;
  showSearchBox?: boolean; // Desktop version fallback
  overlaySearchPlaceholder?: string;
  overlaySearchButtonText?: string;
  overlayBgColor?: string;
  overlayBgOpacity?: number; // 0 to 100
  listType?: 'none' | 'unordered' | 'ordered' | 'square' | 'checkmark';
  overlays?: OverlayItem[];
  
  // Backend API Submissions config
  actionType?: 'link' | 'submit';
  backendUrl?: string;
  backendMethod?: 'POST' | 'GET';

  // Responsive device visibility
  visibleOnDesktop?: boolean;
  visibleOnTablet?: boolean;
  visibleOnMobile?: boolean;
  
  // Read More / Read Less functionality
  enableReadMore?: boolean;
  readMoreHeight?: string;
  settings?: any;
}

export interface DropdownLink {
  id: string;
  parentItem: string;  // e.g. "Erhverv"
  group: string;       // e.g. "Sikkerhed & Adgang"
  title: string;       // e.g. "Adgangskontrol"
  description?: string; // e.g. "Fleksible adgangsløsninger..."
  link: string;        // e.g. "#adgangskontrol"
  pageSlug?: string;   // slug of another page
}

export interface OverlayItem {
  id: string;
  type: 'text' | 'button' | 'search-box' | 'logo' | 'dropdown-menu';
  content: string;
  link?: string;
  src?: string; // Optional image source (e.g. for image logos)
  styles: ElementStyles;
  stylesTablet?: ElementStyles;
  stylesMobile?: ElementStyles;
  dropdownLinks?: DropdownLink[];
  
  // Backend API Submissions config
  actionType?: 'link' | 'submit';
  backendUrl?: string;
  backendMethod?: 'POST' | 'GET';

  // Responsive device visibility
  visibleOnDesktop?: boolean;
  visibleOnTablet?: boolean;
  visibleOnMobile?: boolean;
  settings?: any;
}

export interface Column {
  id: string;
  width: string; // Tailwind class e.g., 'w-full', 'md:w-1/2', 'md:w-1/3'
  elements: PageElement[];
  customWidth?: string; // custom CSS width e.g., '30%', '40%', '320px'
}

export interface Section {
  id: string;
  name: string;
  layout: 'single-col' | 'two-col' | 'three-col' | 'custom' | 'rows';
  paddingY: 'none' | 'sm' | 'md' | 'lg' | 'xl'; // controls padding h-space
  backgroundColor: string; // hex or theme-specific class
  textColor: string;
  backgroundImage?: string;
  bgOpacity?: number;
  columns: Column[];
  fullWidth?: boolean;
  
  // Custom height/padding
  minHeight?: string;
  customPaddingTop?: string;
  customPaddingBottom?: string;
  customWidth?: string;
  customHeight?: string;
  customPaddingLeft?: string;
  customPaddingRight?: string;
  customMarginTop?: string;
  customMarginBottom?: string;

  // Responsive device visibility
  visibleOnDesktop?: boolean;
  visibleOnTablet?: boolean;
  visibleOnMobile?: boolean;

  // Responsive styling overrides
  tabletOverrides?: Partial<Omit<Section, 'id' | 'name' | 'layout' | 'columns' | 'tabletOverrides' | 'mobileOverrides'>>;
  mobileOverrides?: Partial<Omit<Section, 'id' | 'name' | 'layout' | 'columns' | 'tabletOverrides' | 'mobileOverrides'>>;
}

export interface SiteTheme {
  id: string;
  name: string;
  primary: string; // e.g., '#000000' or Tailwind color
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
  border: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'display';
  baseLineHeight?: string; // Global line-height override
  slug?: string;
}

export interface SiteState {
  sections: Section[];
  theme: SiteTheme;
  selectedElementId: string | null;
  selectedSectionId: string | null;
  selectedColumnId: string | null;
}
