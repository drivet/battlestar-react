import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { CreateTable } from "./CreateTable";
import { Tables } from "./Tables";
import { TableComponent } from './Table';

export function App() {
    return (
        <React.StrictMode>
            <Switch>
                <Route exact path='/tables' component={Tables}/>
                <Route exact path='/create' component={CreateTable}/>
                <Route path='/tables/:tableId' component={TableComponent}/>
            </Switch>
        </React.StrictMode>
    );
}
