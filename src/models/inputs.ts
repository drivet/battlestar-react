import { CharacterId, LocationId, SkillCard, SkillType } from "./game-data";
import { CharacterPool } from "../../functions/src/character";

export enum InputId {
    SelectCharacter,
    SelectInitialLocation,
    ReceiveInitialSkills,
    ReceiveSkills,
    Movement
}

export interface InputRequest {
    userId: string;
    inputId: InputId;
}

export interface InputResponse {
    userId: string;
    inputId: InputId;
}

export interface CharacterSelectionRequest extends InputRequest {
    characterPool: CharacterPool;
}

export interface CharacterSelectionResponse extends InputResponse {
    selectedCharacter: CharacterId;
}

export interface CharacterSelectionInput extends CharacterSelectionRequest, CharacterSelectionResponse {}

export interface InitialLocationResponse extends InputResponse {
    left: boolean;
}

export interface InitialLocationInput extends InputRequest, InitialLocationResponse {}

export interface ReceiveInitialSkillsResponse extends InputResponse {
    skills: SkillType[];
}

export interface ReceiveInitialSkillsInput extends InputRequest, ReceiveInitialSkillsResponse {}

export interface ReceiveSkillsResponse extends InputResponse {
    skills: SkillType[];
}

export interface ReceiveSkillsInput extends InputRequest, ReceiveInitialSkillsResponse {}

export interface MoveSelectionRequest extends InputRequest {
    availableLocations: LocationId[];
}

export interface MoveSelectionResponse extends InputResponse {
    location: LocationId;
    discardedSkill?: SkillCard;
}

export interface MoveSelectionInput extends InputRequest, MoveSelectionResponse {
}