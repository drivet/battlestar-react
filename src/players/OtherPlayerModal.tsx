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
                    <div>
                        <img src={loyaltyBack}/>
                        <div>{this.props.player.loyaltyCount}</div>
                    </div>
                    <div>
                        <img src={skillBack}/>
                        <div>{totalSkills}</div>
                    </div>
                    {this.props.player.president ?
                        <div>
                            <img src={quorumBack}/>
                            <div>{this.props.player.quorumCount}</div>
                        </div> : null}
                </div>
                <div>
                    <button className={'btn btn-std my-1'} type="button" onClick={this.props.cancelCb}>Close</button>
                </div>
            </Modal>
        );
    }
}
