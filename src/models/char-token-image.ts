import { CharacterId } from "./game-data";
import apollo from "../images/charactertokens/Player_Piece_Lee_Adama.png";
import starbuck from "../images/charactertokens/PlayerPiece_Starbuck.png";
import helo from "../images/charactertokens/PlayerPiece_Helo.png";
import adama from "../images/charactertokens/PlayerPiece_Bill_Adama.png";
import boomer from "../images/charactertokens/PlayerPiece_Boomer.png";
import baltar from "../images/charactertokens/PlayerPiece_Baltar.png";
import galen from "../images/charactertokens/PlayerPiece_Galen.png";
import tigh from "../images/charactertokens/PlayerPiece_Tigh.png";
import roslin from "../images/charactertokens/PlayerPiece_Laura_Roslin.png";
import zarek from "../images/charactertokens/PlayerPiece_Tom_Zarek.png";

export function getTokenImage(c: CharacterId) {
    if (c === CharacterId.LeeAdama) {
        return apollo;
    } else if (c === CharacterId.KaraThrace) {
        return starbuck;
    } else if (c === CharacterId.KarlAgathon) {
        return helo;
    } else if (c === CharacterId.WilliamAdama) {
        return adama;
    } else if (c === CharacterId.SharonValerii) {
        return boomer;
    } else if (c === CharacterId.GaiusBaltar) {
        return baltar;
    } else if (c === CharacterId.GalenTyrol) {
        return galen;
    } else if (c === CharacterId.SaulTigh) {
        return tigh;
    } else if (c === CharacterId.LauraRoslin) {
        return roslin;
    } else if (c === CharacterId.TomZarek) {
        return zarek;
    }
}