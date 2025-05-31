// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Importar NextRequest para tipado
import { jwtVerify } from "jose";

// Asegúrate de que esta clave secreta sea la misma que usas en auth.ts para firmar los tokens.
// ¡MUY IMPORTANTE: NO USES "your-secret-key-here-change-in-production" en producción!
// Configura JWT_SECRET en las variables de entorno de Vercel con una clave fuerte y única.
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here-change-in-production");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- REGISTROS DE DEPURACIÓN EN VERCEL (aparecen en la pestaña "Logs" de tu despliegue) ---
  console.log(`[Middleware] Interceptando ruta: ${pathname}`);
  // --- FIN REGISTROS DE DEPURACIÓN ---

  // Aplica el middleware solo a rutas /admin (excepto /admin/login)
  // El 'matcher' en 'export const config' ya filtra esto, pero esta condición añade una capa de claridad.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    try {
      const token = request.cookies.get("admin-token")?.value;

      // --- REGISTROS DE DEPURACIÓN EN VERCEL ---
      console.log(`[Middleware] Token encontrado para ${pathname}: ${!!token}`); // Registra true/false para no exponer el token real
      // --- FIN REGISTROS DE DEPURACIÓN ---

      if (!token) {
        // --- REGISTROS DE DEPURACIÓN EN VERCEL ---
        console.log(`[Middleware] No hay token, redirigiendo a /admin/login desde ${pathname}`);
        // --- FIN REGISTROS DE DEPURACIÓN ---
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // Verifica el token
      await jwtVerify(token, secret);

      // --- REGISTROS DE DEPURACIÓN EN VERCEL ---
      console.log(`[Middleware] Token verificado con éxito para ${pathname}.`);
      // --- FIN REGISTROS DE DEPURACIÓN ---

      // El token es válido, continúa a la página solicitada
      return NextResponse.next();
    } catch (error) {
      // --- REGISTROS DE DEPURACIÓN EN VERCEL ---
      console.error(`[Middleware] ¡ERROR! Falló la verificación del token para ${pathname}:`, error);
      // --- FIN REGISTROS DE DEPURACIÓN ---
      // El token es inválido (expirado, modificado, etc.), redirige a login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // --- REGISTROS DE DEPURACIÓN EN VERCEL ---
  console.log(`[Middleware] Ruta ${pathname} no protegida o es /admin/login, continuando.`);
  // --- FIN REGISTROS DE DEPURACIÓN ---
  return NextResponse.next();
}

// Configuración opcional para qué rutas debe aplicar el middleware.
// Esto es más eficiente que poner toda la lógica de filtrado dentro de la función middleware.
export const config = {
  matcher: ["/admin/:path*"], // Aplica el middleware a todas las rutas que empiezan con /admin/
};