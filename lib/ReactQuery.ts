import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from 'react-query'

// get user logged in
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

// get all rooms
export function useGetRooms() {
  return useInfiniteQuery('rooms', 
    async ({ pageParam = '' }) => {
      const rooms = fetch(`/api/modules/read/rooms?cursor=${ pageParam }`)
      return (await rooms).json()
    },
    {
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// get joined room (find-first)
export function useGetRoom(roomSlug: string) {
  return useQuery('room', 
    async () => {
      const room = fetch(`/api/modules/read/rooms/${ roomSlug }`)
      return (await room).json()
    },
    {
      enabled: !!roomSlug,
      refetchInterval: 1000
    }
  )
}

// get all joined rooms by user
export function useGetJoinedRooms(userId: string) {
  return useInfiniteQuery('joined_rooms', 
    async ({ pageParam = '' }) => {
      const joined_rooms = fetch(`/api/modules/read/joined-rooms?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
      return (await joined_rooms).json()
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// get joined room (find-first)
export function useGetJoinedRoom(roomSlug: string) {
  return useQuery('joined_room', 
    async () => {
      const joined_room = fetch(`/api/modules/read/joined-rooms/${ roomSlug }`)
      return (await joined_room).json()
    },
    {
      enabled: !!roomSlug,
      refetchInterval: 1000
    }
  )
}

// get all chats by room slug
export function useGetChats(roomSlug: string) {
  return useInfiniteQuery('chats', 
    async ({ pageParam = '' }) => {
      const chats = fetch(`/api/modules/read/chats?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomSlug })
      })
      return (await chats).json()
    },
    {
      select: chats => ({
        pages: [...chats.pages],
        pageParams: [...chats.pageParams].reverse()
      }),
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false
    }
  )
}

// for optimistic updates useMutation function
export const sendChat = (_args: any) => {
  return fetch('/api/modules/create/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatbox: _args.chatbox,
      userId: _args.userId,
      roomSlug: _args.roomSlug
    })
  })
}

export const useSendChatMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(sendChat, {
    onMutate: async (newChat) => {
      await queryClient.cancelQueries('createChat')
      const previousChatData = queryClient.getQueriesData('createChat')
      queryClient.setQueriesData('createChat', (oldQueryData: any) => {
        return {
          ...oldQueryData,
          data: [...oldQueryData.data, { index: oldQueryData?.data.length + 1, ...newChat }]
        }
      })
      return {
        previousChatData,
      }
    },
    onError: (_error, _chat, context) => {
      queryClient.setQueryData('createChat', context?.previousChatData)
    },
    onSettled: () => {
      queryClient.invalidateQueries('createChat')
    }
  })
}