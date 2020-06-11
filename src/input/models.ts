import { GameData } from "../models/game-data";

export interface InputRequest {
    requestId: string;
    userId: string;
    inputId: string;
}

export interface InputResponse {
    requestId: string;
    userId: string;
    data: any;
}

export type processResponseFn = (response: InputResponse, game: GameData) => void;

function processCharacterSelection(response: InputResponse, game: GameData) {
    const player = game.player(response.userId);
    player.characterId = response.data;
}

function processInitialLocationSelection(response: InputResponse, game: GameData) {
    const player = game.player(response.userId);
    player.location = response.data;
}

function processSkillCardSelection(response: InputResponse, game: GameData) {

}