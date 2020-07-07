import React from 'react';
import { Board } from "./Board";
import { Banner } from "./Banner";
import { GameState, LocationId, SkillCard, ViewableGameData } from "./models/game-data";
import { myUserId } from "./App";
import { FullPlayer } from "../functions/src/game";
import { InputId, InputRequest, InputResponse } from "./models/inputs";
import { SkillCardSelectionModal } from "./inputComponents/SkillCardSelection";
import { requiresDiscard } from "./models/location";
import { gameViewOn, playerOn, pushResponse } from "./firebase-game";
import { renderPlayer } from "./Player";

import basestar from './images/BSG_basestar.gif';
import raider from './images/BSG_Raider.gif';
import heavyRaider from './images/BSG_HeavyRaider.gif';
import { CharacterSelection } from "./inputComponents/CharacterSelection";
import skillBack from './images/skills/BSG_Skill_Back.png';
import loyaltyBack from './images/loyalty/BSG_Loyalty_Back.png';
import quorumBack from './images/quorum/BSG_Quorum_Back.png';
import destinationBack from './images/BSG_Destination_Back.png';
import { MultiSkillSelection } from "./inputComponents/MultiSkillSelection";
import { InitialSkillSelection } from "./inputComponents/InitialSkillSelection";
import { ActionSelection } from "./inputComponents/ActionSelection";
import { IconInfo } from "./utils/IconInfo";
import { PlayerHand } from "./Hand";
import { Movement } from "../functions/src/locations";
import { wantsInput } from "./utils/inputs";
import { ConsolidatePowerSelection } from "./inputComponents/ConsolidatePower";
import { ResearchLab } from "./inputComponents/ResearchLab";
import { ArrestOrder } from "./inputComponents/ArrestOrder";
import { EncourageMutiny } from "./inputComponents/EncourageMutiny";
import nuke from "./images/BSG_nuke1.gif";

interface IGameState {
    game: ViewableGameData;
    player: FullPlayer;

    // move selection in progress
    moveSelection?: InputResponse<Movement>;
    moveMade?: boolean;

    // initial placement in progress
    setupDone?: boolean;
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

function makeSetupResponse(left: boolean): InputResponse<boolean> {
    return {
        userId: myUserId,
        inputId: InputId.SelectInitialLocation,
        data: left
    }
}

export class GameComponent extends React.Component<any, IGameState> {
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
            moveMade: false,
            setupDone: false
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
                    {this.phase()}
                    {this.renderGameState()}
                    {this.state.game.players.map(p => renderPlayer(this.state.game, p, currentPlayer))}
                </div>
                <div className={'col-span-8 grid justify-center'}>
                    <Board game={this.state.game}
                           locationSelect={this.isLocationSelectPhase() || this.isInitialSetupPhase()}
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
                    <div className={'mt-2'}>Nukes</div>
                    <div className={'flex'}>
                        <IconInfo icon={nuke} text={this.state.game.nukes} title={'Nukes'} className={'mr-1'}/>
                    </div>
                </div>
                {this.isMoveDiscardPhase() ? this.getSkillCardSelectionModal(cards => this.handleMoveDiscard(cards[0])) : null}
            </div>
        );
    }

    private isInitialSetupPhase(): boolean {
        return this.state.game?.inputRequest.inputId === InputId.SelectInitialLocation &&
            this.state.game?.inputRequest.userId === myUserId && !this.state.setupDone;
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
        if (this.isMovementPhase()) {
            return (this.state.game?.inputRequest as InputRequest<LocationId[]>).ctx;
        } else {
            return [LocationId.FrontBelow, LocationId.BackBelow];
        }
    }

    private getSkillCardSelectionModal(handler: (cards: SkillCard[]) => void) {
       return (<SkillCardSelectionModal availableCards={this.getSkillCards()} count={1} selectionCb={handler}/>);
    }

    private getSkillCards() {
        return this.state.player?.skillCards;
    }

    private handleLocationSelection(loc: LocationId) {
        if (this.isInitialSetupPhase()) {
            this.pushInitialResponse(makeSetupResponse(loc === LocationId.FrontBelow));
            return;
        }
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

    private pushInitialResponse(setupResponse: InputResponse<boolean>) {
        pushResponse(this.gameId(), setupResponse);
        this.setState({
            setupDone: true
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
                {this.isInitialSetupPhase() ? <div>Select initial location</div> : null}
                {this.wantsInput(InputId.SelectCharacter) ?
                    <CharacterSelection gameId={this.gameId()} game={this.state.game} player={this.state.player} /> : null}
                {this.wantsInput(InputId.ReceiveSkills) ?
                    <MultiSkillSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}
                {this.wantsInput(InputId.ReceiveInitialSkills) ?
                    <InitialSkillSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}
                {this.wantsInput(InputId.SelectAction) ?
                    <ActionSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}
                {this.wantsInput(InputId.ActionConsolidatePowerSkillSelect) ?
                    <ConsolidatePowerSelection gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}
                {this.wantsInput(InputId.ActionResearchLabSkillSelect) ?
                    <ResearchLab gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}
                {this.wantsInput(InputId.ActionArrestOrderPlayerSelect) ?
                    <ArrestOrder gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}
                {this.wantsInput(InputId.ActionEncourageMutinyPlayerSelect) ?
                    <EncourageMutiny gameId={this.gameId()} game={this.state.game} player={this.state.player}/>: null}

            </div>
        );
    }
    private wantsInput(inputId: InputId) {
        return wantsInput(this.state.game, this.state.player, inputId);
    }

    private phase() {
        return (
            <div>
                Turn phase: {this.stateString()}
            </div>
        )
    }

    private stateString() {
        const state = this.state.game.state;
        if (state === GameState.CharacterSelection) {
            return 'Character selection';
        } else if (state === GameState.CharacterSetup) {
            return 'Character setup';
        } else if (state === GameState.InitialSkillSelection) {
            return 'Initial skills selection';
        } else if (state === GameState.ReceiveSkills) {
            return 'Skill selection';
        } else if (state === GameState.Movement) {
            return 'Movement';
        } else if (state === GameState.ActionSelection) {
            return 'Action selection';
        }
    }
}
