export { TeamName, TeamShared, Team };

enum TeamName {
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
  MASTERS = 'masters'
}

interface TeamShared {
  name: TeamName;
  auctionAmount: number;
  accountBalance: number;
  hasBlackBox: boolean;
  hintsCount: number;
  inGame?: boolean;
  isAuction?: boolean;
  hasLost?: boolean;
}

class Team {
  public name: TeamName;
  public auctionAmount: number = 0;
  public accountBalance: number = 5000;
  public hasBlackBox: boolean = false;
  public hintsCount: number = 0;

  constructor(name: TeamName) {
    this.name = name;
  }

  allMoney() {
    return this.accountBalance + this.auctionAmount;
  }

  startAuction() {
    this.accountBalance -= 200;
    this.auctionAmount = 200;

    return 200;
  }

  bidAmount(amount: number) {
    const amountDiff = amount - this.auctionAmount;
    this.accountBalance -= amountDiff;
    this.auctionAmount += amountDiff;
    return amountDiff;
  }

  grantPrize(amount: number) {
    this.accountBalance += amount;
    return this.accountBalance;
  }

  grantHint() {
    this.hintsCount += 1;
    return this.hintsCount;
  }

  grantBlackBox() {
    this.hasBlackBox = true;
    return this.hasBlackBox;
  }

  ableToPlay() {
    return this.allMoney() > 200;
  }
}
