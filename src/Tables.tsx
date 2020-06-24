import React from "react";
import { Link } from 'react-router-dom'
import firebase from './firebase';
import { Table } from "./Table";


interface TableListState {
    tables: Table[];
}

export class Tables extends React.Component<any, TableListState> {
    constructor(props) {
        super(props);
        this.state = {
            tables: []
        }
    }

    componentDidMount() {
        const tableListRef = firebase.database().ref('tables');
        tableListRef.on('value', snapshot => {
            const tables = snapshot.val();
            const newState = [];
            for (let table in tables) {
                newState.push({
                    tableId: table,
                    users: tables[table].users
                });
            }
            this.setState({
                tables: newState
            });
        });
    }

    render() {
        return (
            <div>
                <Link to='/create'>Create new table</Link>
                <div className={'table'}>
                    <div className={'table-row'}>
                        <div className={'table-cell p-1'}>
                            Number of players
                        </div>
                        <div className={'table-cell p-1'}>
                            Delete?
                        </div>
                        <div className={'table-cell p-1'}>
                            Join?
                        </div>
                    </div>
                    {this.state.tables.map(table => this.tableRow(table))}
                </div>
            </div>
        );
    }

    private tableRow(table: Table) {
        return (
            <div key={table.tableId} className={'table-row'}>
                <div className={'table-cell p-1'}>
                    {table.users.length}
                </div>
                <div className={'table-cell p-1'}>
                    <button onClick={e => this.handleDelete(e, table.tableId)}>Delete</button>
                </div>
                <div className={'table-cell p-1'}>
                    <Link to={'/tables/' + table.tableId}>Join</Link>
                </div>
            </div>
        )
    }

    handleDelete(e, tableId: string) {
        const updates = {};
        updates['/tables/' + tableId] = null;

        firebase.database().ref().update(updates).then(() => {
            console.log('deleted!');
        });
    }
}
