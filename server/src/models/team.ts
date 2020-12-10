export { TeamName, Team };

enum TeamName {
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
  MASTERS = 'masters'
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

  startAuction() {
    const startAmount = 200;
    this.accountBalance -= startAmount;
    this.auctionAmount = startAmount;
    return startAmount;
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
    return this.getAllMoney() > 200;
  }

  getAllMoney() {
    return this.accountBalance + this.auctionAmount;
  }
}