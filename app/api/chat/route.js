import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const res = await fetch("https://agentic-rag-financial-parser.onrender.com/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": authHeader || ""
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy Chat Error:", error);
    return NextResponse.json({ detail: "Internal Proxy Error" }, { status: 500 });
  }
}
