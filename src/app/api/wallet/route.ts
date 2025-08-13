import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body to get the wallet_address
    const { wallet_address }: { wallet_address: string } = await req.json();

    if (!wallet_address) {
      return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ wallet_address }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error submitting wallet address:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
