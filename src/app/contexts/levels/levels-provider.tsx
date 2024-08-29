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
    mutationFn: async (formData: any) => {
      const res = await axios.post(`${endpoints.levels.levelUp}/${formData.levelId}/${formData.userId}`)
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
    mutationFn: async (formData: any)=> {
      const res = await axios.post(endpoints.levels.register, formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['levels']})
    }
  })

  const {mutateAsync: updateLevel} = useMutation({
    mutationFn: async({levelId, formData}: {levelId:string, formData: any})=> {
      const res = await axios.patch(`${endpoints.levels.update}/${levelId}`, formData)

      return res.data
    },
    onSuccess:(dataRes, variables) => {
      const queryKeys = [
        ['levels'],
        ['levels', variables.levelId]
      ]
      queryKeys.forEach(key => queryClient.invalidateQueries({queryKey: key}))
    }
  })

  const contextValue = useMemo(() => ({
    data,
    isLoading,
    isError,
    registerLevel,
    levelUpUser,
    updateLevel
  }), [data, isLoading, isError, registerLevel, levelUpUser, updateLevel])

  return <LevelsContext.Provider value={contextValue}>{children}</LevelsContext.Provider>
}