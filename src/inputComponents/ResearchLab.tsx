import { InputId, InputResponse } from "../models/inputs";
import { PlayerData, SkillType, ViewableGameData } from "../models/game-data";
import React from "react";
import { SkillTypeSelection } from "./SkillTypeSelection";
import { pushResponse } from "../firebase-game";
import { myUserId } from "../App";

interface ResearchLabProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function makeResponse(input: InputId, selectedSkill: SkillType): InputResponse<SkillType> {
    return {
        userId: myUserId,
        inputId: input,
        data: selectedSkill,
    }
}

export function ResearchLab(props: ResearchLabProps) {
    return (
        <SkillTypeSelection gameId={props.gameId}
                            available={getAvailableSkills()}
                            count={1}
                            doneCb={skills => handleSkillSelection(props.gameId, skills)}/>
    );
}

function getAvailableSkills(): SkillType[] {
    return [SkillType.Engineering, SkillType.Tactics]
}

function handleSkillSelection(gameId: string, selectedSkills: SkillType[]) {
    pushResponse(gameId, makeResponse(InputId.ActionResearchLabSkillSelect, selectedSkills[0]));
}
