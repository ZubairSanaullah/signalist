'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleWatchlistItem } from '@/lib/actions/watchlist.actions';

const WatchlistButton = ({
    symbol,
    company,
    isInWatchlist: initialIsInWatchlist,
    showTrashIcon = false,
    type = 'button',
    onWatchlistChange,
}: WatchlistButtonProps) => {
    const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            try {
                const result = await toggleWatchlistItem(symbol, company);
                setIsInWatchlist(result.added);
                onWatchlistChange?.(symbol, result.added);
                router.refresh();
            } catch (error) {
                console.error('Failed to toggle watchlist:', error);
            }
        });
    };

    if (type === 'icon') {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                disabled={isPending}
                className={cn(
                    'watchlist-icon-btn',
                    isInWatchlist && 'watchlist-icon-added'
                )}
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : showTrashIcon && isInWatchlist ? (
                    <Trash2 className="trash-icon" />
                ) : (
                    <Star className={cn('star-icon', isInWatchlist && 'fill-current')} />
                )}
            </Button>
        );
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            className={cn('watchlist-btn', isInWatchlist && 'watchlist-remove')}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <Star className={cn('h-4 w-4 mr-2', isInWatchlist && 'fill-current')} />
            )}
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Button>
    );
};

export default WatchlistButton;
