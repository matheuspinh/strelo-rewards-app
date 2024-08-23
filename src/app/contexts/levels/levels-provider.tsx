import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { LevelsContext } from "./levels-context";

interface ProviderProps {
  children: React.ReactNode;
}

export function LevelsProvider({ children }: ProviderProps){
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["levels"],
    queryFn: async () => {
      const res = await axios.get(endpoints.levels.list)
      return res.data
    }
  })

  const { mutateAsync: levelUpUser } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(`${endpoints.levels.levelUp}/${data.levelId}/${data.userId}`)
      return res.data
    },
    onSuccess: () => {
      const queryKeys = [
        ['levels'],
        ['users']
      ]
      queryKeys.forEach(key => queryClient.invalidateQueries({queryKey: key}))
    }
  })

  const { mutateAsync: registerLevel } = useMutation({
    mutationFn: async (data: any)=> {
      const res = await axios.post(endpoints.levels.register, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['levels']})
    }
  })

  const contextValue = useMemo(() => ({
    data,
    isLoading,
    isError,
    registerLevel,
    levelUpUser
  }), [data, isLoading, isError, registerLevel, levelUpUser])

  return <LevelsContext.Provider value={contextValue}>{children}</LevelsContext.Provider>
}