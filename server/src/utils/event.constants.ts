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
  AUTHORIZED = 'authorized',

  // questions
  ALL_QUESTION_SETS = 'allQuestionSets',

  // game
  TEAM_STATE = 'TeamState',
  BLACK_BOX_CHANGED = 'BlackBoxChanged',
  TEAM_STATUS_CHANGED = 'TeamStatusChanged'
}

enum Incoming {
  // built-in
  CONNECT = 'connect',

  // rooms
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
  ADMIN_JOIN_ROOM = 'adminJoinRoom',
  AUTHORIZE = 'authorize',

  // questions
  ADD_QUESTION_SET = 'addQuestionSet',
  GET_ALL_QUESTION_SETS = 'getAllQuestionSets',
  CHANGE_QUESTION_SET = 'changeQuestionSet',

  // game
  GET_TEAM_STATE = 'getTeamState',
  CHANGE_BLACK_BOX = 'changeBlackBox',
  CHANGE_TEAM_STATUS = 'changeTeamStatus'
}
