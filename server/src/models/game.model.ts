import { Team, TeamName } from './team.model';

export { Game, GameShared };

interface GameShared {
  teamName: string;
  desiredState?: boolean;
}

class Game {
  public activeTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public inactiveTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public moneyPool: number = 0;
  public hintAmount: number = 0;
  public answeringTeam?: Team;

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

    return this.moneyPool;
  }

  bidAmount(team: TeamName, amount: number) {
    this.moneyPool += amount;
    this.activeTeams.get[team].bidAmount(amount);
  }

  finishAuction() {
    this.answeringTeam = this.findAuctionWinningTeam();
    return this.answeringTeam;
  }

  correctAnswer() {
    this.answeringTeam.grantPrize(this.moneyPool);
    this.answeringTeam = null;
    this.moneyPool = 0;
  }

  wrongAnswer() {
    if (this.answeringTeam.accountBalance === 0) {
      this.activeTeams.delete(this.answeringTeam.name);
    }
    this.answeringTeam = null;
  }

  startSecondRound() {
    const winningTeam = this.findWinningTeam();
    this.activeTeams = new Map<TeamName, Team>();
    this.activeTeams.set(winningTeam.name, winningTeam);
    this.activeTeams.set(TeamName.MASTERS, new Team(TeamName.MASTERS));
    this.activeTeams.get(TeamName.MASTERS).accountBalance = 10000;
  }

  changeBlackBox(team: TeamName, hasBlackBox: boolean) {
    this.activeTeams.get(team).hasBlackBox = hasBlackBox;
  }

  changeTeamStatus(team: TeamName, inGame: boolean) {
    if (!inGame) {
      return this.moveToInactive(team);
    }
    return this.moveToActive(team);
  }

  isInGame(team: TeamName) {
    return this.activeTeams.get(team) != null;
  }

  exists(team: TeamName) {
    return this.activeTeams.get(team) != null || this.inactiveTeams.get(team) != null;
  }

  private moveToInactive(team: TeamName) {
    const teamObj = this.activeTeams.get(team);
    this.inactiveTeams.set(team, teamObj);
    this.activeTeams.delete(team);
    return teamObj;
  }

  private moveToActive(team: TeamName) {
    const teamObj = this.inactiveTeams.get(team);
    this.activeTeams.set(team, teamObj);
    this.inactiveTeams.delete(team);
    return teamObj;
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
