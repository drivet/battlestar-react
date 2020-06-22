import React from "react";
import { SkillCard } from "./models/game-data";
import Modal from 'react-modal';
import { getSkillCardImage } from "./models/skills";
import './SkillCardSelectionModel.css';
import { customModalStyles } from "./view";

interface SkillCardSelectionProps {
    availableCards: SkillCard[];
    count: number;
    selectionCb: (skillCards: SkillCard[]) => void;
}

interface SkillCardSelectionState {
    selectedCards: number[];
    open: boolean;
}

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
            <Modal isOpen={this.state.open} style={customModalStyles}>
                <div className={'availableSkillCards'}>
                    {this.props.availableCards.map((s, i) => this.renderAvailCard(s, i))}
                </div>
                <div>
                    <button onClick={() => this.handleDone()}
                            disabled={this.state.selectedCards.length < this.props.count}>
                        Done
                    </button>
                </div>
            </Modal>
        );
    }

    private renderAvailCard(skillCard: SkillCard, index: number) {
        return (
            <div className={'cardWrapper ' + (this.isSelected(index) ? 'selected' : 'unselected')}
                 onClick={() => this.handleCardSelect(index)}>
                {skillCardImgElement(skillCard)}
            </div>
        );
    }

    private handleDone() {
        this.props.selectionCb(this.state.selectedCards.map(i => this.props.availableCards[i]));
    }

    private isSelected(index: number) {
        return this.state.selectedCards.indexOf(index) !== -1;
    }

    private handleCardSelect(index: number) {
        const selectedIndex = this.state.selectedCards.indexOf(index);
        const selected = [...this.state.selectedCards];

        if (selectedIndex !== -1) {
            // card is selected so unselect it
            selected.splice(selectedIndex, 1);
        } else {
            // card is not selected so select it
            if (selected.length === this.props.count) {
                // we're at the max, so remove one of the selected cards first
                selected.pop();
            }
            selected.splice(selectedIndex, 0, index);
        }

        this.setState({
            selectedCards: selected
        });
    }
}
