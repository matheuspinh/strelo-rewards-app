'use client'

import { useContext } from "react"

import { BadgesContext } from "src/app/contexts/badges/badges-context"

export const useBadgesContext = () => {
  const context = useContext(BadgesContext)

  if(!context) throw new Error('useBadgesContext must be used inside BadgesProvider')

  return context
}