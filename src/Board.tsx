import React from 'react';
import board from './images/bsg-board-2.jpg';
import jump01 from './images/jump01.png';
import jump02 from './images/jump02.png';
import jump03 from './images/jump03.png';
import jump04 from './images/jump04.png';
import jump05 from './images/jump05.png';

import './Board.css';
import { LocationId, ViewableGameData } from "./models/game-data";

interface IBoardProps {
    game: ViewableGameData;
    locationSelect: boolean;
    availableLocations: LocationId[]
    locationSelectCb: (LocationId) => void;
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
                {this.props.locationSelect ? this.locationOverlays() : null}
            </svg>
        )
    }

    private locationOverlays() {
        return (
            <g>
                {this.rect(LocationId.PressRoom, "157", "34", "105", "142")}
                {this.rect(LocationId.PresidentsOffice, "300", "34", "105", "142")}
                {this.rect(LocationId.Administration, "435", "34", "122", "142")}

                {this.rect(LocationId.FtlControl, "267", "612", "105", "142")}
                {this.rect(LocationId.WeaponsControl, "425", "526", "105", "142")}
                {this.rect(LocationId.Command, "425", "698", "105", "142")}
                {this.rect(LocationId.Communications, "583", "526", "105", "142")}
                {this.rect(LocationId.ResearchLab, "741", "527", "105", "142")}
                {this.rect(LocationId.HangarDeck, "741", "699", "105", "142")}
                {this.rect(LocationId.Armory, "897", "614", "105", "142")}
                {this.rect(LocationId.Sickbay, "1056", "527", "105", "142")}
                {this.rect(LocationId.Brig, "1046", "700", "125", "142")}
                {this.rect(LocationId.AdmiralsQuarters, "574", "698", "122", "142")}

                {this.rect(LocationId.Caprica, "744", "55", "90", "139")}
                {this.rect(LocationId.CylonFleet, "846", "55", "90", "139")}
                {this.rect(LocationId.HumanFleet, "947", "55", "90", "139")}
                {this.rect(LocationId.ResurrectionShip, "1048", "55", "90", "139")}

                {this.polygon(LocationId.FrontAbove, "20,250 700,250 700,460 450,500")}
                {this.polygon(LocationId.BackAbove, "1420,250 740,250 740,460 990,500")}
                {this.polygon(LocationId.FrontBelow, "50,1065 700,1065 700,900 450,860")}
                {this.polygon(LocationId.BackBelow, "1390,1065 740,1065 740,900 990,860")}
                {this.polygon(LocationId.Front, "20,320 390,545 170,585 170,785 390,815 20,1045")}
                {this.polygon(LocationId.Back, "1420,320 1080,505 1280,505 1280,865 1080,865 1420,1045")}
            </g>
        )
    }

    private polygon(location: LocationId, points: string) {
        if (this.props.availableLocations.indexOf(location) === -1) {
            return null;
        }
        return (
            <polygon onClick={() => this.props.locationSelectCb(location)} className={"spaceLocation"}
                     points={points}/>)
    }

    private rect(location: LocationId, x: string, y: string, width: string, height: string) {
        if (this.props.availableLocations.indexOf(location) === -1) {
            return null;
        }
        return (
            <rect onClick={() => this.props.locationSelectCb(location)} className={"location"} x={x} y={y}
                width={width} height={height}/>
        );
    }
}
