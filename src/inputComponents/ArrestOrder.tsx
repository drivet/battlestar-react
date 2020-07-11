import { LocationId, PlayerData, ViewableGameData } from "../models/game-data";
import { makeResponse, PlayerSelection } from "./PlayerSelection";
import { pushResponse } from "../firebase-game";
import { InputId } from "../models/inputs";
import React from "react";
import { myUserId } from "../App";

interface ArrestWarrantProps {
    gameId: string;
    game: ViewableGameData;
    player: PlayerData;
}

export function ArrestOrder(props: ArrestWarrantProps) {
    return (
        <PlayerSelection available={getPlayers(props.game.players)}
                         count={1}
                         doneCb={players => handlePlayerSelection(props.gameId, players)}/>
    );
}

function getPlayers(players: PlayerData[]): PlayerData[] {
    return players.filter(p => p.location !== LocationId.Brig && p.userId !== myUserId);
}

function handlePlayerSelection(gameId: string, players: PlayerData[]) {
    pushResponse(gameId, makeResponse(InputId.ActionArrestOrderPlayerSelect, players[0].userId));
}
