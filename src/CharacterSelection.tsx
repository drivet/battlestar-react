import React from "react";
import ReactModal from 'react-modal';
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
    selectableCharacters: CharacterId[],
    selectedCharacterCb: (selected: CharacterId) => void
}

interface CharacterSelectionState {
    displayedCharacter: number;
    open: boolean;
}

export class CharacterSelection extends React.Component<CharacterSelectionProps, CharacterSelectionState> {
    constructor(props) {
        super(props);
        this.state = {
            displayedCharacter: 0,
            open: true
        };
    }

    render() {
        return(
            <ReactModal isOpen={this.state.open}>
                {charImgElement(this.currentCharacterId())}
                <div>
                    <button onSelect={e => this.handleSelect(e)}>Select</button>
                    <button onClick={e => this.handleNext(e)}>Next</button>
                </div>
            </ReactModal>
        );
    }

    private handleSelect(e) {
        this.props.selectedCharacterCb(this.state.displayedCharacter);
        this.setState({
            open: false
        });
    }

    private handleNext(e) {
        this.setState({
            displayedCharacter: this.state.displayedCharacter + 1
        });
    }

    private currentCharacterId(): CharacterId {
        return this.props.selectableCharacters[this.state.displayedCharacter];
    }
}

