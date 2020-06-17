import React from "react";
import { getCharacter, SkillType, ViewableGameData } from "./models/game-data";
import { FullPlayer } from "../functions/src/game";
import { CharacterSelection } from "./CharacterSelection";
import {
    CharacterSelectionRequest,
    InputId,
    ReceiveInitialSkillsResponse,
    ReceiveSkillsResponse
} from "./models/inputs";
import { SkillSelection } from "./SkillSelection";
import firebase from "./firebase";
import { myUserId } from "./App";

interface InputDialogsProps {
    gameId: string;
    game: ViewableGameData;
    player: FullPlayer;
}

function makeResponse(input: InputId, selectedSkills: SkillType[]): ReceiveInitialSkillsResponse | ReceiveSkillsResponse {
    return {
        userId: myUserId,
        inputId: input,
        skills: selectedSkills,
    }
}

export class InputDialogs extends React.Component<InputDialogsProps, any> {
    render() {
        return (
            <div>
                {this.shouldShowCharacterSelection() ? this.characterSelection() : null}
                {this.shouldShowInitialSkillSelection() ? this.initialSkillSelection() : null}
                {this.shouldShowSkillSelection() ? this.skillSelection() : null}
            </div>
        );
    }

    private request() {
        const g = this.props.game;
        return g ? g.inputRequest : null;
    }

    private characterSelection() {
        return (
            <CharacterSelection request={this.request() as CharacterSelectionRequest}
                                gameId={this.props.gameId}/>
        );
    }

    private initialSkillSelection() {
        return (
            <SkillSelection availableSkills={this.getAvailableInitialSkills()}
                            count={3}
                            doneCb={skills => this.handleInitialSkillSelection(skills)}/>
        );
    }

    private skillSelection() {
        const multiSkills = this.getMultiSkills();
        const count = multiSkills[0];
        const skills = multiSkills[1];
        return (
            <SkillSelection availableSkills={skills}
                            count={count}
                            doneCb={skills => this.handleSkillSelection(skills)}/>
        );
    }

    private handleInitialSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(InputId.ReceiveInitialSkills, selectedSkills));
    }

    private handleSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(InputId.ReceiveSkills, selectedSkills));
    }

    private shouldShowCharacterSelection(): boolean {
        const g = this.props.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.SelectCharacter;
    }

    private shouldShowInitialSkillSelection(): boolean {
        if (!this.props.player) {
            return false;
        }
        const g = this.props.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveInitialSkills;
        return r;
    }

    private shouldShowSkillSelection(): boolean {
        if (!this.props.player) {
            return false;
        }
        const g = this.props.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveSkills;
        return r;
    }

    private getAvailableInitialSkills(): SkillType[] {
        if (!this.shouldShowInitialSkillSelection()) {
            return [];
        }
        const character = getCharacter(this.props.player.characterId);
        const skills = [];
        character.cardsDue.forEach(d => skills.push(...d.skills));
        return skills;
    }

    private getMultiSkills(): [number, SkillType[]] {
        if (!this.shouldShowSkillSelection()) {
            return [0, []];
        }
        const character = getCharacter(this.props.player.characterId);
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
}
