import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { BadgesContext } from "./badges-context";

interface ProviderProps {
  children: React.ReactNode;
}

export function BadgesProvider({ children }: ProviderProps){
  const queryClient = useQueryClient()

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

  const { mutateAsync: deleteMission } = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${endpoints.missions.delete}/${id}`)
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['missions']})
    }
  })

  const {mutateAsync: updateMission} = useMutation({
    mutationFn: async ({id, formData} : {id: string, formData: any}) => {
      const res = await axios.patch(`${endpoints.missions.update}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data
    },
    onSuccess: (dataRes, variables) => {
      const queryKeys = [
        ['missions'],
        ['mission', variables.id]
      ]
      queryKeys.forEach(key => queryClient.invalidateQueries({queryKey: key}))
    }
  })

  const contextValue = useMemo(() => ({
    data,
    registerBadge,
    isLoading,
    isError,
  }), [data, registerBadge, isLoading, isError]);

  return <BadgesContext.Provider value={contextValue}>{children}</BadgesContext.Provider>

}
