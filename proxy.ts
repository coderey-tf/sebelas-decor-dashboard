import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isDemoEnv =
    supabaseUrl.includes("demo-project.supabase.co") ||
    supabaseUrl.includes("placeholder.supabase.co") ||
    !supabaseUrl;

  // Jika env masih menggunakan URL demo / placeholder, atau mengakses route publik, izinkan langsung
  const pathname = request.nextUrl.pathname;
  if (
    isDemoEnv ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/simulasi") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/api")
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Jika belum login dan bukan di halaman login atau API, redirect ke login
    if (
      !user &&
      !request.nextUrl.pathname.startsWith("/login") &&
      !request.nextUrl.pathname.startsWith("/api")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch {
    // Abaikan error koneksi Supabase saat demo
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
