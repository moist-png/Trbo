import { createContext } from 'react';

// Shared across App.jsx, PlannerView.jsx, and MiniGames.jsx so any component
// that draws a zone/phase colour can pick up Settings -> Visuals ->
// "Colour-blind friendly palette" without threading a settings prop through
// every chart, card, or row that happens to draw one.
export const ColorblindContext = createContext(false);
