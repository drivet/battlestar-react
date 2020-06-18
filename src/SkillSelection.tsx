import React from "react";
import './SkillSelection.css';
import { getCharacter, SkillType } from "./models/game-data";
import Modal from 'react-modal';
import politics from './images/politics.png';
import tactics from './images/tactics.png';
import piloting from './images/piloting.png';
import engineering from './images/engineering.png';
import leadership from './images/leadership.png';
import { InputDialogsProps } from "./InputDialogs";
import { InputId, ReceiveInitialSkillsResponse, ReceiveSkillsResponse } from "./models/inputs";
import firebase from "./firebase";
import { myUserId } from "./App";

interface SkillSelectionProps {
    availableSkills: SkillType[];
    count: number;
    doneCb: (skills: SkillType[]) => void;
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

function makeResponse(input: InputId, selectedSkills: SkillType[]): ReceiveInitialSkillsResponse | ReceiveSkillsResponse {
    return {
        userId: myUserId,
        inputId: input,
        skills: selectedSkills,
    }
}

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

export class SkillSelectionModal extends React.Component<SkillSelectionProps, SkillSelectionState> {
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
        this.props.doneCb(this.state.selectedSkills);
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
            return;
        }
        this.setState({
            selectedSkills: this.state.selectedSkills.concat(skill)
        });
    }
}
