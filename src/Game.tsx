import React from 'react';
import './Game.css';
import { Board } from "./Board";
import { CharacterId, PlayerData, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";
import { CharacterSelection } from "./CharacterSelection";
import { InputId } from "./models/inputs";
import { CharacterPool } from "./models/character";

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
        const gameRef = firebase.database().ref('games/' + this.gameId() + '/view');
        gameRef.on('value', snapshot => {
            this.setState({
                game: snapshot.val()
            });
        });
    }

    private gameId(): string {
        return this.props.match.params.gameId;
    }

    render() {
        if (!this.state.game) {
            return null;
        }

        const pool = new CharacterPool();
        const selectable = pool.selectable.map(c => c.id);
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
                <CharacterSelection show={this.shouldShowCharacterSelection()}
                                    selectableCharacters={selectable}
                                    request={this.request()}
                                    gameId={this.gameId()}>
                </CharacterSelection>
            </div>
        );
    }

    private handleCharacterSelection(selectable: CharacterId[], index: number) {
        console.log('selected char ' + selectable[index]);
    }

    private shouldShowCharacterSelection() {
        const g = this.state.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.SelectCharacter;
    }
    private request() {
        const g = this.state.game;
        return g ? g.inputRequest : null;
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
