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
}

class Team {
  public name: TeamName;
  public auctionAmount: number;
  public accountBalance: number = 5000;
  public hasBlackBox: boolean = false;
  public hintsCount: number = 0;

  constructor(name: TeamName) {
    this.name = name;
  }

  startAuction() {
    this.accountBalance -= 200;
    this.auctionAmount = 200;

    return 200;
  }

  bidAmount(amount: number) {
    this.accountBalance -= amount;
    this.auctionAmount += amount;
  }

  grantPrize(amount: number) {
    this.accountBalance += amount;
  }

  grantHint() {
    this.hintsCount += 1;
  }
}
