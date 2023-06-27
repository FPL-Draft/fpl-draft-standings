import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import * as z from "zod"

const postSchema = z.object({
  id: z.string()
})

const fplResponseSchema = z.object({
  league: z.object({
    name: z.string()
  }),
  league_entries: z.object({
    entry_id: z.number(),
    entry_name: z.string(),
    id: z.number(),
  }).array(),
  matches: z.object({
    event: z.number(),
    finished: z.boolean(),
    league_entry_1: z.number(),
    league_entry_1_points: z.number(),
    league_entry_2: z.number(),
    league_entry_2_points: z.number(),
  }).array()
})

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = postSchema.parse(req.body)
  const fplResponse = await fetch(`https://draft.premierleague.com/api/league/${id}/details`);
  const fplData = await fplResponse.json()
  const data = fplResponseSchema.parse(fplData)
  const insertLeaguesResponse = await supabase.from('leagues').insert({
    fpl_id: parseInt(id),
    season: '22/23'
  })

  const { data: league } = await supabase
    .from('leagues')
    .select()
    .eq('fpl_id', id)
    .limit(1)
    .single()

  if (!league) {
    res.status(500)
    return;
  }

  const insertTeamsResponse = await supabase.from('teams').insert(data.league_entries.map((entry => ({
    name: entry.entry_name,
    fpl_id: entry.id,
    entry_id: entry.entry_id,
    league_id: league.id,
    manager: 1
  }))))


  const { data: teams } = await supabase
    .from('teams')
    .select()
    .eq('league_id', league.id)

    if (!teams) {
      res.status(500)
      return;
    }

  const addedGW: { gameweek: number, league_id: number, id: number }[] = [];

  data.matches.forEach(async (matchData) => {
    let matchRecord = addedGW.find((m) => m.gameweek === matchData.event)
    if (!matchRecord) {
      const insertMatchResponse = await supabase.from('matches').insert({
        gameweek: matchData.event,
        league_id: league.id,
        status: matchData.finished ? 1 : 0
      })
      const { data: matchRow } = await supabase
        .from('matches')
        .select()
        .eq('gameweek', matchData.event)
        .eq('league_id', league.id)
        .limit(1)
        .single()
  
      addedGW.push(matchRow as { gameweek: number, league_id: number, id: number })
      matchRecord = matchRow as { gameweek: number, league_id: number, id: number }
    }

    const homeTeam = teams.find((t) => t.fpl_id === matchData.league_entry_1)
    if (!homeTeam) { return }
    const awayTeam = teams.find((t) => t.fpl_id === matchData.league_entry_2)
    if (!awayTeam) { return }

    let homeResult = await supabase.from('match_results').insert({
      match_id: matchRecord.id,
      team_id: homeTeam?.id,
      points: matchData.league_entry_1_points,
    }).select().single()

    if (homeResult.error) {
      homeResult = await supabase.from('match_results')
        .select()
        .eq('match_id', matchRecord.id)
        .eq('team_id', homeTeam.id)
        .limit(1)
        .single()
    }

    if (!homeResult.data) { return }

    let awayResult = await supabase.from('match_results').insert({
        match_id: matchRecord.id,
        team_id: awayTeam.id,
        points: matchData.league_entry_2_points,
        opponent_id: homeResult.data.id
      }).select().single()

    if (awayResult.error) {
      awayResult = await supabase.from('match_results')
        .select()
        .eq('match_id', matchRecord.id)
        .eq('team_id', awayTeam.id)
        .limit(1)
        .single()
    }
    if (!awayResult.data) { return }

    await supabase.from('match_results')
      .update({
        opponent_id: awayResult.data.id
      })
      .eq('match_id', matchRecord.id)
      .eq('team_id', homeTeam.id)
  })

  res.status(201).send(data.matches)
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data } = await supabase.from('leagues').select();
  res.status(200).send(data)
}

export default async function leagues(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await post(req, res);
  } else {
    await get(req, res);
  }
  res.status(405);
}