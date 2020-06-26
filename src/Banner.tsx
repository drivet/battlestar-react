import React from "react";
import { ViewableGameData } from "./models/game-data";
import bsg from './images/battlestar-galactica.jpg';
import morale from './images/morale.png';
import food from './images/food.png';
import fuel from './images/fuel.png';
import pop from './images/pop.png';

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
                    <img src={morale} className={'w-6'}/>
                    <div className={'px-1'}>Morale:</div>
                    <div className={'px-1'}>{this.props.game.morale}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={food} className={'w-6'}/>
                    <div className={'px-1'}>Food:</div>
                    <div className={'px-1'}>{this.props.game.food}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={fuel} className={'w-6'}/>
                    <div className={'px-1'}>Fuel:</div>
                    <div className={'px-1'}>{this.props.game.fuel}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <img src={pop} className={'w-6'}/>
                    <div className={'px-1'}>Population:</div>
                    <div className={'px-1'}>{this.props.game.population}</div>
                </div>
                <div className={'flex items-center px-2'}>
                    <div className={'px-1'}>Centurions:</div>
                    <div className={'px-1'}>{this.props.game.boardedCenturions} / 5</div>
                </div>
            </div>
        );
    }
}
