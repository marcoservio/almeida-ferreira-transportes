import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt e sitemap.xml — arquivos de SEO. Sem esta exceção o proxy
     *   redirecionava os dois para /auth/login e o Google não conseguia lê-los.
     * - .html — arquivos estáticos da pasta public/, como o de verificação de
     *   propriedade do Google Search Console.
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
