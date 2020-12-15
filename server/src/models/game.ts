import { Team, TeamName } from './team';
import { OneOnOne } from './oneOnOne';
import { Logger } from '../utils/logger';

export { Game, RoundStage };

enum RoundStage {
  AUCTION = 'auction',
  ONE_ON_ONE = 'oneOnOne',
  ANSWERING = 'answering',
  HINT_AUCTION = 'hintAuction',
  CELEBRATION = 'celebration',
  IDLE = 'idle'
}

class Game {
  public activeTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public inactiveTeams: Map<TeamName, Team> = new Map<TeamName, Team>();
  public auctionWinningTeam?: Team;
  public oneOnOne?: OneOnOne;
  public roundStage: RoundStage = RoundStage.IDLE;
  public moneyPool = 0;
  public hintAmount = 0;
  public roundNumber = 1;
  public stageNumber = 1;

  constructor() {
    for (const name in TeamName) {
      const teamName = TeamName[name];
      this.activeTeams.set(teamName, new Team(teamName));
    }
    this.inactiveTeams.set(TeamName.MASTERS, this.activeTeams.get(TeamName.MASTERS));
    this.activeTeams.delete(TeamName.MASTERS);
  }

  startAuction(amount = 200): number {
    this.activeTeams.forEach(team => {
      if (team.ableToPlay()) {
        this.moneyPool += team.startAuction(amount);
      }
    });
    this.auctionWinningTeam = null;
    this.roundStage = RoundStage.AUCTION;
    return this.moneyPool;
  }

  finishAuction(): Team {
    this.roundStage = RoundStage.ANSWERING;
    this.activeTeams.forEach(team => {
      team.auctionAmount = 0;
    });
    return this.auctionWinningTeam;
  }

  cancelAuction(): void {
    this.roundStage = RoundStage.IDLE;
    this.auctionWinningTeam = null;
    this.activeTeams.forEach(team => {
      this.moneyPool -= team.auctionAmount;
      team.accountBalance += team.auctionAmount;
      team.auctionAmount = 0;
    });
  }

  startOneOnOne(categories: string[]): number {
    const activeTeams = [...this.activeTeams.values()];
    if (activeTeams.length !== 2) {
      Logger.error(`Invalid OneOnOne teams count: ${ activeTeams.length }`);
    }
    const moneyPool = this.startAuction(500);
    this.roundStage = RoundStage.ONE_ON_ONE;
    this.oneOnOne = new OneOnOne(categories, [activeTeams[0], activeTeams[1]]);
    return moneyPool;
  }

  bidAmount(teamName: TeamName, amount: number): boolean {
    const team = this.activeTeams.get(teamName);
    if (team.getAllMoney() >= amount && (!this.auctionWinningTeam || amount > this.auctionWinningTeam.auctionAmount)) {
      this.auctionWinningTeam = team;
      this.moneyPool += team.bidAmount(amount);
      return true;
    }
    return false;
  }

  correctAnswer(): number {
    const prize = this.moneyPool;
    this.roundStage = RoundStage.CELEBRATION;
    this.auctionWinningTeam.grantPrize(this.moneyPool);
    this.moneyPool = 0;
    return prize;
  }

  wrongAnswer(): number {
    this.roundStage = RoundStage.CELEBRATION;
    return 0;
  }

  noAnswerNeeded(): void {
    this.roundStage = RoundStage.CELEBRATION;
    this.moneyPool = 0;
  }

  startHintAuction(): void {
    this.hintAmount = 0;
    this.roundStage = RoundStage.HINT_AUCTION;
  }

  acceptHintAuction(): void {
    this.roundStage = RoundStage.ANSWERING;
    this.auctionWinningTeam.hintsCount += 1;
    this.auctionWinningTeam.accountBalance -= this.hintAmount;
    this.hintAmount = 0;
  }

  discardHintAuction(): void {
    this.roundStage = RoundStage.ANSWERING;
    this.hintAmount = 0;
  }

  startNewRound(): number {
    this.roundStage = RoundStage.IDLE;
    this.auctionWinningTeam = null;
    this.roundNumber += 1;
    return this.roundNumber;
  }

  startSecondStage(): void {
    const winningTeam = this.findWinningTeam();
    this.inactiveTeams = new Map([...this.inactiveTeams, ...this.activeTeams]);
    this.activeTeams = new Map<TeamName, Team>();
    this.moveToActive(winningTeam.name);
    this.moveToActive(TeamName.MASTERS);
    this.activeTeams.get(TeamName.MASTERS).accountBalance = 10000;
    this.roundNumber = 1;
    this.stageNumber = 2;
  }

  changeTeamStatus(teamName: TeamName, inGame: boolean): Team {
    if (!inGame) {
      return this.moveToInactive(teamName);
    }
    return this.moveToActive(teamName);
  }

  isInGame(teamName: TeamName): boolean {
    return this.activeTeams.get(teamName) != null;
  }

  exists(teamName: TeamName): boolean {
    return this.activeTeams.get(teamName) != null || this.inactiveTeams.get(teamName) != null;
  }

  isAuction(): boolean {
    return this.roundStage === RoundStage.AUCTION;
  }

  isAnswering(): boolean {
    return this.roundStage === RoundStage.ANSWERING;
  }

  isHintAuction(): boolean {
    return this.roundStage === RoundStage.HINT_AUCTION;
  }

  isOneOnOne(): boolean {
    return this.roundStage === RoundStage.ONE_ON_ONE || this.oneOnOne != null;
  }

  isCelebration(): boolean {
    return this.roundStage === RoundStage.CELEBRATION;
  }

  isIdle(): boolean {
    return this.roundStage === RoundStage.IDLE;
  }

  getTeam(teamName: TeamName): Team {
    if (this.isInGame(teamName)) return this.activeTeams.get(teamName);
    else return this.inactiveTeams.get(teamName);
  }

  getActiveTeam(teamName: TeamName): Team {
    return this.activeTeams.get(teamName);
  }

  getAbleToPlaySize(): number {
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
