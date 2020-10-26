export { Incoming, Outgoing };

enum Outgoing {
  // common
  WARNING = 'warning',
  UNAUTHORIZED = 'unauthorized',

  // rooms
  ROOM_CREATED = 'roomCreated',
  ROOM_JOINED = 'roomJoined',
  STATE = 'state'
}

enum Incoming {
  //built-in
  CONNECT = 'connect',

  //rooms
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
  ADMIN_JOIN_ROOM = 'adminJoinRoom',
  GET_STATE = 'getState',
  ADMIN_GET_STATE = 'adminGetState'
}
