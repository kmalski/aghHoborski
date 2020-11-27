import { Team, TeamName } from './team';

export { Game, RoundStage };

enum RoundStage {
  AUCTION = 'auction',
  ANSWERING = 'answering',
  HINT_AUCTION = 'hintAuction',
  IDLE = 'idle'
}

class Game {
  public activeTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public inactiveTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public moneyPool: number = 0;
  public hintAmount: number = 0;
  public auctionWinningTeam?: Team;
  public roundStage: RoundStage = RoundStage.IDLE;
  public roundNumber: number = 0;
  public stageNumber: number = 1;

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
    this.roundStage = RoundStage.AUCTION;
    this.roundNumber += 1;
    return this.moneyPool;
  }

  finishAuction() {
    this.roundStage = RoundStage.ANSWERING;
    this.activeTeams.forEach(team => {
      team.auctionAmount = 0;
    });
    return this.auctionWinningTeam;
  }

  cancelAuction() {
    this.roundStage = RoundStage.IDLE;
    this.auctionWinningTeam = null;
    this.activeTeams.forEach(team => {
      this.moneyPool -= team.auctionAmount;
      team.accountBalance += team.auctionAmount;
      team.auctionAmount = 0;
    });
    this.roundNumber -= 1;
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
    this.roundStage = RoundStage.IDLE;
    this.auctionWinningTeam.grantPrize(this.moneyPool);
    this.auctionWinningTeam = null;
    this.moneyPool = 0;
  }

  wrongAnswer() {
    this.roundStage = RoundStage.IDLE;
    this.auctionWinningTeam = null;
  }

  noAnswerNeeded() {
    this.roundStage = RoundStage.IDLE;
    this.auctionWinningTeam = null;
    this.moneyPool = 0;
  }

  startHintAuction() {
    this.hintAmount = 0;
    this.roundStage = RoundStage.HINT_AUCTION;
  }

  acceptHintAuction() {
    this.roundStage = RoundStage.ANSWERING;
    this.auctionWinningTeam.hintsCount += 1;
    this.auctionWinningTeam.accountBalance -= this.hintAmount;
    this.hintAmount = 0;
  }

  discardHintAuction() {
    this.roundStage = RoundStage.ANSWERING;
    this.hintAmount = 0;
  }

  startSecondStage() {
    const winningTeam = this.findWinningTeam();
    this.inactiveTeams = new Map([...this.inactiveTeams, ...this.activeTeams]);
    this.activeTeams = new Map<TeamName, Team>();
    this.moveToActive(winningTeam.name);
    this.moveToActive(TeamName.MASTERS);
    this.activeTeams.get(TeamName.MASTERS).accountBalance = 10000;
    this.stageNumber = 2;
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

  isAuction() {
    return this.roundStage === RoundStage.AUCTION;
  }

  isAnswering() {
    return this.roundStage === RoundStage.ANSWERING;
  }

  isHintAuction() {
    return this.roundStage === RoundStage.HINT_AUCTION;
  }

  isIdle() {
    return this.roundStage === RoundStage.IDLE;
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
