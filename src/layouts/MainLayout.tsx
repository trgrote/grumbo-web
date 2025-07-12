import { Link, Outlet } from "react-router";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function MainLayout() {
	return (
		<div className='dark min-w-auto min-h-screen bg-background text-neutral-300'>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link to='/'>Home</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link to='/paladin'>Paladin Attack</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div className='min-w-full min-h-full px-0.5'>
				<Outlet />
			</div>
		</div>
	);
}