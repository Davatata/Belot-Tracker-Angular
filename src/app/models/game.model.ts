import { Hand } from "./hand.model";

export interface Game {
  winner: string,
  teams: { 
    team1Name: string,
    team2Name: string,
    team1Score: number,
    team2Score: number,
  },
  hands: Hand[]
}