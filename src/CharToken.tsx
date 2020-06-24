import { CharacterId } from "./models/game-data";
import React from "react";
import { getTokenImage } from "./models/char-token-image";

interface CharTokenProps {
    characterId: CharacterId;
}

export function CharToken(props: CharTokenProps) {
    return (<img src={getTokenImage(props.characterId)} />);
}