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
  public auctionAmount = 0;
  public accountBalance = 5000;
  public hasBlackBox = false;
  public hintsCount = 0;

  constructor(name: TeamName) {
    this.name = name;
  }

  startAuction(): number {
    const startAmount = 200;
    this.accountBalance -= startAmount;
    this.auctionAmount = startAmount;
    return startAmount;
  }

  bidAmount(amount: number): number {
    const amountDiff = amount - this.auctionAmount;
    this.accountBalance -= amountDiff;
    this.auctionAmount += amountDiff;
    return amountDiff;
  }

  grantPrize(amount: number): number {
    this.accountBalance += amount;
    return this.accountBalance;
  }

  grantHint(): number {
    this.hintsCount += 1;
    return this.hintsCount;
  }

  grantBlackBox(): boolean {
    this.hasBlackBox = true;
    return this.hasBlackBox;
  }

  ableToPlay(): boolean {
    return this.getAllMoney() > 200;
  }

  getAllMoney(): number {
    return this.accountBalance + this.auctionAmount;
  }
}
