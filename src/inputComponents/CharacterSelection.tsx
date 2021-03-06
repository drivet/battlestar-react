import React, { Component } from "react";
import Modal from 'react-modal';
import baltar from '../images/charactersheets/chars_baltar.jpg';
import billadama from '../images/charactersheets/chars_bill_adama.jpg';
import galentyrol from '../images/charactersheets/chars_galen_tyrol.jpg';
import karathrace from '../images/charactersheets/chars_kara_thrace.jpg';
import karlagathon from '../images/charactersheets/chars_karl_agathon.jpg';
import lauraroslin from '../images/charactersheets/chars_laura_roslin.jpg';
import leeadama from '../images/charactersheets/chars_lee_adama.jpg';
import saultigh from '../images/charactersheets/chars_saul_tigh.jpg';
import sharonvalaerii from '../images/charactersheets/chars_sharon_valerii.jpg';
import tomzarek from '../images/charactersheets/chars_tom_zarek.jpg';
import { CharacterId, PlayerData, ViewableGameData } from "../models/game-data";
import firebase from "../firebase";
import { InputId, InputRequest, InputResponse } from "../models/inputs";
import { myUserId } from "../App";
import { customModalStyles } from "../view";
import { CharacterPool } from "../models/character";

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
    return (<img src={charImages[character]} alt={'character'} className={'mb-1'}/>);
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

function makeResponse(selectedCharacter: CharacterId): InputResponse<CharacterId> {
    return {
        userId: myUserId,
        inputId: InputId.SelectCharacter,
        data: selectedCharacter
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
                <button className={'btn btn-std my-1'}
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
        const request = this.props.game.inputRequest as InputRequest<CharacterPool>;
        return request.ctx.selectable;
    }

    private renderModal() {
        return(
            <Modal isOpen={this.state.show} style={customModalStyles}>
                <h1 className={'text-xl mb-1'}>Please select your character</h1>
                {charImgElement(this.currentCharacterId())}
                <div className={'flex justify-center'}>
                    <button className={'btn btn-std mr-1'}
                            onClick={e => this.handlePrev(e)}>Previous</button>
                    <button className={'btn btn-std mr-1'}
                            onClick={e => this.handleSelect(e)}>Select</button>
                    <button className={'btn btn-std mr-1'}
                            onClick={e => this.handleNext(e)}>Next</button>
                    <button className={'btn btn-std mr-1'}
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
