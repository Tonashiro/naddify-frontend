import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || '';

  const encodedText = encodeURIComponent(text);
  const intentUrl = `https://x.com/intent/tweet?text=${encodedText}`;

  return NextResponse.redirect(intentUrl);
}
