import { getCharacter, PlayerData, SkillType, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";
import { InputId } from "./models/inputs";
import React, { Component } from "react";
import { makeResponse, SkillSelectionModal } from "./SkillSelectionModal";

interface SkillSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

interface SkillSelectionState {
    show: boolean;
    done: boolean;
}

export class SkillSelection extends Component<SkillSelectionProps, SkillSelectionState> {
    state = {
        show: false,
        done: false
    };

    render() {
        if (!this.shouldShowSkillSelection()) {
            return null;
        }
        return (
            <div>
                {this.state.done ? <div className={'my-1'}>Skills selected</div> :
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1'}
                            type="button" onClick={this.showModal}>Select Skills</button> }
                {this.skillSelection()}
            </div>
        );
    }

    private skillSelection() {
        const multiSkills = this.getMultiSkills();
        const count = multiSkills[0];
        const skills = multiSkills[1];
        return (
            <SkillSelectionModal show={this.state.show}
                                 availableSkills={skills}
                                 count={count}
                                 doneCb={skills => this.handleSkillSelection(skills)}/>
        );
    }

    private showModal = () => {
        this.setState({ show: true });
    };

    private shouldShowSkillSelection(): boolean {
        if (!this.props.player) {
            return false;
        }
        const g = this.props.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveSkills;
        return r;
    }

    private handleSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(InputId.ReceiveSkills, selectedSkills));
        this.setState({
            show: false,
            done: true
        });
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
