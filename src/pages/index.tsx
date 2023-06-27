import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import HeaderSection from '@/components/header';
import StandingsTable from '@/components/standingsTable';
import Leagues from '@/components/leagues';

export default function Home() {
  return (
    <>
      <Head>
        <title>Salty Spur Draft Standings</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <Leagues />
        <HeaderSection />
        <StandingsTable />
      </main>
    </>
  );
}
