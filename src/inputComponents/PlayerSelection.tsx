import { getCharacter, PlayerData } from "../models/game-data";
import React, { Component } from "react";
import Modal from 'react-modal';
import { InputId, InputResponse } from "../models/inputs";
import { myUserId } from "../App";
import { customModalStyles } from "../view";
import { CharToken } from "../CharToken";

export type PlayerSelectedCb = (players: PlayerData[]) => void;

interface PlayerSelectionProps {
    available: PlayerData[],
    count: number,
    doneCb: PlayerSelectedCb;
}

interface PlayerSelectionState {
    selectedPlayers: PlayerData[];
    show: boolean;
    selected: boolean;
}

export function makeResponse(input: InputId, player: string): InputResponse<string> {
    return {
        userId: myUserId,
        inputId: input,
        data: player,
    }
}

export class PlayerSelection extends Component<PlayerSelectionProps, PlayerSelectionState> {
    state = {
        selectedPlayers: [],
        show: false,
        selected: false
    };

    render() {
        return (
            <div>
                {this.state.selected ? <div className={'my-1'}>Player(s) selected</div> :
                    <button className={'btn btn-std my-1'}
                            type="button" onClick={this.showModal}>Select player(s)</button>}
                {this.renderModal()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({show: true});
    };

    private handleDone() {
        this.props.doneCb(this.state.selectedPlayers);
        this.setState({
            show: false,
            selected: true
        });
    }

    private handleCancel() {
        this.setState({
            show: false
        });
    }

    private renderModal() {
        return (
            <Modal isOpen={this.state.show} style={customModalStyles}>
                <div className={'flex mb-2'}>
                    {this.props.available.map((s, i) => this.renderPlayer(s, i))}
                </div>
                <div className={"flex justify-center"}>
                    <button className={"btn btn-std mr-1"} onClick={() => this.handleDone()}
                            disabled={this.state.selectedPlayers.length < this.props.count}>
                        Done
                    </button>
                    <button className={'btn btn-std mr-1'} onClick={e => this.handleCancel()}>
                        Cancel
                    </button>
                </div>
            </Modal>
        );
    }

    private renderPlayer(player: PlayerData, index: number) {
        return (
            <div className={'w-40 p-1 ' + (this.isSelected(index) ? 'bg-green-500' : 'bg-white')}
                 onClick={() => this.handlePlayerSelect(index)}>
                <div className={"flex justify-center"}>
                    <CharToken characterId={player.characterId} />
                </div>
                <div className={"text-center"}>
                    {player.userId}
                </div>
                <div className={"text-center"}>
                    {getCharacter(player.characterId).name}
                </div>

            </div>
        );
    }

    private isSelected(index: number) {
        return this.state.selectedPlayers.indexOf(index) !== -1;
    }

    private handlePlayerSelect(index: number) {
        const selectedIndex = this.state.selectedPlayers.indexOf(index);
        const selected = [...this.state.selectedPlayers];

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
            selectedPlayers: selected
        });
    }
}
