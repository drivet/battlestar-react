import { InputDialogsProps } from "./InputDialogs";
import { getCharacter, SkillType } from "./models/game-data";
import firebase from "./firebase";
import { InputId } from "./models/inputs";
import React from "react";
import { makeResponse, SkillSelectionModal } from "./SkillSelectionModal";

export function SkillSelection(props: InputDialogsProps) {
    function skillSelection() {
        const multiSkills = getMultiSkills();
        const count = multiSkills[0];
        const skills = multiSkills[1];
        return (
            <SkillSelectionModal availableSkills={skills}
                                 count={count}
                                 doneCb={skills => handleSkillSelection(skills)}/>
        );
    }

    function handleSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + props.gameId + '/responses')
            .push(makeResponse(InputId.ReceiveSkills, selectedSkills));
    }

    function shouldShowSkillSelection(): boolean {
        if (!props.player) {
            return false;
        }
        const g = props.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveSkills;
        return r;
    }

    function getMultiSkills(): [number, SkillType[]] {
        if (!shouldShowSkillSelection()) {
            return [0, []];
        }
        const character = getCharacter(props.player.characterId);
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

    return (
        <div>
            {shouldShowSkillSelection() ? skillSelection() : null}
        </div>
    );
}