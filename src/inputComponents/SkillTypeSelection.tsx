import { SkillType } from "../models/game-data";
import React, { Component } from "react";
import { SkillTypeSelectionModal } from "./SkillTypeSelectionModal";
import { InputId, InputResponse } from "../models/inputs";
import { myUserId } from "../App";

export type SkillTypeSelectedCb = (skillTypes: SkillType[]) => void;

interface SkillTypeSelectionProps {
    gameId: string;
    available: SkillType[],
    count: number,
    doneCb: SkillTypeSelectedCb;
}

interface SkillTypeSelectionState {
    show: boolean;
    done: boolean;
}

export function makeResponse(input: InputId, selectedSkills: SkillType[]): InputResponse<SkillType[]> {
    return {
        userId: myUserId,
        inputId: input,
        data: selectedSkills,
    }
}

export class SkillTypeSelection extends Component<SkillTypeSelectionProps, SkillTypeSelectionState> {
    state = {
        show: false,
        done: false
    };

    render() {
        return (
            <div>
                {this.state.done ? <div className={'my-1'}>Skills selected</div> :
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1'}
                            type="button" onClick={this.showModal}>Select skills</button>}
                {this.skillSelection()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({show: true});
    };

    private handleSkillSelection(selectedSkills: SkillType[]) {
        this.props.doneCb(selectedSkills);
        this.setState({
            show: false,
            done: true
        });
    }

    private skillSelection() {
        return (
            <SkillTypeSelectionModal show={this.state.show}
                                     availableSkills={this.props.available}
                                     count={this.props.count}
                                     doneCb={s => this.handleSkillSelection(s)}/>
        );
    }
}
