import React from "react";
import './SkillSelection.css';
import { SkillType } from "./models/game-data";
import Modal from 'react-modal';
import politics from './images/politics.png';
import tactics from './images/tactics.png';
import piloting from './images/piloting.png';
import engineering from './images/engineering.png';
import leadership from './images/leadership.png';
import firebase from "./firebase";
import { InputId, ReceiveInitialSkillsResponse } from "./models/inputs";
import { myUserId } from "./App";

interface SkillSelectionProps {
    availableSkills: SkillType[];
    count: number;
    gameId: string;

    // TODO find better way
    initial: boolean;
}

interface SkillSelectionState {
    selectedSkills: SkillType[];
    open: boolean;
}

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const skillImages = {
    [SkillType.Politics]: politics,
    [SkillType.Leadership]: leadership,
    [SkillType.Engineering]: engineering,
    [SkillType.Tactics]: tactics,
    [SkillType.Piloting]: piloting,
}

function skillImgElement(skillType: SkillType) {
    return (<img className={'skillImg'} src={skillImages[skillType]} alt={'skill type'}/>);
}

function makeResponse(initial: boolean, selectedSkills: SkillType[]): ReceiveInitialSkillsResponse {
    return {
        userId: myUserId,
        inputId: initial ? InputId.ReceiveInitialSkills: InputId.ReceiveSkills,
        skills: selectedSkills,
    }
}

export class SkillSelection extends React.Component<SkillSelectionProps, SkillSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedSkills: [],
            open: true
        };
    }

    render() {
        return(
            <Modal isOpen={this.state.open} style={customStyles}>
                Select skill cards from the options on the left
                <div className={'skillSelectionPanel'}>
                    <div className={'availableSkillList'}>
                        {this.props.availableSkills.map(s => this.renderAvailSkill(s))}
                    </div>
                    <div className={'selectedSkillList'}>
                        {this.getSelectedSkills()
                            .map((s, i) => this.renderSelectedSkill(s, i))}
                    </div>
                </div>
                <div>
                    <button onClick={e => this.handleDone(e)}
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
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(this.props.initial, this.state.selectedSkills));
        this.setState({
            open: false
        });
    }

    private renderAvailSkill(s: SkillType) {
        return (
            <div className={'availableSkillItem'} onClick={() => this.skillClick(s)}>
                {skillImgElement(s)}
            </div>
        );
    }

    private renderSelectedSkill(s: SkillType, index: number) {
        return (
            <div className={'selectedSkillRow'} key={index}>
                <div className={'selectedSkillItem'} onClick={() => this.skillClick(s)}>
                    {s !== undefined ? skillImgElement(s) : null}
                </div>
                {s !== undefined ? this.renderRemoveButton(index) : null}
            </div>
        );
    }

    private renderRemoveButton(index: number) {
        return (<a href={'#'} onClick={e => {this.remove(e, index)}}>Remove</a>)
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
            console.log('reached ' + this.props.count);
            return;
        }
        this.setState({
            selectedSkills: this.state.selectedSkills.concat(skill)
        });
    }
}
