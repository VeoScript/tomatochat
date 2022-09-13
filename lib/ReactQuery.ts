import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from 'react-query'

import {
  changeProfile,
  changeCover,
  changeBio,
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
  createStory,
  likePost,
  unlikePost,
  commentPost,
  deleteCommentPost,
  addToBookmark,
  deleteToBookmark,
  deletePost,
  followUser,
  unfollowUser,
  changeSocMed,
  changeAccount,
  addHobbies,
  deleteHobby
} from './API'


// ------------- REACT-QUERY (QUERIES) ------------- //

// QUERY FOR GETTING THE LOGGED IN USER DETAILS (FIND-FIRST)
export function useGetUser(email: string) {
  return useQuery(['user', email], 
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
  return useQuery(['userprofile', userId], 
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
      enabled: !!userId,
      refetchInterval: 1000
    }
  )
}

// QUERY FOR GETTING THE RESULTS OF SEARCH PEOPLE
export function useGetSearchPeople(searchTerm: string) {
  return useQuery(['searchpeople', searchTerm], 
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
  return useQuery(['searchdiscover', searchTerm], 
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
  return useQuery(['searchinbox', searchTerm, userId], 
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
  return useQuery(['room', roomSlug], 
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
  return useInfiniteQuery(['joined_rooms', userId], 
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
  return useQuery(['joined_room', roomSlug], 
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
  return useQuery(['members', roomSlug], 
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
  return useInfiniteQuery(['chats', roomSlug], 
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
      enabled: !!roomSlug,
      refetchInterval: 1000,
      select: chats => ({
        pages: [...chats.pages],
        pageParams: [...chats.pageParams].reverse()
      }),
      getNextPageParam: (lastPage) => lastPage.nextId ?? false
    }
  )
}

// QUERY FOR GETTING ALL POSTS OF SPECIFIC USER (FIND-FIRST)
export function useGetUserPosts(userId: string) {
  return useInfiniteQuery(['get_user_posts', userId], 
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

// QUERY FOR THE SPECIFIC POST QUERY INFORMATION
export function useGetUserPost(postId: string) {
  return useQuery(['get_user_post', postId], 
    async () => {
      const get_user_post = fetch('/api/modules/read/posts/specificpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
      })
      return (await get_user_post).json()
    },
    {
      enabled: !!postId,
      refetchInterval: 1000
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

// QUERY FOR GETTING ALL COMMENTS IN POST
export function useGetPostComments(postId: string) {
  return useInfiniteQuery(['get_post_comments', postId], 
    async ({ pageParam = '' }) => {
      const get_post_comments = fetch(`/api/modules/read/comments?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
      })
      return (await get_post_comments).json()
    },
    {
      enabled: !!postId,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// QUERY FOR COUNTING ALL COMMENTS IN SPECIFIC POST
export function useGetTotalComments(postId: string) {
  return useQuery(['total_comments', postId], 
    async () => {
      const total_comments = fetch('/api/modules/read/comments/count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
      })
      return (await total_comments).json()
    },
    {
      enabled: !!postId,
      refetchInterval: 1000
    }
  )
}

// QUERY FOR GETTING ALL OF USER BOOKMARKS
export function useGetBookmarks(userId: string) {
  return useInfiniteQuery('get_bookmarks', 
    async ({ pageParam = '' }) => {
      const get_bookmarks = fetch(`/api/modules/read/bookmarks?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
      return (await get_bookmarks).json()
    },
    {
      enabled: !!userId,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// QUERY FOR GETTING ALL OF USER FOLLOWERS
export function useGetFollowers(profileId: string) {
  return useInfiniteQuery(['followers', profileId], 
    async ({ pageParam = '' }) => {
      const followers = fetch(`/api/modules/read/followers?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileId })
      })
      return (await followers).json()
    },
    {
      enabled: !!profileId,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}

// QUERY FOR GETTING ALL OF USER FOLLOWING
export function useGetFollowing(profileId: string) {
  return useInfiniteQuery('following', 
    async ({ pageParam = '' }) => {
      const following = fetch(`/api/modules/read/following?cursor=${ pageParam }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileId })
      })
      return (await following).json()
    },
    {
      enabled: !!profileId,
      refetchInterval: 1000,
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  )
}



// ------------- REACT-QUERY (MUTATIONS) ------------- //

// MUTATION FOR UPDATING THE USER ACCOUNT
export const useChangeUserAccountMutation = () => {
  return useMutation((_args: any) => changeAccount({
      userId: _args.userId,
      name: _args.name,
      username: _args.username,
      location: _args.location
    })
  )
}

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

// MUTATION FOR UPDATING THE USER BIO
export const useChangeBioMutation = () => {
  return useMutation((_args: any) => changeBio({
      bio: _args.bio,
      userId: _args.userId
    })
  )
}

// MUTATION FOR ADDING HOBBIES
export const useAddUserHobbiesMutation = () => {
  return useMutation((_args: any) => addHobbies({
      hobbyName: _args.hobbyName,
      userId: _args.userId
    })
  )
}

// MUTATION FOR DELETING HOBBIES
export const useDeleteUserHobbiesMutation = () => {
  return useMutation((_args: any) => deleteHobby({
      hobbyId: _args.hobbyId
    })
  )
}

// MUTATION FOR UPDATING USER SOCIAL MEDIA LINKS
export const useChangeSocMedMutation = () => {
  return useMutation((_args: any) => changeSocMed({
      userId: _args.userId,
      facebook: _args.facebook,
      instagram: _args.instagram,
      twitter: _args.twitter,
      tiktok: _args.tiktok,
      linkedin: _args.linkedin,
      youtube: _args.youtube
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

// MUTATION FOR DELETE A POST
export const useDeletePost = () => {
  return useMutation((_args: { postId: string }) => deletePost({
      postId: _args.postId
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

// MUTATION FOR LIKING THE POST
export const useLikePost = () => {
  return useMutation((_args: { postId: string, userId: string }) => likePost({
      postId: _args.postId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR UNLIKING THE POST
export const useUnlikePost = () => {
  return useMutation((_args: { postId: string, userId: string }) => unlikePost({
      postId: _args.postId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR COMMENTING THE POST
export const useCommentPost = () => {
  return useMutation((_args: { message: string, postId: string, userId: string }) => commentPost({
      message: _args.message,
      postId: _args.postId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR DELETING THE COMMENT
export const useDeleteCommentPost = () => {
  return useMutation((_args: { commentId: string }) => deleteCommentPost({
      commentId: _args.commentId
    })
  )
}

// MUTATION FOR ADD POST TO USER BOOKMARKS
export const useAddToBookmark = () => {
  return useMutation((_args: { postId: string, userId: string }) => addToBookmark({
      postId: _args.postId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR ADD POST TO USER BOOKMARKS
export const useDeleteToBookmark = () => {
  return useMutation((_args: { postId: string, userId: string }) => deleteToBookmark({
      postId: _args.postId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR FOLLOW FUNCTION
export const useFollowUser = () => {
  return useMutation((_args: { profileId: string, userId: string }) => followUser({
      profileId: _args.profileId,
      userId: _args.userId
    })
  )
}

// MUTATION FOR UNFOLLOW FUNCTION
export const useUnfollowUser = () => {
  return useMutation((_args: { profileId: string, userId: string }) => unfollowUser({
      profileId: _args.profileId,
      userId: _args.userId
    })
  )
}