import React from "react";
import { Link } from 'react-router-dom'
import firebase from './firebase';
import './Tables.css'
import { Table, TableComponent } from "./Table";


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
        const tableListRef = firebase.database().ref('tableList');
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
                <div className={'tableList'}>
                    <div className={'tableHeader'}>
                        <div>
                            Number of players
                        </div>
                        <div>
                            Delete?
                        </div>
                        <div>
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
            <div key={table.tableId} className={'tableRow'}>
                <div>
                    {table.users}
                </div>
                <div>
                    <button onClick={e => this.handleDelete(e, table.tableId)}>Delete</button>
                </div>
                <div>
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
