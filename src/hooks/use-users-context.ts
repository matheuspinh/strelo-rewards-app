'use client'

import { useContext } from "react";
import { UsersContext } from "src/app/contexts/users/users-context";

export const useUsersContext = () => {
  const context = useContext(UsersContext);

  if(!context) throw new Error('useUsersContext must be used inside UsersProvider');

  return context;
}