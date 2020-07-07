import { InputId } from "../models/inputs";
import { PlayerData, SkillType, ViewableGameData } from "../models/game-data";
import React from "react";
import { makeResponse } from "./SkillSelectionModal";
import { SkillTypeSelection } from "./SkillTypeSelection";
import { pushResponse } from "../firebase-game";

interface ConsolidatePowerProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function ConsolidatePowerSelection(props: ConsolidatePowerProps) {
    return (
        <SkillTypeSelection gameId={props.gameId}
                            available={getAvailableSkills()}
                            count={2}
                            doneCb={skills => handleSkillSelection(props.gameId, skills)}/>
    );
}

function getAvailableSkills(): SkillType[] {
    return [SkillType.Politics, SkillType.Piloting, SkillType.Engineering, SkillType.Tactics, SkillType.Leadership]
}

function handleSkillSelection(gameId: string, selectedSkills: SkillType[]) {
    pushResponse(gameId, makeResponse(InputId.ActionConsolidatePowerSkillSelect, selectedSkills));
}
