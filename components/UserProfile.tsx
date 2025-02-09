import { cookies } from "next/headers";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { User } from "@/lib/types";

const DOMAIN_URL = process.env.DOMAIN_URL;

async function fetchUserProfile(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    if (!access_token) throw new Error("No access token");

    const response = await fetch(`${DOMAIN_URL}/api/home/user-profile`, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "force-cache", // Usa el cache de Next.js para evitar múltiples llamadas
      next: { revalidate: 3600 }, // Refresca los datos cada hora
    });

    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function UserProfile() {
  const user = await fetchUserProfile();

  if (!user) {
    return <div className='text-spotify-red text-center'>Error al cargar el perfil</div>;
  }

  return (
    <div className='flex items-center justify-center space-x-4 bg-spotify-gray-300 p-6 rounded-lg border-2 border-spotify-gray-200 max-w-fit mx-auto shadow-lg'>
      {user.imageUrl ? (
        <Image src={user.imageUrl} alt={user.name} width={80} height={80} className='rounded-full  mr-2' />
      ) : (
        <div className='w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center  mr-2'>
          <UserIcon className='text-spotify-black' size={40} />
        </div>
      )}
      <div>
        <h2 className='text-2xl font-bold text-spotify-white mb-1 truncate w-full'>{user.name}</h2>
        <p className='text-spotify-gray-100 truncate w-full'>{user.email}</p>
      </div>
    </div>
  );
}
