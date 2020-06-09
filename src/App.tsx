import React from 'react';
import { Switch, Route } from 'react-router-dom'
import { Game } from "./Game";

function GameList(props) {
    return (<div>This is a game list</div>);
}

export function App() {
    return (
        <React.StrictMode>
            <Switch>
                <Route exact path='/games' component={GameList}/>
                <Route path='/games/:id' component={Game}/>
            </Switch>
        </React.StrictMode>
    );
}
