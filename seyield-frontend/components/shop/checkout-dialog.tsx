"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, ShoppingBag, AlertCircle, Info as InfoIcon } from "lucide-react"
import { useAccount } from "wagmi"
import { useMerchantContract } from "@/hooks/useMerchantContract"
import { formatUnits } from "viem"

export function CheckoutDialog({ open, onOpenChange, product }) {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const [step, setStep] = useState("confirm") // confirm, processing, success, error
  const [transactionId, setTransactionId] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Use our merchant hook
  const {
    isPurchaseLoading,
    isPurchaseComplete,
    handlePurchaseItem,
    ySYLDBalance,
    purchaseData
  } = useMerchantContract()

  // Format ySYLD balance for display
  const formattedYSYLDBalance = ySYLDBalance ? formatUnits(ySYLDBalance, 6) : "0"

  // Handle purchase
  const handlePurchase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    // Check if user has enough ySYLD
    if (ySYLDBalance && typeof ySYLDBalance === 'bigint') {
      const requiredAmount = BigInt(Math.round(product.price * 10**6)); // Convert to bigint with 6 decimals

      if (ySYLDBalance < requiredAmount) {
        setErrorMessage(`Insufficient ySYLD balance. You need at least ${product.price ? product.price.toFixed(2) : '0.00'} ySYLD but you only have ${formattedYSYLDBalance} ySYLD.`)
        setStep("error")
        return
      }
    } else {
      toast({
        title: "Balance error",
        description: "Could not verify your ySYLD balance. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    try {
      // Show toast notification that purchase is being initiated
      toast({
        title: "Initiating purchase...",
        description: "Please confirm the transaction in your wallet when prompted.",
        duration: 5000,
      })

      console.log("Purchasing item:", {
        itemId: product.id,
        name: product.name,
        price: product.price,
        userBalance: formattedYSYLDBalance
      });

      // Call the merchant contract to purchase the item
      // The loading state will be handled by the useEffect watching isPurchaseLoading
      await handlePurchaseItem(product.id)
    } catch (error) {
      console.error('Purchase error:', error)

      // Provide more specific error message if possible
      let errorMsg = "Failed to complete purchase. Please try again."
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          errorMsg = "You rejected the transaction in your wallet. You can try again when ready."
        } else if (error.message.includes("insufficient funds")) {
          errorMsg = "You don't have enough SEI to pay for the transaction gas fees."
        } else if (error.message.includes("InsufficientYield")) {
          errorMsg = "You don't have enough ySYLD tokens to make this purchase."
        } else if (error.message.includes("InvalidItem")) {
          errorMsg = "This item is no longer available for purchase."
        } else {
          errorMsg = error.message
        }
      }

      setErrorMessage(errorMsg)
      setStep("error")
    }
  }

  // Watch for purchase loading and completion states
  useEffect(() => {
    // When purchase is loading, show processing step
    if (isPurchaseLoading) {
      setStep("processing")
    }

    // When purchase is complete, show success step
    if (isPurchaseComplete) {
      // Set the transaction ID to the transaction hash if available
      if (typeof purchaseData === 'string') {
        setTransactionId(purchaseData)
      } else {
        // Fallback to product ID if no transaction hash
        setTransactionId(product.id.toString())
      }

      setStep("success")

      toast({
        title: "Purchase successful!",
        description: `You've purchased ${product.name} for ${product.price ? product.price.toFixed(2) : '0.00'} ySYLD tokens.`,
        duration: 5000,
      })
    }
  }, [isPurchaseLoading, isPurchaseComplete, purchaseData, product, toast])

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setStep("confirm")
      setErrorMessage("")
    }
  }, [open])

  const handleViewTransaction = () => {
    // If it's a transaction hash, open in explorer
    if (transactionId?.startsWith('0x')) {
      const explorerUrl = `https://sei.explorers.guru/tx/${transactionId}`
      window.open(explorerUrl, '_blank')
    } else {
      // Otherwise, go to transactions page
      router.push(`/transactions/${transactionId}`)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                You are about to purchase this item using your rewards.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <img
                    src={product?.image || "/placeholder.svg"}
                    alt={product?.name}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <h3 className="font-medium">{product?.name}</h3>
                  <p className="text-sm text-muted-foreground">{product?.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">{product?.price ? product.price.toFixed(2) : '0.00'} ySYLD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Merchant:</span>
                    <span className="font-medium">{product?.merchant || "SEYIELD Marketplace"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium">Purchase Details</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Item Price:</span>
                  <span className="font-medium">{product?.price ? product.price.toFixed(2) : '0.00'} ySYLD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Required ySYLD:</span>
                  <span className="font-medium">{product?.price ? product.price.toFixed(2) : '0.00'} ySYLD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your ySYLD Balance:</span>
                  <span className="font-medium">{formattedYSYLDBalance} ySYLD</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="font-medium">Payment Method:</span>
                  <span className="font-bold">SEYIELD Rewards (ySYLD)</span>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 text-sm text-blue-700 dark:text-blue-300">
                <p className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  <span>When you purchase an item, your ySYLD tokens are burned and the merchant receives payment in USDC automatically from the SEYIELD platform.</span>
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>By clicking "Confirm Purchase", you agree to the SEYIELD Marketplace Terms and Conditions.</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={!isConnected || Number(formattedYSYLDBalance) < product?.price}
                className="gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700"
              >
                <ShoppingBag className="h-4 w-4" />
                Confirm Purchase
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle>Processing Your Purchase</DialogTitle>
              <DialogDescription>
                Please wait while we process your transaction. This may take a few moments.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verifying ySYLD balance</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Confirming transaction</span>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Burning ySYLD tokens</span>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Paying merchant automatically</span>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Generating receipt</span>
                  <span>Pending</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-center text-muted-foreground">
                <p>Please confirm the transaction in your wallet if prompted.</p>
                <p className="mt-2">Do not close this window until the transaction is complete.</p>
              </div>
            </div>
          </>
        )}

        {step === "error" && (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Failed</DialogTitle>
              <DialogDescription>
                {errorMessage || "There was an error processing your purchase. Please try again."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <Button variant="outline" onClick={() => setStep("confirm")} className="mt-4">
                Try Again
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Successful!</DialogTitle>
              <DialogDescription>
                Your purchase of {product?.name} has been completed successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="w-full max-w-xs space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction:</span>
                  <span className="font-medium truncate max-w-[180px]" title={transactionId}>
                    {transactionId?.startsWith('0x')
                      ? `${transactionId.substring(0, 6)}...${transactionId.substring(transactionId.length - 4)}`
                      : transactionId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Item:</span>
                  <span className="font-medium">{product?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{product?.price ? product.price.toFixed(2) : '0.00'} ySYLD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Merchant:</span>
                  <span className="font-medium">{product?.merchant || "SEYIELD Official Store"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-500">Completed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-700 dark:text-green-300 mb-6">
                <p className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  <span>The merchant has been paid automatically by the SEYIELD platform. Your ySYLD tokens have been burned.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                {transactionId && (
                  <Button
                    onClick={handleViewTransaction}
                    className="gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700"
                  >
                    {transactionId?.startsWith('0x') ? 'View on Explorer' : 'View Transaction'}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
