export interface Hand {
  bet: number;
  bettor: string;
  suit: string;
  team1Score: number;
  team2Score: number;
  team1Bonus: number;
  team2Bonus: number;
  team1Sum: number;
  team2Sum: number;
  special: string;
  betAchieved: boolean;
}
