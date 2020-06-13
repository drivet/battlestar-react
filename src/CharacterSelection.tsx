import React from "react";
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
import { CharacterId } from "./models/game-data";
import firebase from "./firebase";
import { InputRequest, makeResponse } from "./models/inputs";

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
    show: boolean,
    gameId: string,
    request: InputRequest,
    selectableCharacters: CharacterId[],
}

interface CharacterSelectionState {
    displayedCharacter: number;
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

export class CharacterSelection extends React.Component<CharacterSelectionProps, CharacterSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            displayedCharacter: 0,
            open: props.show
        };
    }

    render() {
        return(
            <Modal isOpen={this.state.open} style={customStyles}>
                {charImgElement(this.currentCharacterId())}
                <div>
                    <button onClick={e => this.handlePrev(e)}>Previous</button>
                    <button onClick={e => this.handleSelect(e)}>Select</button>
                    <button onClick={e => this.handleNext(e)}>Next</button>
                </div>
            </Modal>
        );
    }

    private handleSelect(e) {
        firebase.database().ref('/games/' + this.props.gameId + '/responses')
            .push(makeResponse(this.props.request, this.props.selectableCharacters[this.state.displayedCharacter]));
        this.setState({
            open: false
        });
    }

    private handleNext(e) {
        this.setState({
            displayedCharacter: this.state.displayedCharacter === this.props.selectableCharacters.length -1 ?
                0 : this.state.displayedCharacter + 1
        });
    }

    private handlePrev(e) {
        this.setState({
            displayedCharacter: this.state.displayedCharacter === 0 ?
                this.props.selectableCharacters.length - 1 : this.state.displayedCharacter - 1
        });
    }

    private currentCharacterId(): CharacterId {
        return this.props.selectableCharacters[this.state.displayedCharacter];
    }
}

