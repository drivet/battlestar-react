import { LocationId, PlayerData, ViewableGameData } from "../models/game-data";
import { makeResponse, PlayerSelection } from "./PlayerSelection";
import { pushResponse } from "../firebase-game";
import { InputId } from "../models/inputs";
import React from "react";

interface ArrestWarrantProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function ArrestOrder(props: ArrestWarrantProps) {
    return (
        <PlayerSelection available={getPlayers(props.game.players)}
                         count={3}
                         doneCb={skills => handlePlayerSelection(props.gameId, skills)}/>
    );
}

function getPlayers(players: PlayerData[]): PlayerData[] {
    return players.filter(p => p.location !== LocationId.Brig);
}

function handlePlayerSelection(gameId: string, players: PlayerData[]) {
    pushResponse(gameId, makeResponse(InputId.ActionArrestOrderPlayerSelect, players[0].userId));
}
