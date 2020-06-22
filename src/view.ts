import { ViewableGameData } from "./models/game-data";
import { myUserId } from "./App";
import { InputId } from "./models/inputs";

export enum GameViewState {
    WaitingForPlayer,
    SelectingCharacter,
    SelectingInitialLocation,
    SelectingInitialSkills,
    SelectingMultiSkills,
    SelectingLocation,
    DiscardingSkillMove,
    SelectingAction
}


export const customModalStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

export function getGameViewState(game: ViewableGameData): GameViewState {
    const inputRequest = game.inputRequest;
    if (inputRequest.userId !== myUserId) {
        return GameViewState.WaitingForPlayer;
    } else if (inputRequest.inputId === InputId.SelectCharacter) {
        return GameViewState.SelectingCharacter;
    } else if (inputRequest.inputId === InputId.SelectInitialLocation) {
        return GameViewState.SelectingInitialLocation;
    } else if (inputRequest.inputId === InputId.ReceiveInitialSkills) {
        return GameViewState.SelectingInitialSkills;
    } else if (inputRequest.inputId === InputId.ReceiveSkills) {
        return GameViewState.SelectingMultiSkills;
    } else if (inputRequest.inputId === InputId.Movement) {
        return GameViewState.SelectingLocation;
    } else if (inputRequest.inputId === InputId.Action) {
        return GameViewState.SelectingAction;
    }
}