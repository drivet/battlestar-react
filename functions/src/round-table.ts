import { GameDocument, getPlayerCount, setInputReq } from "./game";
import { Input, InputId } from "../../src/models/inputs";

export type InputCtxFactory<T> = (game: GameDocument, user: string) => T;

export interface RoundTableCtx<T> {
    inputId: InputId;
    users: string[];
    ctxFactory: InputCtxFactory<T>;
    count: number;
}

export function initRoundTable<T>(game: GameDocument, inputId: InputId, users: string[],
                                     ctxFactory: InputCtxFactory<T> = undefined) {
    game.gameState.roundTableCtx = {
        inputId: inputId,
        users: users,
        ctxFactory: ctxFactory,
        count: 0
    }
}

export function handleRoundTable<T>(gameDoc: GameDocument, input: Input<T>): boolean {
    const ctx = gameDoc.gameState.roundTableCtx;
    if (!input) {
        const user = ctx.users[ctx.count];
        setInputReq(gameDoc, ctx.inputId, user, (ctx.ctxFactory)(gameDoc, user));
        return false;
    }
    return ctx.count === getPlayerCount(gameDoc);
}

// return the users starting from the one after the current player and ending with the current player
export function usersFromCurrent(gameDoc: GameDocument): string[] {
    const users = [] as string[];
    for (let i = getNextPlayer(gameDoc, gameDoc.gameState.currentPlayer), count = 0;
         count < gameDoc.gameState.userIds.length;
         i = getNextPlayer(gameDoc, i), count++) {
        users.push(gameDoc.gameState.userIds[i]);
    }
    return users;
}

function getNextPlayer(gameDoc: GameDocument, playerIndex: number): number {
    let next = playerIndex + 1;
    if (next === getPlayerCount(gameDoc)) {
        next = 0;
    }
    return next;
}
