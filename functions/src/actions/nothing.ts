import { GameDocument } from "../game";
import { finishAction } from "../transitions/action";

export function actionNothing(gameDoc: GameDocument) {
    finishAction(gameDoc);
}
