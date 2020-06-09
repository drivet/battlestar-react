import React from "react";
import { Link } from 'react-router-dom'
import firebase from './firebase';
import { GameEntry } from "./models/game";
import './Games.css'

interface IGameProps {
    game: any;
}

interface GameListState {
    games: GameEntry[];
}

export class GameList extends React.Component<IGameProps, GameListState> {
    constructor(props) {
        super(props);
        this.state = {
            games: []
        }
    }
    render() {
        return (
            <div>
                <Link to='/create'>Create new game</Link>
                <div className={'gameList'}>
                    <div className={'gameHeader'}>
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
                    {this.state.games.map(game => {
                        return (
                            <div key={game.gameId} className={'gameRow'}>
                                <div>
                                    {game.users}
                                </div>
                                <div>
                                    <button onClick={e => this.handleDelete(e, game.gameId)}>Delete</button>
                                </div>
                                <div>
                                    <Link to={'/games/' + game.gameId}>Join</Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    handleDelete(e, gameId: string) {
        const updates = {};
        updates['/games/' + gameId] = null;
        updates['/gameList/' + gameId] = null;

        firebase.database().ref().update(updates).then(() => {
            console.log('deleted!');
        });
    }

    componentDidMount() {
        const gameListRef = firebase.database().ref('gameList');
        gameListRef.on('value', snapshot => {
            const games = snapshot.val();
            const newState = [];
            for (let game in games) {
                newState.push({
                    gameId: game,
                    users: games[game].users
                });
            }
            this.setState({
                games: newState
            });
        });
    }
}
