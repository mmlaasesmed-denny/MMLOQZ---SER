import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'da' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultContext: LanguageContextType = {
  language: 'da',
  setLanguage: () => {},
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

// A simple dictionary mapping English keys to Danish translations.
// We use English as the key for simplicity since a lot of the codebase is English/Danish mixed.
const dictionary: Record<string, { da: string, en: string }> = {
  // Main Tabs
  "Inspector": { da: "Inspektør", en: "Inspector" },
  "Elements": { da: "Elementer", en: "Elements" },
  "Webshop": { da: "Webshop", en: "Webshop" },
  "Layout": { da: "Layout", en: "Layout" },
  "Themes": { da: "Temaer", en: "Themes" },
  "AI Writer": { da: "AI Skribent", en: "AI Writer" },

  // General Controls
  "Save": { da: "Gem", en: "Save" },
  "Preview": { da: "Forhåndsvisning", en: "Preview" },
  "Export": { da: "Eksportér", en: "Export" },
  "Delete": { da: "Slet", en: "Delete" },
  "Add": { da: "Tilføj", en: "Add" },
  "Clone": { da: "Klon", en: "Clone" },
  "Edit": { da: "Rediger", en: "Edit" },
  "Cancel": { da: "Annuller", en: "Cancel" },

  // App UI text
  "No component selected": { da: "Intet element valgt", en: "No component selected" },
  "Select an element or section to view its properties": { da: "Vælg et element eller en sektion for at se dens egenskaber", en: "Select an element or section to view its properties" },
  "Add new section": { da: "Tilføj ny sektion", en: "Add new section" },
  
  // Element Types
  "Element Type": { da: "Elementtype", en: "Element Type" },
  "Text / HTML Block": { da: "Tekst / HTML-blok", en: "Text / HTML Block" },
  "Image / Graphic": { da: "Billede / Grafik", en: "Image / Graphic" },
  "Button / Link Button": { da: "Knap / Link-knap", en: "Button / Link Button" },
  "Horizontal Divider": { da: "Vandret deling", en: "Horizontal Divider" },
  "Blank Spacer": { da: "Tom plads", en: "Blank Spacer" },
  "Search Input Box": { da: "Søgefelt", en: "Search Input Box" },

  // Sidebar specific
  "Add New Element": { da: "Tilføj Nyt Element", en: "Add New Element" },
  "Text Content": { da: "Tekstindhold", en: "Text Content" },
  "Image URL": { da: "Billed-URL", en: "Image URL" },
  "Button Link": { da: "Knaplink", en: "Button Link" },
  "Padding": { da: "Polstring (Padding)", en: "Padding" },
  "Margin": { da: "Margen (Margin)", en: "Margin" },
  "Dimensions": { da: "Dimensioner", en: "Dimensions" },
  "Typography": { da: "Typografi", en: "Typography" },
  "Colors": { da: "Farver", en: "Colors" },
  
  // Language Switcher
  "Language": { da: "Sprog", en: "Language" },
  "Danish": { da: "Dansk", en: "Danish" },
  "English": { da: "Engelsk", en: "English" }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('da');

  const t = (key: string): string => {
    const entry = dictionary[key];
    if (entry) {
      return entry[language] || key;
    }
    // If not in dictionary, just return the key as fallback
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
