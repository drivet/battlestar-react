import { LoyaltyCardId } from "../models/game-data";
import { getLoyaltyImage } from "../loyalty-cards";
import React from "react";
import { SelectionPanel } from "./SelectionPanel";

interface LoyaltySelectionPanelProps {
    available: LoyaltyCardId[];
    selectCount: number;
    doneDb?: (cards: LoyaltyCardId[]) => void;
}

function renderLoyalty(loyalty: LoyaltyCardId) {
    return (
        <img src={getLoyaltyImage(loyalty)} />
    );
}

export function LoyaltySelectionPanel(props: LoyaltySelectionPanelProps) {
    return (
        <SelectionPanel available={props.available}
                        rows={1} columns={5} renderFn={renderLoyalty}
                        selectCount={props.selectCount}
                        doneCb={props.doneDb} />
    );
}
