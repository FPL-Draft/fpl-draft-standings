import React, { useState, useEffect } from 'react';
import { getLeagues, createLeague } from '@/utils/api';

export default function Leagues() {
  const [leagues, setLeagues] = useState<any>();
  const [created, setCreated] = useState<any>();

  useEffect(() => {
    async function fetchLeagues() {
      const leaguesData = await getLeagues();
      setLeagues(leaguesData);
    }

    fetchLeagues();
  }, []);

  const onCreateLeague = async () => {
    const response = await createLeague('39485')
    console.log(response)
    setCreated(response)
  }

  return (
    <>
      <pre>{JSON.stringify(leagues)}</pre>
      <button onClick={onCreateLeague}>CLICK ME!!!</button> 
      <pre>{JSON.stringify(created)}</pre>
    </>
  );
}
