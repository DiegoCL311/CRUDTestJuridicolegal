import { Settings, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"



export function LogoutButton() {
    const { logOut } = useAuth();


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => logOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
