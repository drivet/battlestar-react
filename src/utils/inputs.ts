import { InputId } from "../models/inputs";
import { FullPlayer, GameDocument } from "../../functions/src/game";
import { ViewableGameData } from "../models/game-data";

export function wantsInput(game: ViewableGameData, player: FullPlayer, input: InputId): boolean {
    return player && game &&
        game.inputRequest.userId === player.userId && game.inputRequest.inputId === input;
}
