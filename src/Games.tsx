import React from "react";
import { Board } from "./Board";

interface IGameProps {
    game: any;
}

export class Games extends React.Component<IGameProps> {
    render() {
        return (
            <Board game={this.props.game}/>
        )
    }
}
