import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_UPTIME_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const res = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `api_key=${apiKey}&format=json&response_times=1&custom_uptime_ratios=30`,
      next: { revalidate: 60 }
    });

    const data = await res.json();

    if (data.stat === 'ok' && data.monitors) {
      const formatted = {};
      let totalUptime = 0;
      let validMonitors = 0;

      data.monitors.forEach(m => {
        let key = m.friendly_name;
        if (key.includes('financial-parser')) key = 'Financial Parser';
        else if (key.includes('indian-legal')) key = 'Legal AI';
        else if (key.includes('citizen-safety')) key = 'Citizen Safety';
        else if (key.includes('ambuj-portfolio-v2')) key = 'Portfolio';

        const uptimeVal = parseFloat(m.custom_uptime_ratio);
        if (!isNaN(uptimeVal)) {
          totalUptime += uptimeVal;
          validMonitors++;
        }

        formatted[key] = {
          status: m.status === 2 ? 'Up' : 'Down',
          uptime: uptimeVal.toFixed(2),
          latency: m.response_times?.[0]?.value || '--'
        };
      });

      const avgUptime = validMonitors > 0 ? (totalUptime / validMonitors) : 99.7;
      return NextResponse.json({ services: formatted, average: avgUptime });
    }

    return NextResponse.json({ error: 'Invalid response from UptimeRobot' }, { status: 502 });
  } catch (error) {
    console.error('Uptime proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch uptime data' }, { status: 500 });
  }
}
