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
        const data = ctx.ctxFactory ? (ctx.ctxFactory)(gameDoc, user) : null;
        setInputReq(gameDoc, ctx.inputId, user, data);
        return false;
    } else {
        ctx.count++;
        if (ctx.count === getPlayerCount(gameDoc)) {
            gameDoc.gameState.roundTableCtx = null;
            return true;
        } else {
            return false;
        }
    }
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

export function initAndHandleRoundTable<T, S>(gameDoc: GameDocument, inputId: InputId, input: Input<T>,
                                              inputCtxFactory: InputCtxFactory<S> = undefined): boolean {
    if (!gameDoc.gameState.roundTableCtx) {
        initRoundTable(gameDoc, inputId, usersFromCurrent(gameDoc), inputCtxFactory)
    }
    return handleRoundTable(gameDoc, input);
}