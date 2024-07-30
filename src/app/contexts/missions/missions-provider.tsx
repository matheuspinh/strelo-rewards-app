import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { MissionsContext } from "./missions-context";

interface ProviderProps {
  children: React.ReactNode;
}

export function MissionsProvider({ children }: ProviderProps){
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const res = await axios.get(endpoints.missions.list)
      return res.data
    }
  })

  const { mutateAsync: registerMission } = useMutation({
    mutationFn: async (formData: any)=> {
      const res = await axios.post(endpoints.missions.register, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['missions']})
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
    registerMission,
    isLoading,
    isError,
    deleteMission,
    updateMission
  }), [data, registerMission, isLoading, isError, deleteMission, updateMission]);

  return <MissionsContext.Provider value={contextValue}>{children}</MissionsContext.Provider>

}
