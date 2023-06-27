select 
  sum(er.points) as totalFplPoints,
  sum(er.resultPoints) as totalPoints
from (
  select
    mr.points,
    m.gameweek,
    mr.team_id team,
    CASE 
      WHEN mr.points > o.points THEN 3
      WHEN mr.points < o.points THEN 0
      ELSE 1
    END as resultPoints,
    CASE 
      WHEN mr.points > o.points THEN 'w'
      WHEN mr.points < o.points THEN 'l'
      ELSE 'd'
    END as result,
    o.team_id opponent
  from public.match_results as mr
  join public.matches as m on mr.match_id = m.id
  join public.match_results as o on o.id = mr.opponent_id
) as er -- Extended Results
GROUP BY er.team