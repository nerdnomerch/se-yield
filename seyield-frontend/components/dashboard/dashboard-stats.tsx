"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/useTokenBalance"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function DashboardStats() {
  const { isConnected } = useAccount()
  const {
    usdcBalance,
    pSyldBalance,
    ySyldBalance,
    refetchBalances
  } = useTokenBalance('usdc')

  // Format balances for display
  const formattedUsdcBalance = usdcBalance ? formatUnits(usdcBalance, 6) : "0"
  const formattedPSyldBalance = pSyldBalance ? formatUnits(pSyldBalance, 6) : "0"
  const formattedYSyldBalance = ySyldBalance ? formatUnits(ySyldBalance, 6) : "0"

  // Calculate total assets (principal + rewards)
  const totalAssets = Number.parseFloat(formattedPSyldBalance) + Number.parseFloat(formattedYSyldBalance)

  // Add loading state
  const [isLoading, setIsLoading] = useState(false)

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true)
    await refetchBalances()
    setTimeout(() => setIsLoading(false), 1000)
  }

  // Auto-refresh on mount
  useEffect(() => {
    if (isConnected) {
      const refreshData = async () => {
        setIsLoading(true)
        await refetchBalances()
        setTimeout(() => setIsLoading(false), 1000)
      }

      refreshData()
    }
  }, [isConnected, refetchBalances])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="col-span-2"
    >
      <Card className="border border-pink-100 dark:border-pink-900/20">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Loader2 className="h-3 w-3 mr-1" />
              )}
              Refresh
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets.toFixed(2)} USDC</div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Deposit</div>
              <div className="text-xl font-semibold">{formattedPSyldBalance} USDC</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Available Rewards</div>
              <div className="text-xl font-semibold text-pink-500 dark:text-pink-400">{formattedYSyldBalance} USDC</div>
            </div>
          </div>
          {!isConnected && (
            <div className="mt-4 text-xs text-center text-muted-foreground">
              Connect your wallet to see your real balances
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
