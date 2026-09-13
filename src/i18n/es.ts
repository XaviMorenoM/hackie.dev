import type { Translations } from './types';

export const es: Translations = {
  meta: {
    siteSuffix: 'hackie.dev',
    hubTitle: 'hackie.dev — apps independientes, hechas con cariño',
    hubDescription:
      'hackie.dev es la casa de {app} y de otras apps pequeñas y cuidadas, creadas por un desarrollador independiente.',
    appTitle: '{app} — el registro de entrenos que no se interpone',
    appDescription:
      '{app} es un registro de entrenamientos para iPhone, rápido y local. Apunta tus series en segundos, sigue rutinas, mira tu progreso y guarda tus datos en tu dispositivo y en tu propio iCloud.',
    privacyTitle: 'Política de privacidad — {app}',
    privacyDescription:
      'Cómo trata {app} tus datos: todo se queda en tu dispositivo y en tu propio iCloud. Sin servidores, sin rastreadores, sin anuncios.',
    supportTitle: 'Soporte — {app}',
    supportDescription: 'Respuestas a las preguntas más habituales sobre {app} y cómo ponerte en contacto.',
  },
  nav: {
    skipToContent: 'Ir al contenido',
    home: 'Inicio',
    app: '{app}',
    privacy: 'Privacidad',
    support: 'Soporte',
    language: 'Idioma',
    homeAria: 'Inicio de hackie.dev',
  },
  hub: {
    eyebrow: 'Software independiente',
    heroTitle: 'apps independientes, hechas con cariño.',
    heroSub:
      'Herramientas pequeñas para la vida real, creadas por una sola persona que las usa cada día. Sin trucos de crecimiento ni patrones oscuros: solo software que respeta tu tiempo.',
    productsHeading: 'Productos',
    productCardEyebrow: 'iPhone · iOS {ios}+',
    productCardTagline: 'Un registro de entrenos que no se interpone. Apunta series rápido, sigue rutinas y observa tu progreso.',
    productCardCta: 'Descubre {app}',
    aboutHeading: 'Sobre hackie.dev',
    aboutBody:
      'hackie.dev es donde {developer} publica lo que construye para sí mismo. Todas las apps son locales, sin anuncios y hechas para durar.',
  },
  product: {
    eyebrow: 'Registro de entrenos para iPhone',
    heroTitle: 'Apunta la serie. Vuelve a la barra.',
    heroSub:
      '{app} es un registro de entrenamientos que no se interpone. Introduce peso y repeticiones, deja correr el temporizador de descanso y mira cómo tu progreso crece semana a semana, todo en tu dispositivo.',
    platformNote: 'iOS {ios}+ · Español e inglés · kg / lb',
    ctaAppStore: 'Descargar en el App Store',
    ctaTestFlight: 'Unirse a la beta de TestFlight',
    ctaComingSoon: 'Próximamente',
    ctaComingSoonNote: 'Todavía no está en el App Store. Vuelve pronto.',
    featuresEyebrow: 'Funciones',
    featuresHeading: 'Todo lo que necesitas en el gimnasio. Nada de lo que no.',
    featuresSub:
      'Pensada para cómo entrenas de verdad: registro rápido, valores por defecto con sentido y un progreso que se nota.',
    features: [
      {
        icon: 'log',
        title: 'Registro de series sin esfuerzo',
        body: 'Peso y repeticiones en dos toques. Ejercicios con peso corporal y lastre, temporizador de descanso entre series y atajos de teclado para no perder el ritmo.',
      },
      {
        icon: 'routines',
        title: 'Rutinas o empezar de cero',
        body: 'Crea rutinas tipo Push / Pull / Legs y arráncalas con un toque, o empieza un entreno vacío y añade ejercicios sobre la marcha.',
      },
      {
        icon: 'heatmap',
        title: 'Mapa de calor muscular',
        body: 'Descubre qué músculos trabaja realmente cada rutina. El mapa se pondera por carga de volumen, no solo por el número de series.',
      },
      {
        icon: 'progress',
        title: 'Progreso que puedes recorrer',
        body: 'Gráficas de cada ejercicio, historial de peso corporal y récords personales. Arrastra el dedo por la gráfica para leer cualquier punto.',
      },
      {
        icon: 'library',
        title: 'Biblioteca de ejercicios cuidada',
        body: 'Un catálogo seleccionado a mano con búsqueda inteligente, para encontrar el movimiento correcto en un segundo en lugar de pasar por miles.',
      },
      {
        icon: 'health',
        title: 'Apple Health en ambos sentidos',
        body: 'Lee tus entrenamientos y frecuencia cardíaca de Salud y escribe cada sesión completada, para que tus anillos y tu historial sigan completos.',
      },
      {
        icon: 'cloud',
        title: 'Local primero, sincronizado por iCloud',
        body: 'Todo vive en tu iPhone y se sincroniza a través de tu propia cuenta de iCloud. Sin cuentas que crear ni servidores de por medio.',
      },
      {
        icon: 'resume',
        title: 'Nunca pierdas una sesión',
        body: 'Cierra la app a mitad de entreno y retómalo justo donde lo dejaste. Edita cualquier entrenamiento terminado: series, pesos, notas.',
      },
    ],
    galleryEyebrow: 'Pantallas',
    galleryHeading: 'Diseñada para el rincón oscuro del gimnasio.',
    gallerySub: 'Alto contraste, botones grandes, una sola mano. Se ve igual a las 6 de la mañana que a las 11 de la noche.',
    screenshotAlts: [
      'Pantalla de hoy de {app} con la rutina actual y los últimos entrenos',
      'Pantalla de registro de {app} con series, peso, repeticiones y temporizador de descanso',
      'Detalle de rutina de {app} con mapa de calor muscular',
      'Gráficas de progreso de {app} con gráfica de línea interactiva',
      'Biblioteca de ejercicios de {app} con buscador',
      'Pantalla de perfil de {app} con unidades y ajustes de Apple Health',
    ],
    placeholderLabel: 'Captura próximamente',
    videoEyebrow: 'En movimiento',
    videoHeading: 'Treinta segundos, un entreno.',
    videoSub: 'Empieza una rutina, apunta unas series, termina. Ese es todo el ciclo.',
    videoPlaceholder: 'Vídeo de demostración próximamente',
    videoUnsupported: 'Tu navegador no admite vídeo integrado.',
    dataEyebrow: 'Tus datos',
    dataHeading: 'Tus datos son tuyos.',
    dataSub:
      '{app} no tiene backend. No hay nada que registrar, nada que se pueda filtrar y nada que vender.',
    dataPoints: [
      {
        title: 'En tu dispositivo',
        body: 'Los entrenamientos se guardan localmente en tu iPhone con SwiftData. La app funciona completamente sin conexión.',
      },
      {
        title: 'Tu propio iCloud',
        body: 'La sincronización opcional usa la base de datos privada de CloudKit ligada a tu Apple ID. El desarrollador no puede leerla.',
      },
      {
        title: 'Apple Health',
        body: 'Los datos de salud solo se leen y escriben con tu permiso y nunca salen de tu dispositivo salvo a través de tu iCloud.',
      },
      {
        title: 'Sin rastreadores',
        body: 'Sin analíticas de terceros, sin anuncios, sin SDK que envíen datos a nadie. Solo los informes de fallos agregados de Apple.',
      },
    ],
    dataLink: 'Leer la política de privacidad completa',
    finalHeading: 'Cuando tú quieras.',
    finalSub: '{app} para iPhone. iOS {ios} o posterior.',
    finalSupport: '¿Dudas? Visita el soporte',
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Política de privacidad',
    effective: 'En vigor desde el {date}',
    intro: [
      '{app} está desarrollada por {developer}, desarrollador independiente. Esta política explica, en lenguaje claro, qué datos toca la app y adónde van. La versión corta: se quedan contigo.',
      '{app} no tiene servidor. No existe ninguna cuenta con el desarrollador, ningún servicio de analítica ni publicidad. El desarrollador no tiene forma de acceder a nada de lo que registras en la app.',
    ],
    sections: [
      {
        heading: 'Datos guardados en tu dispositivo',
        paragraphs: [
          'Todo lo que introduces en {app} (entrenamientos, series, rutinas, peso corporal, récords personales y ajustes) se guarda localmente en tu iPhone. La app funciona completamente sin conexión.',
        ],
      },
      {
        heading: 'Sincronización con iCloud',
        paragraphs: [
          'Si tienes iCloud activado en tu dispositivo, {app} sincroniza tus datos mediante Apple CloudKit usando la base de datos privada asociada a tu Apple ID. Apple cifra esos datos en tránsito y en reposo, y solo son accesibles desde tus propios dispositivos. El desarrollador no tiene acceso a ellos.',
        ],
      },
      {
        heading: 'Iniciar sesión con Apple',
        paragraphs: [
          '{app} usa Iniciar sesión con Apple para identificar tu cuenta. Solo recibe el nombre y la dirección de correo que Apple proporciona (que puede ser una dirección de reenvío privada si decides ocultar tu correo). Esta información se usa únicamente para identificar tu cuenta y nunca se comparte.',
        ],
      },
      {
        heading: 'Apple Health (HealthKit)',
        paragraphs: [
          'Con tu permiso, {app} lee entrenamientos y muestras de frecuencia cardíaca de Apple Health y escribe en Apple Health los entrenamientos que completas en la app. Puedes conceder, revisar o revocar este acceso en cualquier momento desde la app Salud.',
          'Los datos de salud nunca salen de tu dispositivo salvo a través de tu propia sincronización de iCloud. Nunca se comparten con terceros, nunca se usan con fines publicitarios o de marketing y nunca se venden. {app} no utiliza los datos de salud para ningún fin distinto de mostrártelos dentro de la app.',
        ],
      },
      {
        heading: 'Diagnóstico',
        paragraphs: [
          '{app} recibe informes agregados de fallos y rendimiento a través de Apple MetricKit. Los genera y anonimiza Apple, y no contienen datos personales ni de entrenamientos. {app} no incluye analíticas de terceros, SDK publicitarios ni rastreadores de ningún tipo.',
        ],
      },
      {
        heading: 'Eliminar tus datos',
        paragraphs: ['Tú tienes el control. Para eliminarlo todo:'],
        bullets: [
          'Borra la app de tu iPhone para eliminar todos los datos locales.',
          'Para eliminar los datos sincronizados, abre Ajustes → tu nombre → iCloud → Gestionar almacenamiento de la cuenta, selecciona {app} y borra sus datos.',
          'Los datos de salud escritos por {app} se pueden eliminar desde la app Salud, en Explorar → Entrenamientos.',
        ],
      },
      {
        heading: 'Menores',
        paragraphs: [
          '{app} no está dirigida a menores de 13 años y no recopila conscientemente información sobre ellos.',
        ],
      },
      {
        heading: 'Cambios en esta política',
        paragraphs: [
          'Si esta política cambia, la nueva versión se publicará en esta página con la fecha de entrada en vigor actualizada.',
        ],
      },
    ],
    contactHeading: 'Contacto',
    contactBody: '¿Preguntas o solicitudes sobre tus datos? Escribe a {email}.',
  },
  support: {
    eyebrow: 'Ayuda',
    title: 'Soporte',
    intro: 'Respuestas a las preguntas que más nos llegan. Si la tuya no está, manda un correo: responde una persona de verdad.',
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿En qué dispositivos funciona {app}?',
        a: '{app} funciona en iPhone con iOS {ios} o posterior. La interfaz está disponible en español e inglés, y puedes registrar en kilogramos o libras.',
      },
      {
        q: '¿Necesito una cuenta?',
        a: 'No. {app} guarda todo en tu iPhone. Iniciar sesión con Apple se usa solo para identificar tu cuenta en la sincronización de iCloud: no hay contraseña que recordar ni servidor por parte del desarrollador.',
      },
      {
        q: '¿Cómo funciona la sincronización entre mis dispositivos?',
        a: 'Activa iCloud en cada dispositivo con el mismo Apple ID y {app} se sincroniza automáticamente a través de tu base de datos privada de iCloud. Nada pasa por el desarrollador.',
      },
      {
        q: '¿Qué hace {app} con Apple Health?',
        a: 'Con tu permiso, lee entrenamientos y frecuencia cardíaca de Apple Health y escribe en Salud cada entrenamiento que terminas, para que tu historial y tus anillos de actividad sigan completos. Puedes cambiarlo en cualquier momento desde la app Salud, en Compartir.',
      },
      {
        q: 'He cerrado la app a mitad de entreno. ¿He perdido la sesión?',
        a: 'No. {app} conserva el entrenamiento en curso y te ofrece retomarlo o descartarlo la próxima vez que abras la app.',
      },
      {
        q: '¿Puedo editar un entrenamiento después de terminarlo?',
        a: 'Sí. Abre cualquier sesión completada desde tu historial y cambia series, pesos y repeticiones.',
      },
      {
        q: '¿Cómo borro mis datos?',
        a: 'Borra la app para eliminar los datos locales. Para limpiar los datos sincronizados, ve a Ajustes → tu nombre → iCloud → Gestionar almacenamiento de la cuenta y borra los datos de {app}. Consulta la política de privacidad para más detalles.',
      },
    ],
    contactHeading: '¿Sigues atascado?',
    contactBody: 'Escribe directamente al desarrollador. Indica tu versión de iOS y qué estabas haciendo cuando ocurrió el problema.',
    contactCta: 'Escribir a soporte',
    contactHint: 'O escribe a {email}',
  },
  footer: {
    madeBy: 'Hecho por {developer}',
    privacy: 'Privacidad',
    support: 'Soporte',
    github: 'GitHub',
  },
  notFound: {
    title: 'Página no encontrada',
    body: 'Ese enlace no lleva a ninguna parte.',
    cta: 'Volver a hackie.dev',
  },
};
