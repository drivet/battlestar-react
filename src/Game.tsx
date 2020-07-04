import React from 'react';
import { Board } from "./Board";
import { Banner } from "./Banner";
import { LocationId, SkillCard, ViewableGameData } from "./models/game-data";
import { myUserId } from "./App";
import { FullPlayer } from "../functions/src/game";
import { InputId, InputRequest, InputResponse } from "./models/inputs";
import { SkillCardSelectionModal } from "./SkillCardSelectionModal";
import { requiresDiscard } from "./models/location";
import { gameViewOn, playerOn, pushResponse } from "./firebase-game";
import { renderPlayer } from "./Player";

import basestar from './images/BSG_basestar.gif';
import raider from './images/BSG_Raider.gif';
import heavyRaider from './images/BSG_HeavyRaider.gif';
import { CharacterSelection } from "./CharacterSelection";
import skillBack from './images/skills/BSG_Skill_Back.png';
import loyaltyBack from './images/loyalty/BSG_Loyalty_Back.png';
import quorumBack from './images/quorum/BSG_Quorum_Back.png';
import destinationBack from './images/BSG_Destination_Back.png';
import { SkillSelection } from "./SkillSelection";
import { InitialSkillSelection } from "./InitialSkillSelection";
import { ActionSelection } from "./ActionSelection";
import { IconInfo } from "./utils/IconInfo";
import { PlayerHand } from "./Hand";
import { Movement } from "../functions/src/locations";

interface GameState {
    game: ViewableGameData;
    player: FullPlayer;

    // move selection in progress
    moveSelection?: InputResponse<Movement>;
    moveMade?: boolean;
}

function makeMoveResponse(location: LocationId): InputResponse<Movement> {
    return {
        userId: myUserId,
        inputId: InputId.Movement,
        data: {
            location
        }
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
                <div className={'col-span-12'}>
                    <Banner game={this.state.game}/>
                </div>
                <div className={'col-span-2 px-2'}>
                    {this.renderHand()}
                    {this.renderGameState()}
                    {this.state.game.players.map(p => renderPlayer(this.state.game, p, currentPlayer))}
                </div>
                <div className={'col-span-8 grid justify-center'}>
                    <Board game={this.state.game}
                           locationSelect={this.isLocationSelectPhase()}
                           availableLocations={this.getAvailableLocations()}
                           locationSelectCb={loc => this.handleLocationSelection(loc)}/>
                </div>
                <div className={'col-span-2 p-2'}>
                    <div>Remaining Cards</div>
                    <div className={'flex'}>
                        <IconInfo icon={destinationBack} text={this.state.game.destinationDeck} title={'Destination'}/>
                        <IconInfo icon={loyaltyBack} text={this.state.game.loyaltyDeck} title={'Loyalty'} />
                        <IconInfo icon={quorumBack} text={this.state.game.quorumDeck} title={'Quorum'} />
                        <IconInfo icon={skillBack} text={this.state.game.destinyDeck} title={'Destiny'} />
                    </div>

                    <div className={'mt-2'}>Remaining Cylons</div>
                    <div className={'flex'}>
                        <IconInfo icon={raider} text={this.state.game.raiders} title={'Raiders'} className={'mr-4'} />
                        <IconInfo icon={heavyRaider} text={this.state.game.heavyRaiders} title={'Heavy Raiders'}  className={'mr-4'}/>
                        <IconInfo icon={basestar} text={this.state.game.basestars} title={'Basestars'}  className={'mr-4'} />
                    </div>
                </div>
                {this.isMoveDiscardPhase() ? this.getSkillCardSelectionModal(cards => this.handleMoveDiscard(cards[0])) : null}
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
        moveSelect.data.discardedSkill = skillCard;
        this.pushMoveResponse(moveSelect);
    }

    private getAvailableLocations(): LocationId[] {
        return (this.state.game?.inputRequest as InputRequest<LocationId[]>).ctx;
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

    private pushMoveResponse(moveResponse: InputResponse<Movement>) {
        pushResponse(this.gameId(), moveResponse);
        this.setState({
            moveSelection: null,
            moveMade: true
        })
    }

    private renderHand() {
        return (
            <PlayerHand player={this.state.player} />
        );
    }
    private renderGameState() {
        return (
            <div>
                <CharacterSelection gameId={this.gameId()} game={this.state.game} player={this.state.player} />
                <SkillSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>
                <InitialSkillSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>
                <ActionSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>
            </div>
        );
    }
}
