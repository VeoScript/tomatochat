import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from 'react-query'

import {
  changeProfile,
  changeCover,
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
  sendChatImage,
  sendLastChat,
  seenChat,
  deleteChat,
  createPost,
  createStory
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
      enabled: !!email,
      refetchInterval: 1000
    }
  )
}

// QUERY FOR GETTING THE PROFILE DETAILS OF SPECIFIC USER (FIND-FIRST)
export function useGetProfile(userId: string) {
  return useQuery('userprofile', 
    async () => {
      const profile = fetch(`/api/modules/read/userprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
      return (await profile).json()
    },
    {
      refetchInterval: 1000
    }
  )
}

// QUERY FOR GETTING THE RESULTS OF SEARCH PEOPLE
export function useGetSearchPeople(searchTerm: string) {
  return useQuery('searchpeople', 
    async () => {
      const search = fetch(`/api/modules/read/search/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm })
      })
      return (await search).json()
    },
    {
      enabled: !!searchTerm
    }
  )
}

// QUERY FOR GETTING THE RESULTS OF SEARCH DISCOVER ROOM
export function useGetSearchDiscover(searchTerm: string) {
  return useQuery('searchdiscover', 
    async () => {
      const search = fetch(`/api/modules/read/search/discover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm })
      })
      return (await search).json()
    },
    {
      enabled: !!searchTerm
    }
  )
}

// QUERY FOR GETTING THE RESULTS OF SEARCH INBOX ROOM
export function useGetSearchInbox(searchTerm: string, userId: string) {
  return useQuery('searchinbox', 
    async () => {
      const search = fetch(`/api/modules/read/search/inbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm, userId})
      })
      return (await search).json()
    },
    {
      enabled: !!searchTerm
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

// QUERY FOR GETTING ALL POSTS OF SPECIFIC USER (FIND-FIRST)
export function useGetUserPosts(userId: string) {
  return useInfiniteQuery('get_user_posts', 
    async ({ pageParam = '' }) => {
      const get_user_posts = fetch(`/api/modules/read/posts?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
      return (await get_user_posts).json()
    },
    {
      enabled: !!userId,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// QUERY FOR GETTING ALL POSTS DISPLAYING IN NEWSFEED PAGE
export function useGetNewsFeedPosts() {
  return useInfiniteQuery('get_newsfeed_posts', 
    async ({ pageParam = '' }) => {
      const get_newsfeed_posts = fetch(`/api/modules/read/posts/newsfeed?cursor=${ pageParam }`)
      return (await get_newsfeed_posts).json()
    },
    {
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}




// ------------- REACT-QUERY (MUTATIONS) ------------- //

// MUTATION FOR UPDATING NEW PROFILE PHOTO
export const useChangeProfileMutation = () => {
  return useMutation((_args: any) => changeProfile({
      photo: _args.photo,
      userId: _args.userId
    })
  )
}

// MUTATION FOR UPDATING NEW COVER PHOTO
export const useChangeCoverMutation = () => {
  return useMutation((_args: any) => changeCover({
      photo: _args.photo,
      userId: _args.userId
    })
  )
}

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

// MUTATION FOR SENDING A NORMAL CHAT
export const useSendChatMutation = () => {
  return useMutation((_args: any) => sendChat({
      chatbox: _args.chatbox,
      userId: _args.userId,
      roomSlug: _args.roomSlug
    })
  )
}

// MUTATION FOR SENDING A NORMAL CHAT
export const useSendChatImageMutation = () => {
  return useMutation((_args: any) => sendChatImage({
      chatbox: _args.chatbox,
      userId: _args.userId,
      roomSlug: _args.roomSlug
    })
  )
}

// OPTIMISTIC MUTATION FOR SENDING A NORMAL CHAT
// export const useSendChatMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(sendChat, {
//     onMutate: async (newChat) => {
//       await queryClient.cancelQueries('chats')
//       const previousChatData = queryClient.getQueriesData('chats')
//       queryClient.setQueriesData('chats', (oldQueryData: any) => {
//         oldQueryData.pages.map((page: { chats: any }) => ({
//           ...page,
//           chats: [...page.chats, { index: page?.chats.length + 1, ...newChat }]
//         }))
//       })
//       return {
//         previousChatData,
//       }
//     },
//     onError: (_error, _chat, context: any) => {
//       queryClient.setQueryData('chats', context?.previousChatData)
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries('chats')
//     }
//   })
// }

// OPTIMISTIC MUTATION FOR SENDING AN IMAGE CHAT
// export const useSendChatImageMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(sendChatImage, {
//     onMutate: async (newImageChat) => {
//       await queryClient.cancelQueries('chats')
//       const previousChatData = queryClient.getQueriesData('chats')
//       queryClient.setQueriesData('chats', (oldQueryData: any) => {
//         oldQueryData.pages.map((page: { chats: any }) => ({
//           ...page,
//           chats: [...page.chats, { index: page?.chats.length + 1, ...newImageChat }]
//         }))
//       })
//       return {
//         previousChatData,
//       }
//     },
//     onError: (_error, _chat, context: any) => {
//       queryClient.setQueryData('chats', context?.previousChatData)
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries('chats')
//     }
//   })
// }

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

// MUTATION FOR CREATING NEW POST
export const useCreatePost = () => {
  return useMutation((_args: any) => createPost({
      description: _args.description,
      postId: _args.postId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR CREATING NEW STORY
export const useCreateStory = () => {
  return useMutation((_args: any) => createStory({
      imageUrl: _args.imageUrl,
      postId: _args.postId
    })
  )
}