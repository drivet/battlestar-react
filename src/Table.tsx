import React from "react";
import firebase from "./firebase";
import { GameComponent } from './Game';

export interface Table {
    tableId: string;
    users: string[];
    started: boolean;
    gameId?: string;
}

export interface TableState {
    table: Table;
}

export class TableComponent extends React.Component<any, TableState> {
    constructor(props) {
        super(props);
        this.state = {
            table: null
        }
    }

    componentDidMount() {
        const tableId = this.props.match.params.tableId;
        const tableRef = firebase.database().ref('tables/' + tableId);
        tableRef.on('value', snapshot => {
            this.setState({
                table: snapshot.val()
            });
        });
    }

    render() {
        if (this.state.table) {
            if (!this.state.table.gameId) {
                return (<button onClick={e => this.handleStart(e)}>Start</button>);
            }
            return (<GameComponent />)
        } else {
            return null;
        }
    }

    private handleStart(e) {
        e.preventDefault();
        const tableId = this.props.match.params.tableId;
        firebase.database().ref('/tables/' + tableId + '/started').set(true).then(() => {
            console.log('started!');
        });
    }
}
