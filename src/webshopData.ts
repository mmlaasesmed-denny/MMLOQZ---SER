export interface WebshopCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcatIds: string[];
  image?: string;
}

export interface WebshopSubcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  detailedDescription: string;
  brandIds: string[];
  image?: string;
}

export interface WebshopBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface WebshopProduct {
  id: string;
  subcategoryId: string;
  brandId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  badges: string[];
  badge?: string;
  color?: string;
  shape?: string;
  size?: string;
  tags?: string[];
  stock?: number;
  specifications?: { key: string; value: string }[];
}

export const WEBSHOP_CATEGORIES: WebshopCategory[] = [
  {
    id: 'adgangskontrol',
    name: 'Adgangskontrol',
    icon: '🚪',
    description: 'Adgangskontrol (ADK) - nemt at gøre det sikkert til din dør.',
    subcatIds: ['Langskilte', 'softwaretilbehor', 'Cylinders', 'Wallreadersandcontrolunits'],
    image: 'https://mmlaasesmed.dk/images/uploads/202503100652-38accesscontrol_main_cat.webp'
  },
  {
    id: 'MMLoqz',
    name: 'MMLoqz',
    icon: '📱',
    description: 'Innovativ og Trådløs Låseløsning til Hjem og Erhverv.',
    subcatIds: ['mmloqzdigitalcylinders'],
    image: 'https://mmlaasesmed.dk/images/uploads/202509050523-55maincat_image_mmloqs_for_copy_mmloqs.webp'
  },
  {
    id: 'alarm',
    name: 'AJAX Alarm',
    icon: '🛡️',
    description: 'Branchevalg sikkerhed eller brand fabrikant.',
    subcatIds: ['alarmpannel', 'signal', 'spanel', 'sensor', 'branddetektor', 'noglebrik', 'alarmpakke'],
    image: 'https://mmlaasesmed.dk/images/uploads/202503100652-48Ajax-1_alarm_main_category.jpg'
  }
];

