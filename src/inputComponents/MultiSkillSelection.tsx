import { CharacterId, getCharacter, PlayerData, SkillType, ViewableGameData } from "../models/game-data";
import { InputId } from "../models/inputs";
import React from "react";
import { makeResponse } from "./SkillSelectionModal";
import { SkillTypeSelection } from "./SkillTypeSelection";
import { pushResponse } from "../firebase-game";

interface MultiSkillSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function MultiSkillSelection(props: MultiSkillSelectionProps) {
    const multiSkill = getMultiSkills(props.player.characterId);
    return (
        <SkillTypeSelection gameId={props.gameId}
                            available={multiSkill[1]}
                            count={multiSkill[0]}
                            doneCb={skills => handleSkillSelection(props.gameId, skills)}/>
    );
}

function getMultiSkills(characterId: CharacterId): [number, SkillType[]] {
    const character = getCharacter(characterId);
    const skills = [];
    let count = 0;
    character.cardsDue
        .filter(d => d.skills.length > 1)
        .forEach(d => {
            count += d.count;
            skills.push(...d.skills);
        });
    return [count, skills];
}

function handleSkillSelection(gameId: string, selectedSkills: SkillType[]) {
    pushResponse(gameId, makeResponse(InputId.ReceiveSkills, selectedSkills));
}
