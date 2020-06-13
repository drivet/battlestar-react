import React from 'react';
import board from './images/bsg-board-2.jpg';
import jump01 from './images/jump01.png';
import jump02 from './images/jump02.png';
import jump03 from './images/jump03.png';
import jump04 from './images/jump04.png';
import jump05 from './images/jump05.png';
import './Board.css';
import { ViewableGameData } from "./models/game-data";

interface IBoardProps {
    game: ViewableGameData;
}

function jumpPositionImage(position: number): any {
    if (position === 0) {
        return jump01;
    } else if (position === 1) {
        return jump02;
    } else if (position === 2) {
        return jump03;
    } else if (position === 3) {
        return jump04;
    } else if (position === 4) {
        return jump05;
    } else {
        throw new Error('bad jump position: ' + position);
    }
}

export class Board extends React.Component<IBoardProps> {
    render() {
        const jumpImage = jumpPositionImage(4);
        return (
            <svg className={"board"} viewBox={"0 0 1440 1080"}>
                <image href={board} x={"0"} y={"0"} width={"100%"} height={"100%"}/>
                <image href={jumpImage} x={"1158"} y={"20"} width={"278"} height={"94"}/>
            </svg>
        )
    }
}
