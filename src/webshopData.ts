export interface WebshopCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcatIds: string[];
}

export interface WebshopSubcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  detailedDescription: string;
  brandIds: string[];
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
}

export const WEBSHOP_CATEGORIES: WebshopCategory[] = [
  {
    id: 'lase-cylindre',
    name: 'Låse & Cylindre',
    icon: '🔒',
    description: 'Mekanisk og elektronisk dør- og ejendomssikring i højeste sikkerhedsklasse.',
    subcatIds: ['systemlase', 'haengelaase', 'smartlocks']
  },
  {
    id: 'adgangskontrol',
    name: 'Adgangskontrol & Alarm',
    icon: '🛡️',
    description: 'Moderne kodelåse, videoporttelefoner og CCTV overvågning til hjemmet og kontoret.',
    subcatIds: ['doertelefoner', 'kodelaase', 'overvaagning']
  },
  {
    id: 'pengeskabe',
    name: 'Pengeskabe & Brandskabe',
    icon: '🗄️',
    description: 'Indbrudssikre og brandsikre pengeskabe til sikker opbevaring af værdier og dokumenter.',
    subcatIds: ['vaerdiskabe', 'brandskabe', 'noegleskabe']
  }
];

export const WEBSHOP_SUBCATEGORIES: WebshopSubcategory[] = [
  {
    id: 'systemlase',
    categoryId: 'lase-cylindre',
    name: 'Systemlåse (Master Key)',
    description: 'Patenteret, organiseret låsesystem hvor én nøgle passer til udvalgte døre.',
    detailedDescription: 'Systemlåse (også kendt som Master Key-systemer) giver dig fuld kontrol over adgangen til dine lokaler. Ved hjælp af et patenteret cylindersystem kan du tildele medarbejdere eller beboere én enkelt nøgle, der kun låser de døre, de har tilladelse til. Dette eliminerer behovet for store nøglebundter, forbedrer sikkerheden markant mod uautoriseret nøglekopiering, og giver administratorer en uforlignelig fleksibilitet. Ideelt til boligforeninger, kontorkomplekser og private ejendomme.',
    brandIds: ['ruko', 'evva', 'dormakaba']
  },
  {
    id: 'haengelaase',
    categoryId: 'lase-cylindre',
    name: 'Hængelåse (Padlocks)',
    description: 'Kraftige hængelåse til sikring af porte, containere og skure.',
    detailedDescription: 'Hængelåse er den klassiske og mobile løsning til effektiv sikring af områder, der ikke kan monteres med faste låsekasser. Vores udvalg spænder fra mindre låse to skabe og værktøjskasser til certificerede klasse 3 og klasse 4 hængelåse med hærdede bøjler til tunge porte, containere, motorcykler og skure. De er designet til at modstå ekstreme vejrforhold og brutale opbrudsforsøg, og kan integreres i dit eksisterende låsesystem.',
    brandIds: ['ruko', 'dormakaba']
  },
  {
    id: 'smartlocks',
    categoryId: 'lase-cylindre',
    name: 'Smarte & Elektroniske Låse',
    description: 'Nøglefri dørstyring til private hjem og erhverv.',
    detailedDescription: 'Smarte og elektroniske låse repræsenterer fremtidens adgangssikring. Glem alt om tabte nøgler – du kan låse op med smartphone-app, PIN-kode, fingeraftryk eller en trådløs brik. Du kan oprette midlertidige adgangskoder til gæster eller håndværkere direkte fra din telefon, overvåge loggen for hvem der går ind og ud, og låse døren automatisk bag dig. Vores smarte låse er godkendt til nordiske døre og opfylder strenge forsikringskrav.',
    brandIds: ['yale', 'salto']
  },
  {
    id: 'doertelefoner',
    categoryId: 'adgangskontrol',
    name: 'Dørtelefoner (Intercom)',
    description: 'Smarte samtaleanlæg med og uden video til styring af gæsteadgang.',
    detailedDescription: 'Dørtelefonsystemer er den første forsvarslinje i enhver etageejendom eller erhvervsbygning. Vi tilbyder moderne samtalepaneler med krystalklar tovejs-lyd og højopløselig videoovervågning. Beboere kan nemt og sikkert verificere gæsters identitet, før de låser op via en svartelefon i lejligheden eller direkte på mobilen. Systemet forhindrer uønsket færdsel i opgange og skaber tryghed for alle i ejendommen.',
    brandIds: ['salto', 'ruko']
  },
  {
    id: 'kodelaase',
    categoryId: 'adgangskontrol',
    name: 'Kodelåse & Scannere',
    description: 'Nøglefrie adgangspaneler med PIN-kode, brik eller biometri.',
    detailedDescription: 'Kodelåse og scannere er ideelle til kontorer, lagerområder, fitnesscentre og andre faciliteter, hvor der er stor udskiftning af brugere. Du slipper for administration af fysiske nøgler – brugere indtaster blot en personlig kode, scanner en RFID-brik eller anvender biometrisk genkendelse (f.eks. fingeraftryk). Systemet kan tidsstyres, så bestemte koder kun virker inden for arbejdstiden, og tabte brikker kan spærres øjeblikkeligt.',
    brandIds: ['salto', 'evva', 'yale']
  },
  {
    id: 'overvaagning',
    categoryId: 'adgangskontrol',
    name: 'Overvågningskameraer (CCTV)',
    description: 'Kameraovervågning med nattesyn, bevægelsesdetektion og app-styring.',
    detailedDescription: 'Videoovervågning (CCTV) er et uundværligt redskab til forebyggelse af kriminalitet og dokumentation af hændelser. Vores kamerasystemer leverer knivskarpe billeder i fuld HD/4K – også om natten takket være infrarød teknologi. Med avanceret AI-bevægelsesdetektion modtager du en push-besked på din smartphone, hvis der registreres mistænkelig aktivitet omkring din ejendom, så du kan handle proaktivt og se live-optagelser.',
    brandIds: ['yale', 'ruko']
  },
  {
    id: 'vaerdiskabe',
    categoryId: 'pengeskabe',
    name: 'Værdiskabe',
    description: 'Forsikringsgodkendte pengeskabe til smykker, kontanter og værdipapirer.',
    detailedDescription: 'Vores forsikringsgodkendte værdiskabe tilbyder den ultimative beskyttelse mod indbrud og tyveri. Hvert skab er testet og certificeret vha. europæiske standarder (f.eks. EN 1143-1), hvilket garanterer maksimal mekanisk modstandsdygtighed. Perfekt til opbevaring af kontanter, smykker, ure, guldbarrer og fortrolige dokumenter i både private hjem og erhvervsvirksomheder. Fås med elektronisk kodelås eller traditionel nøglelås.',
    brandIds: []
  },
  {
    id: 'brandskabe',
    categoryId: 'pengeskabe',
    name: 'Brandskabe',
    description: 'Brandsikre dokumentbokse der beskytter vigtige papirer mod brand.',
    detailedDescription: 'Brandskabe og dokumentskabe er specielt designet og isoleret til at holde den interne temperatur nede under en ildebrand. Vores udvalg er brandtestet og certificeret vha. anerkendte internationale standarder (f.eks. NT Fire 017), hvilket giver dig enten 60 eller 120 minutters fuld beskyttelse af papirdokumenter eller digitale datamedier. Ideel til skøder, pas, testamenter, backup-drev og uerstattelige familiefotos.',
    brandIds: []
  },
  {
    id: 'noegleskabe',
    categoryId: 'pengeskabe',
    name: 'Nøgleskabe',
    description: 'Nøgleskabe med kodelås til sikker opbevaring og organisering af nøgler.',
    detailedDescription: 'Sikker og organiseret opbevaring af nøgler er afgørende for boligforeninger, erhverv, bilforhandlere og plejehjem. Vores nøgleskabe er fremstillet af kraftigt stål og udstyret med kraftige låsemekanismer for at forhindre uautoriseret adgang. De leveres med justerbare nøglekroge, farvekodede tags og nummererede lister for nemt overblik. Vælg mellem mekanisk kodelås, elektronisk kodelås eller nøglelås alt efter dit behov.',
    brandIds: []
  }
];

