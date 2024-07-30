import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios, {endpoints} from "src/utils/axios";

import { UsersContext } from "./users-context";

interface ProviderProps {
  children: React.ReactNode;
}

export function UsersProvider({ children }: ProviderProps){
  const queryClient = useQueryClient();

  const {data, isLoading, isError} = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(endpoints.users.list);
      return res.data;
    }
  })

  const { mutateAsync: registerUser } = useMutation({
    mutationFn: async (formData: any) => {
      const res = await axios.post(endpoints.users.register, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']})
    },
  })

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: async ({id, formData}:{id: string, formData:any}) => {
      const res = await axios.put(`${endpoints.users.update}${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
      },
      onSuccess: (resData, variables) => {
        const queryKeys = [
          ['users'],
          ['user', variables.id]
        ]
        queryKeys.forEach(key => queryClient.invalidateQueries({queryKey: key}))
      },
  })
  

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: async(id: string)=> {
      const res = await axios.delete(`${endpoints.users.delete}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']})
    }

  })

  const contextValues = useMemo(() => ({
    data,
    isLoading,
    isError,
    registerUser,
    deleteUser,
    updateUser
  }), [data, isLoading, isError, registerUser, deleteUser, updateUser]);

  return <UsersContext.Provider value={contextValues}>{children}</UsersContext.Provider>
}