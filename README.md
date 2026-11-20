# ReSII — Portal Académico para Estudiantes del TecNM en Celaya

**ReSII** es una aplicación web moderna, clara y responsiva pensada para que las y los estudiantes del **Tecnológico Nacional de México en Celaya** consulten su información escolar oficial del **SII** desde una interfaz ágil y cómoda, sin importar si acceden desde computadora o celular.

Además de reunir en un solo lugar tu expediente, calificaciones, kárdex y horario, integra **LinceHub**, un espacio de apoyo estudiantil con bolsa de asesorías y diagnóstico temprano para acompañar tu desempeño durante el semestre.

### 🚀 Pruébalo en línea

Puedes acceder directamente al portal desde cualquier navegador con tu correo institucional `@celaya.tecnm.mx`:

👉 **[Abrir Portal ReSII — sii-itc-frontend-uwaa.onrender.com](https://sii-itc-frontend-uwaa.onrender.com)**

> *Nota: El servicio se encuentra alojado en el plan gratuito de Render; si estuvo inactivo, el primer inicio de sesión puede tardar entre 30 y 50 segundos mientras despierta el servidor.*

📘 *¿Buscas los detalles técnicos, arquitectura o referencia de endpoints? Consulta la documentación técnica en [`README_TECNICO.md`](./README_TECNICO.md).*

---

## ¿Qué puedes hacer en ReSII?

- **Inicio de sesión institucional**: Ingresa con tu correo oficial `@celaya.tecnm.mx`. Tu sesión se maneja en memoria privada durante la visita y puedes mostrar u ocultar tu correo completo en pantalla con un clic.
- **Panel del estudiante (Dashboard)**: Visualiza tu fotografía oficial, número de control, carrera, semestre, promedios (ponderado y aritmético), créditos acumulados y complementarios, barra de avance reticular y accesos directos a tus módulos.
- **Calificaciones con semáforo visual**: Consulta el detalle por unidad evaluada y tu promedio parcial o final con un código de color fácil de leer:
  - 🟢 **Óptimo** (≥ 80)
  - 🟡 **Regular o en espera de captura** (70–79 / pendiente)
  - 🔴 **En riesgo** (< 70 o NA)
  Incluye buscador por asignatura, clave o docente, filtro por periodo y vista intercambiable entre tarjetas y tabla.
- **Kárdex académico**: Explora todo tu historial de materias cursadas y acreditadas, agrupado por semestre o en tabla general, con conteo de créditos, promedios y filtros por periodo, búsqueda o modalidad (ordinario y repetición).
- **Horario de clases**: Revisa tu agenda semanal por bloques de hora —con el día actual resaltado, aulas y grupos— o cambia a la vista de tabla oficial con el total de materias y horas a la semana.
- **LinceHub (Comunidad y Asesorías)**:
  - *Bolsa de Asesorías*: Explora asesorías presenciales, en línea e híbridas, inscríbete en un clic, revisa cupos disponibles y evita empalmes de horario automáticamente.
  - *Diagnóstico Académico*: Analiza tus calificaciones actuales y tu kárdex para detectar materias con unidades en riesgo (nivel preventivo o crítico) y sugerirte asesorías a tiempo.
  - *Gestión Administrativa*: Permite registrar, editar, activar o pausar y eliminar programas de asesoría.

---

## Vistazo rápido

Aquí tienes algunas pantallas principales de la aplicación (puedes ver la galería completa en [`README_TECNICO.md`](./README_TECNICO.md)):

### Inicio de sesión institucional
![Inicio de sesión institucional](https://github.com/user-attachments/assets/db9fa934-0b71-4be5-aa38-2843144e2e61)

### Panel del estudiante (Dashboard)
![Dashboard del estudiante](https://github.com/user-attachments/assets/f4d53dbf-cb17-40f2-9189-b5dac7acab88)

### Calificaciones con semáforo de desempeño
![Calificaciones con semáforo](https://github.com/user-attachments/assets/ca5e257f-4a71-4fcd-ae2b-30c591da9546)

### Horario semanal de clases
![Horario semanal de clases](https://github.com/user-attachments/assets/f6d82230-2fa5-4951-9b49-2da68bd0340e)

### LinceHub — Asesorías y diagnóstico académico
![LinceHub](https://github.com/user-attachments/assets/cefe9c3c-29ba-4e29-b7b0-f4f88dfd8cb2)

---

## Tecnologías principales

- **Interfaz web**: React, Vite y Tailwind CSS, con iconografía de Lucide React.
- **Servidor intermedio**: Node.js y Express para conectar de forma segura con los servicios oficiales del SII ITC.
- **Datos y análisis de apoyo**: Supabase y Edge Functions, con respaldo automático en memoria para funcionar en desarrollo incluso sin configurar servicios externos.
- **Despliegue**: Contenedores con Docker Compose para desarrollo local y manifiesto listo para Render.

---

## Documentación técnica (README secundario)

Si necesitas profundizar en la implementación del proyecto, la documentación técnica completa se conserva en [`README_TECNICO.md`](./README_TECNICO.md), donde encontrarás:
- Arquitectura de dos capas de backend (BFF / proxy hacia el SII ITC).
- Estructura completa de carpetas y archivos del monorepo.
- Tabla de referencia de endpoints `/api/sii` y equivalencias oficiales.
- Galería completa de capturas de pantalla de cada vista.

---

## Autores

- **MidKnight458** — [@MidKnight458](https://github.com/MidKnight458)
- **John-Hdz** — [@John-Hdz](https://github.com/John-Hdz)
