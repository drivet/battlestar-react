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
import { CharacterSelectionRequest, CharacterSelectionResponse, InputId } from "./models/inputs";
import { myUserId } from "./App";
import { InputDialogsProps } from "./InputDialogs";

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
    selectable: CharacterId[];
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

function makeResponse(selectedCharacter: CharacterId): CharacterSelectionResponse {
    return {
        userId: myUserId,
        inputId: InputId.SelectCharacter,
        selectedCharacter: selectedCharacter
    }
}

export function CharacterSelection(props: InputDialogsProps) {
    function shouldShowCharacterSelection(): boolean {
        const g = props.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.SelectCharacter;
    }

    function characterSelection() {
        const characterSelectionRequest = props.game.inputRequest as CharacterSelectionRequest;
        return (
            <CharacterSelectionModal selectable={characterSelectionRequest.characterPool.selectable}
                                     gameId={props.gameId}/>
        );
    }

    return (
        <div>
            {shouldShowCharacterSelection() ? characterSelection() : null}
        </div>
    );
}

class CharacterSelectionModal extends React.Component<CharacterSelectionProps, CharacterSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            displayedCharacter: 0,
            open: true
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
            .push(makeResponse(this.props.selectable[this.state.displayedCharacter]));
        this.setState({
            open: false
        });
    }

    private handleNext(e) {
        this.setState({
            displayedCharacter: this.state.displayedCharacter === this.props.selectable.length -1 ?
                0 : this.state.displayedCharacter + 1
        });
    }

    private handlePrev(e) {
        this.setState({
            displayedCharacter: this.state.displayedCharacter === 0 ?
                this.props.selectable.length - 1 : this.state.displayedCharacter - 1
        });
    }

    private currentCharacterId(): CharacterId {
        return this.props.selectable[this.state.displayedCharacter];
    }
}
