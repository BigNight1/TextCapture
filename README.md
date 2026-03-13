# TextCapture OCR 📸➡️📝

> **¿Cansado de reescribir texto a mano?** Tomás una captura, la pegás, y en segundos tenés el texto listo para copiar.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## ¿Para qué sirve?

Me pasaba que veía texto en una imagen, en un PDF escaneado, o en una captura de pantalla, y tenía que reescribirlo todo a mano. Una pérdida de tiempo enorme.

**TextCapture resuelve eso:** pegás tu captura con `Ctrl+V` (o subís una imagen), y la app te extrae el texto automáticamente en el navegador, sin subir nada a ningún servidor.

**Casos de uso reales:**
- 📋 Copiar texto de capturas de pantalla
- 🖼️ Extraer texto de fotos de documentos
- 📄 Digitalizar imágenes con texto escrito
- ⚡ Cualquier situación donde reescribir a mano sería una pérdida de tiempo

---

## ¿Cómo se usa?

1. Abrís la app
2. **Pegás una captura** con `Ctrl+V` — o subís una imagen desde tu equipo
3. Hacés clic en **"Extraer Texto (OCR)"**
4. El texto aparece listo para **copiar o descargar como `.txt`**

Así de simple.

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/BigNight1/TextCapture.git
cd TextCapture

# Instalar dependencias
pnpm install   # o: npm install

# Iniciar en modo desarrollo
pnpm dev       # o: npm run dev
```

Abrí `http://localhost:5173` en tu navegador.

---

## Stack

| Tecnología | Uso |
|---|---|
| React + TypeScript | UI y lógica |
| Vite | Bundler y dev server |
| Tailwind CSS | Estilos |
| Tesseract.js | OCR en el navegador (sin backend) |
| Lucide React | Iconos |

> El OCR corre 100% en el navegador gracias a Tesseract.js. Tu imagen nunca sale de tu dispositivo.

---

## Autor

**BigNight** — construyo herramientas que yo mismo necesito.

[![GitHub](https://img.shields.io/badge/GitHub-BigNight1-181717?style=flat&logo=github)](https://github.com/BigNight1)
