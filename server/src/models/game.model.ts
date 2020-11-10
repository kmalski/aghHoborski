import { Team, TeamName } from './team.model';

export { Game, GameShared };

interface GameShared {
  teamName: string;
  newAmount?: number;
  newBalance?: number;
  newCount?: number;
  newMoneyPool?: number
  desiredState?: boolean;
  finishAuctionAction?: string;
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
      if (team.accountBalance > 200) {
        this.moneyPool += team.startAuction();
      }
    });
    this.auctionWinningTeam = null;
    this.isAuction = true;
    return this.moneyPool;
  }

  finishAuction() {
    this.isAuction = false;
    return this.auctionWinningTeam;
  }

  cancelAuction() {
    this.isAuction = false;
    this.auctionWinningTeam = null;
    this.activeTeams.forEach(team => {
      this.moneyPool -= team.auctionAmount;
      team.accountBalance += team.auctionAmount;
    });
  }

  bidAmount(teamName: TeamName, amount: number) {
    const team = this.activeTeams.get(teamName);
    if (team.allMoney() >= amount && (!this.auctionWinningTeam || amount > this.auctionWinningTeam.auctionAmount)) {
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
    if (this.auctionWinningTeam.accountBalance < 300) {
      this.activeTeams.delete(this.auctionWinningTeam.name);
    }
    this.auctionWinningTeam = null;
  }

  noAnswerNeeded() {
    if (this.auctionWinningTeam.accountBalance < 300) {
      this.activeTeams.delete(this.auctionWinningTeam.name);
    }
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

  changeBlackBox(teamName: TeamName, hasBlackBox: boolean) {
    this.activeTeams.get(teamName).hasBlackBox = hasBlackBox;
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

  auctionAmount(teamName: TeamName) {
    const team = this.activeTeams.get(teamName);
    if (team) return team.auctionAmount;
    return 0;
  }

  accountBalance(teamName: TeamName) {
    const team = this.activeTeams.get(teamName);
    if (team) return team.accountBalance;
    return 0;
  }

  hintsCount(teamName: TeamName) {
    const team = this.activeTeams.get(teamName);
    if (team) return team.hintsCount;
    return 0;
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

  private findAuctionWinningTeam() {
    const entry = [...this.activeTeams.entries()].reduce((x, y) => (x[1].auctionAmount > y[1].auctionAmount ? x : y));
    return entry[1];
  }

  private findWinningTeam() {
    const entry = [...this.activeTeams.entries()].reduce((x, y) => (x[1].accountBalance > y[1].accountBalance ? x : y));
    return entry[1];
  }
}
