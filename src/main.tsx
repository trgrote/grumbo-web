import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home/Home.tsx';
import { BrowserRouter, Routes, Route, Link } from "react-router";
import PaladinPage from './pages/paladin/PaladinPage.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import GloomStalkerPage from './pages/gloomstalker/GloomStalkerPage.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route path='/' element={<Home />} />
					<Route path='paladin' element={<PaladinPage />} />
					<Route path='gloomstalker' element={<GloomStalkerPage />} />
					<Route path='*' element={
						<div className="flex flex-col items-center justify-center gap-4 py-24">
							<h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
							<Link to="/" className="underline hover:text-neutral-100">Return Home</Link>
						</div>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
