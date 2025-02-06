import { Suspense } from "react";
import type { Metadata } from "next";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import TopGenres from "@/components/TopGenres";
import UserProfile from "@/components/UserProfile";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import UserProfileSkeleton from "@/components/skeletons/UserProfileSkeleton";
import TrackArtistSkeleton from "@/components/skeletons/TrackArtistSkeleton";
import GenreSkeleton from "@/components/skeletons/GenreSkeleton";
import TimeRangeSelector from "@/components/TimeRangeSelector";

export const metadata: Metadata = {
  title: "Home | Spotify Stats",
  description: "Bienvenido a tu Home de Spotify.",
};

interface HomeProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Home({ searchParams }: HomeProps) {
  const timeRange = Array.isArray(searchParams.time_range)
    ? searchParams.time_range[0] // Tomar solo el primer valor si es un array
    : searchParams.time_range || "short_term";

  return (
    <main className='min-h-screen relative'>
      <section className='bg-spotify-black'>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
            Tus Spotify Tops
          </h1>
          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile />
          </Suspense>
          {/* Agrupamos TimeRangeSelector con los Tops */}
          <div className='flex justify-center mt-8'>
            <TimeRangeSelector />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Suspense fallback={<TrackArtistSkeleton count={5} />}>
              <TopTracks timeRange={timeRange} />
            </Suspense>
            <Suspense fallback={<TrackArtistSkeleton count={5} />}>
              <TopArtists timeRange={timeRange} />
            </Suspense>
            <div className='md:col-span-2'>
              <Suspense fallback={<GenreSkeleton count={5} />}>
                <TopGenres timeRange={timeRange} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#0A0A0A]'>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
          <RecentlyPlayed />
        </div>
      </section>
    </main>
  );
}
