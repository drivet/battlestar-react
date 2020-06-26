import { PlayerData, ViewableGameData } from "./models/game-data";
import CurrentPlayer from "./images/BSG_Current_Player.png";
import President from "./images/BSG_president.gif";
import Admiral from "./images/BSG_admiral.gif";
import { CharToken } from "./CharToken";
import React from "react";
import skillBack from './images/BSG_Skill_Back.png';
import loyaltyBack from './images/BSG_Loyalty_Back.png';
import quorumBack from './images/BSG_Quorum_Back.png';
import nuke from './images/BSG_nuke1.gif';

export function renderPlayer(game: ViewableGameData, p: PlayerData, currentPlayer: PlayerData) {
    return (
        <div key={p.userId} className={'mb-8'}>
            <div className={'flex items-center bg-blue-100 border-t border-b border-blue-500 text-blue-700 py-2 mb-2'}>
                <CharToken className={'h-8'} characterId={p.characterId}/>
                <div className={'px-1'}>
                    {p.userId}
                </div>

                <div className={'flex-1'}/>

                <div className={'px-1'}>
                    {p.userId === currentPlayer.userId ? <img  className={'h-8'} src={CurrentPlayer}/> : null}
                </div>

                <div className={'px-1'}>
                    {p.president ? <img className={'h-8'}  src={President}/> : null}
                </div>

                <div className={'px-1'}>
                    {p.admiral ? <img className={'h-8'} src={Admiral}/> : null}
                </div>
            </div>
            {cards(game, p)}
        </div>
    );
}

function cards(game: ViewableGameData, player: PlayerData) {
    const totalSkills = Object.values(player.skillCounts).reduce((a, c) => a + c);
    return (
        <div className={'flex'}>

            <div className={'flex mr-2 items-center'}>
                <img className={'h-10'} src={loyaltyBack} title={'Loyalty'}/>
                <div>{player.loyaltyCount}</div>
            </div>

            <div className={'flex mr-2 items-center'}>
                <img className={'h-10'} src={skillBack} title={'Skills'}/>
                <div>{totalSkills}</div>
            </div>

            {player.president ?
                (<div className={'flex mr-2 items-center'}>
                    <img className={'h-10'} src={quorumBack} title={'Quorum'}/>
                    <div>{player.quorumCount}</div>
                </div>) : null
            }
            {player.admiral ?
                (<div className={'flex mr-2 items-center'}>
                    <img className={'h-8'} src={nuke} title={'Nukes'}/>
                    <div>{game.nukes}</div>
                </div>) : null
            }
        </div>
    )
}
