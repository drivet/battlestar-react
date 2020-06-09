import React from 'react';
import './Game.css';
import { Board } from "./Board";
import { GameData } from "./models/game";

interface IGameProps {
    game: any;
}

export class Game extends React.Component<IGameProps> {
    render() {
        return (
            <div className={'Game'}>
                <div className={'leftCol'}>Left Side</div>
                <div className={'middleCol'}>
                    <Board game={this.props.game}/>
                </div>
                <div className={'rightCol'}>Right Side</div>
            </div>
        )
    }
}
