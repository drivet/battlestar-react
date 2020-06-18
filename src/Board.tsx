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
    locationSelect: boolean;
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
        const jumpImage = jumpPositionImage(this.props.game.jumpPosition);
        return (
            <svg className={"board"} viewBox={"0 0 1440 1080"}>
                <image href={board} x={"0"} y={"0"} width={"100%"} height={"100%"}/>
                <image href={jumpImage} x={"1158"} y={"20"} width={"278"} height={"94"}/>
                <rect className={"location"} x={"157"} y={"34"} width={"105"} height={"142"} />
                <rect className={"location"} x={"300"} y={"34"} width={"105"} height={"142"} />
                <rect className={"location"} x={"267"} y={"612"} width={"105"} height={"142"} />
                <rect className={"location"} x={"425"} y={"526"} width={"105"} height={"142"} />
                <rect className={"location"} x={"425"} y={"698"} width={"105"} height={"142"} />
                <rect className={"location"} x={"583"} y={"526"} width={"105"} height={"142"} />
                <rect className={"location"} x={"741"} y={"527"} width={"105"} height={"142"} />
                <rect className={"location"} x={"741"} y={"699"} width={"105"} height={"142"} />
                <rect className={"location"} x={"897"} y={"614"} width={"105"} height={"142"} />
                <rect className={"location"} x={"1056"} y={"527"} width={"105"} height={"142"} />
                <rect className={"location"} x={"1046"} y={"700"} width={"125"} height={"142"} />
                <rect className={"location"} x={"574"} y={"698"} width={"122"} height={"142"} />
                <rect className={"location"} x={"435"} y={"34"} width={"122"} height={"142"} />
                <rect className={"location"} x={"744"} y={"55"} width={"90"} height={"139"} />
                <rect className={"location"} x={"846"} y={"55"} width={"90"} height={"139"} />
                <rect className={"location"} x={"947"} y={"55"} width={"90"} height={"139"} />
                <rect className={"location"} x={"1048"} y={"55"} width={"90"} height={"139"} />

                <polygon className={"spaceLocation"} points="20,250 700,250 700,460 450,500" />
                <polygon className={"spaceLocation"} points="1420,250 740,250 740,460 990,500" />
                <polygon className={"spaceLocation"} points="50,1065 700,1065 700,900 450,860" />
                <polygon className={"spaceLocation"} points="1390,1065 740,1065 740,900 990,860" />

                <polygon className={"spaceLocation"} points="20,320 390,545 170,585 170,785 390,815 20,1045" />
                <polygon className={"spaceLocation"} points="1420,320 1080,505 1280,505 1280,865 1080,865 1420,1045" />

            </svg>
        )
    }

}
