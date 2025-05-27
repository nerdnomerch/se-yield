'use client'

import { useAccount, useBalance, useReadContract } from 'wagmi'
import { tokenAddresses, tokenMetadata } from '@/app/config/token-addresses'
import { contractAddresses } from '@/app/config/contract-addresses'
import { erc20Abi } from '@/app/config/abis/erc20-abi'
import { useState, useEffect, useCallback } from 'react'

type AssetType = 'usdc'

/**
 * Custom hook to fetch token balance for a specific asset
 * @param asset The asset to fetch balance for ('usdc')
 * @returns Object containing balance information and loading state
 */
export function useTokenBalance(asset: AssetType) {
  const { address, isConnected } = useAccount()
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0))
  const [pSyldBalance, setPSyldBalance] = useState<bigint>(BigInt(0))
  const [ySyldBalance, setYSyldBalance] = useState<bigint>(BigInt(0))

  // Get USDC balance
  const { data: usdcData, isError, isLoading, refetch } = useBalance({
    address: isConnected ? address : undefined,
    token: tokenAddresses[asset] as `0x${string}`,
  })

  // Get pSYLD balance
  const { data: pSyldData, refetch: refetchPSyld } = useReadContract({
    address: contractAddresses.principalToken as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: isConnected && !!address ? [address as `0x${string}`] : undefined,
  })

  // Get ySYLD balance
  const { data: ySyldData, refetch: refetchYSyld } = useReadContract({
    address: contractAddresses.yieldToken as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: isConnected && !!address ? [address as `0x${string}`] : undefined,
  })

  // Update balances when data changes
  useEffect(() => {
    if (usdcData?.value) {
      setUsdcBalance(usdcData.value)
    }
    if (pSyldData) {
      setPSyldBalance(pSyldData as bigint)
    }
    if (ySyldData) {
      setYSyldBalance(ySyldData as bigint)
    }
  }, [usdcData, pSyldData, ySyldData])

  // Function to refresh all balances
  const refetchBalances = useCallback(async () => {
    await Promise.all([
      refetch(),
      refetchPSyld(),
      refetchYSyld()
    ])
  }, [refetch, refetchPSyld, refetchYSyld])

  return {
    balance: usdcData ? usdcData.value.toString() : '0',
    symbol: usdcData?.symbol || tokenMetadata[asset]?.symbol,
    decimals: usdcData?.decimals || tokenMetadata[asset]?.decimals,
    value: usdcData?.value,
    usdcBalance,
    pSyldBalance,
    ySyldBalance,
    isLoading,
    isError,
    refetch,
    refetchBalances,
    isConnected,
  }
}
