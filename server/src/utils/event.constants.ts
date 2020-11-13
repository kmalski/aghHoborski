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
  CURRENT_QUESTION = 'currentQuestion',
  NEXT_QUESTION = 'nextQuestion',
  AVAILABLE_CATEGORIES = 'availableCategories',

  // game
  TEAM_STATE = 'TeamState',
  MONEY_POOL = 'moneyPool',
  TEAM_STATUS_CHANGED = 'TeamStatusChanged',
  AUCTION_AMOUNT_CHANGED = 'AuctionAmountChanged',
  ACCOUNT_BALANCE_CHANGED = 'AccountBalanceChanged',
  HINTS_COUNT_CHANGED = 'HintsCountChanged',
  BLACK_BOX_CHANGED = 'BlackBoxChanged',
  HAS_LOST_CHANGED = 'HasLostChanged',
  MONEY_POOL_CHANGED = 'moneyPoolChanged',
  AUCTION_STARTED = 'auctionStarted',
  AUCTION_FINISHED = 'auctionFinished',
  ROUND_FINISHED = 'roundFinished'
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
  GET_CURRENT_QUESTION = 'getCurrentQuestion',
  GET_AVAILABLE_CATEGORIES = 'getAvailableCategories',
  DRAW_NEXT_QUESTION = 'drawNextQuestion',

  // game
  GET_TEAM_STATE = 'getTeamState',
  GET_MONEY_POOL = 'getMoneyPool',
  CHANGE_TEAM_STATUS = 'changeTeamStatus',
  CHANGE_AUCTION_AMOUNT = 'changeAuctionAmount',
  CHANGE_ACCOUNT_BALANCE = 'changeAccountBalance',
  CHANGE_HINTS_COUNT = 'changeHintsCount',
  CHANGE_BLACK_BOX = 'changeBlackBox',
  CHANGE_MONEY_POOL = 'changeMoneyPool',
  RESET_ACCOUNT_BALANCES = 'resetAccountBalances',
  START_AUCTION = 'startAuction',
  FINISH_AUCTION = 'finishAuction',
  CANCEL_AUCTION = 'cancelAuction'
}
