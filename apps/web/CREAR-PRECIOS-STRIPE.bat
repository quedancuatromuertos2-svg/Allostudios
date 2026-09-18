@echo off
cd /d "%~dp0"
echo Creando los productos del modelo de suscripcion en Stripe (modo real) y archivando los antiguos...
node --env-file=.env.local scripts\crear-precios-suscripcion.mjs --archivar
echo.
echo Si arriba pone "Ids guardados", ya esta. Ahora: git add -A ^&^& git commit -m "Ids de Stripe" y desplegar.
pause
