import React from "react";
import { ViewableGameData } from "./models/game-data";
import { FullPlayer } from "../functions/src/game";
import { CharacterSelection } from "./CharacterSelection";
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
                <CharacterSelection gameId={this.props.gameId} game={this.props.game} player={this.props.player}/>
                <InitialSkillSelection gameId={this.props.gameId} game={this.props.game} player={this.props.player}/>
                <SkillSelection gameId={this.props.gameId} game={this.props.game} player={this.props.player}/>
            </div>
        );
    }
}
