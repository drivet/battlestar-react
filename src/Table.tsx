import React from "react";
import firebase from "./firebase";
import { Redirect } from 'react-router-dom';

export interface Table {
    tableId: string;
    users: string[];
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
                return (
                    <div>
                        {this.state.table.users.map(u => (<div key={u}>{u}</div>))}
                        <button onClick={e => this.handleStart(e)}>Start</button>
                    </div>
                );
            } else {
                return (<Redirect to={'/games/' + this.state.table.gameId} />);
            }
        } else {
            return null;
        }
    }

    private handleStart(e) {
        e.preventDefault();
        const startGame = firebase.functions().httpsCallable('startGame');
        startGame({users: this.users(), tableId: this.tableId()}).then(result => {
            console.log('game started');
        }).catch(error => {
            console.log('error: ' + error.code + ', ' + error.message + ', ' + error.details);
        });
    }

    private users() {
        return this.state.table.users;
    }

    private tableId() {
        return this.state.table.tableId;
    }
}
