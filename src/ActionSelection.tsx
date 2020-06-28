import React, { Component } from "react";
import { ActionId, PlayerData, ViewableGameData } from "./models/game-data";
import { ActionSelectionResponse, InputId } from "./models/inputs";
import { customModalStyles } from "./view";
import firebase from "./firebase";
import Modal from 'react-modal';
import { myUserId } from "./App";

interface ActionSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}
interface ActionSelectionState {
    selectedAction: number;
    show: boolean;
    selected: boolean;
}

function makeResponse(selectedAction: ActionId): ActionSelectionResponse {
    return {
        userId: myUserId,
        inputId: InputId.Action,
        selectedAction: selectedAction
    }
}

export class ActionSelection extends Component<ActionSelectionProps, ActionSelectionState> {
    state = {
        show: false,
        selectedAction: 0,
        selected: false
    };

    render() {
        if (!this.shouldShowActionSelection()) {
            return null;
        }
        return (
            <div>
                {this.state.selected ? <div className={'my-1'}>Action selected</div> :
                    <button className={'btn btn-std my-1'}
                            type="button" onClick={this.showModal}>Select Action</button>}
                {this.renderModal()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({show: true});
    };

    private shouldShowActionSelection(): boolean {
        const g = this.props.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.Action;
    }

    private renderModal() {
        return (
            <Modal isOpen={this.state.show} style={customModalStyles}>
                <h1 className={'text-xl mb-1'}>Please select your action</h1>
                <div>Hello!</div>
                <div className={'flex justify-center'}>
                    <button className={'btn btn-std mr-1'}
                            onClick={e => this.handleSelect(e)}>Select
                    </button>
                    <button className={'btn btn-std mr-1'}
                            onClick={e => this.handleCancel()}>Cancel
                    </button>
                </div>
            </Modal>
        );
    }

    private handleCancel() {
        this.setState({
            show: false
        });
    }

    private handleSelect(e) {
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(this.state.selectedAction));
        this.setState({
            show: false,
            selected: true
        })
    }
}

