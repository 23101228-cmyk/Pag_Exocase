# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Cotizador local con Bambu Studio

El cotizador usa un backend local que ejecuta Bambu Studio. Para probarlo en desarrollo, deja abierta la página Vite (`pnpm run dev`) y arranca el servicio en otra terminal con `pnpm run slicer`.

El perfil queda fijo en Bambu Lab A1 0.4 mm, 0.28 mm Extra Draft, 2 paredes, 15 % Gyroid, soportes árbol/auto a 40° y Bambu PLA Basic. El backend procesa el archivo STL en la computadora donde corre; el cotizador toma del laminado el tiempo estimado y el filamento usado, calcula el precio a S/15/h hasta 10 horas y S/10/h por encima de 10 horas.

El servicio escucha solo en `127.0.0.1:8787` durante desarrollo. Esto permite probarlo en localhost, pero no lo expone para un dominio público. Para publicar, hay que desplegar un backend accesible desde el dominio con Bambu Studio y sus perfiles instalados, y configurar el origen permitido en `CORS_ORIGINS`.