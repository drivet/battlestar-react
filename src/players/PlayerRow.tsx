import { PlayerData, ViewableGameData } from "../models/game-data";
import CurrentPlayer from "../images/BSG_Current_Player.png";
import President from "../images/BSG_president.gif";
import Admiral from "../images/BSG_admiral.gif";
import React from "react";
import { IconInfo } from "../utils/IconInfo";
import { getTokenImage } from "../models/char-token-image";
import { Icon } from "../utils/Icon";
import { myUserId } from "../App";
import { PlayerHandModal } from "./PlayerHandModal";
import { OtherPlayerModal } from "./OtherPlayerModal";
import { FullPlayer } from "../../functions/src/game";

const playerColors = ['red-500', 'green-500', 'blue-500', 'purple-500', 'yellow-500', 'orange-500'];

export function getPlayerColor(game: ViewableGameData, player: PlayerData): string {
    return playerColors[game.players.indexOf(player)];
}

function isYou(player: PlayerData) {
    return player.userId === myUserId;
}

interface PlayerRowProps {
    game: ViewableGameData;
    player: PlayerData;
    fullPlayer: FullPlayer;
}

export class PlayerRow extends React.Component<PlayerRowProps, {}> {
    state = {
        show: false,
    };

    private showModal = () => {
        this.setState({show: true});
    };

    private hideModal = () => {
        this.setState({show: false});
    };

    render() {
        const player = this.props.player;
        const color = getPlayerColor(this.props.game, player);
        return (
            <div key={player.userId}>
                <div className={'flex items-center bg-blue-100 border-t border-b border-blue-500 text-blue-700 py-2 mb-2'}>
                    <div className={'px-1 cursor-pointer'} onClick={() => this.showModal()}>
                        {
                            this.isCurrent() ?
                                <Icon icon={CurrentPlayer} title={'Current player'} size={"xs"}/> :
                                <div className={"w-8 text-center"}>&hellip;</div>
                        }
                    </div>

                    <IconInfo icon={getTokenImage(player.characterId)}
                              text={player.userId}
                              title={'Character'}
                              className={"text-"+color}/>

                    <div className={'flex-1'}/>

                    {player.president ?
                        <div className={'px-1'}>
                            <Icon icon={President} title={'President'} size={"xs"} onClick={() => handlePresClick()}/>
                        </div> : null}

                    {player.admiral ?
                        <div className={'px-1'}>
                            <Icon icon={Admiral} title={'Admiral'} size={"xs"}
                                  onClick={e => handleAdmiralClick()}/>
                        </div> : null}
                </div>
                {isYou(player) ?
                    <PlayerHandModal show={this.state.show} game={this.props.game} fullPlayer={this.props.fullPlayer} cancelCb={this.hideModal} />:
                    <OtherPlayerModal show={this.state.show} game={this.props.game} player={player} cancelCb={this.hideModal} />}
            </div>
        );
    }

    private isCurrent(): boolean {
        const currentIndex = this.props.game.currentPlayer;
        return this.props.player.userId === this.props.game.players[currentIndex].userId;
    }
}

function handlePresClick() {
    console.log('president');
}

function handleAdmiralClick() {
    console.log('admiral');
}
