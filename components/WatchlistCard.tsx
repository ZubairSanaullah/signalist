'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ChartBarIncreasingIcon,
    ChartBarDecreasingIcon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import WatchlistButton from './WatchlistButton';
import { cn } from '@/lib/utils';

interface WatchlistCardProps {
    stock: StockWithData;
}

const WatchlistCard = ({ stock }: WatchlistCardProps) => {
    const isPositive = (stock.changePercent || 0) >= 0;

    return (
        <div className="group relative bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 transition-all duration-300 hover:bg-gray-800/60 hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/5 overflow-hidden">
            {/* Background Glow Effect */}
            <div className={cn(
                "absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-10 rounded-full transition-all duration-500 group-hover:opacity-20",
                isPositive ? "bg-green-500" : "bg-red-500"
            )} />

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs">
                            {stock.symbol}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-100 truncate max-w-[150px]" title={stock.company}>
                        {stock.company}
                    </h3>
                </div>
                <WatchlistButton
                    symbol={stock.symbol}
                    company={stock.company}
                    isInWatchlist={true}
                    type="icon"
                    showTrashIcon={true}
                />
            </div>

            <div className="flex items-end justify-between">
                <div className="flex flex-col">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Price</p>
                    <p className="text-2xl font-bold text-gray-100">
                        {stock.priceFormatted || `$${stock.currentPrice?.toFixed(2) || '0.00'}`}
                    </p>
                </div>
                
                <div className={cn(
                    "flex flex-col items-end px-3 py-1.5 rounded-xl border",
                    isPositive 
                        ? "bg-green-500/5 border-green-500/20 text-green-500" 
                        : "bg-red-500/5 border-red-500/20 text-red-500"
                )}>
                    <div className="flex items-center gap-1 font-bold">
                        <HugeiconsIcon 
                            icon={isPositive ? ChartBarIncreasingIcon : ChartBarDecreasingIcon} 
                            size={16} 
                        />
                        <span>{isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%</span>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-700/30 flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Market Cap</p>
                    <p className="text-sm font-semibold text-gray-300">{stock.marketCap || 'N/A'}</p>
                </div>
                
                <Link 
                    href={`/stocks/${stock.symbol}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors group/link"
                >
                    View Details
                    <HugeiconsIcon 
                        icon={ArrowRight01Icon} 
                        size={14} 
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                </Link>
            </div>
        </div>
    );
};

export default WatchlistCard;
