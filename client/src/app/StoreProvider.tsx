'use client'
import { Provider } from 'react-redux'
import { store } from '@/lib/store/store'
import { ReactNode } from 'react'

interface StoreProviderProps {
  children: ReactNode
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}