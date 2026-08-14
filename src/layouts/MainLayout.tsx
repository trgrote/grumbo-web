import { Link, Outlet, useLocation } from "react-router";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function MainLayout() {
	const location = useLocation();
	return (
		<div className='dark min-w-auto min-h-screen bg-background text-neutral-300'>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link to='/' aria-current={location.pathname === '/' ? 'page' : undefined} className={location.pathname === '/' ? 'font-bold text-white' : ''}>Home</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link to='/paladin' aria-current={location.pathname === '/paladin' ? 'page' : undefined} className={location.pathname === '/paladin' ? 'font-bold text-white' : ''}>Paladin Attack</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link to='/gloomstalker' aria-current={location.pathname === '/gloomstalker' ? 'page' : undefined} className={location.pathname === '/gloomstalker' ? 'font-bold text-white' : ''}>Gloom-Stalker</Link>
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