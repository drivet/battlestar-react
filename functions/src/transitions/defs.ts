import { FullPlayer, GameDocument } from "../game";
import { InputResponse } from "../../../src/models/inputs";
import { GameState, ViewableGameData } from "../../../src/models/game-data";
import { Input } from "../inputs/input";

export type TransitionFn = (g: GameDocument, input?: Input<any, any>) => void;
export type BotFn<T> = (g: ViewableGameData, p: FullPlayer) => InputResponse<T>;

function isLastPlayer(gameDoc: GameDocument): boolean {
    return gameDoc.gameState.currentPlayer === (gameDoc.gameState.userIds.length - 1);
}

export function nextPlayerAndChangeState(gameDoc: GameDocument, stateIfDone: GameState) {
    if (isLastPlayer(gameDoc)) {
        gameDoc.gameState.currentPlayer = 0;
        gameDoc.gameState.state = stateIfDone;
    } else {
        gameDoc.gameState.currentPlayer++;
    }
}