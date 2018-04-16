export interface Hand {
  handId: number,
  bet: number,
  bettor: string,
  suit: string,
  team1Score: number,
  team2Score: number,
  betAchieved: boolean
}