import { NextResponse } from 'next/server';
import { GameWeekStatus } from '@/interfaces/match';

async function fetchData(): Promise<{
  status: GameWeekStatus[];
  leagues: string;
}> {
  try {
    const res = await fetch(
      'https://draft.premierleague.com/api/pl/event-status',
      {
        next: {
          revalidate: 3600, // 1 hour
        },
      },
    );
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const GET = async (req: Request, res: Response) => {
  try {
    const { status } = await fetchData();

    const currentGameweekStatus = status[0];

    return NextResponse.json(currentGameweekStatus);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
