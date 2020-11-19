export { Incoming, Outgoing };

/*
These are all events that the server can emit. 
Those beginning with a capital letter requires team name prefix. 
Example: redTeamState
*/
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
  CURRENT_QUESTION = 'currentQuestion',
  AVAILABLE_CATEGORIES = 'availableCategories',
  NEXT_QUESTION = 'nextQuestion',

  // team
  TEAM_STATE = 'TeamState',
  TEAM_STATUS_CHANGED = 'TeamStatusChanged',
  AUCTION_AMOUNT_CHANGED = 'AuctionAmountChanged',
  ACCOUNT_BALANCE_CHANGED = 'AccountBalanceChanged',
  HINTS_COUNT_CHANGED = 'HintsCountChanged',
  BLACK_BOX_CHANGED = 'BlackBoxChanged',
  HAS_LOST_CHANGED = 'HasLostChanged',

  // game
  GAME_STATE = 'gameState',
  MONEY_POOL = 'moneyPool',
  GAME_RESET = 'gameReset',
  MONEY_POOL_CHANGED = 'moneyPoolChanged',
  AUCTION_STARTED = 'auctionStarted',
  AUCTION_FINISHED = 'auctionFinished',
  ROUND_FINISHED = 'roundFinished',
  CORRECT_ANSWER = 'correctAnswer',
  WRONG_ANSWER = 'wrongAnswer',

  // time
  TIME_STARTED = 'timeStarted',
  TIME_STOPPED = 'timeStopped'
}

/*
These are all events that the server can handle as an input. 
*/
enum Incoming {
  // built-in
  CONNECT = 'connect',

  // rooms
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
  ADMIN_JOIN_ROOM = 'adminJoinRoom',
  AUTHORIZE = 'authorize',

  // questions
  GET_ALL_QUESTION_SETS = 'getAllQuestionSets',
  GET_CURRENT_QUESTION = 'getCurrentQuestion',
  GET_AVAILABLE_CATEGORIES = 'getAvailableCategories',
  ADD_QUESTION_SET = 'addQuestionSet',
  CHANGE_QUESTION_SET = 'changeQuestionSet',
  SKIP_QUESTION = 'skipQuestion',

  // team
  GET_TEAM_STATE = 'getTeamState',
  CHANGE_TEAM_STATUS = 'changeTeamStatus',
  CHANGE_AUCTION_AMOUNT = 'changeAuctionAmount',
  CHANGE_ACCOUNT_BALANCE = 'changeAccountBalance',
  CHANGE_HINTS_COUNT = 'changeHintsCount',
  CHANGE_BLACK_BOX = 'changeBlackBox',
  RESET_ACCOUNT_BALANCES = 'resetAccountBalances',

  // game
  GET_GAME_STATE = 'getGameState',
  GET_MONEY_POOL = 'getMoneyPool',
  RESET_GAME = 'resetGame',
  CHANGE_MONEY_POOL = 'changeMoneyPool',
  START_AUCTION = 'startAuction',
  FINISH_AUCTION = 'finishAuction',
  CANCEL_AUCTION = 'cancelAuction',
  MARK_CORRECT_ANSWER = 'markCorrectAnswer',
  MARK_WRONG_ANSWER = 'markWrongAnswer',

  // time
  START_TIME = 'startTime',
  STOP_TIME = 'stopTime'
}
