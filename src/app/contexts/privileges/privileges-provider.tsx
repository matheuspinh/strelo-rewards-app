import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { PrivilegesContext } from "./privileges-context";

interface ProviderProps {
  children: React.ReactNode;
}

export function PrivilegesProvider({ children }: ProviderProps){
  const queryClient = useQueryClient();

  const {data, isLoading, isError} = useQuery({
    queryKey: ["privileges"],
    queryFn: async () => {
      const res = await axios.get(endpoints.privileges.list)

      return res.data;
    }
  })

  const { mutateAsync: registerPrivilege } = useMutation({
    mutationFn: async (postData: any) => {
      const res = await axios.post(endpoints.privileges.register, postData)

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['privileges']})
    }
  })

  const { mutateAsync: updatePrivilege } = useMutation({
    mutationFn: async ({id, patchData}:{id: string, patchData: any}) => {
      const res = await axios.patch(`${endpoints.privileges.update}/${id}`, patchData)

      return res.data;
    },
    onSuccess: (resData, variables) => {
      const queryKeys = [
        ['privileges'],
        ['privilege', variables.id]
      ]
      queryKeys.forEach(key => queryClient.invalidateQueries({queryKey: key}))
    }
  })

  const { mutateAsync: deletePrivilege } = useMutation({
    mutationFn: async (id: string)=> {
      const res = await axios.delete(`${endpoints.privileges.delete}/${id}`)

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['privileges']})
    }
  })
    

  const contextValues = useMemo(() => ({
    data,
    isLoading,
    isError,
    registerPrivilege,
    updatePrivilege,
    deletePrivilege
  }), [data, isLoading, isError, registerPrivilege, updatePrivilege, deletePrivilege])

  return <PrivilegesContext.Provider value={contextValues}>{children}</PrivilegesContext.Provider>
}