export const WEBSHOP_SUBCATEGORIES: WebshopSubcategory[] = [
  {
    id: 'Langskilte',
    categoryId: 'adgangskontrol',
    name: 'Langskilte',
    description: 'Langskiltesæt til elektronisk adgangskontrol og smarte låse.',
    detailedDescription: 'Smarte langskilte giver dig elektronisk adgangskontrol direkte på døren. Perfekt til både kontorer og moderne lejligheder.',
    brandIds: ['stroxx', 'dormakaba']
  },
  {
    id: 'softwaretilbehor',
    categoryId: 'adgangskontrol',
    name: 'Software & Tilbehør',
    description: 'Adgangskontrol softwarelicenser og tilbehør.',
    detailedDescription: 'Licenser og hardware-tilbehør for at styre og programmere dine adgangskontrolenheder.',
    brandIds: ['dormakaba']
  },
  {
    id: 'Cylinders',
    categoryId: 'adgangskontrol',
    name: 'Cylinders',
    description: 'Højsikkerheds cylindere til elektronisk eller mekanisk låsesystem.',
    detailedDescription: 'Cylindere i højeste kvalitet til sikring av døre.',
    brandIds: ['dormakaba', 'ruko']
  },
  {
    id: 'Wallreadersandcontrolunits',
    categoryId: 'adgangskontrol',
    name: 'Væglæsere & Styreenheder',
    description: 'Væglæsere, kodetastaturer og styreenheder til dørstyring.',
    detailedDescription: 'Væglæsere til berøringsfri kort eller brikker samt styreenheder til døre.',
    brandIds: ['dormakaba']
  },
  {
    id: 'mmloqzdigitalcylinders',
    categoryId: 'MMLoqz',
    name: 'MMLoqz Digital Cylinders',
    description: 'Smarte trådløse digitale cylindere fra MMLoqz.',
    detailedDescription: 'Fuldstændig trådløse og cloud-styrede digitale cylindere, der kan eftermonteres i eksisterende døre uden kabler.',
    brandIds: ['ruko']
  },
  {
    id: 'alarmpannel',
    categoryId: 'alarm',
    name: 'Alarmpanel',
    description: 'Centrale kontrolpaneler til AJAX alarmsystemer.',
    detailedDescription: 'Kernen i dit alarmsystem, der modtager trådløse signaler fra alle sensorer og videresender alarmer til din mobil eller vagtcentral.',
    brandIds: ['ajax']
  },
  {
    id: 'signal',
    categoryId: 'alarm',
    name: 'Signalforstærker',
    description: 'Trådløse signalforstærkere til udvidelse af rækkevidde.',
    detailedDescription: 'Forstærker det trådløse signal mellem alarmpanelet og sensorerne på store afstande.',
    brandIds: ['ajax']
  },
  {
    id: 'spanel',
    categoryId: 'alarm',
    name: 'Betjeningspanel',
    description: 'Trådløse tastaturer og betjeningspaneler til alarmstyring.',
    detailedDescription: 'Gør det nemt at tilkoble og frakoble dit alarmsystem med pinkode eller brik ved indgangen.',
    brandIds: ['ajax']
  },
  {
    id: 'sensor',
    categoryId: 'alarm',
    name: 'Sensor',
    description: 'Bevægelsessensorer, dørkontakter og glasbrudsdetektorer.',
    detailedDescription: 'Trådløse sensorer, der registrerer indbrudsforsøg eller færden øjeblikkeligt.',
    brandIds: ['ajax']
  },
  {
    id: 'branddetektor',
    categoryId: 'alarm',
    name: 'Branddetektor',
    description: 'Smarte røg- og varmealarmer.',
    detailedDescription: 'Tidlig detektion af røg, hurtig temperaturstigning og kulilte (CO).',
    brandIds: ['ajax']
  },
  {
    id: 'noglebrik',
    categoryId: 'alarm',
    name: 'Nøglebrik',
    description: 'Trådløse brikker og fjernbetjeninger til nem betjening.',
    detailedDescription: 'Tilkobl eller frakobl din alarm med et enkelt tryk på nøgleringen eller ved at scanne brikken.',
    brandIds: ['ajax']
  },
  {
    id: 'alarmpakke',
    categoryId: 'alarm',
    name: 'Alarmpakke',
    description: 'Komplette alarmsæt klar til installation.',
    detailedDescription: 'Færdige startpakker med alt, hvad du behøver for at sikre din bolig eller virksomhed.',
    brandIds: ['ajax']
  }
];

export const WEBSHOP_BRANDS: WebshopBrand[] = [
  {
    id: 'stroxx',
    name: 'STROXX',
    logo: '🔒',
    description: 'Innovativ adgangskontrol og smarte låse i elegant, robust design.'
  },
  {
    id: 'dormakaba',
    name: 'DormaKaba',
    logo: '🏢',
    description: 'Pålidelige schweiziske låsesystemer, dørpumper og adgangspaneler designet specielt til intensive erhvervsmiljøer.'
  },
  {
    id: 'ajax',
    name: 'Ajax Systems',
    logo: '🛡️',
    description: 'Prisvindende professionelt trådløst alarmsystem til optimal indbruds- og brandsikring.'
  },
  {
    id: 'ruko',
    name: 'ASSA ABLOY (Ruko)',
    logo: '🔑',
    description: 'Danmarks mest kendte og betroede låseproducent, der leverer kvalitetssikring til både private og store erhvervsvirksomheder.'
  }
];

