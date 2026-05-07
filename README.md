# 🦅 Avesdex Chile

**La guía de aves más completa de Chile** — una Pokédex interactiva con 216 especies nativas, cantos reales, fotos de campo y experiencia social para observadores de aves.

---

## ¿Qué es Avesdex?

Avesdex es una aplicación web para observadores de aves chilenas (birdwatchers) que combina una enciclopedia visual con funciones sociales. Permite explorar el catálogo completo de aves de Chile, escuchar sus cantos reales, ver su distribución geográfica y llevar un registro personal de avistamientos.

El proyecto nació de la idea de crear una experiencia tipo **Pokédex** para las aves de Chile — donde cada especie tiene su ficha completa con foto, datos científicos, hábitat, curiosidades y grabaciones de audio.

---

## APIs utilizadas

### 🐦 Aves Ninjas Chile
**`https://aves.ninjas.cl/api/birds`**

Catálogo oficial de aves chilenas con 216 especies. Provee:
- Nombre en español, inglés y latín
- Fotografías de alta calidad
- Datos de campo: tamaño, orden taxonómico, estado de conservación
- Información de hábitat y distribución en Chile
- Mapa SVG de distribución por región
- Estado migratorio y dimorfismo sexual
- Audio de referencia por especie
- Curiosidades ("¿Sabías que…?")
- Clasificación IUCN (estado de conservación global)

### 🎵 Xeno-canto API v3
**`https://xeno-canto.org/api/3/recordings`**

Base de datos global de grabaciones de cantos de aves. Provee:
- Grabaciones de audio reales en campo
- Calidad de grabación (escala A–E)
- Coordenadas GPS de cada avistamiento
- Datos del grabador, fecha y lugar
- Tipo de sonido (canto, llamada, alarma, etc.)
- Espectrogramas de audio

La búsqueda se realiza por nombre científico usando los tags `gen:` y `sp:` de la API v3, con fallback automático si no hay grabaciones de Chile.

---

## Funcionalidades

- 🗂 **Catálogo completo** — 216 especies con buscador en tiempo real
- 🔍 **Filtros avanzados** — por nombre, latín, inglés, vistas, pendientes o favoritas
- 📷 **Ficha por especie** — foto principal, galería, datos científicos y mapa de distribución
- 🎵 **Cantos reales** — reproductor de audio integrado con grabaciones de Xeno-canto
- 📍 **Avistamientos georreferenciados** — coordenadas GPS de cada grabación
- 👁️ **Registro personal** — marca las aves que ya viste con lugar, fecha, notas y foto
- ♥ **Favoritas** — lista sincronizada entre dispositivos
- 🌐 **Feed comunitario** — avistamientos de la comunidad en tiempo real
- 📊 **Tu progreso** — cuántas has visto, cuántas te faltan
- 🔑 **Auth con Google** — experiencia personalizada con Firebase

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS + CSS variables |
| Auth | Firebase Authentication (Google) |
| Base de datos | Cloud Firestore |
| Storage | Firebase Storage |
| Deploy | Vercel |
| Tipografía | Playfair Display + Inter + JetBrains Mono |

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/dihidalgo14-ship-it/avesdex.git
cd avesdex

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Firebase y Xeno-canto

# Correr en desarrollo
npm run dev
```

### Variables de entorno necesarias

```env
XC_API_KEY=                              # API key de xeno-canto.org (gratis con cuenta)

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

---

## Configuración Firebase

1. Crear proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Habilitar **Authentication → Google Provider**
3. Crear base de datos **Firestore** en modo producción
4. Habilitar **Storage**
5. Aplicar las reglas de seguridad en `firebase/firestore.rules` y `firebase/storage.rules`
6. Agregar tu dominio en **Authentication → Authorized domains**

Ver instrucciones detalladas en [`firebase/README.md`](./firebase/README.md).

---

## Créditos

- Fotografías e información de aves: [aves.ninjas.cl](https://aves.ninjas.cl)
- Grabaciones de cantos: [xeno-canto.org](https://xeno-canto.org) y sus contribuidores
- Datos taxonómicos y de conservación: IUCN Red List

---

*Hecho con ❤️ para los observadores de aves de Chile 🇨🇱*