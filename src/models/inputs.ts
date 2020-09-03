export enum InputId {
    SelectCharacter,
    SelectInitialLocation,
    ReceiveInitialSkills,
    ReceiveSkills,
    Movement,
    SelectAction,
    ActionConsolidatePowerSkillSelect,
    ActionArrestOrderPlayerSelect,
    ActionResearchLabSkillSelect,
    ActionEncourageMutinyPlayerSelect,
    SelectCrisisAction,
    ActionPresidentialPardon,
    PlayerSelect,
    SkillCardSelect,
    LocationSelect,
    SkillTypeSelect,
    BeforeSkillCheckSelect,
    AfterSkillCheckTotaled,
    CommandAuthority,
    BeforeRollSelect,
    ReRollSelect
}

export interface InputRequest<T extends any = undefined> {
    userId: string;
    inputId: InputId;
    ctx?: T;
}

export interface InputResponse<T> {
    userId: string;
    inputId: InputId;
    data: T;
}

export interface Input<S, T extends any = undefined> extends InputRequest<T>, InputResponse<S>{}
