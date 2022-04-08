import { useQuery } from 'react-query'

export function useGetUser(email: string) {
  return useQuery('user', 
    async () => {
      const user = fetch(`/api/auth/user/${email}`)
      return (await user).json()
    },
    {
      enabled: !!email
    }
  )
}