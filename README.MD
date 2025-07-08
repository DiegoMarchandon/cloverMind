#cloverMind

# Estructura de carpetas:
cloverMind/  
├── clovermind/  
│   ├── public/                # Archivos estáticos (imágenes, fuentes, etc.)  
│   ├── src/  
│   │   ├── app/               # Directorio raíz de la aplicación (Next.js App Router)  
│   │   │   ├── globals.css    # Estilos globales  
│   │   │   ├── layout.tsx     # Layout principal  
│   │   │   ├── page.tsx       # Página principal  
│   │   │   └── ...            # Otras páginas o rutas  
│   │   ├── components/        # Componentes reutilizables  
│   │   ├── styles/            # Archivos CSS adicionales (opcional)  
│   │   └── utils/             # Funciones utilitarias  
│   ├── .dockerignore          # Ignorar archivos para Docker  
│   ├── .eslintrc.json         # Configuración de ESLint  
│   ├── .gitignore             # Ignorar archivos para Git  
│   ├── docker-compose.yml     # Configuración de Docker Compose  
│   ├── Dockerfile             # Configuración de Docker  
│   ├── next.config.js         # Configuración de Next.js  
│   ├── package.json           # Dependencias y scripts del proyecto  
│   ├── postcss.config.mjs     # Configuración de PostCSS  
│   ├── tailwind.config.js     # Configuración de Tailwind CSS  
│   └── tsconfig.json          # Configuración de TypeScript  
├── README.md                  # Documentación del proyecto  
└── node_modules/    