import { ViewableGameData } from "../models/game-data";
import { FullPlayer } from "../../functions/src/game";
import React from "react";
import { customModalStyles } from "../view";
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Modal from 'react-modal';
import { LoyaltySelectionPanel } from "../inputComponents/LoyaltySelectionPanel";
import { QuorumSelectionPanel } from "../inputComponents/QuorumSelectionPanel";
import { SkillCardSelectionSelectionPanel } from "../inputComponents/SkillCardSelectionPanel";

interface PlayerHandModalProps {
    show: boolean;
    game: ViewableGameData;
    fullPlayer: FullPlayer;
    cancelCb: () => void;
}

export class PlayerHandModal extends React.Component<PlayerHandModalProps, {}> {
    render() {
        return (
            <Modal isOpen={this.props.show} style={customModalStyles}>
                <div>
                    Your complete hand
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Loyalty</Tab>
                        {this.props.fullPlayer.skillCards ? <Tab>Skills</Tab> : null}
                        {this.props.fullPlayer.president ? <Tab>Quorum</Tab> : null}
                    </TabList>
                    <TabPanel>
                        <LoyaltySelectionPanel available={this.props.fullPlayer.loyaltyCards} selectCount={0} />
                    </TabPanel>
                    {this.props.fullPlayer.skillCards ?
                        <TabPanel>
                            <SkillCardSelectionSelectionPanel available={this.props.fullPlayer.skillCards} selectCount={0} />
                        </TabPanel>
                        : null}
                    {this.props.fullPlayer.president ?
                        <TabPanel>
                            <QuorumSelectionPanel available={this.props.fullPlayer.quorumHand} selectCount={0} />
                        </TabPanel>
                        : null}
                </Tabs>
                <div className={"flex justify-center"}>
                    <button className={'btn btn-std my-1'} type="button" onClick={this.props.cancelCb}>Close</button>
                </div>
            </Modal>
        );
    }
}
