import React from 'react';
import './Game.css';
import { Board } from "./Board";
import { LocationId, PlayerData, SkillCard, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";
import { myUserId } from "./App";
import { FullPlayer } from "../functions/src/game";
import { InputDialogs } from "./InputDialogs";
import { InputId, MoveSelectionRequest, MoveSelectionResponse } from "./models/inputs";
import { SkillCardSelectionModal } from "./SkillCardSelectionModal";
import { requiresDiscard } from "./models/location";

interface GameState {
    game: ViewableGameData;
    player: FullPlayer;

    // move selection in progress
    moveSelection?: MoveSelectionResponse;
    moveMade?: boolean;
}

function makeMoveResponse(location: LocationId): MoveSelectionResponse {
    return {
        userId: myUserId,
        inputId: InputId.Movement,
        location: location
    }
}

export class GameComponent extends React.Component<any, GameState> {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            player: null,
        }
    }

    componentDidMount() {
        const gameRef = firebase.database().ref('games/' + this.gameId() + '/view');
        gameRef.on('value', snapshot => {
            this.setState({
                // probably should be moved to general reset routine
                moveMade: false,
                game: snapshot.val()
            });
        });

        const playerRef = firebase.database().ref('games/' + this.gameId() + '/players/' + myUserId);
        playerRef.on('value', snapshot => {
            this.setState({
                player: snapshot.val()
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

        const currentPlayer = this.state.game.players[this.state.game.currentPlayer];
        return (
            <div className={'Game'}>
                <div className={'leftCol'}>
                    <div>Players</div>
                    {this.state.game.players.map(p => this.player(p, currentPlayer))}
                </div>
                <div className={'middleCol'}>
                    <Board game={this.state.game}
                           locationSelect={this.isLocationSelectPhase()}
                           availableLocations={this.getAvailableLocations()}
                           locationSelectCb={loc => this.handleLocationSelection(loc)}/>
                </div>
                <div className={'rightCol'}>
                    <div>Vipers: {this.state.game.vipers}</div>
                    <div>Raptors: {this.state.game.raptors}</div>
                    <div>Civilian ships: {this.state.game.civilianShips}</div>
                    <div>Raiders: {this.state.game.raiders}</div>
                    <div>Heavy Raiders: {this.state.game.heavyRaiders}</div>
                </div>
                <InputDialogs gameId={this.gameId()} game={this.state.game} player={this.state.player}/>
                {this.isMoveDiscardPhase() ? this.getSkillCardSelectionModal(cards => this.handleMoveDiscard(cards[0])) : null}
            </div>
        );
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

    private isMovementPhase(): boolean {
        return this.state.game?.inputRequest.inputId === InputId.Movement &&
            this.state.game?.inputRequest.userId === myUserId && !this.state.moveMade;
    }
    private isLocationSelectPhase(): boolean {
        return this.isMovementPhase() && !this.state.moveSelection;
    }

    private isMoveDiscardPhase() {
        return this.isMovementPhase() && this.state.moveSelection;
    }

    private handleMoveDiscard(skillCard: SkillCard) {
        const moveSelect = this.state.moveSelection;
        moveSelect.discardedSkill = skillCard;
        this.pushMoveResponse(moveSelect);
    }

    private getAvailableLocations(): LocationId[] {
        return (this.state.game?.inputRequest as MoveSelectionRequest).availableLocations;
    }

    private getSkillCardSelectionModal(handler: (cards: SkillCard[]) => void) {
       return (<SkillCardSelectionModal availableCards={this.getSkillCards()} count={1} selectionCb={handler}/>);
    }

    private getSkillCards() {
        return this.state.player?.skillCards;
    }

    private handleLocationSelection(loc: LocationId) {
        const discard = requiresDiscard(loc, this.state.player);
        if (!discard) {
            this.pushMoveResponse(makeMoveResponse(loc));
        } else {
            const response = makeMoveResponse(loc);
            this.setState({
                moveSelection: response
            })
        }
    }

    private pushMoveResponse(moveResponse: MoveSelectionResponse) {
        firebase.database().ref('/games/' + this.gameId() + '/responses').push(moveResponse);
        this.setState({
            moveSelection: null,
            moveMade: true
        })
    }
}