export const WEBSHOP_BRANDS: WebshopBrand[] = [
  {
    id: 'ruko',
    name: 'ASSA ABLOY (Ruko)',
    logo: '🔑',
    description: 'Danmarks mest kendte og betroede låseproducent, der leverer kvalitetssikring til både private og store erhvervsvirksomheder.'
  },
  {
    id: 'evva',
    name: 'EVVA Security',
    logo: '🌀',
    description: 'Østrigsk specialist kendt for mekaniske låsesystemer i verdensklasse samt den innovative AirKey mobiladgang.'
  },
  {
    id: 'salto',
    name: 'SALTO Systems',
    logo: '📶',
    description: 'Global pioner inden for trådløse adgangssystemer, der integrerer smartlåse og adgangskontrol via cloud-løsninger.'
  },
  {
    id: 'yale',
    name: 'Yale',
    logo: '🏡',
    description: 'Markedsleder inden for smarte låse og sikring til private hjem, kendt for Yale Doorman og Yale Linus.'
  },
  {
    id: 'dormakaba',
    name: 'DormaKaba',
    logo: '🏢',
    description: 'Pålidelige schweiziske låsesystemer, dørpumper og adgangspaneler designet specielt til intensive erhvervsmiljøer.'
  }
];

export const WEBSHOP_PRODUCTS: WebshopProduct[] = [
  // Systemlåse
  {
    id: 'prod-ruko-triton',
    subcategoryId: 'systemlase',
    brandId: 'ruko',
    name: 'Ruko Triton 501 Cylinder',
    price: 899,
    description: 'Højresistent, patenteret låsecylinder til private boliger og mindre virksomheder. Giver fremragende beskyttelse mod dirkning og boring.',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80',
    badges: ['Høj Sikkerhed', 'Patenteret'],
    color: 'sølv',
    shape: 'rund',
    size: 'standard',
    tags: ['cylinder', 'ruko', 'lås', 'mekanisk', 'masterkey']
  },
  {
    id: 'prod-ruko-garant',
    subcategoryId: 'systemlase',
    brandId: 'ruko',
    name: 'Ruko Garant Plus Cylinder',
    price: 1249,
    description: 'Premium låsecylinder med kopibeskyttede nøgler. Perfekt til masterkey-systemer i boligforeninger og større kontorer.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    badges: ['Bedst i Test', 'Ekstrem Sikker'],
    color: 'sølv',
    shape: 'rund',
    size: 'standard',
    tags: ['cylinder', 'ruko', 'lås', 'sikker', 'kopisikring']
  },
  {
    id: 'prod-evva-4ks',
    subcategoryId: 'systemlase',
    brandId: 'evva',
    name: 'EVVA 4KS Cylinder',
    price: 1450,
    description: 'Fjederløs sikkerhedscylinder med unik kurveteknologi. Modstandsdygtig over for støv, is og ekstreme opbrudsforsøg.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    badges: ['Fjederløs', 'Vedligeholdelsesfri'],
    color: 'sølv',
    shape: 'rund',
    size: 'stor',
    tags: ['cylinder', 'evva', 'lås', 'fjederløs', 'kurve']
  },
  {
    id: 'prod-evva-mcs',
    subcategoryId: 'systemlase',
    brandId: 'evva',
    name: 'EVVA MCS Magnet-system',
    price: 1999,
    description: 'Magnetisk kodesystem, der gør det umuligt at 3D-printe eller kopiere nøglerne. Det absolut ypperste inden for mekanisk sikring.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    badges: ['Ukopierbar', 'Magnet-Teknik'],
    color: 'messing',
    shape: 'rund',
    size: 'stor',
    tags: ['cylinder', 'evva', 'lås', 'magnet', 'sikkerhed']
  },
  {
    id: 'prod-kaba-pextra',
    subcategoryId: 'systemlase',
    brandId: 'dormakaba',
    name: 'DormaKaba pextra+ Cylinder',
    price: 1100,
    description: 'Professionel låsecylinder godkendt til de højeste erhvervsstandarder. Med integreret sikring mod slagmetoder.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
    badges: ['Erhvervskvalitet'],
    color: 'messing',
    shape: 'oval',
    size: 'mellemstor',
    tags: ['cylinder', 'dorma', 'lås', 'pextra', 'erhverv']
  },

  // Hængelåse
  {
    id: 'prod-ruko-pl340',
    subcategoryId: 'haengelaase',
    brandId: 'ruko',
    name: 'Ruko PL340 Hængelås (Klasse 3)',
    price: 650,
    description: 'Forsikringsgodkendt klasse 3 hængelås i hærdet stål. Ideel til porte, bomme og skure.',
    image: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=400&q=80',
    badges: ['Klasse 3', 'Forsikringsgodkendt'],
    color: 'sort',
    shape: 'rektangulær',
    size: '50mm',
    tags: ['hængelås', 'ruko', 'stål', 'klasse 3', 'udendørs']
  },
  {
    id: 'prod-ruko-pl350',
    subcategoryId: 'haengelaase',
    brandId: 'ruko',
    name: 'Ruko PL350 Hængelås (Klasse 4)',
    price: 1150,
    description: 'Heavy duty klasse 4 hængelås beregnet til sikring af skibscontainere, store lagerporte og højsikkerhedsområder.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    badges: ['Klasse 4', 'Ekstrem Styrke'],
    color: 'sort',
    shape: 'rektangulær',
    size: '60mm',
    tags: ['hængelås', 'ruko', 'stål', 'klasse 4', 'container']
  },
  {
    id: 'prod-kaba-padlock',
    subcategoryId: 'haengelaase',
    brandId: 'dormakaba',
    name: 'DormaKaba hærdet hængelås',
    price: 799,
    description: 'Vejrbestandig hængelås, der kan kodes sammen med dine almindelige DormaKaba systemnøgler.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    badges: ['System-kompatibel'],
    color: 'messing',
    shape: 'rund',
    size: '40mm',
    tags: ['hængelås', 'dorma', 'messing', 'system', 'vejrbestandig']
  },

  // Smartlocks
  {
    id: 'prod-yale-doorman',
    subcategoryId: 'smartlocks',
    brandId: 'yale',
    name: 'Yale Doorman L3S Smart Lock',
    price: 2999,
    description: 'Markedets mest populære smarte lås. Lås op med kode, brik eller telefon. Integreret dørklokke og fuld app-styring.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80',
    badges: ['Mest Populær', 'Nøglefri'],
    color: 'sort',
    shape: 'rektangulær',
    size: 'slank',
    tags: ['smartlock', 'yale', 'elektronisk', 'kodelås', 'app']
  },
  {
    id: 'prod-yale-linus',
    subcategoryId: 'smartlocks',
    brandId: 'yale',
    name: 'Yale Linus Smart Lock V2',
    price: 1799,
    description: 'Monteres direkte ovenpå din eksisterende cylinder på indersiden af døren. Udefra ser døren helt normal ud.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
    badges: ['Diskret Design', 'Enkel Installation'],
    color: 'sølv',
    shape: 'oval',
    size: 'kompakt',
    tags: ['smartlock', 'yale', 'linus', 'elektronisk', 'app']
  },
  {
    id: 'prod-salto-neo',
    subcategoryId: 'smartlocks',
    brandId: 'salto',
    name: 'SALTO Neo Smart Cylinder',
    price: 2499,
    description: 'Trådløs, elektronisk cylinder der erstatter din mekaniske cylinder. Låses op med RFID-brik eller Bluetooth-app.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    badges: ['Professionel Smart', 'Fuld Trådløs'],
    color: 'sort',
    shape: 'rund',
    size: 'kompakt',
    tags: ['smartlock', 'salto', 'cylinder', 'trådløs', 'rfid']
  },

  // Dørtelefoner
  {
    id: 'prod-salto-xs4-intercom',
    subcategoryId: 'doertelefoner',
    brandId: 'salto',
    name: 'SALTO XS4 Video Intercom',
    price: 4500,
    description: 'Robust udendørs dørtelefon med HD-kamera og RFID-læser. Integration til beboernes mobiltelefoner.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
    badges: ['Video HD', 'RFID Læser'],
    color: 'grå',
    shape: 'firkantet',
    size: 'standard',
    tags: ['dørtelefon', 'intercom', 'video', 'salto', 'skærm']
  },
  {
    id: 'prod-ruko-assa-intercom',
    subcategoryId: 'doertelefoner',
    brandId: 'ruko',
    name: 'ASSA ABLOY Audio Porttelefon',
    price: 3200,
    description: 'Klassisk, yderst stabil dørtelefon til beboelsesejendomme. Krystalklar lyd og vandalsikret frontplade.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    badges: ['Vandalsikret', 'Klassisk Valg'],
    color: 'sølv',
    shape: 'firkantet',
    size: 'standard',
    tags: ['dørtelefon', 'audio', 'ruko', 'porttelefon', 'klassisk']
  },

  // Kodelåse
  {
    id: 'prod-salto-ks-keypad',
    subcategoryId: 'kodelaase',
    brandId: 'salto',
    name: 'SALTO KS Keypad Væglæser',
    price: 3100,
    description: 'Online adgangspanel med kode og brik-læser. Administreres direkte via cloud-dashboardet SALTO KS.',
    image: 'https://images.unsplash.com/photo-1520607117406-0391e23f03b5?auto=format&fit=crop&w=400&q=80',
    badges: ['Cloud Styret', 'Professionel'],
    color: 'sort',
    shape: 'rektangulær',
    size: 'slank',
    tags: ['kodelås', 'tastatur', 'salto', 'rfid', 'online']
  },
  {
    id: 'prod-evva-airkey',
    subcategoryId: 'kodelaase',
    brandId: 'evva',
    name: 'EVVA AirKey Væglæser',
    price: 2899,
    description: 'Lås op med din smartphone (NFC/BLE) eller et kort. Nem administration i browseren.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=400&q=80',
    badges: ['AirKey', 'NFC & BLE'],
    color: 'sølv',
    shape: 'rektangulær',
    size: 'slank',
    tags: ['kodelås', 'airkey', 'evva', 'nfc', 'app']
  },
  {
    id: 'prod-yale-keypad',
    subcategoryId: 'kodelaase',
    brandId: 'yale',
    name: 'Yale Smart Keypad',
    price: 599,
    description: 'Trådløst tastatur, der parres med din Yale Linus smartlås. Ideel til børn eller gæster uden telefon.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80',
    badges: ['Trådløs', 'Til Hjemmet'],
    color: 'sort',
    shape: 'rektangulær',
    size: 'kompakt',
    tags: ['tastatur', 'yale', 'trådløs', 'kodelås', 'keypad']
  },

  // Overvågning
  {
    id: 'prod-yale-camera',
    subcategoryId: 'overvaagning',
    brandId: 'yale',
    name: 'Yale Smart Udendørs Kamera',
    price: 1299,
    description: '1080p Full HD kamera til udendørs montering. Med indbygget projektør, sirene og tovejs-tale.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80',
    badges: ['Sirene & Lys', 'Nattesyn'],
    color: 'hvid',
    shape: 'cylinder',
    size: 'kompakt',
    tags: ['kamera', 'overvågning', 'yale', 'udendørs', 'cctv']
  },
  {
    id: 'prod-ruko-cctv-dome',
    subcategoryId: 'overvaagning',
    brandId: 'ruko',
    name: 'ASSA ABLOY Dome CCTV Pro',
    price: 2499,
    description: 'Højopløseligt 4K kuppelkamera til professionel overvågning. Slagfast (IK10) og vandtæt (IP67).',
    image: 'https://images.unsplash.com/photo-1528319725582-dd10f36bc566?auto=format&fit=crop&w=400&q=80',
    badges: ['4K UHD', 'Hærværkssikret'],
    color: 'sort',
    shape: 'rund',
    size: 'standard',
    tags: ['kamera', 'overvågning', 'ruko', '4k', 'dome']
  },
  // Pengeskabe & Brandskabe Products
  {
    id: 'prod-securesafe-pro1',
    subcategoryId: 'vaerdiskabe',
    brandId: 'ruko',
    name: 'SecureSafe Pro I Værdiskab',
    price: 4499,
    description: 'EN 1143-1 certificeret værdiskab med elektronisk kodelås. Optimal indbrudssikring til smykker og kontanter.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
    badges: ['EN 1143-1', 'Grade 0'],
    color: 'grå',
    shape: 'kube',
    size: 'stor',
    tags: ['pengeskab', 'værdiskab', 'ruko', 'kodelås', 'stål']
  },
  {
    id: 'prod-yale-safe-premium',
    subcategoryId: 'vaerdiskabe',
    brandId: 'yale',
    name: 'Yale Premium Værdiskab',
    price: 1899,
    description: 'Kompakt og stilrent pengeskab med digitalt tastatur og motoriseret låserigler. Velegnet til private hjem.',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=400&q=80',
    badges: ['Yale Smart', 'Nem Betjening'],
    color: 'sort',
    shape: 'kube',
    size: 'kompakt',
    tags: ['pengeskab', 'værdiskab', 'yale', 'trådløs', 'kodelås']
  },
  {
    id: 'prod-fireshield-box',
    subcategoryId: 'brandskabe',
    brandId: 'ruko',
    name: 'FireShield Document Box',
    price: 2299,
    description: 'Brandsikker boks godkendt til 60 minutters brandbeskyttelse af papir (NT Fire 017). Vandtæt design.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
    badges: ['60 min Brand', 'Vandtæt'],
    color: 'sort',
    shape: 'firkantet',
    size: 'mellemstor',
    tags: ['brandskab', 'dokumentboks', 'brandsikker', 'vandtæt']
  },
  {
    id: 'prod-phoenix-titan',
    subcategoryId: 'brandskabe',
    brandId: 'ruko',
    name: 'Phoenix Titan Fire Safe',
    price: 3499,
    description: 'Elektronisk brandsikret boks med plads til ringbind. Testet til både papir og digitale datamedier.',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=400&q=80',
    badges: ['120 min Brand', 'Datamedier'],
    color: 'lys grå',
    shape: 'kube',
    size: 'stor',
    tags: ['brandskab', 'phoenix', 'brandsikker', 'kodelås']
  },
  {
    id: 'prod-keybox-pro50',
    subcategoryId: 'noegleskabe',
    brandId: 'yale',
    name: 'KeyBox Pro 50 Nøgleskab',
    price: 1199,
    description: 'Robust nøgleskab i stål til 50 nøgler. Udstyret med en pålidelig mekanisk trykknapkodelås.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
    badges: ['Mekanisk Kode', '50 Nøgler'],
    color: 'grå',
    shape: 'rektangulær',
    size: 'mellemstor',
    tags: ['nøgleskab', 'yale', 'stål', 'kodelås', 'nøgler']
  },
  {
    id: 'prod-securikey-100',
    subcategoryId: 'noegleskabe',
    brandId: 'yale',
    name: 'Securikey Key Cabinet 100',
    price: 2599,
    description: 'Højsikkerheds nøgleskab med plads til 100 nøgler. Elektronisk kodelås med log-funktion.',
    image: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=400&q=80',
    badges: ['Elektronisk', '100 Nøgler'],
    color: 'grå',
    shape: 'rektangulær',
    size: 'stor',
    tags: ['nøgleskab', 'yale', 'stål', 'elektronisk', 'nøgler']
  }
];
