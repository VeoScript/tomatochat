import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from 'react-query'

import {
  createRoom,
  updateRoom,
  deleteRoom,
  joinPrivateRoom,
  joinPublicRoom,
  kickOutUser,
  leaveUser,
  changeRole,
  sendChat,
  sendChatJoin,
  sendLastChat,
  seenChat,
  deleteChat
} from './API'


// ------------- REACT-QUERY (QUERIES) ------------- //

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
      retry: false,
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

// ------------- REACT-QUERY (MUTATIONS) ------------- //

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

// MUTATION FOR UPDATING A PARTICULAR ROOM
export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation((_args: any) => updateRoom({
      photo: _args.photo,
      name: _args.name,
      privacy: _args.privacy,
      description: _args.description,
      password: _args.password,
      roomSlug: _args.roomSlug,
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
    onError: (_error, _chat, context: any) => {
      queryClient.setQueryData('createChat', context?.previousChatData)
    },
    onSettled: () => {
      queryClient.invalidateQueries('chats')
    }
  })
}

// MUTATION FOR GETTING THE LAST CHAT OF THE MEMBER
export const useLastChatMutation = () => {
  return useMutation((_args: any) => sendLastChat({
      roomSlug: _args.roomSlug,
      lastChat: _args.lastChat,
      lastChatType: _args.lastChatType,
      lastSentUserId: _args.lastSendUserId,
      lastSentUserImage: _args.lastSentUserImage,
      lastSentUserName: _args.lastSentUserName
    })
  )
}

// MUTATION FOR SEEN THE CHATS BY THE ROOM PARTICIPANTS
export const useSeenChatMutation = () => {
  return useMutation((_args: any) => seenChat({
      joinedRoomId: _args.joinedRoomId
    })
  )
}

// MUTATION FOR CHANGING THE ROLE OF SELECTED MEMBER
export const useChangeRole = () => {
  return useMutation((_args: any) => changeRole({
      joinedRoomId: _args.joinedRoomId,
      role: _args.role
    })
  )
}

// MUTATION FOR CHANGING THE ROLE OF SELECTED MEMBER
export const useDeleteChat = () => {
  return useMutation((_args: any) => deleteChat({
      chatId: _args.chatId
    })
  )
}

// MUTATION FOR LEAVE USER BY THE SPECIFIC ROOM
export const useLeaveUser = () => {
  return useMutation((_args: any) => leaveUser({
      joinedRoomId: _args.joinedRoomId
    })
  )
}

// MUTATION FOR KICKING OUT THE USER BY SPECIFIC ROOM
export const useKickOutUser = () => {
  return useMutation((_args: any) => kickOutUser({
      joinedRoomId: _args.joinedRoomId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR DELETING SPECIFIC ROOM
export const useDeleteRoom = () => {
  return useMutation((_args: any) => deleteRoom({
      roomId: _args.roomId
    })
  )
}