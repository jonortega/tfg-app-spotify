import { Suspense } from "react";
import StatCard from "@/components/StatCard";
import StatWrapper from "@/components/StatWrapper";
import Loading from "@/components/Loading";

const stats: Array<{
  id: string;
  title: string;
  icon: keyof typeof import("lucide-react");
  className?: string;
}> = [
  { id: "hall-of-fame", title: "Hall of Fame", icon: "Award", className: "md:col-span-2 lg:col-span-2 lg:row-span-2" },
  { id: "huella-del-dia", title: "Huella Del Día", icon: "Fingerprint", className: "md:col-span-1 lg:col-span-2" },
  { id: "estaciones-musicales", title: "Estaciones Musicales", icon: "SunSnow" },
  { id: "tus-decadas", title: "Tus Décadas", icon: "Rewind" },
  { id: "listening-history", title: "Listening History", icon: "BarChart2", className: "md:col-span-2 lg:col-span-2" },
  { id: "indice-de-resonancia", title: "Índice de Resonancia", icon: "AudioWaveform" },
];

export default function Stats() {
  return (
    <main className='bg-spotify-black min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
          Your Spotify Stats
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              iconName={stat.icon}
              className={stat.className}
              statId={stat.id}
            />
          ))}
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <StatWrapper />
      </Suspense>
    </main>
  );
}
