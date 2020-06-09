import React from 'react';
import firebase from './firebase';
import { Game, GameData, GameEntry } from './models/game';
import { Redirect } from 'react-router';

interface CreateGameState {
    players: number;
    gameId: string;
}

export class CreateGame extends React.Component<any,CreateGameState> {
    constructor(props) {
        super(props);
        this.state = {
            players: 3,
            gameId: null
        }
    }

    render() {
        if (this.state.gameId) {
            const url = '/games/' + this.state.gameId;
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
        const gameRef = firebase.database().ref('games').push();
        const gameId = gameRef.key;
        const game = newGame(gameId, this.state.players);

        const updates = {};
        updates['/games/' + gameId] = game;
        updates['/gameList/' + gameId] = { gameId: gameId, users: game.players.length} as GameEntry;

        firebase.database().ref().update(updates).then(() => {
            this.setState({
                gameId: gameId
            });
        });
    }
}

function newGame(gameId: string, players: number): GameData {
    const names: string[] = []
    for (let i = 0; i < players; i++) {
        names.push(makeid(10));
    }

    return Game.newGame(gameId, names);
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}