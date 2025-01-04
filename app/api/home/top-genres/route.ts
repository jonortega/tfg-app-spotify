import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/artists";
const LIMIT = 5; // Obtener los 5 tracks principales
const TIME_RANGE = "medium_term"; // Últimos 6 meses

interface Artist {
  id: string;
  name: string;
  genres: string[];
}

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  const access_token = authorizationHeader.split(" ")[1];
  console.log("Received access token:", access_token);

  if (!access_token) {
    console.error("No access token provided in cookies");
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  try {
    const response = await axios.get(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        limit: LIMIT,
        time_range: TIME_RANGE,
      },
    });

    const artists: Artist[] = response.data.items;

    // Create a map to count the occurrences of each genre
    const genreCount: Record<string, number> = {};

    // Iterate over artists and their genres, respecting the rules of importance
    artists.forEach((artist, artistIndex) => {
      artist.genres.forEach((genre, genreIndex) => {
        const weight = (artistIndex + 1) * 100 + genreIndex; // Weighted by artist and genre position
        genreCount[genre] = (genreCount[genre] || 0) + weight;
      });
    });

    // Sort genres by their count in descending order
    const sortedGenres = Object.entries(genreCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([name]) => name);

    // Select the top 5 genres and format the response
    const topGenres = sortedGenres.slice(0, 5).map((genre, index) => ({
      id: index + 1,
      name: genre,
    }));

    console.log("Top genres:", topGenres);

    return NextResponse.json(topGenres, { status: 200 });
  } catch (error) {
    console.error("Error fetching top genres:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
