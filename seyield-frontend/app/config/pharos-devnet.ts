import { defineChain } from 'viem'

export const pharosDevnet = defineChain({
  id: 50002 ,
  name: 'Pharos Devnet',
  network: 'pharos-devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Pharos Devnet',
    symbol: 'Pharos Devnet',
  },
  rpcUrls: {
    default: { http: ['https://devnet.dplabs-internal.com'] },
  },
  blockExplorers: {
    default: { name: 'Pharos Scan', url: 'https://pharosscan.xyz/' },
  },
  devnet: true,
})
