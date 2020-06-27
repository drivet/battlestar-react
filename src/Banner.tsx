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
import { IconInfo } from "./utils/IconInfo";

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
                <IconInfo icon={morale} size={'sm'} className={'px-2'} text={this.props.game.morale} title={'Morale'} />
                <IconInfo icon={food} size={'sm'} className={'px-2'} text={this.props.game.food} title={'Food'} />
                <IconInfo icon={fuel} size={'sm'} className={'px-2'} text={this.props.game.fuel} title={'Fuel'} />
                <IconInfo icon={pop} size={'sm'} className={'px-2'} text={this.props.game.population} title={'Population'} />

                <IconInfo icon={viper} size={'sm'} className={'px-2'}
                          text={this.getViperText()}
                          title={'Viper'} />

                <IconInfo icon={raptor} size={'sm'} className={'px-2'}
                          text={this.props.game.raptors}
                          title={'Raptors'} />

                <IconInfo icon={civilian} size={'sm'} className={'px-2'}
                          text={this.props.game.civilianShips}
                          title={'Civilians'} />

                <div className={'flex items-center px-2'}>
                    <div>Distance traveled: </div>
                    <div className={'px-1'}>{this.props.game.distance}</div>
                </div>
            </div>
        );
    }

    private getViperText() {
        return 'Reserve: ' + this.props.game.vipers + ', Damaged: ' + this.props.game.damagedVipers
    }
}
