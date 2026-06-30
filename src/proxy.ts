import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasUsablePublicSupabaseEnv, isExplicitAuthDevBypassEnabled } from "@/lib/supabase/env";

const publicRoutes = new Set(["/login", "/cadastro"]);

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.has(pathname) || pathname.startsWith("/auth");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // THEME HANDLING
  const themeCookie = request.cookies.get("ygn-theme")?.value;
  if (!themeCookie) {
    const systemPrefersDark = request.headers.get("sec-ch-prefers-color-scheme") === "dark";
    const newTheme = systemPrefersDark ? "dark" : "light";
    response.cookies.set("ygn-theme", newTheme, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  if (isExplicitAuthDevBypassEnabled()) {
    return response;
  }

  if (!hasUsablePublicSupabaseEnv()) {
    if (!isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "configuracao");
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Erro no middleware (proxy) ao buscar usuario:", error);
    if (!isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") {
      url.searchParams.set("error", "sessao");
    }
    return NextResponse.redirect(url);
  }

  if (user && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};
