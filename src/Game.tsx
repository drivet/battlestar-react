import React from 'react';
import './Game.css';
import { Board } from "./Board";
import { PlayerData, TurnPhase, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";

interface GameState {
    game: ViewableGameData;
}

export class GameComponent extends React.Component<any, GameState> {
    constructor(props) {
        super(props);
        this.state = {
            game: null
        }
    }

    componentDidMount() {
        const gameId = this.props.match.params.gameId;
        const gameRef = firebase.database().ref('games/' + gameId + '/view');
        gameRef.on('value', snapshot => {
            this.setState({
                game: snapshot.val()
            });
        });
    }

    render() {
        if (this.state.game) {
            const currentPlayer = this.state.game.players[this.state.game.currentPlayer];
            return (
                <div className={'Game'}>
                    <div className={'leftCol'}>
                        <div>Players</div>
                        {this.state.game.players.map(p => this.player(p, currentPlayer))}
                    </div>
                    <div className={'middleCol'}>
                        <Board game={this.state.game}/>
                    </div>
                    <div className={'rightCol'}>
                        <div>Vipers: {this.state.game.vipers}</div>
                        <div>Raptors: {this.state.game.raptors}</div>
                        <div>Civilian ships: {this.state.game.civilianShips}</div>
                        <div>Raiders: {this.state.game.raiders}</div>
                        <div>Heavy Raiders: {this.state.game.heavyRaiders}</div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    private player(p: PlayerData, currentPlayer: PlayerData) {
        return (
            <div key={p.userId} className={'Player'}>
                <div>
                    {p.userId === currentPlayer.userId ? <span>=></span>: null}
                    {p.userId}
                </div>
            </div>
        );
    }
}
