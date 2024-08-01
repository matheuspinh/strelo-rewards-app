'use client'

import { useContext } from "react"

import { PrivilegesContext } from "src/app/contexts/privileges/privileges-context"

export const usePrivilegesContext = () => {
  const context = useContext(PrivilegesContext)

  if(!context) throw new Error('usePrivilegesContext must be used inside PrivilegesProvider')

  return context
}