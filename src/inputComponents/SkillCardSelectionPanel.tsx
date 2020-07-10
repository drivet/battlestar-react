import { SkillCard } from "../models/game-data";
import { SelectionPanel } from "./SelectionPanel";
import React from "react";
import { getSkillCardImage } from "../skills";

interface SkillCardSelectionPanelProps {
    available: SkillCard[];
    selectCount: number;
    doneCb?: (cards: SkillCard[]) => void;
}

export function skillCardImgElement(skillCard: SkillCard) {
    return (<img src={getSkillCardImage(skillCard)} alt={'Skill card'}/>);
}

function renderCard(skillCard: SkillCard, index: number) {
    return (
        <div className={'p-1'}>
            {skillCardImgElement(skillCard)}
        </div>
    );
}

export function SkillCardSelectionSelectionPanel(props: SkillCardSelectionPanelProps) {
    return (
        <SelectionPanel available={props.available}
                        rows={2} columns={5} renderFn={renderCard}
                        selectCount={props.selectCount}
                        doneCb={props.doneCb} />
    );
}
