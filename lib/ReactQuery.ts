import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from 'react-query'

// ------------- API-ROUTE -------------

// API-ROUTE FOR CREATING A NEW ROOM
export const createRoom = async (_args: any) => {
  const res = await fetch('/api/modules/create/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      photo: _args.photo,
      name: _args.name,
      privacy: _args.privacy,
      description: _args.description,
      password: _args.password,
      uuidSlug: _args.uuidSlug,
      userId: _args.userId
    })
  })

  if (!res.ok) {
    const json = await res.json()
    throw String(json.message)
  }
}

// API-ROUTE FOR JOINING PUBLIC ROOM
export const joinPublicRoom = async (_args: any) => {
  const res = await fetch('/api/modules/create/join/public', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slug: _args.slug,
      userId: _args.userId
    })
  })
}

// API-ROUTE FOR JOINING PRIVATE ROOM
export const joinPrivateRoom = async (_args: any) => {
  const res = await fetch('/api/modules/create/join/private', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slug: _args.slug,
      userId: _args.userId,
      passcode: _args.passcode
    })
  })

  if (!res.ok) {
    const json = await res.json()
    throw String(json.message)
  }
}

// API-ROUTE FOR SENDING CHATS (NORMAL)
export const sendChat = (_args: any) => {
  return fetch('/api/modules/create/chat/normal', {
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

// API-ROUTE FOR SENDING CHATS (JOIN)
export const sendChatJoin = (_args: any) => {
  return fetch('/api/modules/create/chat/join', {
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

// ------------- REACT-QUERY (QUERIES) -------------

// QUERY FOR GETTING THE LOGGED IN USER DETAILS (FIND-FIRST)
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

// QUERY FOR GETTING ALL THE ROOMS FROM THE DATABASE (FIND-MANY)
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

// QUERY FOR GETTING THE SPECIFIC ROOM BY ROOM SLUG (FIND-FIRST)
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

// QUERY FOR GETTING ALL OF JOINED ROOMS BY THE USER (FIND-MANY)
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
      enabled: !!userId,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// QUERY FOR GETTING THE SPECIFIC JOINED ROOM BY THE USER (FIND-FIRST)
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

// QUERY FOR GETTING ALL MEMBERS OF SPECIFIC JOINED ROOM BY THE USER (FIND-FIRST)
export function useGetMembers(roomSlug: string) {
  return useQuery('members', 
    async () => {
      const members = fetch('/api/modules/read/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomSlug })
      })
      return (await members).json()
    },
    {
      enabled: !!roomSlug,
      refetchInterval: 1000
    }
  )
}

// QUERY FOR GETTING ALL OF THE CHATS BY SPECIFIC ROOMS (FIND-MANY / USE_INFINITE_QUERY)
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
      enabled: !!roomSlug,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false
    }
  )
}

// ------------- REACT-QUERY (MUTATIONS) -------------

// MUTATION FOR CREATING A NEW ROOM
export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation((_args: any) => createRoom({
      photo: _args.photo,
      name: _args.name,
      privacy: _args.privacy,
      description: _args.description,
      password: _args.password,
      uuidSlug: _args.uuidSlug,
      userId: _args.userId
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rooms')
      }
    }
  )
}

// MUTATION FOR JOINING A PUBLIC ROOM
export const useJoinPublicRoomMutation = () => {
  return useMutation((_args: any) => joinPublicRoom({
      slug: _args.slug,
      userId: _args.userId
    })
  )
}

// MUTATION FOR JOINING A PRIVATE ROOM
export const useJoinPrivateRoomMutation = () => {
  return useMutation((_args: any) => joinPrivateRoom({
      slug: _args.slug,
      userId: _args.userId,
      passcode: _args.passcode
    })
  )
}

// MUTATION FOR SENDING CHAT AFTER JOINING NEW HOST (e.g. "Polano join the room.")
export const useSendChatJoinMutation = () => {
  return useMutation((_args: any) => sendChatJoin({
      chatbox: _args.chatbox,
      userId: _args.userId,
      roomSlug: _args.roomSlug
    })
  )
}

// MUTATION FOR OPTIMISTIC UPDATES IN CHAT ROOM
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