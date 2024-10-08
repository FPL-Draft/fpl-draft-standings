// utils/createPlayersObject.ts
import { Player, PlayerDetails } from '@/interfaces/players';

export function createPlayersObject(players: Player[]): PlayerDetails[] {
  return players.map((player) => ({
    player_name: player.player_first_name,
    player_surname: player.player_last_name,
    id: player.id,
    team_name: player.entry_name,
    head_to_head_rank: 0,
    head_to_head_points: 0,
    total_points: 0,
    points_against: 0,
    head_to_head_total: 0,
    total_points_rank: 0,
    f1_score: 0,
    f1_ranking: 0,
    total_wins: 0,
    total_losses: 0,
    total_draws: 0,
    position_placed: {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0,
      sixth: 0,
      seventh: 0,
      eighth: 0,
    },
  }));
}
