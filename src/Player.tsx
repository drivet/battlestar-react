import { PlayerData, SkillDeckCounts } from "./models/game-data";
import CurrentPlayer from "./images/BSG_Current_Player.png";
import President from "./images/BSG_president.gif";
import Admiral from "./images/BSG_admiral.gif";
import { CharToken } from "./CharToken";
import React from "react";

export function renderPlayer(p: PlayerData, currentPlayer: PlayerData) {
    return (
        <div key={p.userId}>
            <div className={'flex align-center bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-2 m-2'}>
                <CharToken className={'h-6'} characterId={p.characterId}/>
                <div className={'px-1'}>
                    {p.userId}
                </div>

                <div className={'flex-1'}/>

                <div className={'px-1'}>
                    {p.userId === currentPlayer.userId ? <img  className={'h-6'} src={CurrentPlayer}/> : null}
                </div>

                <div className={'px-1'}>
                    {p.president ? <img className={'h-6'}  src={President}/> : null}
                </div>

                <div className={'px-1'}>
                    {p.admiral ? <img className={'h-6'} src={Admiral}/> : null}
                </div>
            </div>
            {p.skillCounts ? skillCards(p.skillCounts): null}
            {p.quorumCount ? quorumCount(p.quorumCount) : null}
            {p.loyaltyCount ? loyaltyCount(p.loyaltyCount) : null}
        </div>
    );
}

function skillCards(skillCounts: SkillDeckCounts) {
    return (<div>
        {Object.keys(skillCounts).map(s => skillCounts[s] ? cardLine(s, skillCounts[s]) : null)}
    </div>);
}

function quorumCount(count: number) {
    return cardLine("Quorum", count);
}

function loyaltyCount(count: number) {
    return cardLine("Loyalty", count);
}

function cardLine(s: string, counts: number) {
    return (
        <div>
            <span>{s}:</span>
            <span>{counts}</span>
        </div>
    );
}