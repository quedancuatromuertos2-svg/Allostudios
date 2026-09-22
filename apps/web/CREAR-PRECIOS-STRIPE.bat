@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo  AlloStudios - activar los pagos
echo  Crea en Stripe (modo REAL) los 11 productos del catalogo,
echo  archiva los precios antiguos, guarda los ids, sube el cambio
echo  y despliega la web. No tienes que hacer nada mas.
echo ============================================================
echo.
node --env-file=.env.local scripts\crear-precios-suscripcion.mjs --archivar
if errorlevel 1 goto error
echo.
echo --- Guardando los ids y desplegando ---
cd /d "%~dp0..\.."
git add apps/web/src/lib/stripe-ids.json
git commit -m "Ids de precios de Stripe (modo real)" || echo (sin cambios que guardar)
git push origin main
cd /d "%~dp0"
call vercel deploy --prod --yes
echo.
echo ============================================================
echo  LISTO. Comprueba que cobra: abre
echo  https://allostudios.net/contratar/pack_pro
echo  y mira que el boton lleve a la pantalla de pago de Stripe.
echo ============================================================
goto fin
:error
echo.
echo *** Algo ha fallado arriba. Copia el mensaje y pasamelo. ***
:fin
pause
