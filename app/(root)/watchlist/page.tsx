import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { getQuote, getProfile } from "@/lib/actions/finnhub.actions";
import WatchlistCard from "@/components/WatchlistCard";
import { formatPrice, formatMarketCapValue } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon,PlusSignIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const WatchlistPage = async () => {
    const watchlistItems = await getWatchlist();

    if (watchlistItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-gray-700/50">
                    <HugeiconsIcon icon={StarIcon} size={40} className="text-gray-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-100 mb-3">Your Watchlist is Empty</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    Start tracking your favorite stocks by adding them to your watchlist. Use the search bar to find companies you're interested in.
                </p>
                <Link 
                    href="/" 
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/10 active:scale-95"
                >
                    <HugeiconsIcon icon={PlusSignIcon} size={20} />
                    Browse Stocks
                </Link>
            </div>
        );
    }

    // Fetch data for all items in the watchlist
    const watchlistWithData: StockWithData[] = await Promise.all(
        watchlistItems.map(async (item) => {
            const [quote, profile] = await Promise.all([
                getQuote(item.symbol),
                getProfile(item.symbol)
            ]);

            return {
                userId: item.userId,
                symbol: item.symbol,
                company: item.company || profile?.name || item.symbol,
                addedAt: item.addedAt,
                currentPrice: quote?.c,
                changePercent: quote?.dp,
                priceFormatted: quote ? formatPrice(quote.c) : undefined,
                changeFormatted: quote ? `${quote.dp > 0 ? '+' : ''}${quote.dp.toFixed(2)}%` : undefined,
                marketCap: profile?.marketCapitalization ? formatMarketCapValue(profile.marketCapitalization * 1e6) : 'N/A', // Finnhub market cap is in millions
                peRatio: 'N/A' // PE ratio would require another endpoint, skipping for now
            };
        })
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-100 mb-2 tracking-tight">Watchlist</h1>
                    <p className="text-gray-500 text-lg font-medium">Tracking {watchlistItems.length} companies</p>
                </div>
                <div className="h-1 w-20 bg-yellow-500 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {watchlistWithData.map((stock) => (
                    <WatchlistCard key={stock.symbol} stock={stock} />
                ))}
            </div>
        </div>
    );
};

export default WatchlistPage;
