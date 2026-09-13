import type { Translations } from './types';

export const ca: Translations = {
  meta: {
    appTitle: '{app} — el registre d’entrenaments que no et destorba',
    appDescription:
      '{app} és un registre d’entrenaments per a iPhone, ràpid i local. Apunta les sèries en segons, segueix rutines, mira el teu progrés i guarda les dades al teu dispositiu i al teu propi iCloud.',
    privacyTitle: 'Política de privacitat — {app}',
    privacyDescription:
      'Com tracta {app} les teves dades: tot es queda al teu dispositiu i al teu propi iCloud. Sense servidors, sense rastrejadors, sense anuncis.',
    supportTitle: 'Suport — {app}',
    supportDescription: 'Respostes a les preguntes més habituals sobre {app} i com posar-t’hi en contacte.',
  },
  nav: {
    skipToContent: 'Ves al contingut',
    privacy: 'Privacitat',
    support: 'Suport',
    language: 'Idioma',
    theme: { label: 'Tema', system: 'Tema del sistema', light: 'Tema clar', dark: 'Tema fosc' },
    footerAria: 'Peu de pàgina',
    homeAria: 'Inici {dApp}',
  },
  product: {
    eyebrow: 'Registre d’entrenaments per a iPhone',
    heroTitle: 'Apunta la sèrie. Torna a la barra.',
    heroSub:
      '{app} és un registre d’entrenaments que no et destorba. Introdueix pes i repeticions, deixa córrer el temporitzador de descans i mira com el teu progrés creix setmana rere setmana, tot al teu dispositiu.',
    platformNote: 'iOS {ios}+ · Castellà i anglès · kg / lb',
    ctaAppStore: 'Baixa-la a l’App Store',
    ctaTestFlight: 'Uneix-te a la beta de TestFlight',
    ctaComingSoon: 'Properament',
    ctaComingSoonNote: 'Encara no és a l’App Store. Torna-hi aviat.',
    featuresEyebrow: 'Funcions',
    featuresHeading: 'Tot el que necessites al gimnàs. Res del que et sobra.',
    featuresSub:
      'Pensada per a com entrenes de debò: registre ràpid, valors per defecte amb seny i un progrés que es nota.',
    features: [
      {
        icon: 'log',
        title: 'Registre de sèries sense esforç',
        body: 'Pes i repeticions en dos tocs. Exercicis amb pes corporal i llast, temporitzador de descans entre sèries i dreceres de teclat per no perdre el ritme.',
      },
      {
        icon: 'routines',
        title: 'Rutines o començar de zero',
        body: 'Crea rutines tipus Push / Pull / Legs i comença-les amb un toc, o inicia un entrenament buit i afegeix-hi exercicis sobre la marxa.',
      },
      {
        icon: 'heatmap',
        title: 'Mapa de calor muscular',
        body: 'Descobreix quins músculs treballa realment cada rutina. El mapa es pondera per càrrega de volum, no només pel nombre de sèries.',
      },
      {
        icon: 'progress',
        title: 'Progrés que pots recórrer',
        body: 'Gràfics de cada exercici, historial de pes corporal i rècords personals. Arrossega el dit pel gràfic per llegir qualsevol punt.',
      },
      {
        icon: 'library',
        title: 'Biblioteca d’exercicis seleccionada',
        body: 'Un catàleg triat a mà amb cerca intel·ligent, per trobar el moviment correcte en un segon en lloc de repassar-ne milers.',
      },
      {
        icon: 'health',
        title: 'Apple Health en tots dos sentits',
        body: 'Llegeix els teus entrenaments i la freqüència cardíaca de Salut i hi escriu cada sessió completada, perquè els teus anells i l’historial es mantinguin sencers.',
      },
      {
        icon: 'cloud',
        title: 'Local primer, sincronitzat per iCloud',
        body: 'Tot viu al teu iPhone i se sincronitza a través del teu propi compte d’iCloud. Sense comptes per crear ni servidors pel mig.',
      },
      {
        icon: 'resume',
        title: 'No perdis mai una sessió',
        body: 'Tanca l’app a mig entrenament i reprèn-lo just on l’havies deixat. Edita qualsevol entrenament acabat: sèries, pesos, notes.',
      },
    ],
    galleryEyebrow: 'Pantalles',
    galleryHeading: 'Dissenyada per al racó fosc del gimnàs.',
    gallerySub: 'Alt contrast, botons grans, una sola mà. Es veu igual a les 6 del matí que a les 11 de la nit.',
    screenshotAlts: [
      'Pantalla Avui {dApp}: sense rutina programada, amb els botons Només entrenar i Veure biblioteca i la setmana següent',
      'Pantalla Biblioteca {dApp} amb les rutines Push, Pull, Cama i Tren superior i el nombre de sessions',
      'Pantalla Progrés {dApp} amb exercicis seguits, tendències i pes corporal',
      'Pantalla Tu {dApp} amb entrenaments totals, quilos aixecats, hores entrenades i sessions recents',
    ],
    placeholderLabel: 'Captura properament',
    videoEyebrow: 'En moviment',
    videoHeading: 'Trenta segons, un entrenament.',
    videoSub: 'Comença una rutina, apunta unes sèries, acaba. Aquest és tot el cicle.',
    videoPlaceholder: 'Vídeo de demostració properament',
    videoUnsupported: 'El teu navegador no admet vídeo incrustat.',
    dataEyebrow: 'Les teves dades',
    dataHeading: 'Les teves dades són teves.',
    dataSub:
      '{app} no té backend. No cal registrar-se enlloc, res que es pugui filtrar i res per vendre.',
    dataPoints: [
      {
        title: 'Al teu dispositiu',
        body: 'Els entrenaments es guarden localment al teu iPhone amb SwiftData. L’app funciona completament sense connexió.',
      },
      {
        title: 'El teu propi iCloud',
        body: 'La sincronització opcional fa servir la base de dades privada de CloudKit lligada al teu Compte d’Apple. El desenvolupador no la pot llegir.',
      },
      {
        title: 'Apple Health',
        body: 'Les dades de salut només es llegeixen i s’escriuen amb el teu permís i mai no surten del teu dispositiu si no és a través del teu iCloud.',
      },
      {
        title: 'Sense rastrejadors',
        body: 'Sense analítiques de tercers, sense anuncis, sense SDK que enviïn dades a ningú. Només els informes d’errors agregats d’Apple.',
      },
    ],
    dataLink: 'Llegeix la política de privacitat completa',
    finalHeading: 'Quan tu vulguis.',
    finalSub: '{app} per a iPhone. iOS {ios} o posterior.',
    finalSupport: 'Dubtes? Visita el suport',
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Política de privacitat',
    effective: 'En vigor des del {date}',
    intro: [
      '{app} està desenvolupada per {developer}, desenvolupador independent. Aquesta política explica, en llenguatge planer, quines dades toca l’app i on van. La versió curta: es queden amb tu.',
      '{app} no té servidor. No hi ha cap compte amb el desenvolupador, cap servei d’analítica ni publicitat. El desenvolupador no té cap manera d’accedir a res del que registres a l’app.',
    ],
    sections: [
      {
        heading: 'Dades guardades al teu dispositiu',
        paragraphs: [
          'Tot el que introdueixes a {app} (entrenaments, sèries, rutines, pes corporal, rècords personals i ajustos) es guarda localment al teu iPhone. L’app funciona completament sense connexió.',
        ],
      },
      {
        heading: 'Sincronització amb iCloud',
        paragraphs: [
          'Si tens l’iCloud activat al dispositiu, {app} sincronitza les teves dades mitjançant Apple CloudKit fent servir la base de dades privada associada al teu Compte d’Apple. Apple xifra aquestes dades en trànsit i en repòs, i només són accessibles des dels teus propis dispositius. El desenvolupador no hi té accés.',
        ],
      },
      {
        heading: 'Iniciar sessió amb Apple',
        paragraphs: [
          '{app} fa servir Iniciar sessió amb Apple per identificar el teu compte. Només rep el nom i l’adreça de correu que Apple proporciona (que pot ser una adreça de reenviament privada si tries amagar el teu correu). Aquesta informació s’utilitza únicament per identificar el teu compte i no es comparteix mai.',
        ],
      },
      {
        heading: 'Apple Health (HealthKit)',
        paragraphs: [
          'Amb el teu permís, {app} llegeix entrenaments i mostres de freqüència cardíaca d’Apple Health i escriu a Apple Health els entrenaments que completes a l’app. Pots concedir, revisar o revocar aquest accés en qualsevol moment des de l’app Salut.',
          'Les dades de salut mai no surten del teu dispositiu si no és a través de la teva pròpia sincronització d’iCloud. Mai no es comparteixen amb tercers, mai no es fan servir amb finalitats publicitàries o de màrqueting i mai no es venen. {app} no utilitza les dades de salut per a cap altra finalitat que mostrar-te-les dins de l’app.',
        ],
      },
      {
        heading: 'Diagnòstic',
        paragraphs: [
          '{app} rep informes agregats d’errors i rendiment a través d’Apple MetricKit. Els genera i anonimitza Apple, i no contenen dades personals ni d’entrenaments. {app} no inclou analítiques de tercers, SDK publicitaris ni rastrejadors de cap mena.',
        ],
      },
      {
        heading: 'Eliminar les teves dades',
        paragraphs: ['Tu tens el control. Per eliminar-ho tot:'],
        bullets: [
          'Esborra l’app de l’iPhone per eliminar totes les dades locals.',
          'Per eliminar les dades sincronitzades, obre Configuració → el teu nom → iCloud → Gestiona l’emmagatzematge del compte, selecciona {app} i esborra’n les dades.',
          'Les dades de salut escrites per {app} es poden eliminar des de l’app Salut, a Explora → Entrenaments.',
        ],
      },
      {
        heading: 'Menors',
        paragraphs: [
          '{app} no s’adreça a menors de 13 anys i no en recull informació de manera conscient.',
        ],
      },
      {
        heading: 'Canvis en aquesta política',
        paragraphs: [
          'Si aquesta política canvia, la nova versió es publicarà en aquesta pàgina amb la data d’entrada en vigor actualitzada.',
        ],
      },
    ],
    contactHeading: 'Contacte',
    contactBody: 'Preguntes o sol·licituds sobre les teves dades? Escriu a {email}.',
  },
  support: {
    eyebrow: 'Ajuda',
    title: 'Suport',
    intro: 'Respostes a les preguntes que més ens arriben. Si la teva no hi és, envia un correu: respon una persona de debò.',
    faqHeading: 'Preguntes freqüents',
    faq: [
      {
        q: 'En quins dispositius funciona {app}?',
        a: '{app} funciona en iPhone amb iOS {ios} o posterior. La interfície està disponible en castellà i anglès, i pots registrar en quilograms o lliures.',
      },
      {
        q: 'Necessito un compte?',
        a: 'No. {app} ho guarda tot al teu iPhone. Iniciar sessió amb Apple només es fa servir per identificar el teu compte a la sincronització d’iCloud: no hi ha cap contrasenya per recordar ni cap servidor per part del desenvolupador.',
      },
      {
        q: 'Com funciona la sincronització entre els meus dispositius?',
        a: 'Activa l’iCloud a cada dispositiu amb el mateix Compte d’Apple i {app} se sincronitza automàticament a través de la teva base de dades privada d’iCloud. Res no passa pel desenvolupador.',
      },
      {
        q: 'Què fa {app} amb Apple Health?',
        a: 'Amb el teu permís, llegeix entrenaments i freqüència cardíaca d’Apple Health i escriu a Salut cada entrenament que acabes, perquè l’historial i els anells d’activitat es mantinguin complets. Ho pots canviar en qualsevol moment des de l’app Salut, a Compartir.',
      },
      {
        q: 'He tancat l’app a mig entrenament. He perdut la sessió?',
        a: 'No. {app} conserva l’entrenament en curs i t’ofereix reprendre’l o descartar-lo la propera vegada que obris l’app.',
      },
      {
        q: 'Puc editar un entrenament després d’acabar-lo?',
        a: 'Sí. Obre qualsevol sessió completada des de l’historial i canvia’n sèries, pesos i repeticions.',
      },
      {
        q: 'Com esborro les meves dades?',
        a: 'Esborra l’app per eliminar les dades locals. Per netejar les dades sincronitzades, ves a Configuració → el teu nom → iCloud → Gestiona l’emmagatzematge del compte i esborra les dades {dApp}. Consulta la política de privacitat per a més detalls.',
      },
    ],
    contactHeading: 'Encara encallat?',
    contactBody: 'Escriu directament al desenvolupador. Indica la teva versió d’iOS i què estaves fent quan ha passat el problema.',
    contactCta: 'Escriu a suport',
    contactHint: 'O escriu a {email}',
  },
  footer: {
    byline: 'Una app indie de hackie.dev',
    privacy: 'Privacitat',
    support: 'Suport',
  },
  notFound: {
    title: 'Pàgina no trobada',
    body: 'Aquest enllaç no porta enlloc.',
    cta: 'Torna a {app}',
  },
};
