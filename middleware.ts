// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Importar NextRequest para tipado
import { jwtVerify } from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here-change-in-production");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

 
  console.log(`[Middleware] Interceptando ruta: ${pathname}`);


  
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    try {
      const token = request.cookies.get("admin-token")?.value;

     
      console.log(`[Middleware] Token encontrado para ${pathname}: ${!!token}`); // Registra true/false para no exponer el token real
      

      if (!token) {
        
        console.log(`[Middleware] No hay token, redirigiendo a /admin/login desde ${pathname}`);
        
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      
      await jwtVerify(token, secret);

      
      console.log(`[Middleware] Token verificado con éxito para ${pathname}.`);
      

      
      return NextResponse.next();
    } catch (error) {
      
      console.error(`[Middleware] ¡ERROR! Falló la verificación del token para ${pathname}:`, error);
      
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

 
  console.log(`[Middleware] Ruta ${pathname} no protegida o es /admin/login, continuando.`);
  
  return NextResponse.next();
}


export const config = {
  matcher: ["/admin/:path*"], 
};