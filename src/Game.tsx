import React from 'react';
import './Game.css';
import { Board } from "./Board";
import { getCharacter, PlayerData, SkillType, ViewableGameData } from "./models/game-data";
import firebase from "./firebase";
import { CharacterSelection } from "./CharacterSelection";
import {
    CharacterSelectionRequest,
    InputId,
    ReceiveInitialSkillsResponse,
    ReceiveSkillsResponse
} from "./models/inputs";
import { myUserId } from "./App";
import { FullPlayer } from "../functions/src/game";
import { SkillSelection } from "./SkillSelection";

interface GameState {
    game: ViewableGameData;
    player: FullPlayer;
}

function makeResponse(input: InputId, selectedSkills: SkillType[]): ReceiveInitialSkillsResponse | ReceiveSkillsResponse {
    return {
        userId: myUserId,
        inputId: input,
        skills: selectedSkills,
    }
}

export class GameComponent extends React.Component<any, GameState> {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            player: null
        }
    }

    componentDidMount() {
        const gameRef = firebase.database().ref('games/' + this.gameId() + '/view');
        gameRef.on('value', snapshot => {
            this.setState({
                game: snapshot.val()
            });
        });

        const playerRef = firebase.database().ref('games/' + this.gameId() + '/players/' + myUserId);
        playerRef.on('value', snapshot => {
            this.setState({
                player: snapshot.val()
            });
        });
    }

    private gameId(): string {
        return this.props.match.params.gameId;
    }

    render() {
        if (!this.state.game) {
            return null;
        }

        const currentPlayer = this.state.game.players[this.state.game.currentPlayer];
        return (
            <div className={'Game'}>
                <div className={'leftCol'}>
                    <div>Players</div>
                    {this.state.game.players.map(p => this.player(p, currentPlayer))}
                </div>
                <div className={'middleCol'}>
                    <Board game={this.state.game}/>
                </div>
                <div className={'rightCol'}>
                    <div>Vipers: {this.state.game.vipers}</div>
                    <div>Raptors: {this.state.game.raptors}</div>
                    <div>Civilian ships: {this.state.game.civilianShips}</div>
                    <div>Raiders: {this.state.game.raiders}</div>
                    <div>Heavy Raiders: {this.state.game.heavyRaiders}</div>
                </div>
                {this.shouldShowCharacterSelection() ? this.characterSelection() : null}
                {this.shouldShowInitialSkillSelection() ? this.initialSkillSelection() : null}
                {this.shouldShowSkillSelection() ? this.skillSelection() : null}
            </div>
        );
    }

    private characterSelection() {
        return (
            <CharacterSelection request={this.request() as CharacterSelectionRequest}
                                gameId={this.gameId()}/>
        );
    }

    private initialSkillSelection() {
        return (
            <SkillSelection availableSkills={this.getAvailableInitialSkills()}
                            count={3}
                            doneCb={skills => this.handleInitialSkillSelection(skills)}/>
        );
    }

    private skillSelection() {
        const multiSkills = this.getMultiSkills();
        const count = multiSkills[0];
        const skills = multiSkills[1];
        return (
            <SkillSelection availableSkills={skills}
                            count={count}
                            doneCb={skills => this.handleSkillSelection(skills)}/>
        );
    }

    private handleInitialSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + this.gameId() + '/responses')
            .push(makeResponse(InputId.ReceiveInitialSkills, selectedSkills));
    }

    private handleSkillSelection(selectedSkills: SkillType[]) {
        firebase.database().ref('/games/' + this.gameId() + '/responses')
            .push(makeResponse(InputId.ReceiveSkills, selectedSkills));
    }

    private shouldShowCharacterSelection(): boolean {
        const g = this.state.game;
        return g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.SelectCharacter;
    }
    private request() {
        const g = this.state.game;
        return g ? g.inputRequest : null;
    }

    private player(p: PlayerData, currentPlayer: PlayerData) {
        return (
            <div key={p.userId} className={'Player'}>
                <div>
                    {p.userId === currentPlayer.userId ? <span>=></span>: null}
                    {p.userId}
                </div>
            </div>
        );
    }

    private shouldShowInitialSkillSelection(): boolean {
        if (!this.state.player) {
            return false;
        }
        const g = this.state.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveInitialSkills;
        return r;
    }

    private shouldShowSkillSelection(): boolean {
        if (!this.state.player) {
            return false;
        }
        const g = this.state.game;
        const r = g && g.inputRequest.userId === g.players[0].userId &&
            g.inputRequest.inputId === InputId.ReceiveSkills;
        return r;
    }

    private getAvailableInitialSkills(): SkillType[] {
        if (!this.shouldShowInitialSkillSelection()) {
            return [];
        }
        const character = getCharacter(this.state.player.characterId);
        const skills = [];
        character.cardsDue.forEach(d => skills.push(...d.skills));
        return skills;
    }

    private getMultiSkills(): [number, SkillType[]] {
        if (!this.shouldShowSkillSelection()) {
            return [0, []];
        }
        const character = getCharacter(this.state.player.characterId);
        const skills = [];
        let count = 0;
        character.cardsDue
            .filter(d => d.skills.length > 1)
            .forEach(d => {
                count += d.count;
                skills.push(...d.skills);
            });
        return [count, skills];
    }
}
