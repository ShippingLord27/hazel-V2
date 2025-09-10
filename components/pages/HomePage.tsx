"use client"

import { useAppContext } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, MapPin } from "lucide-react"

interface HomePageProps {
  initialItems: any[]
  categories: any[]
}

export default function HomePage({ initialItems, categories }: HomePageProps) {
  const { currentUser, addToCart, showToast } = useAppContext()

  const handleRentNow = (item: any) => {
    if (!currentUser) {
      showToast("Please log in to rent items")
      return
    }

    const cartItem = {
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
    }

    addToCart(cartItem)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">HAZEL: RENTAL ONLINE</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted marketplace for renting tools, equipment, and more. Find what you need, when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search for items..."
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button size="lg" className="px-8">
              <Filter className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.category_id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initialItems.slice(0, 8).map((item) => (
              <Card key={item.item_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      {item.categories?.name || "General"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{item.owners?.name || "Owner"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                    <span className="text-lg font-bold text-primary">₱{item.price_per_day}/day</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => handleRentNow(item)}>
                    Rent Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Search & Browse</h3>
              <p className="text-muted-foreground">
                Find the perfect item for your needs from our wide selection of rental products.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Connect & Rent</h3>
              <p className="text-muted-foreground">
                Contact the owner, agree on terms, and complete your rental booking securely.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Enjoy & Return</h3>
              <p className="text-muted-foreground">
                Use the item for your project and return it in good condition when done.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
