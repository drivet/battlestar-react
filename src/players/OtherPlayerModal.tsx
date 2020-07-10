import { PlayerData, ViewableGameData } from "../models/game-data";
import React from "react";
import Modal from 'react-modal';
import { customModalStyles } from "../view";
import loyaltyBack from "../images/loyalty/BSG_Loyalty_Back.png";
import skillBack from "../images/skills/BSG_Skill_Back.png";
import quorumBack from "../images/quorum/BSG_Quorum_Back.png";

interface OtherPlayerModalProps {
    show: boolean;
    game: ViewableGameData;
    player: PlayerData;
    cancelCb: () => void;
}

export class OtherPlayerModal extends React.Component<OtherPlayerModalProps, {}> {

    render() {
        const totalSkills = this.props.player.skillCounts ? Object.values(this.props.player.skillCounts)
            .reduce((a, c) => a + c): 0;

        return (
            <Modal isOpen={this.props.show} style={customModalStyles}>
                <div>
                    Redacted hand for {this.props.player.userId}
                </div>
                <div className={'flex'}>
                    <div className={'m-1'}>
                        <div>
                            <img className={"w-40 h-64 mb-1"} src={loyaltyBack}/>
                            <div className={'text-center'}>Loyalty: {this.props.player.loyaltyCount}</div>
                        </div>
                    </div>
                    <div className={'m-1'}>
                        <div>
                            <img className={"w-40 h-64 mb-1"} src={skillBack}/>
                            <div className={'text-center'}>Skills: {totalSkills}</div>
                        </div>
                    </div>
                    {this.props.player.president ?
                        <div className={'w-40 m-1'}>
                            <div>
                                <img className={"w-40 h-64 mb-1"} src={quorumBack}/>
                                <div className={'text-center'}>Quorum: {this.props.player.quorumCount}</div>
                            </div>
                        </div> : null}
                </div>
                <div className={"flex justify-center"}>
                    <button className={'btn btn-std my-1'} type="button" onClick={this.props.cancelCb}>Close</button>
                </div>
            </Modal>
        );
    }
}
