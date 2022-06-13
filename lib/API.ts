// ------------- API-ROUTE ------------- //

// API-ROUTE FOR UPDATING NEW PROFILE PHOTO
export const changeProfile = async (_args: any) => {
  const res = await fetch('/api/modules/update/upload/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      photo: _args.photo,
      userId: _args.userId
    })
  })

  if (!res.ok) {
    const json = await res.json()
    throw String(json.message)
  }
}

// API-ROUTE FOR UPDATING NEW COVER PHOTO
export const changeCover = async (_args: any) => {
  const res = await fetch('/api/modules/update/upload/cover', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      photo: _args.photo,
      userId: _args.userId
    })
  })

  if (!res.ok) {
    const json = await res.json()
    throw String(json.message)
  }
}


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

// API-ROUTE FOR UPDATING A PARTICULAR ROOM
export const updateRoom = async (_args: any) => {
  const res = await fetch('/api/modules/update/room', {
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
      roomSlug: _args.roomSlug,
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

// API-ROUTE FOR SENDING CHATS (IMAGE)
export const sendChatImage = (_args: any) => {
  return fetch('/api/modules/create/chat/image', {
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

// API-ROUTE FOR GETTING THE LAST CHAT OF THE MEMBER
export const sendLastChat = (_args: any) => {
  return fetch('/api/modules/update/chat/lastchat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomSlug: _args.roomSlug,
      lastChat: _args.lastChat,
      lastChatType: _args.lastChatType,
      lastSentUserId: _args.lastSendUserId,
      lastSentUserImage: _args.lastSentUserImage,
      lastSentUserName: _args.lastSentUserName
    })
  })
}

// API-ROUTE FOR SEEN THE CHATS BY THE ROOM PARTICIPANTS
export const seenChat = (_args: any) => {
  return fetch('/api/modules/update/chat/seen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      joinedRoomId: _args.joinedRoomId
    })
  })
}

// API-ROUTE FOR DELETING SELECTED CHAT
export const deleteChat = (_args: any) => {
  return fetch('/api/modules/delete/chat', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId: _args.chatId
    })
  })
}

// API-ROUTE FOR CHANGING THE ROLE OF SELECTED MEMBER
export const changeRole = (_args: any) => {
  return fetch('/api/modules/update/members/role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      joinedRoomId: _args.joinedRoomId,
      role: _args.role
    })
  })
}

// API-ROUTE FOR LEAVE THE USER IN SELECTED ROOM
export const leaveUser = (_args: any) => {
  return fetch('/api/modules/delete/leave/leave-user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      joinedRoomId: _args.joinedRoomId
    })
  })
}

// API-ROUTE FOR KICKING OUT THE USER IN SELECTED ROOM
export const kickOutUser = (_args: any) => {
  return fetch('/api/modules/delete/leave/kickout-user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      joinedRoomId: _args.joinedRoomId,
      userId: _args.userId
    })
  })
}

// API-ROUTE FOR DELETED SELECTED ROOM
export const deleteRoom = (_args: any) => {
  return fetch('/api/modules/delete/room', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId: _args.roomId
    })
  })
}

// API-ROUTE FOR CREATING NEW POST
export const createPost = (_args: any) => {
  return fetch('/api/modules/create/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: _args.description,
      postId: _args.postId,
      userId: _args.userId
    })
  })
}

// API-ROUTE FOR CREATING NEW STORY (MULTIPLE POST IMAGES)
export const createStory = (_args: any) => {
  return fetch('/api/modules/create/story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrl: _args.imageUrl,
      postId: _args.postId
    })
  })
}

// API-ROUTE FOR LIKING THE POST
export const likePost = (_args: { postId: string, userId: string }) => {
  return fetch('/api/modules/create/reactions/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId: _args.postId,
      userId: _args.userId
    })
  })
}

// API-ROUTE FOR UNLIKING THE POST
export const unlikePost = (_args: { postId: string, userId: string }) => {
  return fetch('/api/modules/create/reactions/unlike', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId: _args.postId,
      userId: _args.userId
    })
  })
}

// API-ROUTE FOR COMMENTING THE POST
export const commentPost = (_args: { message: string, postId: string, userId: string }) => {
  return fetch('/api/modules/create/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: _args.message,
      postId: _args.postId,
      userId: _args.userId
    })
  })
}