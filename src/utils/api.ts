const headers = {
  'Content-Type': 'application/json',
};

export async function getLeagues() {
  const response = await fetch('/api/leagues', {
    headers,
    method: 'GET',
  });

  return response.json();
}

export async function createLeague(id: string) {
  const response = await fetch('/api/leagues', {
    headers,
    method: 'POST',
    body: JSON.stringify({ id })
  });

  return response.json();
}
