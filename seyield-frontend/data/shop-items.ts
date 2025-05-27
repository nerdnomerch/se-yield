// Shop items metadata to enhance blockchain data
export const shopItemsMetadata = [
  {
    id: 1,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    popular: true,
    details: "High-quality noise-cancelling headphones with premium sound and comfort for long listening sessions.",
    features: [
      "Active noise cancellation",
      "40-hour battery life",
      "Premium sound quality",
      "Comfortable fit"
    ]
  },
  {
    id: 2,
    category: "wearables",
    image: "/placeholder.svg?height=200&width=200",
    details: "Latest smartwatch with fitness tracking, notifications, and health monitoring features.",
    features: [
      "Heart rate monitoring",
      "Sleep tracking",
      "Water resistant",
      "7-day battery life"
    ]
  },
  {
    id: 3,
    category: "vouchers",
    image: "/placeholder.svg?height=200&width=200",
    popular: true,
    details: "Voucher for $200 off a new laptop purchase from major retailers.",
    features: [
      "Valid at major electronics retailers",
      "No expiration date",
      "Combinable with other offers",
      "Easy to redeem"
    ]
  },
  {
    id: 4,
    category: "gaming",
    image: "/placeholder.svg?height=200&width=200",
    details: "Latest gaming console with two controllers and a selection of popular games.",
    features: [
      "4K gaming",
      "1TB storage",
      "Two wireless controllers",
      "Online multiplayer"
    ]
  },
  {
    id: 5,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    details: "Latest smartphone with premium camera, fast processor, and long battery life.",
    features: [
      "Triple camera system",
      "All-day battery life",
      "5G connectivity",
      "Water resistant"
    ]
  }
]

// Fallback shop items in case blockchain data is not available
export const fallbackShopItems = [
  {
    id: 1,
    name: "Premium Headphones",
    category: "electronics",
    price: 50,
    description: "High-quality noise-cancelling headphones with premium sound",
    image: "/placeholder.svg?height=200&width=200",
    popular: true,
    details: "High-quality noise-cancelling headphones with premium sound and comfort for long listening sessions.",
    merchant: "SEYIELD Official Store",
    merchantAddress: "0xF88A7306b8edCc6Ffa48bF0EA1F0f530a6bC1D30",
    features: [
      "Active noise cancellation",
      "40-hour battery life",
      "Premium sound quality",
      "Comfortable fit"
    ]
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "wearables",
    price: 100,
    description: "Latest smartwatch with fitness tracking and notifications",
    image: "/placeholder.svg?height=200&width=200",
    details: "Latest smartwatch with fitness tracking, notifications, and health monitoring features.",
    merchant: "SEYIELD Official Store",
    merchantAddress: "0xF88A7306b8edCc6Ffa48bF0EA1F0f530a6bC1D30",
    features: [
      "Heart rate monitoring",
      "Sleep tracking",
      "Water resistant",
      "7-day battery life"
    ]
  },
  {
    id: 3,
    name: "Laptop Voucher",
    category: "vouchers",
    price: 200,
    description: "Voucher for $200 off a new laptop purchase",
    image: "/placeholder.svg?height=200&width=200",
    popular: true,
    details: "Voucher for $200 off a new laptop purchase from major retailers.",
    merchant: "SEYIELD Official Store",
    merchantAddress: "0xF88A7306b8edCc6Ffa48bF0EA1F0f530a6bC1D30",
    features: [
      "Valid at major electronics retailers",
      "No expiration date",
      "Combinable with other offers",
      "Easy to redeem"
    ]
  },
  {
    id: 4,
    name: "Gaming Console",
    category: "gaming",
    price: 300,
    description: "Latest gaming console with two controllers",
    image: "/placeholder.svg?height=200&width=200",
    details: "Latest gaming console with two controllers and a selection of popular games.",
    merchant: "SEYIELD Official Store",
    merchantAddress: "0xF88A7306b8edCc6Ffa48bF0EA1F0f530a6bC1D30",
    features: [
      "4K gaming",
      "1TB storage",
      "Two wireless controllers",
      "Online multiplayer"
    ]
  },
  {
    id: 5,
    name: "Smartphone",
    category: "electronics",
    price: 500,
    description: "Latest smartphone with premium camera and features",
    image: "/placeholder.svg?height=200&width=200",
    details: "Latest smartphone with premium camera, fast processor, and long battery life.",
    merchant: "SEYIELD Official Store",
    merchantAddress: "0xF88A7306b8edCc6Ffa48bF0EA1F0f530a6bC1D30",
    features: [
      "Triple camera system",
      "All-day battery life",
      "5G connectivity",
      "Water resistant"
    ]
  }
]
