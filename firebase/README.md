# Configuración Firebase

## 1. Firestore — crear índices

En Firebase Console → Firestore → Indexes, crear:

| Collection | Fields | Order |
|-----------|--------|-------|
| sightings | userId ASC, seenAt DESC | |
| feed      | createdAt DESC | |

## 2. Aplicar reglas de seguridad

### Firestore
Copiar contenido de `firebase/firestore.rules` en:
Firebase Console → Firestore → Rules

### Storage  
Copiar contenido de `firebase/storage.rules` en:
Firebase Console → Storage → Rules

## 3. Habilitar Google Auth
Firebase Console → Authentication → Sign-in method → Google → Habilitar

Agregar dominio autorizado:
- localhost (ya viene)
- tu-dominio.vercel.app (al deployar)

## 4. Habilitar Storage
Firebase Console → Storage → Get started → Production mode

## 5. Variables de entorno para Vercel

En Vercel Dashboard → Settings → Environment Variables, agregar todas las
variables de NEXT_PUBLIC_FIREBASE_* del archivo .env.local

También agregar:
XC_API_KEY=e408fff441ba19d960d7bb536b00e8a9b93d097f
