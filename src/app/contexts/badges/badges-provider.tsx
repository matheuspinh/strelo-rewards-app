import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { BadgeCategoryOptions } from "./types";
import { BadgesContext } from "./badges-context";

interface ProviderProps {
  children: React.ReactNode;
}

export function BadgesProvider({ children }: ProviderProps){
  const queryClient = useQueryClient()

  const badgesClassifications = [
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Prata' },
    { value: 'gold', label: 'Ouro' },
  ] as BadgeCategoryOptions[]

  const badgesSkillTypes = [
    {value: 'softskill', label: 'Soft Skill'},
    {value: 'hardskill', label: 'Hard Skill'},
  ] as BadgeCategoryOptions[]

  const { data, isLoading, isError } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const res = await axios.get(endpoints.badges.list)
      return res.data
    }
  })

  const { mutateAsync: registerBadge } = useMutation({
    mutationFn: async (formData: any)=> {
      const res = await axios.post(endpoints.badges.register, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['badges']})
    }
  })

  const { mutateAsync: deleteBadge } = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${endpoints.badges.delete}/${id}`)
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['badges']})
    }
  })

  const {mutateAsync: updateBadge} = useMutation({
    mutationFn: async ({id, formData} : {id: string, formData: any}) => {
      const res = await axios.patch(`${endpoints.badges.update}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data
    },
    onSuccess: (dataRes, variables) => {
      const queryKeys = [
        ['badges'],
        ['badge', variables.id]
      ]
      queryKeys.forEach(key => queryClient.invalidateQueries({queryKey: key}))
    }
  })

  const contextValue = useMemo(() => ({
    data,
    registerBadge,
    deleteBadge,
    updateBadge,
    isLoading,
    isError,
    badgesClassifications,
    badgesSkillTypes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [data, registerBadge, deleteBadge, updateBadge, isLoading, isError]);

  return <BadgesContext.Provider value={contextValue}>{children}</BadgesContext.Provider>

}
