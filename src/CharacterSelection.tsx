import React, { Component } from "react";
import Modal from 'react-modal';
import baltar from './images/chars_baltar.jpg';
import billadama from './images/chars_bill_adama.jpg';
import galentyrol from './images/chars_galen_tyrol.jpg';
import karathrace from './images/chars_kara_thrace.jpg';
import karlagathon from './images/chars_karl_agathon.jpg';
import lauraroslin from './images/chars_laura_roslin.jpg';
import leeadama from './images/chars_lee_adama.jpg';
import saultigh from './images/chars_saul_tigh.jpg';
import sharonvalaerii from './images/chars_sharon_valerii.jpg';
import tomzarek from './images/chars_tom_zarek.jpg';
import { CharacterId, PlayerData, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";
import { CharacterSelectionRequest, CharacterSelectionResponse, InputId } from "./models/inputs";
import { myUserId } from "./App";
import { customModalStyles } from "./view";

const charImages = {
    [CharacterId.KarlAgathon]: karlagathon,
    [CharacterId.SaulTigh]: saultigh,
    [CharacterId.WilliamAdama]: billadama,
    [CharacterId.TomZarek]: tomzarek,
    [CharacterId.GaiusBaltar]: baltar,
    [CharacterId.GalenTyrol]: galentyrol,
    [CharacterId.KaraThrace]: karathrace,
    [CharacterId.LauraRoslin]: lauraroslin,
    [CharacterId.LeeAdama]: leeadama,
    [CharacterId.SharonValerii]: sharonvalaerii
}

function charImgElement(character: CharacterId) {
    return (<img src={charImages[character]} alt={'character'}/>);
}

interface CharacterSelectionProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

interface CharacterSelectionState {
    displayedCharacter: number;
    show: boolean;
    selected: boolean;
}

function makeResponse(selectedCharacter: CharacterId): CharacterSelectionResponse {
    return {
        userId: myUserId,
        inputId: InputId.SelectCharacter,
        selectedCharacter: selectedCharacter
    }
}

export class CharacterSelection extends Component<CharacterSelectionProps, CharacterSelectionState> {
    state = {
        show: false,
        displayedCharacter: 0,
        selected: false
    };

    render() {
        if (!this.shouldShowCharacterSelection()) {
            return null;
        }
        return (
            <div>
                {this.state.selected ? <div className={'my-1'}>Character selected</div> :
                <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1'}
                        type="button" onClick={this.showModal}>Select Character</button> }
                {this.renderModal()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({ show: true });
    };

    private shouldShowCharacterSelection(): boolean {
        const g = this.props.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.SelectCharacter;
    }

    private selectable() {
        const request = this.props.game.inputRequest as CharacterSelectionRequest;
        return request.characterPool.selectable;
    }

    private renderModal() {
        return(
            <Modal isOpen={this.state.show} style={customModalStyles}>
                {charImgElement(this.currentCharacterId())}
                <div>
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1 mr-1'}
                            onClick={e => this.handlePrev(e)}>Previous</button>
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1 mr-1'}
                            onClick={e => this.handleSelect(e)}>Select</button>
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1 mr-1'}
                            onClick={e => this.handleNext(e)}>Next</button>
                    <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded my-1 mr-1'}
                            onClick={e => this.handleCancel()}>Cancel</button>
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
        const selectable = this.selectable();
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(selectable[this.state.displayedCharacter]));
        this.setState({
            show: false,
            selected: true
        })
    }

    private handleNext(e) {
        const selectable = this.selectable();
        this.setState({
            displayedCharacter: this.state.displayedCharacter === selectable.length -1 ?
                0 : this.state.displayedCharacter + 1
        });
    }

    private handlePrev(e) {
        const selectable = this.selectable();
        this.setState({
            displayedCharacter: this.state.displayedCharacter === 0 ?
                selectable.length - 1 : this.state.displayedCharacter - 1
        });
    }

    private currentCharacterId(): CharacterId {
        const selectable = this.selectable();
        return selectable[this.state.displayedCharacter];
    }
}
