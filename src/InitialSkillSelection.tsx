import { InputId } from "./models/inputs";
import { getCharacter, PlayerData, SkillType, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";
import React, { Component } from "react";
import { makeResponse, SkillSelectionModal } from "./SkillSelectionModal";

interface InitialSkillSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

interface InitialSkillSelectionState {
    show: boolean;
    done: boolean;
}

export class InitialSkillSelection extends Component<InitialSkillSelectionProps, InitialSkillSelectionState> {
    state = {
        show: false,
        done: false
    };

    render() {
        if (!this.shouldShowInitialSkillSelection()) {
            return null;
        }
        return (
            <div>
                {this.state.done ? <div className={'my-1'}>Initial skills selected</div> :
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1'}
                            type="button" onClick={this.showModal}>Select initial skills</button> }
                {this.initialSkillSelection()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({ show: true });
    };

    private shouldShowInitialSkillSelection(): boolean {
        if (!this.props.player) {
            return false;
        }
        const g = this.props.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveInitialSkills;
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

    private handleInitialSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(InputId.ReceiveInitialSkills, selectedSkills));
    }

    private initialSkillSelection() {
        return (
            <SkillSelectionModal show={this.state.show}
                                 availableSkills={this.getAvailableInitialSkills()}
                                 count={3}
                                 doneCb={skills => this.handleInitialSkillSelection(skills)}/>
        );
    }
}
