import React from "react";
import { ViewableGameData } from "./models/game-data";
import bsg from './images/battlestar-galactica.jpg';
import morale from './images/morale.png';
import food from './images/food.png';
import fuel from './images/fuel.png';
import pop from './images/pop.png';
import viper from './images/BSG_Viper.gif';
import raptor from './images/BSG_Raptor.png';
import civilian from './images/BSG_ship_bk.gif';
import destBack from './images/BSG_Destination_Back.png';

interface BannerProps {
    game: ViewableGameData
}

export class Banner extends React.Component<BannerProps, any> {
    render() {
        return (
          <div className={'h-10 bg-black flex'}>
              <img src={bsg} className={'h-full'}/>
              {this.props.game ? this.renderStats() : null}
          </div>
        );
    }

    private renderStats() {
        return (
            <div className={'flex items-center text-white'}>
                <div className={'flex items-center px-2'}>
                    <img src={morale} title={'Morale'} className={'w-6'}/>
                    <div className={'px-1'}>{this.props.game.morale}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={food} title={'Food'} className={'w-6'}/>
                    <div className={'px-1'}>{this.props.game.food}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={fuel} title={'Fuel'} className={'w-6'}/>
                    <div className={'px-1'}>{this.props.game.fuel}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={pop} title={'Population'} className={'w-6'}/>
                    <div className={'px-1'}>{this.props.game.population}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={viper} title={'Vipers'} className={'w-8'}/>
                    <div className={'px-1'}>Reserve: {this.props.game.vipers}</div>
                    <div className={'px-1'}>Damaged: {this.props.game.damagedVipers}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={raptor} title={'Raptors'} className={'w-8'}/>
                    <div className={'px-1'}>{this.props.game.raptors}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={civilian} title={'Civilians'} className={'w-8'}/>
                    <div className={'px-1'}>{this.props.game.civilianShips}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <div>Distance traveled: </div>
                    <div className={'px-1'}>{this.props.game.distance}</div>
                </div>
            </div>
        );
    }
}
