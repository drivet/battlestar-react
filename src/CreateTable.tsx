import React from 'react';
import firebase from './firebase';
import { Redirect } from 'react-router';
import { Table } from "./Table";

interface CreateTableState {
    players: number;
    tableId: string;
}

export class CreateTable extends React.Component<any,CreateTableState> {
    constructor(props) {
        super(props);
        this.state = {
            players: 3,
            tableId: null
        }
    }

    render() {
        if (this.state.tableId) {
            const url = '/tables/' + this.state.tableId;
            return <Redirect to={url} />
        }
        return (
            <section className="add-game">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <label htmlFor="players">Number of players (between 3 and 6):</label>
                    <input type="number" name="players" placeholder="How many players?" min={"3"} max={"6"}
                           onChange={e => this.handleChange(e)} value={this.state.players}/>
                    <button>Create</button>
                </form>
            </section>
        )
    }

    handleChange(e) {
        this.setState({
            players: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const tableRef = firebase.database().ref('tables').push();
        const tableId = tableRef.key;
        const table = newTable(tableId, this.state.players);

        const updates = {};
        updates['/tables/' + tableId] = table;

        firebase.database().ref().update(updates).then(() => {
            this.setState({
                tableId: tableId
            });
        });
    }
}

function newTable(tableId: string, players: number): Table {
    const names: string[] = []
    for (let i = 0; i < players; i++) {
        names.push('player_'+i);
    }
    return {
        tableId: tableId,
        users: names
    }
}
