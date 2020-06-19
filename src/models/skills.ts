import { FullPlayer } from "../../functions/src/game";
import { SkillCard, SkillCardType, SkillType } from "./game-data";
import eng_repair_01 from '../images/BSG_Skill_Eng_Repair_1.png';
import eng_repair_02 from '../images/BSG_Skill_Eng_Repair_2.png';
import eng_research_03 from '../images/BSG_Skill_Eng_Sci_Research_3.png';
import eng_research_04 from '../images/BSG_Skill_Eng_Sci_Research_4.png';
import eng_research_05 from '../images/BSG_Skill_Eng_Sci_Research_5.png';
import lead_xo_01 from '../images/BSG_Skill_Led_XO_1.png';
import lead_xo_02 from '../images/BSG_Skill_Led_XO_2.png';
import lead_dec_em_03 from 'BSG_Skill_Led_Dec Emergency_3.png';
import lead_dec_em_04 from 'BSG_Skill_Led_Dec Emergency_4.png';
import lead_dec_em_05 from 'BSG_Skill_Led_Dec Emergency_5.png';
import pilot_evasive_01 from 'BSG_Skill_Pil_Evasive_1.png';
import pilot_evasive_02 from 'BSG_Skill_Pil_Evasive_2.png';
import pilot_max_fire_03 from 'BSG_Skill_Pil_Maximum_3.png';
import pilot_max_fire_04 from 'BSG_Skill_Pil_Maximum_4.png';
import pilot_max_fire_05 from 'BSG_Skill_Pil_Maximum_5.png';
import pol_con_power_01 from 'BSG_Skill_Pol_Con_Power_1.png';
import pol_con_power_02 from 'BSG_Skill_Pol_Con_Power_2.png';
import pol_inv_com_03 from 'BSG_Skill_Pol_Inv Committee_3.png';
import pol_inv_com_04 from 'BSG_Skill_Pol_Inv Committee_4.png';
import pol_inv_com_05 from 'BSG_Skill_Pol_Inv Committee_5.png';
import tac_launch_scout_01 from 'BSG_Skill_Tac_Launch_Scout_1.png';
import tac_launch_scout_02 from 'BSG_Skill_Tac_Launch_Scout_2.png';
import tac_strategic_03 from 'BSG_Skill_Tac_Strat_3.png';
import tac_strategic_04 from 'BSG_Skill_Tac_Strat_4.png';
import tac_strategic_05 from 'BSG_Skill_Tac_Strat_5.png';

export function findMatchingSkillCard(player: FullPlayer, card: SkillCard): SkillCard {
    return player.skillCards.find(s => s.strength === card.strength &&
        s.type === card.type &&
        s.cardType === card.cardType);
}

const cards = {
    [SkillType[SkillType.Piloting]]: {
        [SkillCardType[SkillCardType.EvasiveManeuvers]]: {
            1: pilot_evasive_01,
            2: pilot_evasive_02
        },
        [SkillCardType[SkillCardType.MaximumFirepower]]: {
            3: pilot_max_fire_03,
            4: pilot_max_fire_04,
            5: pilot_max_fire_05,
        }
    },
    [SkillType[SkillType.Engineering]]: {
        [SkillCardType[SkillCardType.Repair]]: {
            1: eng_repair_01,
            2: eng_repair_02
        },
        [SkillCardType[SkillCardType.ScientificResearch]]: {
            3: eng_research_03,
            4: eng_research_04,
            5: eng_research_05,
        }
    },
    [SkillType[SkillType.Leadership]]: {
        [SkillCardType[SkillCardType.ExecutiveOrder]]: {
            1: lead_xo_01,
            2: lead_xo_02
        },
        [SkillCardType[SkillCardType.DeclareEmergency]]: {
            3: lead_dec_em_03,
            4: lead_dec_em_04,
            5: lead_dec_em_05,
        }
    },
    [SkillType[SkillType.Politics]]: {
        [SkillCardType[SkillCardType.ConsolidatePower]]: {
            1: pol_con_power_01,
            2: pol_con_power_02,
        },
        [SkillCardType[SkillCardType.InvestigativeCommittee]]: {
            3: pol_inv_com_03,
            4: pol_inv_com_04,
            5: pol_inv_com_05,
        }
    },
    [SkillType[SkillType.Tactics]]: {
        [SkillCardType[SkillCardType.LaunchScout]]: {
            1: tac_launch_scout_01,
            2: tac_launch_scout_02,
        },
        [SkillCardType[SkillCardType.StrategicPlanning]]: {
            3: tac_strategic_03,
            4: tac_strategic_04,
            5: tac_strategic_05,
        }
    }
}
export function getSkillCardImage(skillCard: SkillCard) {
    const type = SkillType[skillCard.type];
    const cardType = SkillCardType[skillCard.cardType];
    return cards[type][cardType][skillCard.strength];
}
