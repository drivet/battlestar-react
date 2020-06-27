import React from "react";
import { SkillType } from "./models/game-data";
import Modal from 'react-modal';
import politics from './images/politics.png';
import tactics from './images/tactics.png';
import piloting from './images/piloting.png';
import engineering from './images/engineering.png';
import leadership from './images/leadership.png';
import { InputId, ReceiveInitialSkillsResponse, ReceiveSkillsResponse } from "./models/inputs";
import { myUserId } from "./App";
import { customModalStyles } from "./view";

interface SkillSelectionProps {
    show: boolean;
    availableSkills: SkillType[];
    count: number;
    doneCb: (skills: SkillType[]) => void;
}

interface SkillSelectionState {
    selectedSkills: SkillType[];
}

const skillImages = {
    [SkillType.Politics]: politics,
    [SkillType.Leadership]: leadership,
    [SkillType.Engineering]: engineering,
    [SkillType.Tactics]: tactics,
    [SkillType.Piloting]: piloting,
}

function skillImgElement(skillType: SkillType) {
    return (<img className={'w-full h-full'} src={skillImages[skillType]} alt={'skill type'}/>);
}

export function makeResponse(input: InputId, selectedSkills: SkillType[]): ReceiveInitialSkillsResponse | ReceiveSkillsResponse {
    return {
        userId: myUserId,
        inputId: input,
        skills: selectedSkills,
    }
}

export class SkillSelectionModal extends React.Component<SkillSelectionProps, SkillSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedSkills: []
        };
    }

    render() {
        return(
            <Modal isOpen={this.props.show} style={customModalStyles}>
                Select skill cards from the options on the left
                <div className={'flex mb-1'}>
                    <div>
                        {this.props.availableSkills.map(s => this.renderAvailSkill(s))}
                    </div>
                    <div>
                        {this.getSelectedSkills()
                            .map((s, i) => this.renderSelectedSkill(s, i))}
                    </div>
                </div>
                <div className={'flex justify-center'}>
                    <button className={'btn btn-std'} onClick={e => this.handleDone(e)}
                            disabled={this.state.selectedSkills.length < this.props.count}>
                        Done
                    </button>
                </div>
            </Modal>
        );
    }

    private getSelectedSkills(): SkillType[] {
        const blanks = Array(this.props.count - this.state.selectedSkills.length)
            .fill(undefined);
        return this.state.selectedSkills.concat(...blanks);
    }

    private handleDone(e) {
        this.props.doneCb(this.state.selectedSkills);
    }

    private renderAvailSkill(s: SkillType) {
        return (
            <div className={'w-40 h-10 p-1'} onClick={() => this.skillClick(s)}>
                {skillImgElement(s)}
            </div>
        );
    }

    private renderSelectedSkill(s: SkillType, index: number) {
        return (
            <div className={'flex align-center'} key={index}>
                <div className={'w-40 h-10 p-1'} onClick={() => this.skillClick(s)}>
                    {s !== undefined ? skillImgElement(s) : null}
                </div>
                {s !== undefined ? this.renderRemoveButton(index) : null}
            </div>
        );
    }

    private renderRemoveButton(index: number) {
        return (<a className={'btn btn-std'} href={'#'} onClick={e => {this.remove(e, index)}}>Remove</a>)
    }

    private remove(e: any, index: number) {
        e.preventDefault();
        const selected = [...this.state.selectedSkills];
        selected.splice(index, 1);
        this.setState({
           selectedSkills: selected
        });
    }

    private skillClick(skill: SkillType) {
        if (this.state.selectedSkills.length === this.props.count) {
            return;
        }
        this.setState({
            selectedSkills: this.state.selectedSkills.concat(skill)
        });
    }
}
