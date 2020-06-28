import { GameState, PlayerData, ViewableGameData } from "./models/game-data";
import CurrentPlayer from "./images/BSG_Current_Player.png";
import President from "./images/BSG_president.gif";
import Admiral from "./images/BSG_admiral.gif";
import React from "react";
import skillBack from './images/skills/BSG_Skill_Back.png';
import loyaltyBack from './images/loyalty/BSG_Loyalty_Back.png';
import quorumBack from './images/quorum/BSG_Quorum_Back.png';
import nuke from './images/BSG_nuke1.gif';
import { IconInfo } from "./utils/IconInfo";
import { getTokenImage } from "./models/char-token-image";
import { Icon } from "./utils/Icon";

const playerColors = ['red-500', 'green-500', 'blue-500', 'purple-500', 'yellow-500', 'orange-500'];

export function getPlayerColor(game: ViewableGameData, player: PlayerData): string {
    return playerColors[game.players.indexOf(player)];
}

export function renderPlayer(game: ViewableGameData, p: PlayerData, currentPlayer: PlayerData) {
    const color = getPlayerColor(game, p);
    return (
        <div key={p.userId} className={'mb-8'}>
            <div className={'flex items-center bg-blue-100 border-t border-b border-blue-500 text-blue-700 py-2 mb-2'}>

                <IconInfo icon={getTokenImage(p.characterId)} text={p.userId} title={'Character'} className={"text-"+color}/>

                <div className={'flex-1'}/>

                <div className={'px-1'}>
                    {isCurrent(p, currentPlayer) ? <Icon icon={CurrentPlayer} title={'Current player'}/> : null}
                </div>

                <div className={'px-1'}>
                    {p.president ? <Icon icon={President} title={'President'}
                                         onClick={e => handlePresClick()}/> : null}
                </div>

                <div className={'px-1'}>
                    {p.admiral ? <Icon icon={Admiral} title={'Admiral'}
                                       onClick={e => handleAdmiralClick()}/> : null}
                </div>
            </div>
            {isCurrent(p, currentPlayer) ? phase(game) : null}
            {cards(game, p)}
        </div>
    );
}

function handlePresClick() {
    console.log('president');
}


function handleAdmiralClick() {
    console.log('admiral');
}

function isCurrent(player: PlayerData, currentPlayer: PlayerData): boolean {
    return player.userId === currentPlayer.userId;
}

function phase(game: ViewableGameData) {
    const state = stateString(game.state);
    return (
        <div>
            Phase: {state}
        </div>
    )
}

function stateString(state: GameState) {
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
    } else if (state === GameState.Action) {
        return 'Action selection';
    }
}

function cards(game: ViewableGameData, player: PlayerData) {

    const totalSkills = player.skillCounts ? Object.values(player.skillCounts)
        .reduce((a, c) => a + c): 0;
    return (
        <div className={'flex'}>
            <IconInfo icon={loyaltyBack} text={player.loyaltyCount} title={'Loyalty'} className={'mr-1'}/>
            <IconInfo icon={skillBack} text={totalSkills} title={'Skills'} className={'mr-1'}/>
            {player.president ? <IconInfo icon={quorumBack} text={player.quorumCount} title={'Quorum'} className={'mr-1'}/> : null}
            {player.admiral ? <IconInfo icon={nuke} text={game.nukes} title={'Nukes'} className={'mr-1'}/> : null}
        </div>
    )
}
