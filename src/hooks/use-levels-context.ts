'use client'

import { useContext } from "react";

import { LevelsContext } from "src/app/contexts/levels/levels-context";

export const useLevelsContext = () => {
  const context = useContext(LevelsContext);

  if(!context) throw new Error('useLevelsContext must be used inside LevelsProvider');

  return context;
}