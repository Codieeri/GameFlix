import { NextRequest, NextResponse } from 'next/server';

interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

interface SteamAppDetails {
  success: boolean;
  data?: {
    screenshots?: SteamScreenshot[];
    detailed_description?: string;
    short_description?: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appid: string }> }
) {
  const { appid } = await params;

  if (!appid || isNaN(Number(appid))) {
    return NextResponse.json({ error: 'Invalid app ID' }, { status: 400 });
  }

  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Gameflix-Browser/1.0',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ screenshots: [], fullDescription: '' }, { status: 200 });
    }

    const data: Record<string, SteamAppDetails> = await res.json();
    const appData = data[appid];

    if (!appData || !appData.success || !appData.data) {
      return NextResponse.json({ screenshots: [], fullDescription: '' }, { status: 200 });
    }

    const screenshots = (appData.data.screenshots || []).slice(0, 10).map((s) => ({
      id: s.id,
      path_thumbnail: s.path_thumbnail,
      path_full: s.path_full,
    }));

    let fullDescription = appData.data.detailed_description || '';
    fullDescription = fullDescription
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '');

    return NextResponse.json({ screenshots, fullDescription });
  } catch (error) {
    console.error('Steam API fetch error:', error);
    return NextResponse.json({ screenshots: [], fullDescription: '' }, { status: 200 });
  }
}