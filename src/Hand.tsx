import React, { Component } from "react";
import { FullPlayer } from "../functions/src/game";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { customModalStyles } from "./view";
import Modal from 'react-modal';
import { LoyaltyCardId, QuorumCardId } from "./models/game-data";
import { getLoyaltyImage, isCylon } from "./loyalty";
import { skillCardImgElement } from "./SkillCardSelectionModal";
import { getQuorumImage } from "./quorum";

interface PlayerHandProps {
    player: FullPlayer;
}

interface PlayerHandState {
    show: boolean;
}

export class PlayerHand extends Component<PlayerHandProps, PlayerHandState>{
    state = {
        show: false,
    };

    render() {
        if (!this.props.player || !this.props.player.loyaltyCards) {
            return null;
        }
        return (
            <div>
                <button className={'btn btn-std my-1'} type="button" onClick={this.showModal}>Show hand</button>
                {this.renderModal()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({ show: true });
    };

    private hideModal = () => {
        this.setState({ show: false });
    };

    private renderModal() {
        return (
            <Modal isOpen={this.state.show} style={customModalStyles}>
                <Tabs>
                    <TabList>
                        <Tab>Loyalty</Tab>
                        <Tab>Skills</Tab>
                        {this.props.player.president ? <Tab>Quorum</Tab> : null}
                    </TabList>
                    <TabPanel>
                        <div className={'mb-2'}>{this.getCylonMessage()}</div>
                        <div className={'flex'}>
                            {this.props.player.loyaltyCards.map(lc => this.renderLoyalty(lc))}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={'mb-2'}>Your available skill cards</div>
                        <div className={'flex'}>
                            {this.props.player.skillCards.map(sc => skillCardImgElement(sc))}
                        </div>
                    </TabPanel>
                    {this.props.player.president ?
                        <TabPanel>
                            <div className={'mb-2'}>Your available quorum cards</div>
                            <div className={'flex'}>
                                {this.props.player.quorumHand.map(qc => this.renderQuorum(qc))}
                            </div>
                        </TabPanel>
                        : null}
                </Tabs>
                <div>
                    <button className={'btn btn-std my-1'} type="button" onClick={this.hideModal}>Close</button>
                </div>
            </Modal>
        );
    }

    private getCylonMessage() {
        return 'You are ' + (isCylon(this.props.player.loyaltyCards) ? 'a Cylon': 'not a Cylon');
    }

    private renderLoyalty(loyalty: LoyaltyCardId) {
        return (
            <img src={getLoyaltyImage(loyalty)} />
        );
    }

    private renderQuorum(quorum: QuorumCardId) {
        return (
            <img src={getQuorumImage(quorum)} />
        );
    }
}