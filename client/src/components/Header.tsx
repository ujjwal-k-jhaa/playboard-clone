import { Search, UserCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search channels or videos..." 
            className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.firstName || "User"} 
                    className="h-9 w-9 rounded-full object-cover border border-border"
                  />
                ) : (
                  <UserCircle className="h-9 w-9 text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="default" className="rounded-full px-6 font-semibold shadow-lg shadow-primary/25">
            <a href="/api/login">Log In</a>
          </Button>
        )}
      </div>
    </header>
  );
}
