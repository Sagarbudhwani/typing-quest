import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Results from './pages/Results';
import BackgroundLayout from './components/BackgroundLayout';

export default function App() {
  return (
    <BrowserRouter>
      {/* The Layout wraps all pages to ensure consistent background */}
      <BackgroundLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BackgroundLayout>
    </BrowserRouter>
  );
}