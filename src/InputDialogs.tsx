import React from "react";
import { ViewableGameData } from "./models/game-data";
import { FullPlayer } from "../functions/src/game";
import { InitialSkillSelection } from "./InitialSkillSelection";
import { SkillSelection } from "./SkillSelection";

export interface InputDialogsProps {
    gameId: string;
    game: ViewableGameData;
    player: FullPlayer;
}

export class InputDialogs extends React.Component<InputDialogsProps, any> {
    render() {
        return (
            <div>
                <InitialSkillSelection {...this.props}/>
                <SkillSelection {...this.props}/>
            </div>
        );
    }
}
