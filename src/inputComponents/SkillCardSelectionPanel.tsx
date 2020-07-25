import { SkillCardId } from "../models/game-data";
import { SelectionPanel } from "./SelectionPanel";
import React from "react";
import { getSkillCardImage } from "../skills";

interface SkillCardSelectionPanelProps {
    available: SkillCardId[];
    selectCount: number;
    doneCb?: (cards: SkillCardId[]) => void;
}

export function skillCardImgElement(skillCard: SkillCardId) {
    return (<img src={getSkillCardImage(skillCard)} alt={'Skill card'}/>);
}

function renderCard(skillCard: SkillCardId, index: number) {
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
