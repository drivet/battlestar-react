import React from 'react';
import './Game.css';
import { Board } from "./Board";
import { Game, PlayerData } from "./models/game";
import firebase from "./firebase";

interface GameState {
    game: Game;
}

export class GameComponent extends React.Component<any, GameState> {
    constructor(props) {
        super(props);
        this.state = {
            game: null
        }
    }

    componentDidMount() {
        const gameRef = firebase.database().ref('games/' + this.props.match.params.gameId);
        gameRef.on('value', snapshot => {
            this.setState({
                game: new Game(snapshot.val())
            });
        });
    }

    render() {
        if (this.state.game) {
            return (
                <div className={'Game'}>
                    <div className={'leftCol'}>
                        <div>Players</div>
                        {this.state.game.gameData.players.map(p => this.player(p, this.state.game.currentPlayer()))}
                    </div>
                    <div className={'middleCol'}>
                        <Board game={this.state.game.gameData}/>
                    </div>
                    <div className={'rightCol'}>
                        <div>Vipers: {this.state.game.gameData.vipers}</div>
                        <div>Raptors: {this.state.game.gameData.raptors}</div>
                        <div>Civilian ships: {this.state.game.gameData.civilianShips.length}</div>
                        <div>Raiders: {this.state.game.gameData.raiders}</div>
                        <div>Heavy Raiders: {this.state.game.gameData.heavyRaiders}</div>
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
