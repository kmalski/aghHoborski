import { Team, TeamName } from './team.model';

export { Game, GameShared };

interface GameShared {
  teamName: string;
}

class Game {
  public teams: Map<TeamName, Team>;
  public moneyPool: number = 0;
  public hintAmount: number = 0;
  public answeringTeam?: Team;

  constructor() {
    this.teams = new Map<TeamName, Team>();
    for (const name in TeamName) {
      const teamName = TeamName[name];
      this.teams.set(teamName, new Team(teamName));
    }
    this.teams.delete(TeamName.MASTERS);
  }

  startAuction() {
    this.teams.forEach(team => {
      if (team.inGame) {
        this.moneyPool += team.startAuction();
      }
    });

    return this.moneyPool;
  }

  bidAmount(team: TeamName, amount: number) {
    this.moneyPool += amount;
    this.teams.get[team].bidAmount(amount);
  }

  finishAuction() {
    this.answeringTeam = this.findAuctionWinningTeam();
    return this.answeringTeam;
  }

  startHintAuction() {}

  finishHintAuction(agreed: boolean) {}

  correctAnswer() {
    this.answeringTeam.grantPrize(this.moneyPool);
    this.answeringTeam = null;
    this.moneyPool = 0;
  }

  wrongAnswer() {
    if (this.answeringTeam.accountBalance === 0) {
      this.teams.delete(this.answeringTeam.name);
    }
    this.answeringTeam = null;
  }

  grantBlackBox(team: TeamName) {
    this.teams.get(team).hasBlackBox = true;
  }

  removeBlackBox(team: TeamName) {
    this.teams.get(team).hasBlackBox = false;
  }

  startSecondRound() {
    const winningTeam = this.findWinningTeam();
    this.teams = new Map<TeamName, Team>();
    this.teams.set(winningTeam.name, winningTeam);
    this.teams.set(TeamName.MASTERS, new Team(TeamName.MASTERS));
    this.teams.get(TeamName.MASTERS).accountBalance = 10000;
  }

  isIn(team: TeamName) {
    return this.teams.get(team) != null;
  }

  private findAuctionWinningTeam() {
    const entry = [...this.teams.entries()].reduce((x, y) => (x[1].auctionAmount > y[1].auctionAmount ? x : y));
    return entry[1];
  }

  private findWinningTeam() {
    const entry = [...this.teams.entries()].reduce((x, y) => (x[1].accountBalance > y[1].accountBalance ? x : y));
    return entry[1];
  }
}
