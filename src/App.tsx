import React from 'react';
import { Game } from "./Game";

const game = {
    g: 5
}
export function App() {
    return (
        <div className="App">
            <Game game={game}/>
        </div>
    );
}
