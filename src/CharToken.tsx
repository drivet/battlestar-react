import { CharacterId } from "./models/game-data";
import React from "react";
import { getTokenImage } from "./models/char-token-image";

interface CharTokenProps {
    className?: string;
    characterId: CharacterId;
}

export function CharToken(props: CharTokenProps) {
    return (<img className={props.className} src={getTokenImage(props.characterId)} />);
}