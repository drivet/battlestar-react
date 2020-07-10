import React from 'react';
import board from './images/bsg-board-2.jpg';
import jump01 from './images/jump01.png';
import jump02 from './images/jump02.png';
import jump03 from './images/jump03.png';
import jump04 from './images/jump04.png';
import jump05 from './images/jump05.png';

import basestar from './images/BSG_basestar.gif';
import raider from './images/BSG_Raider.gif';
import viper from './images/BSG_Viper.gif';
import civilian from './images/BSG_ship_bk.gif';
import heavyRaider from './images/BSG_HeavyRaider.gif';
import apollo from './images/BSG_pilot_token_Apollo.png';
import boomer from './images/BSG_pilot_token_Boomer.png';
import helo from './images/BSG_pilot_token_Helo.png';
import starbuck from './images/BSG_pilot_token_Starbuck.png';

import { ActiveBasestar, CharacterId, LocationId, PlayerData, ViewableGameData } from "./models/game-data";
import { getPlayerColor } from "./players/PlayerRow";

interface BoardProps {
    game: ViewableGameData;
    locationSelect: boolean;
    availableLocations: LocationId[]
    locationSelectCb: (LocationId) => void;
}

function getPilotImg(character: CharacterId) {
    if (character === CharacterId.LeeAdama) {
        return apollo;
    } else if (character === CharacterId.SharonValerii) {
        return boomer;
    } else if (character === CharacterId.KarlAgathon) {
        return helo;
    } else if (character === CharacterId.KaraThrace) {
        return starbuck;
    } else {
        return null;
    }
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

export class Board extends React.Component<BoardProps> {
    render() {
        const jumpImage = jumpPositionImage(this.props.game.jumpPosition);
        return (
            <svg className={"w-bw h-bh"} viewBox={"0 0 1440 1080"}>
                <image href={board} x={"0"} y={"0"} width={"100%"} height={"100%"}/>
                <image href={jumpImage} x={"1158"} y={"20"} width={"278"} height={"94"}/>
                {this.locationOverlays()}
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
        const cn = "fill-current text-gray-600 opacity-0 " + this.getHover(location);
        return (
            <g>
                {this.getPilotsOnLoc(location)}
                {this.getBasestarCompOnLoc(location)}
                {this.getRaidersCompOnLoc(location)}
                {this.getHeavyRaidersCompOnLoc(location)}
                {this.getVipersCompOnLoc(location)}
                {this.getCiviliansCompOnLoc(location)}
                <polygon onClick={() => this.handleLocationClick(location)} className={cn} points={points}/>
            </g>
        )
    }

    private rect(location: LocationId, x: string, y: string, width: string, height: string) {
        const cn = 'fill-current text-blue-700 opacity-0 ' + this.getHover(location);
        const players = this.getPlayersOnLoc(location);
        return (
            <svg x={x} y={y} width={width} height={height}>
                {this.makeShipTokenLocations(players)}
                <rect onClick={() => this.handleLocationClick(location)} className={cn} x={"0"} y={"y"}
                    width={"100%"} height={"100%"}/>
            </svg>
        );
    }

    private getPilotsOnLoc(location: LocationId) {
        const players = this.getPlayersOnLoc(location);
        return this.makePilotTokens(players.map(p => p.characterId), location);
    }

    private makePilotTokens(characters: CharacterId[], location: LocationId) {
        let x, y;
        if (location === LocationId.FrontAbove) {
            x = "550";
            y = "400";
        } else if (location === LocationId.BackAbove) {
            x = "750";
            y = "400";
        } else if (location === LocationId.Back) {
            x = "1275";
            y = "650";
        } else if (location === LocationId.BackBelow) {
            x = "850";
            y = "950";
        } else if (location === LocationId.FrontBelow) {
            x = "425";
            y = "950";
        } else if (location === LocationId.Front) {
            x = "25";
            y = "675";
        }
        return characters.map((c,i) => {
            const ix = parseInt(x) + (i * 50);
            return (
                <svg x={ix.toString()} y ={y} width={"50"} height={"50"}>
                    <image href={getPilotImg(c)} width={"100%"} height={"100%"}/>
                </svg>
            )
        });
    }

    private makeShipTokenLocations(players: PlayerData[]) {
        return players.map((p,i) => {
            return (
                <svg className={'fill-current text-'+getPlayerColor(this.props.game, p) }>
                    <circle cx={( (i * 20) + 15).toString()} cy="15" r="15"/>
                </svg>
            )
        });
    }

    private getPlayersOnLoc(location: LocationId): PlayerData[] {
        return this.props.game.players.filter(p => p.location === location);
    }

    private getHover(location: LocationId): string {
        let hover = '';
        if (this.props.locationSelect && this.props.availableLocations.indexOf(location) !== -1) {
            hover = 'hover:opacity-50';
        }
        return hover;
    }

    private getBasestarCompOnLoc(location: LocationId) {
        const activeBasestars = this.getBasestarsOnLoc(location);
        let count = activeBasestars.length;
        if (count === 0) {
            return null;
        }
        let x, y;
        if (location === LocationId.FrontAbove) {
            x = "130";
            y = "250";
        } else if (location === LocationId.Front) {
            x = "25";
            y = "350";
        } else if (location === LocationId.FrontBelow) {
            x = "200";
            y = "980";
        } else if (location === LocationId.BackAbove) {
            x = "1250";
            y = "250";
        } else if (location === LocationId.Back) {
            x = "1325";
            y = "375";
        } else if (location === LocationId.BackBelow) {
            x = "1150";
            y = "980";
        }
        return (
            <svg x={x} y ={y} width={"100"} height={"100"}>
                { count > 1 ? <text x="0" y="0" fill="white" dominantBaseline={"hanging"}>{count}</text> : null}
                <image href={basestar} width={"100%"} height={"100%"}/>
            </svg>
        );
    }
    private getBasestarsOnLoc(location: LocationId): ActiveBasestar[] {
        if (!this.props.game.activeBasestars) {
            return [];
        }
        return this.props.game.activeBasestars.filter(ab => ab.location === location);
    }

    private getRaidersCompOnLoc(location: LocationId) {
        let count = this.getRaidersOnLoc(location);
        if (!count) {
            return null;
        }
        let x, y;
        if (location === LocationId.FrontAbove) {
            x = "240";
            y = "250";
        } else if (location === LocationId.Front) {
            x = "25";
            y = "450";
        } else if (location === LocationId.FrontBelow) {
            x = "330";
            y = "980";
        } else if (location === LocationId.BackAbove) {
            x = "1160";
            y = "270";
        } else if (location === LocationId.Back) {
            x = "1325";
            y = "475";
        } else if (location === LocationId.BackBelow) {
            x = "1050";
            y = "980";
        }

        return (
            <svg x={x} y ={y} width={"60"} height={"60"}>
                { count > 1 ? <text x="0" y="0" fill="white" dominantBaseline={"hanging"}>{count}</text> : null}
                <image href={raider} width={"100%"} height={"100%"}/>
            </svg>
        );
    }
    private getRaidersOnLoc(location: LocationId): number {
        if (!this.props.game.activeRaiders) {
            return 0;
        }
        return this.props.game.activeRaiders[LocationId[location]];
    }

    private getHeavyRaidersCompOnLoc(location: LocationId) {
        let count = this.getHeavyRaidersOnLoc(location);
        if (!count) {
            return null;
        }
        let x, y;
        if (location === LocationId.FrontAbove) {
            x = "220";
            y = "310";
        } else if (location === LocationId.Front) {
            x = "100";
            y = "420";
        } else if (location === LocationId.FrontBelow) {
            x = "300";
            y = "920";
        } else if (location === LocationId.BackAbove) {
            x = "1160";
            y = "350";
        } else if (location === LocationId.Back) {
            x = "1230";
            y = "420";
        } else if (location === LocationId.BackBelow) {
            x = "1050";
            y = "920";
        }

        return (
            <svg x={x} y ={y} width={"60"} height={"60"}>
                { count > 1 ? <text x="0" y="0" fill="white" dominantBaseline={"hanging"}>{count}</text> : null}
                <image href={heavyRaider} width={"100%"} height={"100%"}/>
            </svg>
        );
    }

    private getHeavyRaidersOnLoc(location: LocationId): number {
        if (!this.props.game.activeHeavyRaiders) {
            return 0;
        }
        return this.props.game.activeHeavyRaiders[LocationId[location]];
    }

    private getVipersCompOnLoc(location: LocationId) {
        let count = this.getVipersOnLoc(location);

        if (!count) {
            return null;
        }
        let x, y;
        if (location === LocationId.FrontAbove) {
            x = "640";
            y = "250";
        } else if (location === LocationId.Front) {
            x = "25";
            y = "950";
        } else if (location === LocationId.FrontBelow) {
            x = "640";
            y = "1010";
        } else if (location === LocationId.BackAbove) {
            x = "750";
            y = "250";
        } else if (location === LocationId.Back) {
            x = "1325";
            y = "950";
        } else if (location === LocationId.BackBelow) {
            x = "750";
            y = "1010";
        }

        return (
            <svg x={x} y ={y} width={"60"} height={"60"}>
                { count > 1 ? <text x="0" y="0" fill="white" dominantBaseline={"hanging"}>{count}</text> : null}
                <image href={viper} width={"100%"} height={"100%"}/>
            </svg>
        );
    }
    private getVipersOnLoc(location: LocationId): number {
        if (!this.props.game.activeVipers) {
            return 0;
        }
        return this.props.game.activeVipers[LocationId[location]];
    }

    private getCiviliansCompOnLoc(location: LocationId) {
        let count = this.getCiviliansOnLoc(location);

        if (!count) {
            return null;
        }
        let x, y;
        if (location === LocationId.FrontAbove) {
            x = "640";
            y = "300";
        } else if (location === LocationId.Front) {
            x = "25";
            y = "875";
        } else if (location === LocationId.FrontBelow) {
            x = "620";
            y = "950";
        } else if (location === LocationId.BackAbove) {
            x = "750";
            y = "300";
        } else if (location === LocationId.Back) {
            x = "1325";
            y = "880";
        } else if (location === LocationId.BackBelow) {
            x = "750";
            y = "950";
        }

        return (
            <svg x={x} y ={y} width={"75"} height={"75"}>
                { count > 1 ? <text x="0" y="0" fill="white" dominantBaseline={"hanging"}>{count}</text> : null}
                <image href={civilian} width={"100%"} height={"100%"}/>
            </svg>
        );
    }
    private getCiviliansOnLoc(location: LocationId): number {
        if (!this.props.game.activeCivilians) {
            return 0;
        }
        return this.props.game.activeCivilians[LocationId[location]];
    }

    private handleLocationClick(location: LocationId) {
        if (this.props.locationSelect) {
            this.props.locationSelectCb(location);
        }
    }
}