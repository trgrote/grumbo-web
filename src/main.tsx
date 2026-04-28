import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home/Home.tsx';
import { BrowserRouter, Routes, Route } from "react-router";
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
					<Route path='*' element={<div>Invalid Route</div>} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
