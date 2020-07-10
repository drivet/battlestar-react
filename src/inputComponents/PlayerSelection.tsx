import { getCharacter, PlayerData } from "../models/game-data";
import React, { Component } from "react";
import { InputId, InputResponse } from "../models/inputs";
import { myUserId } from "../App";
import { CharToken } from "../CharToken";
import { SelectionButton } from "./SelectionButton";

export type PlayerSelectedCb = (players: PlayerData[]) => void;

interface PlayerSelectionProps {
    available: PlayerData[],
    count: number,
    doneCb: PlayerSelectedCb;
}

interface PlayerSelectionState {
    show: boolean;
    selected: boolean;
}

export function makeResponse(input: InputId, player: string): InputResponse<string> {
    return {
        userId: myUserId,
        inputId: input,
        data: player,
    }
}

export class PlayerSelection extends Component<PlayerSelectionProps, PlayerSelectionState> {
    state = {
        show: false,
        selected: false
    };

    render() {
        return (
            <SelectionButton available={this.props.available}
                             selectCount={this.props.count}
                             buttonLabel={'Select player(s)'}
                             selectedLabel={'Player(s) selected'}
                             rows={1}
                             columns={10}
                             renderFn={renderPlayer}
                             doneCb={this.props.doneCb}/>
        );
    }
}

function renderPlayer(player: PlayerData, index: number) {
    return (
        <div className={'w-40 p-1'}>
            <div className={"flex justify-center"}>
                <CharToken characterId={player.characterId} />
            </div>
            <div className={"text-center"}>
                {player.userId}
            </div>
            <div className={"text-center"}>
                {getCharacter(player.characterId).name}
            </div>
        </div>
    );
}
