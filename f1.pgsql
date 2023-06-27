 
with weeklyRanks as (
  select
    mr.team_id team,
    mr.match_id,
    mr.points as fplPoints,
    row_number() over (partition by mr.match_id order by mr.points desc) wr
  from public.match_results as mr
),
weeklyRankPoints as (
  select
    *,
    case
      when wr = 1 then 12
      when wr = 2 then 9
      when wr = 3 then 7
      when wr = 4 then 5
      when wr = 5 then 4
      when wr = 6 then 3
      when wr = 7 then 2
      else 0
    end points
  from weeklyRanks
)
select 
  sum(points) tp,
  sum(fplPoints) fplTP,
  t.name
from weeklyRankPoints as wrp
join public.teams t on t.id = wrp.team
group by wrp.team, t.name, t.id
order by tp desc