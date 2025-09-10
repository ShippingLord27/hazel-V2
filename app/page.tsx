import { Suspense } from "react"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import HomePage from "@/components/pages/HomePage"

async function getServerData() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )

  // Fetch initial data
  const { data: items } = await supabase
    .from("items")
    .select("*, categories(name), owners(user_id, name)")
    .eq("availability", true)
    .limit(8)

  const { data: categories } = await supabase.from("categories").select("*")

  return {
    items: items || [],
    categories: categories || [],
  }
}

export default async function Home() {
  const { items, categories } = await getServerData()

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <HomePage initialItems={items} categories={categories} />
    </Suspense>
  )
}
