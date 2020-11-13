import { Team, TeamName } from './team.model';

export { Game, GameData };

interface GameData {
  teamName: string;
  newAuctionAmount?: number;
  newAccountBalance?: number;
  newHintsCount?: number;
  newMoneyPool?: number;
  newHasBlackBox?: boolean;
  newIsInGame?: boolean;
  auctionFinishAction?: string;
  categoryName?: string;
}

class Game {
  public activeTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public inactiveTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public moneyPool: number = 0;
  public isAuction: boolean = false;
  public hintAmount: number = 0;
  public auctionWinningTeam?: Team;

  constructor() {
    for (const name in TeamName) {
      const teamName = TeamName[name];
      this.activeTeams.set(teamName, new Team(teamName));
    }
    this.inactiveTeams.set(TeamName.MASTERS, this.activeTeams.get(TeamName.MASTERS));
    this.activeTeams.delete(TeamName.MASTERS);
  }

  startAuction() {
    this.activeTeams.forEach(team => {
      if (team.ableToPlay()) {
        this.moneyPool += team.startAuction();
      }
    });
    this.auctionWinningTeam = null;
    this.isAuction = true;
    return this.moneyPool;
  }

  finishAuction() {
    this.isAuction = false;
    this.activeTeams.forEach(team => {
      team.auctionAmount = 0;
    });
    return this.auctionWinningTeam;
  }

  cancelAuction() {
    this.isAuction = false;
    this.auctionWinningTeam = null;
    this.activeTeams.forEach(team => {
      this.moneyPool -= team.auctionAmount;
      team.accountBalance += team.auctionAmount;
      team.auctionAmount = 0;
    });
  }

  bidAmount(teamName: TeamName, amount: number) {
    const team = this.activeTeams.get(teamName);
    if (team.getAllMoney() >= amount && (!this.auctionWinningTeam || amount > this.auctionWinningTeam.auctionAmount)) {
      this.auctionWinningTeam = team;
      this.moneyPool += team.bidAmount(amount);
      return true;
    }
    return false;
  }

  correctAnswer() {
    this.auctionWinningTeam.grantPrize(this.moneyPool);
    this.auctionWinningTeam = null;
    this.moneyPool = 0;
  }

  wrongAnswer() {
    this.auctionWinningTeam = null;
  }

  noAnswerNeeded() {
    this.auctionWinningTeam = null;
    this.moneyPool = 0;
  }

  startSecondRound() {
    const winningTeam = this.findWinningTeam();
    this.activeTeams.delete(winningTeam.name);
    this.inactiveTeams = new Map([...this.inactiveTeams, ...this.activeTeams]);
    this.activeTeams = new Map<TeamName, Team>();
    this.activeTeams.set(winningTeam.name, winningTeam);
    this.moveToActive(TeamName.MASTERS);
    this.activeTeams.get(TeamName.MASTERS).accountBalance = 10000;
  }

  changeTeamStatus(teamName: TeamName, inGame: boolean) {
    if (!inGame) {
      return this.moveToInactive(teamName);
    }
    return this.moveToActive(teamName);
  }

  isInGame(teamName: TeamName) {
    return this.activeTeams.get(teamName) != null;
  }

  exists(teamName: TeamName) {
    return this.activeTeams.get(teamName) != null || this.inactiveTeams.get(teamName) != null;
  }

  isAnsweringStage() {
    return this.auctionWinningTeam && !this.isAuction;
  }

  getTeam(teamName: TeamName) {
    if (this.isInGame(teamName)) return this.activeTeams.get(teamName);
    else return this.inactiveTeams.get(teamName);
  }

  getActiveTeam(teamName: TeamName) {
    return this.activeTeams.get(teamName);
  }

  getInactiveTeam(teamName: TeamName) {
    return this.inactiveTeams.get(teamName);
  }

  getAbleToPlaySize() {
    let count = 0;
    this.activeTeams.forEach(team => {
      if (team.ableToPlay()) count++;
    });
    return count;
  }

  private moveToInactive(teamName: TeamName) {
    const team = this.activeTeams.get(teamName);
    this.inactiveTeams.set(teamName, team);
    this.activeTeams.delete(teamName);
    return team;
  }

  private moveToActive(teamName: TeamName) {
    const team = this.inactiveTeams.get(teamName);
    this.activeTeams.set(teamName, team);
    this.inactiveTeams.delete(teamName);
    return team;
  }

  private findWinningTeam() {
    const entry = [...this.activeTeams.entries()].reduce((x, y) => (x[1].accountBalance > y[1].accountBalance ? x : y));
    return entry[1];
  }
}
