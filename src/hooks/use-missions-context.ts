'use client'

import { useContext } from "react"

import { MissionsContext } from "src/app/contexts/missions/missions-context"

export const useMissionsContext = () => {
  const context = useContext(MissionsContext)

  if(!context) throw new Error('useMissionsContext must be used inside MissionsProvider')

  return context
}