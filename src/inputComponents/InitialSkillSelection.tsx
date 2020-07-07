import { InputId } from "../models/inputs";
import { CharacterId, getCharacter, PlayerData, SkillType, ViewableGameData } from "../models/game-data";
import React from "react";
import { makeResponse, SkillTypeSelection } from "./SkillTypeSelection";
import { pushResponse } from "../firebase-game";

interface InitialSkillSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function InitialSkillSelection(props: InitialSkillSelectionProps) {
    return (
        <SkillTypeSelection gameId={props.gameId}
                            available={getAvailableInitialSkills(props.player.characterId)}
                            count={3}
                            doneCb={skills => handleInitialSkillSelection(props.gameId, skills)}/>
    );
}

function getAvailableInitialSkills(characterId: CharacterId): SkillType[] {
    const character = getCharacter(characterId);
    const skills = [];
    character.cardsDue.forEach(d => skills.push(...d.skills));
    return skills;
}

function handleInitialSkillSelection(gameId: string, selectedSkills: SkillType[]) {
    pushResponse(gameId, makeResponse(InputId.ReceiveInitialSkills, selectedSkills));
}
