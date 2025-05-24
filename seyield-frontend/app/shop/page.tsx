import { ShopHeader } from "@/components/shop/shop-header"
import { ShopCategories } from "@/components/shop/shop-categories"
import { ShopItemsBlockchain } from "@/components/shop/shop-items-blockchain"
import { ShopTour } from "@/components/tour/shop-tour"
import { BackgroundPattern } from "@/components/ui/background-pattern"

export default function ShopPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="shop" />
      <div className="container mx-auto py-8 px-4">
        <ShopHeader />
        <ShopCategories />
        <ShopItemsBlockchain />
      </div>
      <ShopTour />
    </div>
  )
}
