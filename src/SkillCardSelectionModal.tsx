import React from "react";
import { SkillCard, SkillType } from "./models/game-data";
import Modal from 'react-modal';
import { getSkillCardImage } from "./models/skills";

interface SkillCardSelectionProps {
    availableCards: SkillCard[];
    count: number;
}

interface SkillCardSelectionState {
    selectedCards: SkillCard[];
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


function skillCardImgElement(skillCard: SkillCard) {
    return (<img className={'skillCard'} src={getSkillCardImage(skillCard)} alt={'skill card'}/>);
}

export class SkillCardSelectionModal extends React.Component<SkillCardSelectionProps, SkillCardSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedCards: [],
            open: true
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.open} style={customStyles}>
                <div className={'availableSkillCards'}>
                    {this.props.availableCards.map(s => this.renderAvailCard(s))}
                </div>
            </Modal>
        );
    }

    private renderAvailCard(skillCard: SkillCard) {
        return skillCardImgElement(skillCard);
    }
}
