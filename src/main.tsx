import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from "react-router";
import Paladin from './pages/paladin/Paladin.tsx';
import NavBar from './NavBar.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path='/' element={<App />} />
				<Route path='/paladin' element={<Paladin />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
