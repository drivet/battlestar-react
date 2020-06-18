import { InputDialogsProps } from "./InputDialogs";
import { InputId } from "./models/inputs";
import { getCharacter, SkillType } from "./models/game-data";
import firebase from "./firebase";
import React from "react";
import { makeResponse, SkillSelectionModal } from "./SkillSelectionModal";

export function InitialSkillSelection(props: InputDialogsProps) {

    function shouldShowInitialSkillSelection(): boolean {
        if (!props.player) {
            return false;
        }
        const g = props.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveInitialSkills;
        return r;
    }

    function getAvailableInitialSkills(): SkillType[] {
        if (!shouldShowInitialSkillSelection()) {
            return [];
        }
        const character = getCharacter(props.player.characterId);
        const skills = [];
        character.cardsDue.forEach(d => skills.push(...d.skills));
        return skills;
    }


    function handleInitialSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + props.gameId + '/responses')
            .push(makeResponse(InputId.ReceiveInitialSkills, selectedSkills));
    }

    function initialSkillSelection() {
        return (
            <SkillSelectionModal availableSkills={getAvailableInitialSkills()}
                                 count={3}
                                 doneCb={skills => handleInitialSkillSelection(skills)}/>
        );
    }

    return (
        <div>
            {shouldShowInitialSkillSelection() ? initialSkillSelection() : null}
        </div>
    );
}