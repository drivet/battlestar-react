import { LoyaltyCardId, QuorumCardId } from "../models/game-data";
import { getLoyaltyImage } from "../loyalty-cards";
import { SelectionPanel } from "./SelectionPanel";
import React from "react";
import { getQuorumImage } from "../quorum";

interface QuorumSelectionPanelProps {
    available: QuorumCardId[];
    selectCount: number;
    doneCb?: (cards: QuorumCardId[]) => void;
}

function renderQuorum(quorum: QuorumCardId) {
    return (
        <img src={getQuorumImage(quorum)} />
    );
}

export function QuorumSelectionPanel(props: QuorumSelectionPanelProps) {
    return (
        <SelectionPanel available={props.available}
                        rows={1} columns={3} renderFn={renderQuorum}
                        selectCount={props.selectCount}
                        doneCb={props.doneCb} />
    );
}
