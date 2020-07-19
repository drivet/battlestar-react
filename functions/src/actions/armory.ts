import { GameDocument} from "../game";
import { roll } from "../roll";
import { finishAction } from "../transitions/action";

export function actionArmory(gameDoc: GameDocument) {
    const die = roll();
    if (die >= 7) {
        const centurions = gameDoc.gameState.boardedCenturions;
        // destroy a centurion closest to the end
        for (let i = centurions.length - 1; i >= 0; i--) {
            if (centurions[i] > 0) {
                centurions[i]--;
                break;
            }
        }
        trimZeros(centurions);
    }
    finishAction(gameDoc);
}

function trimZeros(data: number[]) {
    let i;
    for (i = data.length - 1; i >= 0 && data[i] === 0; i--) {}
    data.splice(i + 1, data.length - i - 1);
}
