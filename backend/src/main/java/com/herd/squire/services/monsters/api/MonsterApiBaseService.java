package com.herd.squire.services.monsters.api;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.SpellSlots;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.items.ItemListObject;
import com.herd.squire.models.items.ItemQuantity;
import com.herd.squire.models.items.ItemType;
import com.herd.squire.models.monsters.ChallengeRating;
import com.herd.squire.models.monsters.MonsterAttackDamage;
import com.herd.squire.models.powers.AttackType;
import com.herd.squire.services.powers.PowerApiService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MonsterApiBaseService {
    protected static final int STR_ID = 1;
    protected static final int DEX_ID = 2;
    protected static final int CON_ID = 3;
    protected static final int INT_ID = 4;
    protected static final int WIS_ID = 5;
    protected static final int CHA_ID = 6;

    protected static final int ACROBATICS_ID = 1;
    protected static final int ANIMAL_HANDLING_ID = 2;
    protected static final int ARCANA_ID = 3;
    protected static final int ATHLETICS_ID = 4;
    protected static final int DECEPTION_ID = 5;
    protected static final int HISTORY_ID = 6;
    protected static final int INSIGHT_ID = 7;
    protected static final int INTIMIDATION_ID = 8;
    protected static final int INVESTIGATION_ID = 9;
    protected static final int MEDICINE_ID = 10;
    protected static final int NATURE_ID = 11;
    protected static final int PERCEPTION_ID = 12;
    protected static final int PERFORMANCE_ID = 13;
    protected static final int PERSUASION_ID = 14;
    protected static final int RELIGION_ID = 15;
    protected static final int SLEIGHT_OF_HAND_ID = 16;
    protected static final int STEALTH_ID = 17;
    protected static final int SURVIVAL_ID = 18;

    protected static final int COMMON_ID = 1;
    protected static final int DWARVISH_ID = 2;
    protected static final int ELVISH_ID = 3;
    protected static final int GIANT_LANG_ID = 4;
    protected static final int GNOMISH_ID = 5;
    protected static final int GOBLIN_LANG_ID = 6;
    protected static final int HALFLING_LANG_ID = 7;
    protected static final int ORC_LANG_ID = 8;
    protected static final int ABYSSAL_ID = 9;
    protected static final int CELESTIAL_LANGUAGE_ID = 10;
    protected static final int DRACONIC_ID = 11;
    protected static final int DEEP_SPEECH_ID = 12;
    protected static final int INFERNAL_ID = 13;
    protected static final int PRIMORDIAL_ID = 14;
    protected static final int SYLVAN_ID = 15;
    protected static final int UNDERCOMMON_ID = 16;
    protected static final int DRUIDIC_ID = 17;
    protected static final int THIEVES_CANT_ID = 18;
    protected static final int SPHINX_ID = 19;
    protected static final int IGNAN_ID = 20;
    protected static final int AQUAN_ID = 21;
    protected static final int AURAN_ID = 22;
    protected static final int TERRAN_ID = 23;
    protected static final int OTYUGH_ID = 24;
    protected static final int GNOLL_ID = 25;
    protected static final int SAHUAGIN_ID = 26;

    protected static final int ABERRATION_ID = 1;
    protected static final int BEAST_ID = 2;
    protected static final int CELESTIAL_ID = 3;
    protected static final int CONSTRUCT_ID = 4;
    protected static final int DRAGON_ID = 5;
    protected static final int ELEMENTAL_ID = 6;
    protected static final int FEY_ID = 7;
    protected static final int FIEND_ID = 8;
    protected static final int GIANT_ID = 9;
    protected static final int HUMANOID_ID = 10;
    protected static final int MONSTROSITY_ID = 11;
    protected static final int OOZE_ID = 12;
    protected static final int PLANT_ID = 13;
    protected static final int UNDEAD_ID = 14;

    protected static final int BLINDED_ID = 1;
    protected static final int CHARMED_ID = 2;
    protected static final int DEAFENED_ID = 3;
    protected static final int FRIGHTENED_ID = 4;
    protected static final int GRAPPLED_ID = 5;
    protected static final int INCAPACITATED_ID = 6;
    protected static final int INVISIBLE_ID = 7;
    protected static final int PARALYZED_ID = 8;
    protected static final int PETRIFIED_ID = 9;
    protected static final int POISONED_ID = 10;
    protected static final int PRONE_ID = 11;
    protected static final int RESTRAINED_ID = 12;
    protected static final int STUNNED_ID = 13;
    protected static final int UNCONSCIOUS_ID = 14;
    protected static final int EXHAUSTION_ID = 15;

    protected static final int ARMOR_LEATHER_ID = 2;
    protected static final int ARMOR_STUDDED_LEATHER_ID = 3;
    protected static final int ARMOR_HIDE_ID = 4;
    protected static final int ARMOR_CHAIN_SHIRT_ID = 5;
    protected static final int ARMOR_SCALE_MAIL_ID = 6;
    protected static final int ARMOR_BREASTPLATE_ID = 7;
    protected static final int ARMOR_CHAIN_MAIL_ID = 10;
    protected static final int ARMOR_SPLINT_ID = 11;
    protected static final int ARMOR_PLATE_ID = 12;
    protected static final int ARMOR_SHIELD_ID = 13;
    protected static final int AMMO_START = 14;
    protected static final int ARROW_ID = 1 + AMMO_START;
    protected static final int CROSSBOW_BOLT_ID = 3 + AMMO_START;
    protected static final int SLING_BULLET_ID = 4 + AMMO_START;
    protected static final int WEAPON_CATEGORY_START = 169;
    protected static final int CLUB_ID = 1 + WEAPON_CATEGORY_START;
    protected static final int DAGGER_ID = 2 + WEAPON_CATEGORY_START;
    protected static final int GREATCLUB_ID = 3 + WEAPON_CATEGORY_START;
    protected static final int JAVELIN_ID = 5 + WEAPON_CATEGORY_START;
    protected static final int MACE_ID = 7 + WEAPON_CATEGORY_START;
    protected static final int QUARTERSTAFF_ID = 8 + WEAPON_CATEGORY_START;
    protected static final int SPEAR_ID = 10 + WEAPON_CATEGORY_START;
    protected static final int LIGHT_CROSSBOW_ID = 12 + WEAPON_CATEGORY_START;
    protected static final int DART_ID = 13 + WEAPON_CATEGORY_START;
    protected static final int SHORTBOW_ID = 14 + WEAPON_CATEGORY_START;
    protected static final int SLING_ID = 15 + WEAPON_CATEGORY_START;
    protected static final int BATTLEAXE_ID = 16 + WEAPON_CATEGORY_START;
    protected static final int GLAIVE_ID = 18 + WEAPON_CATEGORY_START;
    protected static final int GREATAXE_ID = 19 + WEAPON_CATEGORY_START;
    protected static final int GREATSWORD_ID = 20 + WEAPON_CATEGORY_START;
    protected static final int LONGSWORD_ID = 23 + WEAPON_CATEGORY_START;
    protected static final int MAUL_ID = 24 + WEAPON_CATEGORY_START;
    protected static final int MORNINGSTAR_ID = 25 + WEAPON_CATEGORY_START;
    protected static final int PIKE_ID = 26 + WEAPON_CATEGORY_START;
    protected static final int RAPIER_ID = 27 + WEAPON_CATEGORY_START;
    protected static final int SCIMITAR_ID = 28 + WEAPON_CATEGORY_START;
    protected static final int SHORTSWORD_ID = 29 + WEAPON_CATEGORY_START;
    protected static final int WAR_PICK_ID = 31 + WEAPON_CATEGORY_START;
    protected static final int WAR_HAMMER_ID = 32 + WEAPON_CATEGORY_START;
    protected static final int WHIP_ID = 33 + WEAPON_CATEGORY_START;
    protected static final int HAND_CROSSBOW_ID = 35 + WEAPON_CATEGORY_START;
    protected static final int HEAVY_CROSSBOW_ID = 36 + WEAPON_CATEGORY_START;
    protected static final int LONGBOW_ID = 37 + WEAPON_CATEGORY_START;

    protected static final String tiny = "@tinyId";
    protected static final String small = "@smallId";
    protected static final String medium = "@mediumId";
    protected static final String large = "@largeId";
    protected static final String huge = "@hugeId";
    protected static final String gargantuan = "@garguantuanId";

    protected static final String lawfulGood = "@LawfulGoodAlignmentId";
    protected static final String neutralGood = "@NeutralGoodAlignmentId";
    protected static final String chaoticGood = "@ChaoticGoodAlignmentId";
    protected static final String lawfulNeutral = "@LawfulNeutralAlignmentId";
    protected static final String neutral = "@NeutralAlignmentId";
    protected static final String chaoticNeutral = "@ChaoticNeutralAlignmentId";
    protected static final String lawfulEvil = "@LawfulEvilAlignmentId";
    protected static final String neutralEvil = "@NeutralEvilAlignmentId";
    protected static final String chaoticEvil = "@ChaoticEvilAlignmentId";
    protected static final String unaligned = "null";
    protected static final String any = "null";

    protected static final String demon = "Demon";
    protected static final String devil = "Devil";
    protected static final String goblinoid = "Goblinoid";
    protected static final String shapeChanger = "Shapechanger";
    protected static final String humanShapechanger = "Human, Shapechanger";
    protected static final String titan = "Titan";

    protected static final String acid = "@acidDamageTypeId";
    protected static final String bludgeoning = "@bludgeoningDamageTypeId";
    protected static final String cold = "@coldDamageTypeId";
    protected static final String fire = "@fireDamageTypeId";
    protected static final String force = "@forceDamageTypeId";
    protected static final String lightning = "@lightningDamageTypeId";
    protected static final String necrotic = "@necroticDamageTypeId";
    protected static final String piercing = "@piercingDamageTypeId";
    protected static final String poison = "@poisonDamageTypeId";
    protected static final String psychic = "@psychicDamageTypeId";
    protected static final String radiant = "@radiantDamageTypeId";
    protected static final String slashing = "@slashingDamageTypeId";
    protected static final String thunder = "@thunderDamageTypeId";

    protected static final String nonmagical = "from nonmagical attacks";
    protected static final String silvered = "from nonmagical attacks not made with silvered weapons";
    protected static final String adamantine = "from nonmagical attacks that aren''t adamantine";

    protected final List<MonsterApi> monsters;

    public MonsterApiBaseService() {
        this.monsters = new ArrayList<>();
    }

    /*********************************************************************************************************/

    protected void insert(String name, int monsterType, String typeVariation, int ac, int hpNumDice,
                        int speed, String size, String alignment, ChallengeRating challengeRating,
                        int str, int dex, int con, int intelligence, int wis, int cha,
                        List<Integer> languageProfs, List<Integer> savingThrowProfs,
                        List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, 0, 0, 0, 0, false, 0, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, false, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, null, null, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insertInnate(String name, int monsterType, String typeVariation, int ac, int hpNumDice,
                              int speed, String size, String alignment, ChallengeRating challengeRating,
                              int str, int dex, int con, int intelligence, int wis, int cha,
                              List<String> innateSpells, List<Integer> languageProfs, List<Integer> savingThrowProfs,
                              List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, 0, 0, 0, 0, false, 0, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, true, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, null, innateSpells, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insert(String name, boolean legendary, int monsterType, String typeVariation, int ac, int hpNumDice,
                        int speed, String size, String alignment, ChallengeRating challengeRating,
                        int str, int dex, int con, int intelligence, int wis, int cha,
                        List<Integer> languageProfs, List<Integer> savingThrowProfs,
                        List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, 0, 0, 0, 0, false, 0, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, false, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                legendary ? 3 : 0, 0, 0, 0, 0, 0, null, null, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insert(String name, int monsterType, String typeVariation, int ac, int hpNumDice,
                        int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                        String size, String alignment, ChallengeRating challengeRating,
                        int str, int dex, int con, int intelligence, int wis, int cha,
                        List<Integer> languageProfs, List<Integer> savingThrowProfs,
                        List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, false, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, null, null, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insertInnate(String name, int monsterType, String typeVariation, int ac, int hpNumDice,
                              int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                              String size, String alignment, ChallengeRating challengeRating,
                              int str, int dex, int con, int intelligence, int wis, int cha,
                              List<String> innateSpells, List<Integer> languageProfs, List<Integer> savingThrowProfs,
                              List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, true, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, null, innateSpells, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insert(String name, boolean legendary, int monsterType, String typeVariation, int ac, int hpNumDice,
                        int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                        String size, String alignment, ChallengeRating challengeRating,
                        int str, int dex, int con, int intelligence, int wis, int cha,
                        List<Integer> languageProfs, List<Integer> savingThrowProfs,
                        List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, false, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                legendary ? 3 : 0, 0, 0, 0, 0, 0, null, null, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insertInnate(String name, int monsterType, String typeVariation, int ac, int hpNumDice,
                              int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                              String size, String alignment, ChallengeRating challengeRating,
                              int str, int dex, int con, int intelligence, int wis, int cha,
                              Integer innateAbilityId, int innateSaveDC, int innateAttackMod, List<String> innateSpells,
                              List<Integer> languageProfs, List<Integer> savingThrowProfs,
                              List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, true, null, null, null, innateAbilityId, 0, 0, innateSaveDC, innateAttackMod, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, null, innateSpells, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insertInnate(String name, boolean legendary, int monsterType, String typeVariation, int ac, int hpNumDice,
                              int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                              String size, String alignment, ChallengeRating challengeRating,
                              int str, int dex, int con, int intelligence, int wis, int cha,
                              Integer innateAbilityId, int innateSaveDC, int innateAttackMod, List<String> innateSpells,
                              List<Integer> languageProfs, List<Integer> savingThrowProfs,
                              List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, false, true, null, null, null, innateAbilityId, 0, 0, innateSaveDC, innateAttackMod, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                legendary ? 3 : 0, 0, 0, 0, 0, 0, null, innateSpells, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insertCaster(String name, int monsterType, String typeVariation, int ac, int hpNumDice,
                                int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                                String size, String alignment, ChallengeRating challengeRating,
                                int str, int dex, int con, int intelligence, int wis, int cha,
                                String casterTypeId, String casterLevelId, Integer spellcastingAbilityId, int saveDC, int attackMod,
                                int level1Slots, int level2Slots, int level3Slots, int level4Slots, int level5Slots, int level6Slots, int level7Slots, int level8Slots, int level9Slots,
                                List<String> spells, List<Integer> languageProfs, List<Integer> savingThrowProfs,
                                List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, true, false, casterTypeId, casterLevelId, spellcastingAbilityId, null, saveDC, attackMod, 0, 0, level1Slots, level2Slots, level3Slots, level4Slots, level5Slots, level6Slots, level7Slots, level8Slots, level9Slots,
                0, 0, 0, 0, 0, 0, spells, null, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected void insertCaster(String name, boolean legendary, int monsterType, String typeVariation, int ac, int hpNumDice,
                                int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                                String size, String alignment, ChallengeRating challengeRating,
                                int str, int dex, int con, int intelligence, int wis, int cha,
                                String casterTypeId, String casterLevelId, Integer spellcastingAbilityId, int saveDC, int attackMod,
                                int level1Slots, int level2Slots, int level3Slots, int level4Slots, int level5Slots, int level6Slots, int level7Slots, int level8Slots, int level9Slots,
                                List<String> spells, List<Integer> languageProfs, List<Integer> savingThrowProfs,
                                List<Integer> skillProfs, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        insert(name, monsterType, typeVariation, ac, hpNumDice, 0, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment,
                challengeRating, str, dex, con, intelligence, wis, cha, true, false, casterTypeId, casterLevelId, spellcastingAbilityId, null, saveDC, attackMod, 0, 0, level1Slots, level2Slots, level3Slots, level4Slots, level5Slots, level6Slots, level7Slots, level8Slots, level9Slots,
                legendary ? 3 : 0, 0, 0, 0, 0, 0, spells, null, languageProfs, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);
    }

    protected DiceSize getDiceSizeBasedOnMonsterSize(String monsterSize) {
        switch(monsterSize){
            case tiny:
                return DiceSize.FOUR;
            case small:
                return DiceSize.SIX;
            case medium:
                return DiceSize.EIGHT;
            case large:
                return DiceSize.TEN;
            case huge:
                return DiceSize.TWELVE;
            case gargantuan:
                return DiceSize.TWENTY;
            default:
                return DiceSize.FOUR;
        }
    }

    protected List<String> getSpellIds(String spellNames){
        List<String> ids = new ArrayList<>();
        String[] names = spellNames.split(",");
        for (int i = 0; i < names.length; i++) {
            String name = names[i].trim();
            ids.add(PowerApiService.getIdValue(name));
        }
        return ids;
    }

    protected String getMonsterType(int monsterType) {
        switch (monsterType) {
            case ABERRATION_ID:
                return "@AberrationMonsterTypeId";
            case BEAST_ID:
                return "@BeastMonsterTypeId";
            case CELESTIAL_ID:
                return "@CelestialMonsterTypeId";
            case CONSTRUCT_ID:
                return "@ConstructMonsterTypeId";
            case DRAGON_ID:
                return "@DragonMonsterTypeId";
            case ELEMENTAL_ID:
                return "@ElementalMonsterTypeId";
            case FEY_ID:
                return "@FeyMonsterTypeId";
            case FIEND_ID:
                return "@FiendMonsterTypeId";
            case GIANT_ID:
                return "@GiantMonsterTypeId";
            case HUMANOID_ID:
                return "@HumanoidMonsterTypeId";
            case MONSTROSITY_ID:
                return "@MonstrosityMonsterTypeId";
            case OOZE_ID:
                return "@OozeMonsterTypeId";
            case PLANT_ID:
                return "@PlantMonsterTypeId";
            case UNDEAD_ID:
                return "@UndeadMonsterTypeId";
        }
        return null;
    }

    protected List<String> getSkillProfs(List<Integer> skills) {
        List<String> profs = new ArrayList<>();
        if (skills != null) {
            for (Integer skill : skills) {
                String id = getSkill(skill);
                if (id != null) {
                    profs.add(id);
                }
            }
        }
        return profs;
    }

    protected String getSkill(Integer skill) {
        if (skill == null) {
            return null;
        }
        switch (skill) {
            case ACROBATICS_ID:
                return "@acrobaticsId";
            case ANIMAL_HANDLING_ID:
                return "@animalHandlingId";
            case ARCANA_ID:
                return "@arcanaId";
            case ATHLETICS_ID:
                return "@athleticsId";
            case DECEPTION_ID:
                return "@deceptionId";
            case HISTORY_ID:
                return "@historyId";
            case INSIGHT_ID:
                return "@insightId";
            case INTIMIDATION_ID:
                return "@intimidationId";
            case INVESTIGATION_ID:
                return "@investigationId";
            case MEDICINE_ID:
                return "@medicineId";
            case NATURE_ID:
                return "@natureId";
            case PERCEPTION_ID:
                return "@perceptionId";
            case PERFORMANCE_ID:
                return "@performanceId";
            case PERSUASION_ID:
                return "@persuasionId";
            case RELIGION_ID:
                return "@religionId";
            case SLEIGHT_OF_HAND_ID:
                return "@sleightOfHandId";
            case STEALTH_ID:
                return "@stealthId";
            case SURVIVAL_ID:
                return "@survivalId";
        }
        return null;
    }

    protected List<String> getLanguageProfs(List<Integer> languages) {
        List<String> profs = new ArrayList<>();
        if (languages != null) {
            for (Integer language : languages) {
                String id = getLanguage(language);
                if (id != null) {
                    profs.add(id);
                }
            }
        }
        return profs;
    }

    protected String getLanguage(Integer language) {
        if (language == null) {
            return null;
        }
        switch (language) {
            case COMMON_ID:
                return "@commonId";
            case DWARVISH_ID:
                return "@dwarvishId";
            case ELVISH_ID:
                return "@elvishId";
            case GIANT_LANG_ID:
                return "@giantLangId";
            case GNOMISH_ID:
                return "@gnomishId";
            case GOBLIN_LANG_ID:
                return "@goblinLangId";
            case HALFLING_LANG_ID:
                return "@halflingLangId";
            case ORC_LANG_ID:
                return "@orcLangId";
            case ABYSSAL_ID:
                return "@abyssalId";
            case CELESTIAL_LANGUAGE_ID:
                return "@celestialId";
            case DRACONIC_ID:
                return "@draconicId";
            case DEEP_SPEECH_ID:
                return "@deepSpeechId";
            case INFERNAL_ID:
                return "@infernalId";
            case PRIMORDIAL_ID:
                return "@primordialId";
            case SYLVAN_ID:
                return "@sylvanId";
            case UNDERCOMMON_ID:
                return "@undercommonId";
            case DRUIDIC_ID:
                return "@druidicId";
            case THIEVES_CANT_ID:
                return "@thievesCantId";
            case SPHINX_ID:
                return "@sphinxId";
            case IGNAN_ID:
                return "@ignanId";
            case AQUAN_ID:
                return "@aquanId";
            case AURAN_ID:
                return "@auranId";
            case TERRAN_ID:
                return "@terranId";
            case OTYUGH_ID:
                return "@otyughId";
            case GNOLL_ID:
                return "@gnollId";
            case SAHUAGIN_ID:
                return "@sahuginId";
        }
        return null;
    }

    protected List<String> getSavingThrowProfs(List<Integer> savingThrows) {
        List<String> profs = new ArrayList<>();
        if (savingThrows != null) {
            for (Integer ability : savingThrows) {
                String id = getAbility(ability);
                if (id != null) {
                    profs.add(id);
                }
            }
        }
        return profs;
    }

    public static String getAbility(Integer ability) {
        if (ability == null) {
            return null;
        }
        switch (ability) {
            case STR_ID:
                return "@strId";
            case DEX_ID:
                return "@dexId";
            case CON_ID:
                return "@conId";
            case INT_ID:
                return "@intId";
            case WIS_ID:
                return "@wisId";
            case CHA_ID:
                return "@chaId";
        }
        return null;
    }

    protected List<String> getConditionImmunities(List<Integer> conditions) {
        List<String> profs = new ArrayList<>();
        if (conditions != null) {
            for (Integer condition : conditions) {
                String id = getCondition(condition);
                if (id != null) {
                    profs.add(id);
                }
            }
        }
        return profs;
    }

    protected String getCondition(Integer condition) {
        if (condition == null) {
            return null;
        }
        switch (condition) {
            case BLINDED_ID:
                return "@BlindedConditionId";
            case CHARMED_ID:
                return "@CharmedConditionId";
            case DEAFENED_ID:
                return "@DeafenedConditionId";
//            case EXHAUSTION_ID:
//                return "@ExhaustionConditionId";
            case FRIGHTENED_ID:
                return "@FrightenedConditionId";
            case GRAPPLED_ID:
                return "@GrappledConditionId";
            case INCAPACITATED_ID:
                return "@IncapacitatedConditionId";
            case INVISIBLE_ID:
                return "@InvisibleConditionId";
            case PARALYZED_ID:
                return "@ParalyzedConditionId";
            case PETRIFIED_ID:
                return "@PetrifiedConditionId";
            case POISONED_ID:
                return "@PoisonedConditionId";
            case PRONE_ID:
                return "@ProneConditionId";
            case RESTRAINED_ID:
                return "@RestrainedConditionId";
            case STUNNED_ID:
                return "@StunnedConditionId";
            case UNCONSCIOUS_ID:
                return "@UnconsciousConditionId";
        }
        return null;
    }

    protected List<ItemQuantity> getItems(List<ListObject> equipment) {
        List<ItemQuantity> items = new ArrayList<>();
        if (equipment != null) {
            for (ListObject item : equipment) {
                String itemId = getItem(Integer.parseInt(item.getId()));
                if (itemId != null) {
                    ItemQuantity itemQuantity = new ItemQuantity(
                            new ItemListObject(itemId, "", 0, false, 0, "0", ItemType.GEAR),
                            item.getSid()
                    );
                    items.add(itemQuantity);
                }
            }
        }
        return items;
    }

    public static String getItem(Integer itemId) {
        if (itemId == null) {
            return null;
        }
        switch (itemId) {
            case ARMOR_LEATHER_ID:
                return "@LeatherId";
            case ARMOR_STUDDED_LEATHER_ID:
                return "@StuddedLeatherId";
            case ARMOR_HIDE_ID:
                return "@HideId";
            case ARMOR_CHAIN_SHIRT_ID:
                return "@ChainShirtId";
            case ARMOR_SCALE_MAIL_ID:
                return "@ScaleMailId";
            case ARMOR_BREASTPLATE_ID:
                return "@BreastplateId";
            case ARMOR_CHAIN_MAIL_ID:
                return "@ChainMailId";
            case ARMOR_SPLINT_ID:
                return "@SplintId";
            case ARMOR_PLATE_ID:
                return "@PlateId";
            case ARMOR_SHIELD_ID:
                return "@ShieldItemId";
            case ARROW_ID:
                return "@ArrowId";
            case CROSSBOW_BOLT_ID:
                return "@CrossbowBoltId";
            case SLING_BULLET_ID:
                return "@SlingBulletId";
            case CLUB_ID:
                return "@clubId";
            case DAGGER_ID:
                return "@daggerId";
            case GREATCLUB_ID:
                return "@greatclubId";
            case JAVELIN_ID:
                return "@javelinId";
            case MACE_ID:
                return "@maceId";
            case QUARTERSTAFF_ID:
                return "@quarterstaffId";
            case SPEAR_ID:
                return "@spearId";
            case LIGHT_CROSSBOW_ID:
                return "@lightCrossbowId";
            case DART_ID:
                return "@dartId";
            case SHORTBOW_ID:
                return "@shortBowId";
            case SLING_ID:
                return "@slingId";
            case BATTLEAXE_ID:
                return "@battleaxeId";
            case GLAIVE_ID:
                return "@glaiveId";
            case GREATAXE_ID:
                return "@greataxeId";
            case GREATSWORD_ID:
                return "@greatswordId";
            case LONGSWORD_ID:
                return "@longswordId";
            case MAUL_ID:
                return "@maulId";
            case MORNINGSTAR_ID:
                return "@morningstarId";
            case PIKE_ID:
                return "@pikeId";
            case RAPIER_ID:
                return "@rapierId";
            case SCIMITAR_ID:
                return "@scimitarId";
            case SHORTSWORD_ID:
                return "@shortswordId";
            case WAR_PICK_ID:
                return "@warPickId";
            case WAR_HAMMER_ID:
                return "@warHammerId";
            case WHIP_ID:
                return "@whipId";
            case HAND_CROSSBOW_ID:
                return "@handCrossbowId";
            case HEAVY_CROSSBOW_ID:
                return "@heavyCrossbowId";
            case LONGBOW_ID:
                return "@longBowId";
        }
        return null;
    }

    protected void insert(String name, int monsterType, String typeVariation, int ac, int hpNumDice, int hpMod,
                        int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                        String size, String alignment, ChallengeRating challengeRating,
                        int str, int dex, int con, int intelligence, int wis, int cha,
                        boolean spellcaster, boolean innateSpellcaster, String casterTypeId, String casterLevelId, Integer spellcastingAbilityId, Integer innateSpellcastingAbilityId, int spellSaveDC,
                        int spellAttackMod, int innateSpellSaveDC, int innateSpellAttackMod,
                        int level1Slots, int level2Slots, int level3Slots, int level4Slots, int level5Slots, int level6Slots,
                        int level7Slots, int level8Slots, int level9Slots, int legendaryPoints,
                        long pp, long gp, long ep, long sp, long cp,
                        List<String> spells, List<String> innateSpells, List<Integer> languageProfIds, List<Integer> savingThrowProfIds,
                        List<Integer> skillProfIds, List<MonsterDamageModifierApi> damageModifiers, List<Integer> conditionImmunityIds,
                        List<MonsterSenseApi> senses, List<MonsterActionApi> actions, List<MonsterFeatureApi> features, List<ListObject> equipment){
        DiceSize hpDiceSize = getDiceSizeBasedOnMonsterSize(size);
        SpellSlots spellSlots = new SpellSlots(null, level1Slots, level2Slots, level3Slots, level4Slots, level5Slots, level6Slots, level7Slots, level8Slots, level9Slots);
        List<String> skillProfs = getSkillProfs(skillProfIds);
        List<String> languageProfs = getLanguageProfs(languageProfIds);
        List<String> savingThrowProfs = getSavingThrowProfs(savingThrowProfIds);
        List<String> conditionImmunities = getConditionImmunities(conditionImmunityIds);
        List<ItemQuantity> items = getItems(equipment);

        if (spells == null) {
            spells = new ArrayList<>();
        }
        if (innateSpells == null) {
            innateSpells = new ArrayList<>();
        }
        if (damageModifiers == null) {
            damageModifiers = new ArrayList<>();
        }
        if (senses == null) {
            senses = new ArrayList<>();
        }
        if (actions == null) {
            actions = new ArrayList<>();
        }
        if (features == null) {
            features = new ArrayList<>();
        }

        MonsterApi monster = new MonsterApi(name, getMonsterType(monsterType), typeVariation, ac, hpNumDice, hpDiceSize,
                hpMod, speed, crawling, climbing, swimming, flying, hover, burrow, size, alignment, challengeRating,
                challengeRating.getExp(), str, dex, con, intelligence, wis, cha, spellcaster, innateSpellcaster, casterTypeId, casterLevelId,
                getAbility(spellcastingAbilityId), getAbility(innateSpellcastingAbilityId), spellSaveDC, spellAttackMod, innateSpellSaveDC,
                innateSpellAttackMod, spellSlots, legendaryPoints, spells, innateSpells, skillProfs,
                languageProfs, savingThrowProfs, damageModifiers, conditionImmunities, senses, actions,
                features, items);
        this.monsters.add(monster);
    }

    protected MonsterDamageModifierApi createModifier(String damage, DamageModifierType type, String condition) {
        return new MonsterDamageModifierApi(damage, type, condition);
    }

    protected MonsterAttackDamage createMonsterAttackDamage(int attackType, int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod){
        return new MonsterAttackDamage(0, 0, attackType, numDice, diceSize, damageType, damageAbilityId, damageMod);
    }

    protected MonsterActionApi createAction(String name, String notes) throws Exception {
        return createAction(name, MonsterActionType.NORMAL, false, MonsterActionAttackType.WEAPON_MELEE, 0, "", null, false, AttackType.ATTACK, 0, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, 0, null, null, notes);
    }

    protected MonsterActionApi createReaction(String name, String notes) throws Exception {
        return createAction(name, MonsterActionType.REACTION, false, MonsterActionAttackType.WEAPON_MELEE, 0, "", null, false, AttackType.ATTACK, 0, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, 0, null, null, notes);
    }

    protected MonsterActionApi createAction(String name, MonsterLimitedUseType limitedUseType, int numPerDay, int min, int max, String notes) throws Exception {
        return createAction(name, MonsterActionType.NORMAL, false, MonsterActionAttackType.WEAPON_MELEE, 0, "", null, false, AttackType.ATTACK, 0, 0, null, false, 0, 0,
                true, limitedUseType, numPerDay, min, max, false, true, 0, null, null, notes);
    }

    protected MonsterActionApi createAction(String name, MonsterLimitedUseType limitedUseType, int numPerDay, int min, int max, boolean rechargeOnShort, boolean rechargeOnLong, String notes) throws Exception {
        return createAction(name, MonsterActionType.NORMAL, false, MonsterActionAttackType.WEAPON_MELEE, 0, "", null, false, AttackType.ATTACK, 0, 0, null, false, 0, 0,
                true, limitedUseType, numPerDay, min, max, rechargeOnShort, rechargeOnLong, 0, null, null, notes);
    }

    protected MonsterActionApi createAction(String name, MonsterActionAttackType monsterActionAttackType,
                                          AttackType attackType, int attackMod,
                                          int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(attackType.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        return createAction(name, MonsterActionType.NORMAL, true, monsterActionAttackType, 0, "", null, false, attackType, attackMod, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createAction(String name, MonsterActionAttackType monsterActionAttackType,
                                          AttackType attackType, int mod, Integer saveTypeId, boolean halfOnMissSave,
                                          int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                          MonsterLimitedUseType limitedUseType, int numPerDay, int min, int max, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(attackType.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        int attackMod = attackType == AttackType.ATTACK ? mod : 0;
        int saveMod = attackType == AttackType.SAVE ? mod : 0;
        return createAction(name, MonsterActionType.NORMAL, true, monsterActionAttackType, 0, "", null, false, attackType, attackMod, saveMod, saveTypeId, halfOnMissSave, 0, 0,
                true, limitedUseType, numPerDay, min, max, false, true, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createActionRange(String name, int ammoId, String range,
                                               AttackType attackType, int attackMod,
                                               int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(attackType.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.WEAPON_RANGED, ammoId, range, null, false, attackType, attackMod, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, true, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createActionRange(String name, int ammoId, String range,
                                               AttackType attackType, int attackMod,
                                               int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod, String notes,
                                               MonsterLimitedUseType limitedUseType, int numPerDay, int min, int max) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(attackType.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.WEAPON_RANGED, ammoId, range, null, false, attackType, attackMod, 0, null, false, 0, 0,
                false, limitedUseType, numPerDay, min, max, false, true, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createActionSave(String name, int saveMod, Integer saveTypeId, boolean halfOnMissSave,
                                              int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.OTHER, 0, "", null, false, AttackType.SAVE, 0, saveMod, saveTypeId, halfOnMissSave, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createActionSave(String name, int saveMod, Integer saveTypeId, boolean halfOnMissSave,
                                              int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                              int numExtraDice, DiceSize extraDiceSize, String extraDamageType, Integer extraDamageAbilityId, int extraDamageMod, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Arrays.asList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod),
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numExtraDice, extraDiceSize, extraDamageType, extraDamageAbilityId, extraDamageMod)
        ));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.OTHER, 0, "", null, false, AttackType.SAVE, 0, saveMod, saveTypeId, halfOnMissSave, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createActionSave(String name, int saveMod, Integer saveTypeId, boolean halfOnMissSave,
                                              int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                              MonsterLimitedUseType limitedUseType, int numPerDay, int min, int max, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.OTHER, 0, "", null, false, AttackType.SAVE, 0, saveMod, saveTypeId, halfOnMissSave, 0, 0,
                true, limitedUseType, numPerDay, min, max, false, true, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createAction(String name, MonsterActionAttackType monsterActionAttackType,
                                          AttackType attackType, int attackMod,
                                          int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                          int numExtraDice, DiceSize extraDiceSize, String extraDamageType, Integer extraDamageAbilityId, int extraDamageMod, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Arrays.asList(
                createMonsterAttackDamage(attackType.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod),
                createMonsterAttackDamage(attackType.getValue(), numExtraDice, extraDiceSize, extraDamageType, extraDamageAbilityId, extraDamageMod)
        ));
        return createAction(name, MonsterActionType.NORMAL, true, monsterActionAttackType, 0, "", null, false, attackType, attackMod, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createActionRange(String name, int ammoId, String range,
                                               AttackType attackType, int attackMod,
                                               int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                               int numExtraDice, DiceSize extraDiceSize, String extraDamageType, Integer extraDamageAbilityId, int extraDamageMod, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Arrays.asList(
                createMonsterAttackDamage(attackType.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod),
                createMonsterAttackDamage(attackType.getValue(), numExtraDice, extraDiceSize, extraDamageType, extraDamageAbilityId, extraDamageMod)
        ));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.WEAPON_RANGED, ammoId, range, null, false, attackType, attackMod, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, true, 0, attackDamages, null, notes);
    }

    protected MonsterActionApi createLegendarySave(String name, int saveMod, Integer saveTypeId, boolean halfOnMissSave,
                                                 int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod, int legendaryCost, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)));
        return createAction(name, MonsterActionType.LEGENDARY, true, MonsterActionAttackType.OTHER, 0, "", null, false, AttackType.SAVE, 0, saveMod, saveTypeId, halfOnMissSave, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, legendaryCost, attackDamages, null, notes);
    }

    protected MonsterActionApi createLegendarySave(String name, int saveMod, Integer saveTypeId, boolean halfOnMissSave,
                                                 int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                                 int numExtraDice, DiceSize extraDiceSize, String extraDamageType, Integer extraDamageAbilityId, int extraDamageMod,
                                                 int legendaryCost, String notes) throws Exception {
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Arrays.asList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod),
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numExtraDice, extraDiceSize, extraDamageType, extraDamageAbilityId, extraDamageMod)
        ));
        return createAction(name, MonsterActionType.LEGENDARY, true, MonsterActionAttackType.OTHER, 0, "", null, false, AttackType.SAVE, 0, saveMod, saveTypeId, halfOnMissSave, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, legendaryCost, attackDamages, null, notes);
    }

    protected MonsterActionApi createLegendaryAction(String name, int legendaryCost, String notes) throws Exception {
        return createAction(name, MonsterActionType.LEGENDARY, false, MonsterActionAttackType.WEAPON_MELEE, 0, "", null, false, AttackType.ATTACK, 0, 0, null, false, 0, 0,
                false, MonsterLimitedUseType.NUM_PER_DAY, 0, 0, 0, false, false, legendaryCost, null, null, notes);
    }

    protected MonsterActionApi createSpellAction(boolean innate, String name, int numPerDay) throws Exception {
        List<String> ids = getSpellIds("'" + name + "'");
        if(ids.size() == 0){
            return null;
        }
        return createAction(name, MonsterActionType.NORMAL, false, MonsterActionAttackType.SPELL,
                0, "", ids.get(0), innate, AttackType.ATTACK, 0, 0, null, false, 0, 0,
                numPerDay > 0, MonsterLimitedUseType.NUM_PER_DAY, numPerDay, 0, 0, false, false, 0, null, null, "");
    }

    protected MonsterActionApi createSpellAction(boolean innate, String name, int numPerDay,
                                               Integer saveTypeId, boolean halfOnMissSave,
                                               int numDice, DiceSize diceSize, String damageType) throws Exception {
        return createSpellAction(innate, saveTypeId == null ? AttackType.ATTACK : AttackType.SAVE, name, numPerDay, saveTypeId, halfOnMissSave, numDice, diceSize, damageType, null, 0);
    }

    protected MonsterActionApi createSpellAction(boolean innate, AttackType attackType, String name, int numPerDay,
                                               Integer saveTypeId, boolean halfOnMissSave,
                                               int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod) throws Exception {
        List<String> ids = getSpellIds("'" + name + "'");
        if(ids.size() == 0){
            return null;
        }
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)
        ));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.SPELL,
                0, "", ids.get(0), innate, attackType, 0, 0, saveTypeId, halfOnMissSave, 0, 0,
                numPerDay > 0, MonsterLimitedUseType.NUM_PER_DAY, numPerDay, 0, 0, false, false, 0, attackDamages, null, "");
    }

    protected MonsterActionApi createSpellAction(boolean innate, String name, int numPerDay,
                                               Integer saveTypeId, boolean halfOnMissSave,
                                               int numDice, DiceSize diceSize, String damageType,
                                               int baseLevelSlot, int numLevelsAbove, int numExtraDice, DiceSize extraDiceSize, String extraDamageType) throws Exception {
        return createSpellAction(innate, saveTypeId == null ? AttackType.ATTACK : AttackType.SAVE, name, numPerDay, saveTypeId, halfOnMissSave, numDice, diceSize, damageType, null, 0,
                baseLevelSlot, numLevelsAbove, numExtraDice, extraDiceSize, extraDamageType, null, 0);
    }

    protected MonsterActionApi createSpellAction(boolean innate, AttackType attackType, String name, int numPerDay,
                                               Integer saveTypeId, boolean halfOnMissSave,
                                               int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                               int baseLevelSlot, int numLevelsAbove, int numExtraDice, DiceSize extraDiceSize, String extraDamageType, Integer extraDamageAbilityId, int extraDamageMod) throws Exception {
        List<String> ids = getSpellIds("'" + name + "'");
        if(ids.size() == 0){
            return null;
        }
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Collections.singletonList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod)
        ));
        List<MonsterAttackDamage> extraDamages = new ArrayList<>(Collections.singletonList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numExtraDice, extraDiceSize, extraDamageType, extraDamageAbilityId, extraDamageMod)
        ));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.SPELL,
                0, "", ids.get(0), innate, attackType, 0, 0, saveTypeId, halfOnMissSave, baseLevelSlot, numLevelsAbove,
                numPerDay > 0, MonsterLimitedUseType.NUM_PER_DAY, numPerDay, 0, 0, false, false, 0, attackDamages, extraDamages, "");
    }

    protected MonsterActionApi createSpellAction(boolean innate, AttackType attackType, String name, int numPerDay,
                                               Integer saveTypeId, boolean halfOnMissSave,
                                               int numDice, DiceSize diceSize, String damageType, Integer damageAbilityId, int damageMod,
                                               int numDiceBaseExtra, DiceSize diceSizeBaseExtra, String baseExtraDamageType, Integer baseExtraDamageAbilityId, int baseExtraDamageMod,
                                               int baseLevelSlot, int numLevelsAbove, int numExtraDice, DiceSize extraDiceSize, String extraDamageType, Integer extraDamageAbilityId, int extraDamageMod) throws Exception {
        List<String> ids = getSpellIds("'" + name + "'");
        if(ids.size() == 0){
            return null;
        }
        List<MonsterAttackDamage> attackDamages = new ArrayList<>(Arrays.asList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numDice, diceSize, damageType, damageAbilityId, damageMod),
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numDiceBaseExtra, diceSizeBaseExtra, baseExtraDamageType, baseExtraDamageAbilityId, baseExtraDamageMod)
        ));
        List<MonsterAttackDamage> extraDamages = new ArrayList<>(Collections.singletonList(
                createMonsterAttackDamage(AttackType.SAVE.getValue(), numExtraDice, extraDiceSize, extraDamageType, extraDamageAbilityId, extraDamageMod)
        ));
        return createAction(name, MonsterActionType.NORMAL, true, MonsterActionAttackType.SPELL,
                0, "", ids.get(0), innate, attackType, 0, 0, saveTypeId, halfOnMissSave, baseLevelSlot, numLevelsAbove,
                numPerDay > 0, MonsterLimitedUseType.NUM_PER_DAY, numPerDay, 0, 0, false, false, 0, attackDamages, extraDamages, "");
    }

    protected MonsterActionApi createAction(String name, MonsterActionType monsterActionType, boolean attack, MonsterActionAttackType monsterActionAttackType, int ammoId, String range, String spellId, boolean innate,
                                          AttackType attackType, int attackMod, int saveMod, Integer saveTypeId, boolean halfOnMissSave, int baseLevelSlot, int numLevelsAbove,
                                          boolean limitedUse, MonsterLimitedUseType limitedUseType, int numPerDay, int rechargeMin, int rechargeMax, boolean rechargeOnShortRest, boolean rechargeOnLongRest,
                                          int legendaryCost, List<MonsterAttackDamage> attackDamages, List<MonsterAttackDamage> extraDamages, String notes) throws Exception {
        if(attackDamages == null) {
            attackDamages = new ArrayList<>();
        }
        if(extraDamages == null) {
            extraDamages = new ArrayList<>();
        }
        return new MonsterActionApi(0, name, monsterActionType, attack, monsterActionAttackType, ammoId, range, spellId, attackType, attackMod, saveMod, saveTypeId, halfOnMissSave, baseLevelSlot, numLevelsAbove,
                limitedUse, limitedUseType, numPerDay, rechargeMin, rechargeMax, rechargeOnShortRest, rechargeOnLongRest, notes, legendaryCost, attackDamages, extraDamages);
    }
}
