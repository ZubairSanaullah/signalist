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
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";

const UserDropdown = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        router.push("/sign-in");
    };

    const user = {
        name: "John Doe",
        email: 'john.doe@example.com'
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-3 text-gray-400 hover:text-yellow-500")}>
                <Avatar className="w-8 h-8">
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                        {user.name[0]}
                    </AvatarFallback>
                </Avatar>
                <span className='hidden md:flex flex-col items-start'>
                    <span className='text-base font-medium text-gray-400'>
                        {user.name}
                    </span>
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='text-gray-400'>
                <DropdownMenuLabel className='flex'>

                    <div className='flex relative items-center gap-3 py-2'>
                        <Avatar className="w-10 h-10">
                            <AvatarImage src='https://github.com/shadcn.png' />
                            <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className='flex flex-col items-start'>
                            <span className='text-base font-medium text-gray-400'>
                                {user.name}
                            </span>
                            <span className='text-sm text-gray-500'>
                                {user.email}
                            </span>
                        </div>
                    </div>

                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-gray-600' />
                <DropdownMenuItem onClick={handleSignOut} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors duration-200 cursor-pointer'>
                    <LogOut className='mr-2 h-4 w-4 hidden sm:block' />
                    Log Out
                </DropdownMenuItem>
                <DropdownMenuSeparator className='hidden:sm:block bg-gray-600' />
                <nav className="sm:hidden">
                    <NavItems />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown