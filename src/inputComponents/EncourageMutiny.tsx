import { PlayerData, ViewableGameData } from "../models/game-data";
import { pushResponse } from "../firebase-game";
import { InputId } from "../models/inputs";
import React from "react";
import { makeResponse, PlayerSelection } from "./PlayerSelection";

interface EncourageMutinyProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function EncourageMutiny(props: EncourageMutinyProps) {
    console.log('mutiny players ' + JSON.stringify(props.game.players));
    return (
        <PlayerSelection available={getPlayers(props.game.players)}
                         count={1}
                         doneCb={skills => handlePlayerSelection(props.gameId, skills)}/>
    );
}

function getPlayers(players: PlayerData[]): PlayerData[] {
    return players.filter(p => !p.admiral);
}

function handlePlayerSelection(gameId: string, players: PlayerData[]) {
    pushResponse(gameId, makeResponse(InputId.ActionEncourageMutinyPlayerSelect, players[0].userId));
}
