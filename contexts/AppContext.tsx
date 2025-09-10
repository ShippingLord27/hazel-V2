"use client"

import type React from "react"
import { createContext, useState, useEffect, useCallback, useContext } from "react"
import { createClient } from "@/lib/supabase/client"

interface AppContextType {
  theme: string
  toggleTheme: () => void
  toast: { show: boolean; message: string }
  showToast: (message: string, duration?: number) => void
  products: any[]
  session: any
  currentUser: any
  login: (email: string, password: string, role: string) => Promise<any>
  signup: (userData: any, role: string) => Promise<any>
  logout: () => Promise<void>
  updateUser: (userId: string, updatedData: any) => Promise<void>
  cart: any[]
  addToCart: (item: any) => boolean
  removeFromCart: (productId: string) => void
  clearCart: () => void
  isChatOpen: boolean
  chatPartner: any
  openChat: (partnerDetails: any) => void
  closeChat: () => void
  toggleChat: () => void
  isLoading: boolean
  productsLoading: boolean
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()

  // State declarations
  const [theme, setTheme] = useState("light")
  const [products, setProducts] = useState([])
  const [session, setSession] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState({ show: false, message: "" })
  const [isChatOpen, setChatOpen] = useState(false)
  const [chatPartner, setChatPartner] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.body.classList.toggle("dark-mode", savedTheme === "dark")
  }, [])

  // Auth & Profile Management
  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        const { data: profile, error } = await supabase
          .from("user_profiles_view")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profile) {
          setCurrentUser({ ...profile, email: session.user.email })
        }
      }

      setIsLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        if (session) {
          const { data: profile } = await supabase
            .from("user_profiles_view")
            .select("*")
            .eq("user_id", session.user.id)
            .single()

          setCurrentUser(profile ? { ...profile, email: session.user.email } : null)
        } else {
          setCurrentUser(null)
        }
      })

      return () => subscription.unsubscribe()
    }

    setupAuth()
  }, [])

  const signup = async (userData: any, role: string) => {
    const { email, password, firstName, lastName, phone, address } = userData

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
          phone: phone || "",
          address: address || "",
        },
      },
    })

    if (error) {
      showToast(error.message)
      return null
    }

    showToast("Account created! Please check your email to verify.")
    return data.user
  }

  const login = async (email: string, password: string, role: string) => {
    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      showToast(error.message)
      return null
    }

    if (loginData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles_view")
        .select("*")
        .eq("user_id", loginData.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        showToast("Login failed: Could not retrieve user profile.")
        return null
      }

      if (profile.role !== role) {
        await supabase.auth.signOut()
        showToast(`Incorrect portal: A '${profile.role}' account cannot log in via the '${role}' portal.`)
        return null
      }

      showToast("Login successful!")
      return { ...profile, email: loginData.user.email }
    }

    return null
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const updateUser = async (userId: string, updatedData: any) => {
    const tableName = currentUser?.role === "admin" ? "admins" : currentUser?.role === "owner" ? "owners" : "renters"

    const { error } = await supabase.from(tableName).update(updatedData).eq("user_id", userId)

    if (error) {
      showToast("Failed to update profile.")
      console.error("Update user error:", error)
      return
    }

    if (currentUser && currentUser.user_id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updatedData }))
    }

    showToast("Profile updated successfully!")
  }

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)

    const { data, error } = await supabase
      .from("items")
      .select("*, categories(name), owners(user_id, name)")
      .eq("availability", true)

    if (error) {
      console.error("Error fetching products:", error)
      showToast("Error fetching products.")
    } else {
      const transformed = data.map((p) => ({
        id: p.item_id,
        title: p.title,
        category: p.categories?.name || "Uncategorized",
        price: p.price_per_day,
        priceDisplay: `₱${p.price_per_day}/day`,
        image: p.image_url,
        description: p.description,
        ownerId: p.owners?.user_id,
        ownerName: p.owners?.name,
        status: "approved",
      }))
      setProducts(transformed)
    }

    setProductsLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Utility functions
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.body.classList.toggle("dark-mode", newTheme === "dark")
  }

  const showToast = (message: string, duration = 3000) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: "" }), duration)
  }

  const addToCart = (item: any) => {
    if (cart.some((cartItem) => cartItem.productId === item.productId)) {
      showToast("This item is already in your cart.")
      return false
    }
    setCart((prev) => [...prev, item])
    showToast("Item added to cart!")
    return true
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
    showToast("Item removed from cart.")
  }

  const clearCart = () => setCart([])

  const openChat = (partnerDetails: any) => {
    setChatPartner(partnerDetails)
    setChatOpen(true)
  }

  const closeChat = () => setChatOpen(false)
  const toggleChat = () => setChatOpen((prev) => !prev)

  const value = {
    theme,
    toggleTheme,
    toast,
    showToast,
    products,
    session,
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isChatOpen,
    chatPartner,
    openChat,
    closeChat,
    toggleChat,
    isLoading,
    productsLoading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const useApp = useAppContext
