'use client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useRouter} from "next/navigation";
import {buttonVariants} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Star as StarIcon, Bell as BellIcon, Settings as SettingsIcon } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";

const UserDropdown = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
    if (!user) return null;
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-3 text-gray-400 hover:text-yellow-500")}>
                <Avatar className="w-8 h-8">
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                        {user.name?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>
                <span className='hidden md:flex flex-col items-start'>
                    <span className='text-base font-medium text-gray-400'>
                        {user.name}
                    </span>
                </span>
            </DropdownMenuTrigger>
                <DropdownMenuContent className='text-gray-400 w-auto min-w-[240px] max-w-[300px]'>
                    <DropdownMenuLabel className='flex w-full'>

                        <div className='flex relative items-center gap-3 py-2 w-full overflow-hidden'>
                            <Avatar className="w-10 h-10 shrink-0">
                                <AvatarImage src='https://github.com/shadcn.png' />
                                <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                                    {user.name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>

                            <div className='flex flex-col items-start overflow-hidden flex-1'>
                                <span className='text-base font-medium text-gray-400 truncate w-full text-left'>
                                    {user.name}
                                </span>
                                <span className='text-sm text-gray-500 truncate w-full text-left'>
                                    {user.email}
                                </span>
                            </div>
                        </div>

                    </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-gray-600' />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/watchlist')} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors duration-200 cursor-pointer'>
                        <StarIcon className='mr-2 h-4 w-4 hidden sm:block' />
                        Watchlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/alerts')} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors duration-200 cursor-pointer'>
                        <BellIcon className='mr-2 h-4 w-4 hidden sm:block' />
                        Alerts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors duration-200 cursor-pointer'>
                        <SettingsIcon className='mr-2 h-4 w-4 hidden sm:block' />
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className='bg-gray-600' />
                <DropdownMenuItem onClick={handleSignOut} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors duration-200 cursor-pointer'>
                    <LogOut className='mr-2 h-4 w-4 hidden sm:block' />
                    Log Out
                </DropdownMenuItem>
                <DropdownMenuSeparator className='hidden:sm:block bg-gray-600' />
                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown