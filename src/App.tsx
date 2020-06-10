import React from 'react';
import { Switch, Route } from 'react-router-dom'
import { GameComponent } from "./Game";
import { CreateGame } from "./CreateGame";
import { GameList } from "./Games";

export function App() {
    return (
        <React.StrictMode>
            <Switch>
                <Route exact path='/games' component={GameList}/>
                <Route exact path='/create' component={CreateGame}/>
                <Route path='/games/:gameId' component={GameComponent}/>
            </Switch>
        </React.StrictMode>
    );
}
