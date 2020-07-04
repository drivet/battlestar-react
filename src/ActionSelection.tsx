import React, { Component } from "react";
import { ActionId, ViewableGameData } from "./models/game-data";
import { InputId, InputResponse } from "./models/inputs";
import { customModalStyles } from "./view";
import firebase from "./firebase";
import Modal from 'react-modal';
import { myUserId } from "./App";
import { getAvailableActions } from "./actions";
import { FullPlayer } from "../functions/src/game";

interface ActionSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: FullPlayer;
}
interface ActionSelectionState {
    selectedAction: ActionId;
    show: boolean;
    selected: boolean;
}

function makeResponse(selectedAction: ActionId): InputResponse<ActionId> {
    return {
        userId: myUserId,
        inputId: InputId.SelectAction,
        data: selectedAction
    }
}

export class ActionSelection extends Component<ActionSelectionProps, ActionSelectionState> {
    state = {
        show: false,
        selectedAction: ActionId.Nothing,
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
        if (!this.props.player) {
            return false;
        }
        const g = this.props.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.SelectAction;
    }

    private renderModal() {
        const availableActions = getAvailableActions(this.props.game, this.props.player);
        return (
            <Modal isOpen={this.state.show} style={customModalStyles}>
                <form>
                    <h1 className={'text-xl mb-1'}>Please select your action</h1>
                    {this.renderActionList('Miscellaneous', availableActions.miscActions)}
                    {this.renderActionList('Character', availableActions.characterActions)}
                    {this.renderActionList('Title', availableActions.titleActions)}
                    {this.renderActionList('Quorum', availableActions.quorumActions)}
                    {this.renderActionList('Location', availableActions.locationActions)}
                    {this.renderActionList('Skills', availableActions.skillActions)}
                    {this.renderActionList('Loyalty', availableActions.loyaltyActions)}
                    <div className={'flex justify-center'}>
                        <button className={'btn btn-std mr-1'}
                                onClick={e => this.handleSelect(e)}>Select
                        </button>
                        <button className={'btn btn-std mr-1'}
                                onClick={e => this.handleCancel()}>Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        );
    }

    private renderActionList(label: string, actions: ActionId[]) {
        return(
          <div className={'mb-4'}>
              <div className={'mb-2 border-b-2 border-gray-600'}>{label}</div>
              <div>
                {actions.map(a => this.renderAction(a))}
              </div>
          </div>
        );
    }

    private renderAction(action: ActionId) {
        const actionValue: string = ActionId[action];
        return (
            <div>
                <label>
                    <input type="radio" name="actions" value={actionValue}
                           checked={this.state.selectedAction === action}
                           className="mr-1" onChange={this.handleOptionChange}/>
                    {ActionId[action]}
                </label>
            </div>
        );
    }

    handleOptionChange = changeEvent => {
        const targetValue: string = changeEvent.target.value;
        const action: ActionId = ActionId[targetValue];
        this.setState({
            selectedAction: action
        });
    };

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

