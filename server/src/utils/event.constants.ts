export { Incoming, Outgoing };

enum Outgoing {
  // common
  WARNING = 'warning',
  UNAUTHORIZED = 'unauthorized',
  FAIL = 'fail',
  SUCCESS = 'success',

  // rooms
  ROOM_CREATED = 'roomCreated',
  ROOM_JOINED = 'roomJoined',
  STATE = 'state',

  // questions
  ALL_QUESTION_SETS = 'allQuestionSets'
}

enum Incoming {
  // built-in
  CONNECT = 'connect',

  // rooms
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
  ADMIN_JOIN_ROOM = 'adminJoinRoom',
  GET_STATE = 'getState',
  ADMIN_GET_STATE = 'adminGetState',

  // questions
  ADD_QUESTION_SET = 'addQuestionSet',
  GET_ALL_QUESTION_SETS = 'getAllQuestionSets',
  CHANGE_QUESTION_SET = 'changeQuestionSet'
}
