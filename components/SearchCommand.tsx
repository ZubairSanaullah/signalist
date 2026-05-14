"use client"

import { useEffect, useRef, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    SearchIcon, 
    StarIcon, 
    ChartBarIncreasingIcon, 
    Building01Icon, 
    GlobalIcon,
    LeftToRightListBulletIcon
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { toggleWatchlistItem } from "@/lib/actions/watchlist.actions";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen(v => !v)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    const handleSearch = async () => {
        if (!isSearchMode) return setStocks(initialStocks);

        setLoading(true)
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch {
            setStocks([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm]);

    // const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // useEffect(() => {
    //     if (debounceTimer.current) clearTimeout(debounceTimer.current);
    //     debounceTimer.current = setTimeout(() => {
    //         handleSearch();
    //     }, 300);
    //     return () => {
    //         if (debounceTimer.current) clearTimeout(debounceTimer.current);
    //     };
    // }, [searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
        setStocks(initialStocks);
    }

    const getStockIcon = (type: string) => {
        let icon = LeftToRightListBulletIcon;
        switch (type.toLowerCase()) {
            case 'common stock':
                icon = ChartBarIncreasingIcon;
                break;
            case 'etp':
            case 'etf':
                icon = GlobalIcon;
                break;
            case 'adr':
                icon = Building01Icon;
                break;
        }
        return <HugeiconsIcon icon={icon} size={18} variant="twotone" />;
    }

    return (
        <>
            {renderAs === 'text' ? (
                <span onClick={() => setOpen(true)} className="search-text">
                    {label}
                </span>
            ) : (
                <Button onClick={() => setOpen(true)} className="search-btn group">
                    <HugeiconsIcon icon={SearchIcon} size={18} />
                    <span className="flex-1 text-left">{label}</span>
                    <div className="search-k-badge">
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </Button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field flex items-center px-4">
                    <div className="text-gray-500 mr-3">
                        <HugeiconsIcon icon={SearchIcon} size={22} />
                    </div>
                    <CommandInput 
                        value={searchTerm} 
                        onValueChange={setSearchTerm} 
                        placeholder="Type a company or symbol..." 
                        className="search-input !h-16 flex-1 !pl-0" 
                    />
                    {loading && <Loader2 className="search-loader" />}
                </div>
                <CommandList className="search-list">
                    {loading ? (
                        <div className="search-list-empty">
                            <Loader2 className="h-8 w-8 text-yellow-500 animate-spin opacity-50" />
                            <p>Searching market data...</p>
                        </div>
                    ) : displayStocks?.length === 0 ? (
                        <div className="search-list-empty">
                            <HugeiconsIcon icon={SearchIcon} size={32} className="text-gray-600 mb-2" />
                            <p>{isSearchMode ? 'No results found' : 'No stocks available'}</p>
                        </div>
                    ) : (
                        <div className="pb-4">
                            <div className="search-count">
                                {isSearchMode ? 'Search results' : 'Popular stocks'}
                                {` `}({displayStocks?.length || 0})
                            </div>
                            <div className="flex flex-col">
                                {displayStocks?.map((stock) => (
                                    <div key={stock.symbol} className="search-item">
                                        <Link
                                            href={`/stocks/${stock.symbol}`}
                                            onClick={handleSelectStock}
                                            className="search-item-link"
                                        >
                                            <div className="search-item-icon">
                                                {getStockIcon(stock.type)}
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="search-item-name">{stock.name}</span>
                                                </div>
                                                <div className="search-item-meta">
                                                    <span className="search-item-symbol">{stock.symbol}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                    <span>{stock.exchange}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                    <span className="capitalize">{stock.type}</span>
                                                </div>
                                            </div>
                                            <button 
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    try {
                                                        const res = await toggleWatchlistItem(stock.symbol, stock.name);
                                                        setStocks(prev => prev.map(s => s.symbol === stock.symbol ? { ...s, isInWatchlist: res.added } : s));
                                                    } catch (error) {
                                                        console.error("Failed to toggle watchlist", error);
                                                    }
                                                }}
                                            >
                                                <HugeiconsIcon 
                                                    icon={StarIcon}
                                                    size={20} 
                                                    className={stock.isInWatchlist ? "text-yellow-500 fill-yellow-500" : "text-gray-600"} 
                                                />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                    }
                </CommandList>
            </CommandDialog>
        </>
    )
}
