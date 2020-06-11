import { CharacterId, GameData, PlayerData, TurnPhase } from "./game-data";

export enum InputId {
    SelectCharacter,
    SelectInitialLocation,
    SelectInitialSkillCards,
    SelectSkillCards,
    SelectLocation,
    SelectAction
}

// information on who needs to provide input and what they need to do
export interface InputState {
    userId: string;
    inputId: InputId;
}

export class GameManager {
    constructor(public game: GameData) {}

    currentPlayer(): PlayerData {
        return this.game.players[this.game.currentPlayer]
    }

    player(userId: string): PlayerData {
        return this.game.players.find(p => p.userId === userId);
    }

    // tell me who needs to do what next
    calcInputState(): InputState {
        const nextWithoutChar = this.game.players.find(p => !p.characterId);
        if (nextWithoutChar) {
            return {
                userId: nextWithoutChar.userId,
                inputId: InputId.SelectCharacter
            }
        }

        // everyone has characters

        const lostApollo = this.game.players.find(p => p.characterId === CharacterId.LeeAdama && !p.location);
        if (lostApollo) {
            return {
                userId: lostApollo.userId,
                inputId: InputId.SelectInitialLocation
            }
        }

        // Apollo has a location

        const noSkillCards = this.game.players.find(p => p.skillCards.length === 0);
        if (noSkillCards && this.game.state === TurnPhase.Setup) {
            return {
                userId: noSkillCards.userId,
                inputId: InputId.SelectInitialSkillCards
            }
        }

        // everyone has skill cards, or it's not the setup phase, in which case it's okay for some people to not
        // have skill cards

        if (this.game.state === TurnPhase.ReceiveSkills) {
            return {
                userId: this.currentPlayer().userId,
                inputId: InputId.SelectSkillCards
            }
        }

        // we are not in the receive skills step

        if (this.game.state === TurnPhase.Movement) {
            return {
                userId: this.currentPlayer().userId,
                inputId: InputId.SelectLocation
            }
        }

        // movement phase has been resolved

        if (this.game.state === TurnPhase.Action) {
            if (!this.game.currentAction) {
                return {
                    userId: this.currentPlayer().userId,
                    inputId: InputId.SelectAction
                }
            } else {
                // this can vary wildly between actions
            }
        }

        // action phase has been resolved

        if (this.game.state === TurnPhase.Crisis) {

        }

        return null;
    }
}