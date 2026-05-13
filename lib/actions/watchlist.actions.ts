'use server';

import { connectToDatabase } from '@/database/mongoose';
import Watchlist from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function toggleWatchlistItem(
  symbol: string,
  company: string
): Promise<{ added: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Not authenticated');

  await connectToDatabase();
  const userId = session.user.id;

  const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });

  if (existing) {
    await Watchlist.deleteOne({ _id: existing._id });
    return { added: false };
  }

  await Watchlist.create({
    userId,
    symbol: symbol.toUpperCase(),
    company,
  });

  return { added: true };
}

export async function checkIsInWatchlist(symbol: string): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return false;

  await connectToDatabase();
  const item = await Watchlist.findOne({
    userId: session.user.id,
    symbol: symbol.toUpperCase(),
  });

  return !!item;
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return [];

  await connectToDatabase();
  const userId = session.user.id;

  const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(items));
}