export const WEBSHOP_PRODUCTS: WebshopProduct[] = [
  // Langskilte
  {
    id: 'prod-stroxx-europaeisk',
    subcategoryId: 'Langskilte',
    brandId: 'stroxx',
    name: 'Langskiltesæt Smartlock ST-2 RS XLOCK t/Europæisk lås',
    price: 2299,
    description: 'Højresistent, patenteret langskiltesæt fra STROXX i rustfrit stål A2 børstet finish.',
    image: 'https://mmlaasesmed.dk/images/uploads/202412030841-0940013216.webp',
    badges: ['STROXX Pro', 'Rustfrit Stål'],
    color: 'sølv',
    shape: 'Langskilte',
    size: '310mm',
    tags: ['langskilt', 'stroxx', 'xlock', 'smartlock', 'europæisk']
  },
  {
    id: 'prod-stroxx-sort',
    subcategoryId: 'Langskilte',
    brandId: 'stroxx',
    name: 'Langskiltesæt Smartlock ST-2 sort XLOCK t/Europæisk lås',
    price: 2499,
    description: 'Elegant og holdbart sort langskiltesæt fra STROXX til elektronisk adgangskontrol.',
    image: 'https://mmlaasesmed.dk/images/uploads/202411140623-27xclo2.webp',
    badges: ['Stilrent design', 'Bestseller'],
    color: 'sort',
    shape: 'Langskilte',
    size: '310mm',
    tags: ['langskilt', 'stroxx', 'xlock', 'smartlock', 'sort']
  },
  {
    id: 'prod-dormakaba-matrix',
    subcategoryId: 'Langskilte',
    brandId: 'dormakaba',
    name: 'Dormakaba Matrix Air Elektronisk Langskilt',
    price: 2580,
    description: 'Elektronisk langskilt med fladt design og nem montering på eksisterende låsekasser.',
    image: 'https://mmlaasesmed.dk/images/Dormakaba_Product_starting_from_image_Desktop_zKihfM9.webp',
    badges: ['Premium ADK', 'Dormakaba'],
    color: 'sølv',
    shape: 'Langskilte',
    size: 'standard',
    tags: ['langskilt', 'dormakaba', 'matrix', 'elektronisk']
  },
  
  // Software & Tilbehør
  {
    id: 'prod-dormakaba-licens',
    subcategoryId: 'softwaretilbehor',
    brandId: 'dormakaba',
    name: 'Dormakaba evolo Manager Software Licens',
    price: 3450,
    description: 'Komplet softwarelicens til programmering og administration af evolo adgangssystemer.',
    image: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600&auto=format&fit=crop&q=80',
    badges: ['Software', 'evolo'],
    color: 'blå',
    shape: 'box',
    size: 'standard',
    tags: ['software', 'dormakaba', 'evolo', 'licens']
  },

  // Cylinders
  {
    id: 'prod-dormakaba-digital-cylinder',
    subcategoryId: 'Cylinders',
    brandId: 'dormakaba',
    name: 'Dormakaba Digital Cylinder 1435',
    price: 1850,
    description: 'Berøringsfri digital cylinder med hærdet borebeskyttelse og optisk signalering.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    badges: ['Digital', 'IP65'],
    color: 'sølv',
    shape: 'rund',
    size: '30/30',
    tags: ['cylinder', 'dormakaba', 'digital', 'adk']
  },

  // MMLoqz Digital Cylinders
  {
    id: 'prod-mmloqz-smart-cylinder',
    subcategoryId: 'mmloqzdigitalcylinders',
    brandId: 'ruko',
    name: 'MMLoqz Digital Smart Cylinder ST-1',
    price: 1599,
    description: 'Sikker, innovativ og trådløs digital cylinder til nem eftermontering.',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80',
    badges: ['MMLoqz', 'Nyhed'],
    color: 'sølv',
    shape: 'rund',
    size: 'standard',
    tags: ['cylinder', 'mmloqz', 'trådløs', 'smart']
  },

  // AJAX Alarmpaneler
  {
    id: 'prod-ajax-hub2',
    subcategoryId: 'alarmpannel',
    brandId: 'ajax',
    name: 'AJAX Hub 2 (4G) Alarmpanel Hvid',
    price: 1899,
    description: 'Centralt kontrolpanel, der understøtter fotoverifikation og 4G/Ethernet opkobling.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    badges: ['AJAX Hub', '4G LTE'],
    color: 'hvid',
    shape: 'firkantet',
    size: '163x163mm',
    tags: ['ajax', 'alarm', 'hub', 'panel', 'central']
  },
  {
    id: 'prod-ajax-hub2-sort',
    subcategoryId: 'alarmpannel',
    brandId: 'ajax',
    name: 'AJAX Hub 2 Plus Sort',
    price: 2799,
    description: 'Avanceret alarmpanel med Wi-Fi, Ethernet, 4G Dual-SIM og plads til 200 enheder.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    badges: ['Wi-Fi + 4G', 'Premium Hub'],
    color: 'sort',
    shape: 'firkantet',
    size: '163x163mm',
    tags: ['ajax', 'alarm', 'hub', 'plus', 'sort']
  },

  // Signalforstærker
  {
    id: 'prod-ajax-rex2',
    subcategoryId: 'signal',
    brandId: 'ajax',
    name: 'AJAX ReX 2 Signalforstærker Hvid',
    price: 1199,
    description: 'Trådløs signalforstærker med understøttelse af fotoverifikation for AJAX systemer.',
    image: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600&auto=format&fit=crop&q=80',
    badges: ['Rækkevidde', 'ReX 2'],
    color: 'hvid',
    shape: 'firkantet',
    size: 'standard',
    tags: ['ajax', 'rex', 'forstærker', 'signal']
  },

  // Betjeningspanel
  {
    id: 'prod-ajax-keypad',
    subcategoryId: 'spanel',
    brandId: 'ajax',
    name: 'AJAX KeyPad Trådløst Betjeningspanel',
    price: 799,
    description: 'Trådløst touch-tastatur til nem til- og frakobling af AJAX alarmsystem.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    badges: ['Touch', 'Trådløs'],
    color: 'hvid',
    shape: 'rektangulær',
    size: 'standard',
    tags: ['ajax', 'keypad', 'tastatur', 'betjening']
  },

  // Sensorer
  {
    id: 'prod-ajax-motionprotect',
    subcategoryId: 'sensor',
    brandId: 'ajax',
    name: 'AJAX MotionProtect Bevægelsessensor',
    price: 499,
    description: 'Trådløs bevægelsesdetektor med kæledyrs-immunitet op til 20 kg.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    badges: ['PIR', 'Dyre-immun'],
    color: 'hvid',
    shape: 'oval',
    size: 'kompakt',
    tags: ['ajax', 'sensor', 'bevægelse', 'pir']
  },
  {
    id: 'prod-ajax-doorprotect',
    subcategoryId: 'sensor',
    brandId: 'ajax',
    name: 'AJAX DoorProtect Dørkontakt',
    price: 349,
    description: 'Trådløs magnetisk dør- og vindueskontakt med input til ekstern sensor.',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80',
    badges: ['Magnet', 'Sikker'],
    color: 'sort',
    shape: 'cylinder',
    size: 'lille',
    tags: ['ajax', 'sensor', 'dør', 'vindue', 'magnet']
  },

  // Branddetektorer
  {
    id: 'prod-ajax-fireprotect2',
    subcategoryId: 'branddetektor',
    brandId: 'ajax',
    name: 'AJAX FireProtect 2 (Heat/Smoke) Brandalarm',
    price: 799,
    description: 'Trådløs røg- og varmealarm med indbygget sirene og lang batterilevetid.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    badges: ['FireProtect 2', 'Varme+Røg'],
    color: 'hvid',
    shape: 'rund',
    size: 'kompakt',
    tags: ['ajax', 'brand', 'røg', 'varme', 'sirene']
  },

  // Nøglebrikker
  {
    id: 'prod-ajax-tag',
    subcategoryId: 'noglebrik',
    brandId: 'ajax',
    name: 'AJAX Tag Nøglebrik 3-pak',
    price: 249,
    description: 'Krypterede berøringsfrie brikker til nem styring af AJAX KeyPad Plus.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
    badges: ['DESFire', '3-pak'],
    color: 'sort',
    shape: 'brik',
    size: 'lille',
    tags: ['ajax', 'brik', 'tag', 'nøglebrik']
  },

  // Alarmpakker
  {
    id: 'prod-ajax-starterkit',
    subcategoryId: 'alarmpakke',
    brandId: 'ajax',
    name: 'AJAX StarterKit Trådløs Alarmsætpakke Hvid',
    price: 3499,
    description: 'Komplet startpakke indeholdende Hub, MotionProtect, DoorProtect og SpaceControl.',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=400&q=80',
    badges: ['Komplet Sæt', 'Bedste Pris'],
    color: 'hvid',
    shape: 'kit',
    size: 'standard',
    tags: ['ajax', 'sæt', 'alarm', 'pakke', 'startkit']
  }
];
