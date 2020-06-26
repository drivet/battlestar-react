import { PlayerData, SkillDeckCounts, SkillType } from "./models/game-data";
import CurrentPlayer from "./images/BSG_Current_Player.png";
import President from "./images/BSG_president.gif";
import Admiral from "./images/BSG_admiral.gif";
import { CharToken } from "./CharToken";
import React from "react";
import skillBack from './images/BSG_Skill_Back.png';
import loyaltyBack from './images/BSG_Loyalty_Back.png'
import quorumBack from './images/BSG_Quorum_Back.png'

export function renderPlayer(p: PlayerData, currentPlayer: PlayerData) {
    return (
        <div key={p.userId}>
            <div className={'flex align-center bg-blue-100 border-t border-b border-blue-500 text-blue-700 py-2'}>
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
            {p.skillCounts ? skillCards(p.skillCounts): null}
            {p.quorumCount ? quorumCount(p.quorumCount) : null}
            {p.loyaltyCount ? loyaltyCount(p.loyaltyCount) : null}
        </div>
    );
}

function skillCards(skillCounts: SkillDeckCounts) {
    return (<div>
        {Object.keys(skillCounts).map(s => {
            let color;
            if (SkillType[s] === SkillType.Leadership) {
                color = 'bg-green-500';
            } else if (SkillType[s] === SkillType.Tactics) {
                color = 'bg-purple-500';
            } else if (SkillType[s] === SkillType.Politics) {
                color = 'bg-yellow-500';
            } else if (SkillType[s] === SkillType.Engineering) {
                color = 'bg-blue-500';
            } else if (SkillType[s] === SkillType.Piloting) {
                color = 'bg-red-500';
            }
            return skillCounts[s] ? cardLine(skillBack, s, skillCounts[s], color) : null
        })}
    </div>);
}

function quorumCount(count: number) {
    return cardLine(quorumBack, "Quorum", count);
}

function loyaltyCount(count: number) {
    return cardLine(loyaltyBack, "Loyalty", count);
}

function cardLine(i: any, s: string, counts: number, color?: string) {
    return (
        <div className={'flex items-center'}>
            <img className={'h-8'} src={i} />
            {color ? <div className={color}>{s}</div> : <div>{s}</div> }
            <div className={'flex-1'}/>
            <div>{counts}</div>
        </div>
    );
}