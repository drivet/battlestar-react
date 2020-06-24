import { PlayerData, SkillDeckCounts, SkillType } from "./models/game-data";
import CurrentPlayer from "./images/BSG_Current_Player.png";
import President from "./images/BSG_president.gif";
import Admiral from "./images/BSG_admiral.gif";
import { CharToken } from "./CharToken";
import React from "react";

export function renderPlayer(p: PlayerData, currentPlayer: PlayerData) {
    return (
        <div key={p.userId}>
            <div
                className={'grid grid-cols-8 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-2 m-2'}>
                <div className={'grid content-center px-1'}>
                    {p.userId === currentPlayer.userId ? <img src={CurrentPlayer}/> : null}
                </div>

                <div className={'grid content-center px-1'}>
                    {p.president ? <img src={President}/> : null}
                </div>

                <div className={'grid content-center px-1'}>
                    {p.admiral ? <img src={Admiral}/> : null}
                </div>

                <div className={'grid content-center px-1'}>
                    <CharToken characterId={p.characterId}/>
                </div>
                <div className={'col-span-4 grid content-center px-1'}>
                    {p.userId}
                </div>
            </div>
            {p.skillCounts ? skillCards(p.skillCounts): null}
            {p.quorumCount ? quorumCount(p.quorumCount) : null}
        </div>
    );
}

function skillCards(skillCounts: SkillDeckCounts) {
    return (<div>
        {Object.keys(skillCounts).map(s => skillCounts[s] ? skillCardLine(s, skillCounts[s]) : null)}
    </div>);
}

function quorumCount(count: number) {
    return(
        <div>
            <span>Quorum:</span>
            <span>{count}</span>
        </div>
    );
}

function skillCardLine(s: string, counts: number) {
    return (
        <div>
            <span>{s}:</span>
            <span>{counts}</span>
        </div>
    );
}