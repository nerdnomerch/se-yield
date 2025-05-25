"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckoutDialog } from "@/components/shop/checkout-dialog"
import { shopItemsMetadata, fallbackShopItems } from "@/data/shop-items"

import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useMerchantContract } from "@/hooks/useMerchantContract"
import { Loader2 } from "lucide-react"
import { formatUnits } from "viem"

// Type for shop items
interface ShopItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  popular?: boolean
  details?: string
  merchant: string
  merchantAddress: string
  features?: string[]
}

export function ShopItemsBlockchain() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<ShopItem | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { isConnected } = useAccount()
  const { items: contractItems, isLoading, refreshData } = useMerchantContract()
  const [shopItems, setShopItems] = useState<ShopItem[]>(fallbackShopItems)

  // Merge contract items with metadata
  useEffect(() => {
    if (contractItems && contractItems.length > 0) {
      const mergedItems = contractItems.map((item) => {
        // Find matching metadata or use the first one as fallback
        const metadata = shopItemsMetadata.find(meta => meta.id === Number(item.id)) || shopItemsMetadata[0];

        return {
          id: Number(item.id),
          name: item.name,
          description: item.description,
          price: Number(formatUnits(item.price, 6)),
          category: metadata.category || "other",
          image: metadata.image || "/placeholder.svg?height=200&width=200",
          popular: metadata.popular || false,
          details: metadata.details || item.description,
          merchant: "SEYIELD Official Store",
          merchantAddress: item.merchant,
          features: metadata.features || []
        };
      });

      setShopItems(mergedItems);
    }
  }, [contractItems]);

  // Refresh data on mount
  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected, refreshData]);

  // Filter items by category
  const filteredItems = selectedCategory === "all"
    ? shopItems
    : shopItems.filter(item => item.category === selectedCategory)

  // Get unique categories
  const categories = ["all", ...new Set(shopItems.map(item => item.category))]

  // Handle buy now click
  const handleBuyNow = (product: ShopItem) => {
    setSelectedProduct(product)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Items"
            )}
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading marketplace items...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border border-pink-100 dark:border-pink-900/20 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{item.name}</CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                        {item.popular && (
                          <Badge variant="default" className="bg-gradient-to-r from-pink-500 to-violet-600">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="aspect-square bg-muted rounded-md overflow-hidden mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Merchant</span>
                          <span className="text-sm">{item.merchant}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Category</span>
                          <span className="text-sm capitalize">{item.category}</span>
                        </div>
                        {item.features && item.features.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Features</span>
                            <ul className="text-sm mt-1 space-y-1">
                              {item.features.slice(0, 2).map((feature) => (
                                <li key={`${item.id}-${feature.substring(0, 10)}`} className="flex items-start">
                                  <span className="text-green-500 mr-1">✓</span> {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-2xl font-bold">{item.price ? item.price.toFixed(2) : '0.00'} ySYLD</div>
                        {isConnected ? (
                          <Button
                            onClick={() => handleBuyNow(item)}
                            className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700"
                          >
                            Buy with Rewards
                          </Button>
                        ) : (
                          <ConnectButton.Custom>
                            {({ openConnectModal }) => (
                              <Button onClick={openConnectModal} variant="outline">
                                Connect Wallet
                              </Button>
                            )}
                          </ConnectButton.Custom>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground text-center w-full">
                        Buy Now, Pay Never with SEYIELD
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <CheckoutDialog
          open={isCheckoutOpen}
          onOpenChange={setIsCheckoutOpen}
          product={selectedProduct}
        />
      )}
    </div>
  )
}
