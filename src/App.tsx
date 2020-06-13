import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { CreateTable } from "./CreateTable";
import { Tables } from "./Tables";
import { TableComponent } from './Table';
import { GameComponent } from "./Game";

export function App() {
    return (
        <React.StrictMode>
            <Switch>
                <Route exact path='/tables' component={Tables}/>
                <Route exact path='/create' component={CreateTable}/>
                <Route path='/tables/:tableId' component={TableComponent}/>
                <Route path='/games/:gameId' component={GameComponent}/>
            </Switch>
        </React.StrictMode>
    );
}
