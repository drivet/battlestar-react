import React from 'react';
import { Board } from "./Board";
import { LocationId, PlayerData, SkillCard, ViewableGameData } from "./models/game-data";
import { myUserId } from "./App";
import { FullPlayer } from "../functions/src/game";
import { InputDialogs } from "./InputDialogs";
import { InputId, MoveSelectionRequest, MoveSelectionResponse } from "./models/inputs";
import { SkillCardSelectionModal } from "./SkillCardSelectionModal";
import { requiresDiscard } from "./models/location";
import { gameViewOn, playerOn, pushResponse } from "./firebase-game";
import CurrentPlayer from "./images/BSG_Current_Player.png";
import { CharToken } from "./CharToken";
import President from './images/BSG_president.gif';
import Admiral from './images/BSG_admiral.gif';

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
        gameViewOn(this.gameId(),game => this.reset(game));

        playerOn(this.gameId(), player => {
            this.setState({
                player: player
            });
        });
    }

    private reset(game: ViewableGameData) {
        this.setState({
            game: game,
            moveMade: false
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
            <div className={'grid grid-cols-12'}>
                <div className={'col-span-2'}>
                    <div>Players</div>
                    {this.state.game.players.map(p => this.renderPlayer(p, currentPlayer))}
                </div>
                <div className={'col-span-8 grid justify-center'}>
                    <Board game={this.state.game}
                           locationSelect={this.isLocationSelectPhase()}
                           availableLocations={this.getAvailableLocations()}
                           locationSelectCb={loc => this.handleLocationSelection(loc)}/>
                </div>
                <div className={'col-span-2'}>
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

    private renderPlayer(p: PlayerData, currentPlayer: PlayerData) {
        return (
            <div key={p.userId}>
                <div className={'grid grid-cols-8 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-2 m-2'}>
                    <div className={'grid content-center px-1'}>
                        {p.userId === currentPlayer.userId ? <img src={CurrentPlayer} /> : null}
                    </div>

                    <div className={'grid content-center px-1'}>
                        {p.president ? <img src={President} /> : null}
                    </div>

                    <div className={'grid content-center px-1'}>
                        {p.admiral ? <img src={Admiral} /> : null}
                    </div>

                    <div className={'grid content-center px-1'}>
                        <CharToken characterId={p.characterId} />
                    </div>
                    <div className={'col-span-4 grid content-center px-1'}>
                        {p.userId}
                    </div>
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
        pushResponse(this.gameId(), moveResponse);
        this.setState({
            moveSelection: null,
            moveMade: true
        })
    }
}
