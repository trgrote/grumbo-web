import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home/Home.tsx';
import { BrowserRouter, Routes, Route } from "react-router";
import Paladin from './pages/paladin/Paladin.tsx';
import NavBar from './NavBar.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='paladin' element={<Paladin />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
