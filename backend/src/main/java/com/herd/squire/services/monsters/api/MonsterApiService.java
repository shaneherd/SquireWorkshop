package com.herd.squire.services.monsters.api;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.Sense;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.monsters.ChallengeRating;
import com.herd.squire.models.powers.AttackType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MonsterApiService extends MonsterApiBaseService {

    public MonsterApiService() {
        super();
    }

    public void readApiFile() throws Exception {
        initializeData();
        MonsterApiWriteService.writeFile(monsters);
    }

    private void initializeDragons() throws Exception {
        List<Integer> savingThrowProfs;
        List<Integer> skillProfs;
        List<Integer> conditionImmunities;
        List<MonsterSenseApi> senses;
        List<MonsterActionApi> actions;
        List<MonsterFeatureApi> features;

        MonsterSenseApi blindsight10 = new MonsterSenseApi(Sense.BLINDSIGHT, 10);
        MonsterSenseApi blindsight30 = new MonsterSenseApi(Sense.BLINDSIGHT, 30);
        MonsterSenseApi blindsight60 = new MonsterSenseApi(Sense.BLINDSIGHT, 60);
        MonsterSenseApi darkvision60 = new MonsterSenseApi(Sense.DARKVISION, 60);
        MonsterSenseApi darkvision120 = new MonsterSenseApi(Sense.DARKVISION, 120);

        List<Integer> draconic = new ArrayList<>(Collections.singletonList(DRACONIC_ID));
        List<Integer> commonDraconic = new ArrayList<>(Arrays.asList(COMMON_ID, DRACONIC_ID));

        final MonsterDamageModifierApi acidImmune = createModifier(acid, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi coldImmune = createModifier(cold, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi fireImmune = createModifier(fire, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi lightningImmune = createModifier(lightning, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi poisonImmune = createModifier(poison, DamageModifierType.IMMUNE, "");

        final List<MonsterDamageModifierApi> acidImmuneList = new ArrayList<>(Collections.singletonList(acidImmune));
        final List<MonsterDamageModifierApi> coldImmuneList = new ArrayList<>(Collections.singletonList(coldImmune));
        final List<MonsterDamageModifierApi> fireImmuneList = new ArrayList<>(Collections.singletonList(fireImmune));
        final List<MonsterDamageModifierApi> lightningImmuneList = new ArrayList<>(Collections.singletonList(lightningImmune));
        final List<MonsterDamageModifierApi> poisonImmuneList = new ArrayList<>(Collections.singletonList(poisonImmune));

        String name = "Ancient Black Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.TEN, piercing, STR_ID, 0, 2, DiceSize.EIGHT, acid, null, 0, "Reach 15ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Acid Breath", 22, DEX_ID, true, 15, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 23, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 22, 21, 40, 0, 0, 40, 80, false, 0, gargantuan, chaoticEvil, ChallengeRating.TWENTY_ONE, 27, 14, 25, 16, 15, 19, commonDraconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, features, null);

        name = "Adult Black Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.EIGHT, acid, null, 0, "Reach 10ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours"),
                createActionSave("Acid Breath", 18, DEX_ID, true, 12, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 19, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 17, 40, 0, 0, 40, 80, false, 0, huge, chaoticEvil, ChallengeRating.FOURTEEN, 23, 14, 21, 14, 13, 17, commonDraconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, features, null);

        name = "Young Black Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.EIGHT, acid, null, 0, "Reach 10ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Acid Breath", 14, DEX_ID, true, 11, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water.")
        ));
        insert(name, DRAGON_ID, "", 18, 15, 40, 0, 0, 40, 80, false, 0, large, chaoticEvil, ChallengeRating.SEVEN, 19, 14, 17, 12, 11, 15, commonDraconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, features, null);

        name = "Black Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.FOUR, acid, null, 0, "Reach 5 ft., one target"),
                createActionSave("Acid Breath", 11, DEX_ID, true, 5, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water.")
        ));
        insert(name, DRAGON_ID, "", 17, 6, 30, 0, 0, 30, 60, false, 0, medium, chaoticEvil, ChallengeRating.TWO, 15, 14, 13, 10, 11, 13, draconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, features, null);

        name = "Ancient Blue Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 16, 2, DiceSize.TEN, piercing, STR_ID, 0, 2, DiceSize.TEN, lightning, null, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 16, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 16, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Lightning Breath", 23, DEX_ID, true, 16, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 24, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 22, 26, 40, 0, 0, 0, 80, false, 40, gargantuan, lawfulEvil, ChallengeRating.TWENTY_THREE, 29, 10, 27, 18, 17, 21, commonDraconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, features, null);

        name = "Adult Blue Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.TEN, lightning, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Lightning Breath", 19, DEX_ID, true, 12, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 20, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 18, 40, 0, 0, 0, 80, false, 30, huge, lawfulEvil, ChallengeRating.SIXTEEN, 25, 10, 23, 16, 15, 19, commonDraconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, features, null);

        name = "Young Blue Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.TEN, lightning, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Lightning Breath", 16, DEX_ID, true, 10, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, DRAGON_ID, "", 18, 16, 40, 0, 0, 0, 80, false, 20, large, lawfulEvil, ChallengeRating.NINE, 21, 10, 19, 14, 13, 17, commonDraconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, null, null);

        name = "Blue Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 1, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.SIX, lightning, null, 0, "Reach 5 ft., one target"),
                createActionSave("Lightning Breath", 12, DEX_ID, true, 4, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, DRAGON_ID, "", 17, 8, 30, 0, 0, 0, 60, false, 15, medium, lawfulEvil, ChallengeRating.THREE, 17, 10, 15, 12, 11, 15, draconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, null, null);

        name = "Ancient Green Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.TEN, piercing, STR_ID, 0, 3, DiceSize.SIX, poison, null, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 4, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Poison Breath", 22, CON_ID, true, 22, DiceSize.SIX, poison, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 23, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water"),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 21, 22, 40, 0, 0, 40, 80, false, 0, gargantuan, lawfulEvil, ChallengeRating.TWENTY_TWO, 27, 12, 25, 20, 17, 19, commonDraconic, savingThrowProfs, skillProfs, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Adult Green Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.TEN, piercing, STR_ID, 0, 2, DiceSize.SIX, poison, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours"),
                createActionSave("Poison Breath", 18, CON_ID, true, 16, DiceSize.SIX, poison, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 19, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water"),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 18, 40, 0, 0, 40, 80, false, 0, huge, lawfulEvil, ChallengeRating.FIFTEEN, 23, 12, 21, 18, 15, 17, commonDraconic, savingThrowProfs, skillProfs, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Young Green Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, 2, DiceSize.SIX, poison, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Poison Breath", 14, CON_ID, true, 12, DiceSize.SIX, poison, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water")
        ));
        insert(name, DRAGON_ID, "", 18, 16, 40, 0, 0, 40, 80, false, 0, large, lawfulEvil, ChallengeRating.EIGHT, 19, 12, 17, 16, 13, 15, commonDraconic, savingThrowProfs, skillProfs, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Green Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.SIX, poison, null, 0, "Reach 5 ft., one target"),
                createActionSave("Poison Breath", 14, CON_ID, true, 12, DiceSize.SIX, poison, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water")
        ));
        insert(name, DRAGON_ID, "", 17, 7, 30, 0, 0, 30, 60, false, 0, medium, lawfulEvil, ChallengeRating.TWO, 15, 12, 13, 14, 11, 13, draconic, savingThrowProfs, skillProfs, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Ancient Red Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.TEN, piercing, STR_ID, 0, 4, DiceSize.SIX, fire, null, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Fire Breath", 24, DEX_ID, true, 26, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 25, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 22, 28, 40, 0, 40, 0, 80, false, 0, gargantuan, chaoticEvil, ChallengeRating.TWENTY_FOUR, 30, 10, 29, 18, 15, 23, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Adult Red Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.TEN, piercing, STR_ID, 0, 2, DiceSize.SIX, fire, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Fire Breath", 21, DEX_ID, true, 18, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 22, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 19, 40, 0, 40, 0, 80, false, 0, huge, chaoticEvil, ChallengeRating.SEVENTEEN, 27, 10, 25, 16, 13, 21, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Young Red Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.SIX, fire, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Fire Breath", 17, DEX_ID, true, 16, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, DRAGON_ID, "", 18, 17, 40, 0, 40, 0, 80, false, 0, large, chaoticEvil, ChallengeRating.TEN, 23, 10, 21, 14, 11, 19, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, null, null);

        name = "Red Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.SIX, fire, null, 0, "Reach 5 ft., one target"),
                createActionSave("Fire Breath", 13, DEX_ID, true, 7, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, DRAGON_ID, "", 17, 10, 30, 0, 30, 0, 60, false, 0, medium, chaoticEvil, ChallengeRating.FOUR, 19, 10, 17, 12, 11, 15, draconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, null, null);

        name = "Ancient White Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.TEN, piercing, STR_ID, 0, 2, DiceSize.EIGHT, cold, null, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Cold Breath", 22, CON_ID, true, 16, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 22, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Ice Walk", "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn''t cost it extra moment."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 20, 18, 40, 0, 0, 40, 80, false, 40, gargantuan, chaoticEvil, ChallengeRating.TWENTY, 26, 10, 26, 10, 13, 14, commonDraconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, features, null);

        name = "Adult White Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.EIGHT, cold, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours"),
                createActionSave("Cold Breath", 19, CON_ID, true, 12, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 19, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Ice Walk", "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn''t cost it extra moment."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 18, 16, 40, 0, 0, 40, 80, false, 30, huge, chaoticEvil, ChallengeRating.THIRTEEN, 22, 10, 22, 6, 12, 12, commonDraconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, features, null);

        name = "Young White Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.EIGHT, cold, null, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Cold Breath", 15, CON_ID, true, 10, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 15 Constitution saving throw, taking 45 (10d8) cold damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Ice Walk", "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn''t cost it extra moment.")
        ));
        insert(name, DRAGON_ID, "", 17, 14, 40, 0, 0, 40, 80, false, 20, large, chaoticEvil, ChallengeRating.SIX, 18, 10, 18, 6, 11, 12, commonDraconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, features, null);

        name = "White Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.FOUR, cold, null, 0, "Reach 5 ft., one target"),
                createActionSave("Cold Breath", 12, CON_ID, true, 5, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast of hail in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (5d8) cold damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, DRAGON_ID, "", 16, 5, 30, 0, 0, 30, 60, false, 15, medium, chaoticEvil, ChallengeRating.TWO, 14, 10, 14, 5, 10, 11, draconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, null, null);

        name = "Ancient Brass Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(HISTORY_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Fire Breath", 21, DEX_ID, true, 16, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Sleep Breath", 21, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales sleep gas in a 90-foot cone. Each creature in that area must succeed on a DC 21 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 22, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 20, 17, 40, 0, 0, 0, 80, false, 40, gargantuan, chaoticGood, ChallengeRating.TWENTY, 27, 10, 25, 16, 15, 19, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Adult Brass Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(HISTORY_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Fire Breath", 18, DEX_ID, true, 13, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 45 (13d6) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Sleep Breath", 18, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 19, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 18, 15, 40, 0, 0, 0, 80, false, 30, huge, chaoticGood, ChallengeRating.THIRTEEN, 23, 10, 21, 14, 13, 17, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Young Brass Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(HISTORY_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Fire Breath", 14, DEX_ID, true, 12, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Sleep Breath", 14, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales sleep gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw or fall unconscious for 5 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.")
        ));
        insert(name, DRAGON_ID, "", 17, 13, 40, 0, 0, 0, 80, false, 20, large, chaoticGood, ChallengeRating.SIX, 19, 10, 17, 12, 11, 15, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, null, null);

        name = "Brass Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(HISTORY_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Fire Breath", 11, DEX_ID, true, 4, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 14 (4d6) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Sleep Breath", 11, CON_ID, true, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw or fall unconscious for 1 minute. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.")
        ));
        insert(name, DRAGON_ID, "", 16, 3, 30, 0, 0, 0, 60, false, 15, medium, chaoticGood, ChallengeRating.ONE, 15, 10, 13, 10, 11, 13, draconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, null, null);

        name = "Ancient Bronze Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 16, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 16, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 16, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Lightning Breath", 21, DEX_ID, true, 16, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Repulsion Breath", 21, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 23 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 24, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 22, 24, 40, 0, 0, 40, 80, false, 0, gargantuan, lawfulGood, ChallengeRating.TWENTY_TWO, 29, 10, 27, 18, 17, 21, commonDraconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, features, null);

        name = "Adult Bronze Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Lightning Breath", 19, DEX_ID, true, 12, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 90- foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Repulsion Breath", 19, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 19 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 20, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 17, 40, 0, 0, 40, 80, false, 0, huge, lawfulGood, ChallengeRating.FIFTEEN, 25, 10, 23, 16, 15, 19, commonDraconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, features, null);

        name = "Young Bronze Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Lightning Breath", 15, DEX_ID, true, 10, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 60- foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Repulsion Breath", 15, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 15 Strength saving throw. On a failed save, the creature is pushed 40 feet away from the dragon.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water.")
        ));
        insert(name, DRAGON_ID, "", 18, 15, 40, 0, 0, 40, 80, false, 0, large, lawfulGood, ChallengeRating.EIGHT, 21, 10, 19, 14, 13, 17, commonDraconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, features, null);

        name = "Bronze Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Lightning Breath", 12, DEX_ID, true, 3, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 40- foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Repulsion Breath", 12, STR_ID, true, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breathe air and water.")
        ));
        insert(name, DRAGON_ID, "", 17, 5, 30, 0, 0, 30, 60, false, 0, medium, lawfulGood, ChallengeRating.TWO, 17, 10, 15, 12, 11, 15, draconic, savingThrowProfs, skillProfs, lightningImmuneList, null, senses, actions, features, null);

        name = "Ancient Copper Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Acid Breath", 22, DEX_ID, true, 14, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 63 (14d8) acid damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Slowing Breath", 22, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 22 Constitution saving throw. On a failed save, the creature can''t use reactions, its speed is halved, and it can''t make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 23, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 21, 20, 40, 0, 40, 0, 80, false, 0, gargantuan, lawfulGood, ChallengeRating.TWENTY_ONE, 27, 12, 25, 20, 17, 19, commonDraconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, features, null);

        name = "Adult Copper Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Acid Breath", 18, DEX_ID, true, 12, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Slowing Breath", 18, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw. On a failed save, the creature can''t use reactions, its speed is halved, and it can''t make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 19, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 18, 16, 40, 0, 40, 0, 80, false, 0, huge, lawfulGood, ChallengeRating.FOURTEEN, 23, 12, 21, 18, 15, 17, commonDraconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, features, null);

        name = "Young Copper Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Acid Breath", 14, DEX_ID, true, 9, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in an 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 40 (9d8) acid damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Slowing Breath", 14, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw. On a failed save, the creature can''t use reactions, its speed is halved, and it can''t make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.")
        ));
        insert(name, DRAGON_ID, "", 17, 14, 40, 0, 40, 0, 80, false, 0, large, lawfulGood, ChallengeRating.SEVEN, 19, 12, 17, 16, 13, 15, commonDraconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, null, null);

        name = "Copper Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Acid Breath", 11, DEX_ID, true, 4, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Slowing Breath", 11, CON_ID, true, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw. On a failed save, the creature can''t use reactions, its speed is halved, and it can''t make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.")
        ));
        insert(name, DRAGON_ID, "", 16, 4, 30, 0, 30, 0, 60, false, 0, medium, lawfulGood, ChallengeRating.ONE, 15, 12, 13, 14, 11, 13, draconic, savingThrowProfs, skillProfs, acidImmuneList, null, senses, actions, null, null);

        name = "Ancient Gold Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 24 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Fire Breath", 24, DEX_ID, true, 13, DiceSize.TEN, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 71 (13d10) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Weakening Breath", 24, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 25, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breath air and water."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 22, 28, 40, 0, 0, 40, 80, false, 0, gargantuan, lawfulGood, ChallengeRating.TWENTY_FOUR, 30, 14, 29, 18, 17, 28, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Adult Gold Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Fire Breath", 21, DEX_ID, true, 12, DiceSize.TEN, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Weakening Breath", 21, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 21 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 22, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breath air and water."),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 19, 40, 0, 0, 40, 80, false, 0, huge, lawfulGood, ChallengeRating.SEVENTEEN, 27, 14, 25, 16, 15, 24, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Young Gold Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Fire Breath", 17, DEX_ID, true, 10, DiceSize.TEN, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Weakening Breath", 17, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breath air and water.")
        ));
        insert(name, DRAGON_ID, "", 18, 17, 40, 0, 0, 40, 80, false, 0, large, lawfulGood, ChallengeRating.TEN, 23, 14, 21, 16, 13, 20, commonDraconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Gold Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Fire Breath", 13, DEX_ID, true, 4, DiceSize.TEN, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Weakening Breath", 13, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon can breath air and water.")
        ));
        insert(name, DRAGON_ID, "", 17, 8, 30, 0, 0, 30, 60, false, 0, medium, lawfulGood, ChallengeRating.THREE, 19, 14, 17, 14, 11, 16, draconic, savingThrowProfs, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Ancient Silver Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 20 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Cold Breath", 24, CON_ID, true, 15, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 90- foot cone. Each creature in that area must make a DC 24 Constitution saving throw, taking 67 (15d8) cold damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Paralyzing Breath", 24, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales paralyzing gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 25, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 22, 25, 40, 0, 0, 0, 80, false, 0, gargantuan, lawfulGood, ChallengeRating.TWENTY_THREE, 30, 10, 29, 18, 15, 23, commonDraconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, features, null);

        name = "Adult Silver Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Cold Breath", 20, CON_ID, true, 13, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 60- foot cone. Each creature in that area must make a DC 20 Constitution saving throw, taking 58 (13d8) cold damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Paralyzing Breath", 20, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales paralyzing gas in a 60-foot cone. Each creature in that area must succeed on a DC 20 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Change Shape", "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon''s choice).\\n\\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."),
                createLegendaryAction("Detect", 1, "The dragon makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Attack", 1, "The dragon makes a tail attack"),
                createLegendarySave("Wing Attack", 21, DEX_ID, false, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 21 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the dragon fails a saving throw, it can choose to succeed instead.")
        ));
        insert(name, true, DRAGON_ID, "", 19, 18, 40, 0, 0, 0, 80, false, 0, huge, lawfulGood, ChallengeRating.SIXTEEN, 27, 10, 25, 16, 13, 21, commonDraconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, features, null);

        name = "Young Silver Dragon";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.SIX, slashing, STR_ID, 0, "Reach 5 ft., one target"),
                createAction("Frightful Presence", "Each creature of the dragon''s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the dragon''s Frightful Presence for the next 24 hours."),
                createActionSave("Cold Breath", 17, CON_ID, true, 12, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 30- foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Paralyzing Breath", 17, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales paralyzing gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        insert(name, DRAGON_ID, "", 18, 16, 40, 0, 0, 0, 80, false, 0, large, lawfulGood, ChallengeRating.NINE, 23, 10, 21, 14, 11, 19, commonDraconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, null, null);

        name = "Silver Dragon Wyrmling";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 5 ft., one target"),
                createActionSave("Cold Breath", 13, CON_ID, true, 4, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 15- foot cone. Each creature in that area must make a DC 13 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Paralyzing Breath", 13, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales paralyzing gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        insert(name, DRAGON_ID, "", 17, 6, 30, 0, 0, 0, 60, false, 0, medium, lawfulGood, ChallengeRating.TWO, 19, 10, 17, 12, 11, 15, draconic, savingThrowProfs, skillProfs, coldImmuneList, null, senses, actions, null, null);
    }

    private void initializeMisc() throws Exception {
        List<Integer> languageProfs;
        List<Integer> savingThrowProfs;
        List<Integer> skillProfs;
        List<MonsterSenseApi> senses;
        List<MonsterActionApi> actions;
        List<MonsterFeatureApi> features;
        List<ListObject> equipment;
        List<String> spells;
        List<MonsterDamageModifierApi> damageModifiers;

        final List<Integer> swarmImmunities = new ArrayList<>(Arrays.asList(
                CHARMED_ID, FRIGHTENED_ID, GRAPPLED_ID, PARALYZED_ID,
                PETRIFIED_ID, PRONE_ID, RESTRAINED_ID, STUNNED_ID
        ));

        final MonsterDamageModifierApi nonmagicalBludgeoningResistant = createModifier(bludgeoning, DamageModifierType.RESISTANT, nonmagical);
        final MonsterDamageModifierApi nonmagicalPiercingResistant = createModifier(piercing, DamageModifierType.RESISTANT, nonmagical);
        final MonsterDamageModifierApi nonmagicalSlashingResistant = createModifier(slashing, DamageModifierType.RESISTANT, nonmagical);
        final MonsterDamageModifierApi poisonResistant = createModifier(poison, DamageModifierType.RESISTANT, "");

        final List<MonsterDamageModifierApi> swarmResistances = new ArrayList<>(Arrays.asList(
                createModifier(bludgeoning, DamageModifierType.RESISTANT, ""),
                createModifier(bludgeoning, DamageModifierType.RESISTANT, ""),
                createModifier(slashing, DamageModifierType.RESISTANT, "")
        ));

        final List<MonsterDamageModifierApi> coldImmune = new ArrayList<>(Collections.singletonList(
                createModifier(cold, DamageModifierType.IMMUNE, "")
        ));

        List<Integer> common = new ArrayList<>(Collections.singletonList(COMMON_ID));

        List<MonsterSenseApi> blindsight10 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.BLINDSIGHT, 10)));
        List<MonsterSenseApi> blindsight30 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.BLINDSIGHT, 30)));
        List<MonsterSenseApi> blindsight60 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.BLINDSIGHT, 60)));
        List<MonsterSenseApi> blindsight120 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.BLINDSIGHT, 120)));
        List<MonsterSenseApi> darkvision30 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.DARKVISION, 30)));
        List<MonsterSenseApi> darkvision60 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.DARKVISION, 60)));
        List<MonsterSenseApi> darkvision120 = new ArrayList<>(Collections.singletonList(new MonsterSenseApi(Sense.DARKVISION, 120)));

        List<Integer> perceptionStealth = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        List<Integer> perception = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        List<Integer> stealth = new ArrayList<>(Collections.singletonList(STEALTH_ID));

        String name = "Ape";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The ape makes two fist attacks."),
                createAction("Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createActionRange("Rock", 0, "25/50 ft.", AttackType.ATTACK, 5, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 12, 3, 30, 0, 30, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 16, 14, 14, 6, 12, 7, null, null, skillProfs, null, null, null, actions, null, null);

        name = "Awakened Shrub";
        damageModifiers = new ArrayList<>(Arrays.asList(
                createModifier(fire, DamageModifierType.VULNERABLE, ""),
                createModifier(piercing, DamageModifierType.RESISTANT, "")
        ));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Rake", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 1, 1, DiceSize.FOUR, slashing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "False Appearance", "While the shrub remains motionless, it is indistinguishable from a normal shrub.")
        ));
        insert(name, PLANT_ID, "", 9, 3, 20, 0, 0, 0, 0, false, 0, small, unaligned, ChallengeRating.ZERO, 3, 8, 11, 10, 10, 6, null, null, null, damageModifiers, null, null, actions, features, null);

        name = "Awakened Tree";
        damageModifiers = new ArrayList<>(Arrays.asList(
                createModifier(fire, DamageModifierType.VULNERABLE, ""),
                createModifier(bludgeoning, DamageModifierType.RESISTANT, ""),
                createModifier(piercing, DamageModifierType.RESISTANT, "")
        ));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 3, DiceSize.SIX, bludgeoning, STR_ID, 0, "Reach 10 ft. One target.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "False Appearance", "While the tree remains motionless, it is indistinguishable from a normal tree.")
        ));
        insert(name, PLANT_ID, "", 12, 3, 30, 0, 30, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 16, 14, 14, 6, 12, 7, null, null, null, damageModifiers, null, null, actions, features, null);

        name = "Axe Beak";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, slashing, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 11, 3, 50, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.QUARTER, 14, 12, 12, 2, 10, 5, null, null, null, null, null, null, actions, null, null);

        name = "Baboon";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 1, 1, DiceSize.FOUR, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Pack Tactics", "The baboon has advantage on an attack roll against a creature if at least one of the baboon''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 30, 0, 30, 0, 0, false, 0, small, unaligned, ChallengeRating.HALF, 8, 14, 11, 4, 12, 6, null, null, null, null, null, null, actions, features, null);

        name = "Badger";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The badger has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 10, 1, 20, 0, 0, 0, 0, false, 5, tiny, unaligned, ChallengeRating.ZERO, 4, 11, 12, 2, 12, 5, null, null, null, null, null, darkvision30, actions, features, null);

        name = "Bat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 0, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Echolocation", "The bat can''t use its blindsight while deafened."),
                new MonsterFeatureApi(0, "Keen Hearing", "The bat has advantage on Wisdom (Perception) checks that rely on hearing.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 5, 0, 0, 0, 30, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 15, 8, 2, 12, 4, null, null, null, null, null, blindsight60, actions, features, null);

        name = "Black Bear";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The bear makes two attacks: one with its bite and one with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 2, DiceSize.FOUR, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The bear has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 11, 3, 40, 0, 30, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 15, 10, 14, 2, 12, 7, null, null, perception, null, null, null, actions, features, null);

        name = "Blink Dog";
        languageProfs = new ArrayList<>(Collections.singletonList(SYLVAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Teleport", MonsterLimitedUseType.RECHARGE_RANGE, 0, 4, 6, "The dog magically teleports, along with any equipment it is wearing or carrying, up to 40 feet to an unoccupied space it can see. Before or after teleporting, the dog can make one bite attack."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell.")
        ));
        insert(name, FEY_ID, "", 13, 4, 40, 0, 0, 0, 0, false, 0, medium, lawfulGood, ChallengeRating.QUARTER, 12, 17, 12, 10, 13, 11, languageProfs, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Blood Hawk";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Sight", "The hawk has advantage on Wisdom (Perception) checks that rely on sight."),
                new MonsterFeatureApi(0, "Pack Tactics", "The hawk has advantage on an attack roll against a creature if at least one of the hawk''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 12, 2, 10, 0, 0, 0, 60, false, 0, small, unaligned, ChallengeRating.EIGHTH, 6, 14, 10, 3, 14, 5, null, null, perception, null, null, null, actions, features, null);

        name = "Boar";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Tusk", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Relentless", true, MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.")
        ));
        insert(name, BEAST_ID, "", 11, 2, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 13, 11, 12, 2, 9, 5, null, null, null, null, null, null, actions, features, null);

        name = "Brown Bear";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The bear makes two attacks: one with its bite and one with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The bear has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 11, 4, 40, 0, 30, 0, 0, false, 0, large, unaligned, ChallengeRating.ONE, 19, 10, 16, 2, 13, 7, null, null, perception, null, null, null, actions, features, null);

        name = "Camel";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, bludgeoning, null, 0, "")
        ));
        insert(name, BEAST_ID, "", 9, 2, 50, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.EIGHTH, 16, 8, 14, 2, 8, 5, null, null, null, null, null, null, actions, null, null);

        name = "Cat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 0, 0, DiceSize.FOUR, slashing, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The cat has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 40, 0, 30, 0, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 3, 15, 10, 3, 12, 7, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Constrictor Snake";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Constrict", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 14). Until this grapple ends, the creature is restrained, and the snake can''t constrict another target.")
        ));
        insert(name, BEAST_ID, "", 12, 2, 30, 0, 0, 30, 0, false, 0, large, unaligned, ChallengeRating.QUARTER, 15, 14, 12, 1, 10, 3, null, null, null, null, null, blindsight10, actions, null, null);

        name = "Crab";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 0, 0, DiceSize.FOUR, bludgeoning, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The crab can breathe air and water.")
        ));
        insert(name, BEAST_ID, "", 11, 1, 20, 0, 0, 20, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 11, 10, 1, 8, 2, null, null, stealth, null, null, blindsight30, actions, features, null);

        name = "Crocodile";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, "The target is grappled (escape DC 12). Until this grapple ends, the target is restrained, and the crocodile can''t bite another target.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Hold Breath", "The crocodile can hold its breath for 15 minutes.")
        ));
        insert(name, BEAST_ID, "", 12, 3, 20, 0, 0, 30, 0, false, 0, large, unaligned, ChallengeRating.HALF, 15, 10, 13, 2, 10, 5, null, null, stealth, null, null, null, actions, features, null);

        name = "Death Dog";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dog makes two bite attacks"),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, "If the target is a creature, it must succeed on a DC 12 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the creature must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The bear has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, MONSTROSITY_ID, "", 12, 6, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.ONE, 15, 14, 14, 3, 13, 6, null, null, perceptionStealth, null, null, darkvision120, actions, features, null);

        name = "Deer";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, piercing, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 13, 1, 50, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.ZERO, 11, 16, 11, 2, 14, 5, null, null, null, null, null, null, actions, null, null);

        name = "Dire Wolf";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, piercing, STR_ID, 0, "If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The wolf has advantage on an attack roll against a creature if at least one of the wolf''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 14, 5, 50, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.ONE, 17, 15, 15, 3, 12, 7, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Draft Horse";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.FOUR, bludgeoning, null, 0, "")
        ));
        insert(name, BEAST_ID, "", 10, 3, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.QUARTER, 18, 10, 12, 2, 11, 7, null, null, null, null, null, null, actions, null, null);

        name = "Eagle";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, slashing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight", "The eagle has advantage on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 10, 0, 0, 0, 60, false, 0, small, unaligned, ChallengeRating.ZERO, 6, 15, 10, 2, 14, 7, null, null, perception, null, null, null, actions, features, null);

        name = "Elephant";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 3, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Stomp", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 3, DiceSize.TEN, bludgeoning, STR_ID, 0, "One prone creature.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Trampling Charge", "If the elephant moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the elephant can make one stomp attack against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 12, 8, 40, 0, 0, 0, 0, false, 0, huge, unaligned, ChallengeRating.FOUR, 22, 9, 17, 3, 11, 6, null, null, null, null, null, null, actions, features, null);

        name = "Elk";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Ram", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, "One prone creature.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Charge", "If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.")
        ));
        insert(name, BEAST_ID, "", 10, 2, 50, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.QUARTER, 16, 10, 12, 2, 10, 6, null, null, null, null, null, null, actions, features, null);

        name = "Flying Snake";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 3, DiceSize.FOUR, poison, null, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Flyby", "The snake doesn''t provoke opportunity attacks when it flies out of an enemy''s reach.")
        ));
        insert(name, BEAST_ID, "", 14, 2, 30, 0, 0, 30, 60, false, 0, tiny, unaligned, ChallengeRating.EIGHTH, 4, 18, 11, 2, 12, 5, null, null, null, null, null, blindsight10, actions, features, null);

        name = "Frog";
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The frog can breathe air and water."),
                new MonsterFeatureApi(0, "Standing Leap", "The frog''s long jump is up to 10 feet and its high jump is up to 5 feet, with or without a running start.")
        ));
        insert(name, BEAST_ID, "", 11, 1, 20, 0, 0, 20, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 1, 13, 8, 1, 8, 3, null, null, perceptionStealth, null, null, darkvision30, null, features, null);

        name = "Giant Ape";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The ape makes two fist attacks."),
                createAction("Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.TEN, bludgeoning, STR_ID, 0, ""),
                createActionRange("Rock", 0, "50/100 ft.", AttackType.ATTACK, 9, 7, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 12, 15, 40, 0, 40, 0, 0, false, 0, huge, unaligned, ChallengeRating.SEVEN, 23, 14, 18, 7, 12, 7, null, null, skillProfs, null, null, null, actions, null, null);

        name = "Giant Badger";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The badger makes two attacks: one with its bite and one with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 2, DiceSize.FOUR, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The badger has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 10, 2, 30, 0, 0, 0, 0, false, 10, medium, unaligned, ChallengeRating.QUARTER, 13, 10, 15, 2, 12, 5, null, null, null, null, null, darkvision30, actions, features, null);

        name = "Giant Bat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Echolocation", "The bat can''t use its blindsight while deafened."),
                new MonsterFeatureApi(0, "Keen Hearing", "The bat has advantage on Wisdom (Perception) checks that rely on hearing.")
        ));
        insert(name, BEAST_ID, "", 13, 4, 10, 0, 0, 0, 60, false, 0, large, unaligned, ChallengeRating.QUARTER, 15, 16, 11, 2, 12, 6, null, null, null, null, null, blindsight60, actions, features, null);

        name = "Giant Boar";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Tusk", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Relentless", true, MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.TWO, 17, 10, 16, 2, 7, 5, null, null, null, null, null, null, actions, features, null);

        name = "Giant Centipede";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must succeed on a DC 11 Constitution saving throw or take 10 (3d6) poison damage. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.")
        ));
        insert(name, BEAST_ID, "", 13, 1, 30, 0, 30, 0, 0, false, 0, small, unaligned, ChallengeRating.QUARTER, 5, 14, 12, 1, 7, 3, null, null, null, null, null, blindsight30, actions, null, null);

        name = "Giant Constrictor Snake";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Constrict", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 16). Until this grapple ends, the creature is restrained, and the snake can''t constrict another target.")
        ));
        insert(name, BEAST_ID, "", 12, 8, 30, 0, 0, 30, 0, false, 0, huge, unaligned, ChallengeRating.TWO, 19, 14, 12, 1, 10, 3, null, null, perception, null, null, blindsight10, actions, null, null);

        name = "Giant Crab";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 11). The crab has two claws, each of which can grapple only one target.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The crab can breathe air and water.")
        ));
        insert(name, BEAST_ID, "", 15, 3, 30, 0, 0, 30, 0, false, 0, medium, unaligned, ChallengeRating.EIGHTH, 13, 15, 11, 1, 9, 3, null, null, stealth, null, null, blindsight30, actions, features, null);

        name = "Giant Crocodile";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The crocodile makes two attacks: one with its bite and one with its tail."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 3, DiceSize.TEN, piercing, STR_ID, 0, "The target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the crocodile can''t bite another target."),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "If the target is a creature, it must succeed on a DC 16 Strength saving throw or be knocked prone.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Hold Breath", "The crocodile can hold its breath for 30 minutes.")
        ));
        insert(name, BEAST_ID, "", 14, 9, 30, 0, 0, 50, 0, false, 0, huge, unaligned, ChallengeRating.FIVE, 21, 9, 17, 2, 10, 7, null, null, stealth, null, null, null, actions, features, null);

        name = "Giant Eagle";
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, AURAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The eagle makes two attacks: one with its beak and one with its talons."),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight", "The eagle has advantage on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, BEAST_ID, "", 13, 4, 10, 0, 0, 0, 80, false, 0, large, neutral, ChallengeRating.ONE, 16, 17, 13, 8, 14, 10, languageProfs, null, perception, null, null, null, actions, features, null);

        name = "Giant Elk";
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, ELVISH_ID, SYLVAN_ID));

        actions = new ArrayList<>(Arrays.asList(
                createAction("Ram", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 4, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "One prone creature")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Charge", "If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone.")
        ));
        insert(name, BEAST_ID, "", 14, 5, 60, 0, 0, 0, 0, false, 0, huge, unaligned, ChallengeRating.TWO, 19, 16, 14, 7, 14, 10, languageProfs, null, perception, null, null, null, actions, features, null);

        name = "Giant Fire Beetle";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 1, 1, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Illumination", "The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 feet.")
        ));
        insert(name, BEAST_ID, "", 13, 1, 30, 0, 0, 0, 0, false, 0, small, unaligned, ChallengeRating.ZERO, 8, 10, 12, 1, 7, 3, null, null, null, null, null, blindsight30, actions, features, null);

        name = "Giant Frog";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, "The frog makes one bite attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) acid damage at the start of each of the frog''s turns. The frog can have only one target swallowed at a time.\\n\\nIf the frog dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 feet of movement, exiting prone.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The frog can breathe air and water."),
                new MonsterFeatureApi(0, "Standing Leap", "The frog''s long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.")
        ));
        insert(name, BEAST_ID, "", 11, 4, 30, 0, 0, 30, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 12, 13, 11, 2, 10, 3, null, null, perceptionStealth, null, null, darkvision30, actions, features, null);

        name = "Giant Goat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Ram", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the goat moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Sure-Footed", "The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.")
        ));
        insert(name, BEAST_ID, "", 11, 3, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.HALF, 17, 11, 12, 3, 12, 6, null, null, null, null, null, null, actions, features, null);

        name = "Giant Hyena";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Rampage", "When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a bonus action to move up to half its speed and make a bite attack.")
        ));
        insert(name, BEAST_ID, "", 12, 6, 50, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.ONE, 16, 14, 14, 2, 12, 7, null, null, perception, null, null, null, actions, features, null);

        name = "Giant Lizard";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 12, 3, 30, 0, 30, 0, 0, false, 0, large, unaligned, ChallengeRating.QUARTER, 15, 12, 13, 2, 10, 5, null, null, null, null, null, darkvision30, actions, null, null);

        name = "Giant Octopus";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Tentacles", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "Reach 15 ft., one target. If the target is a creature, it is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the octopus can''t use its tentacles on another target."),
                createAction("Ink Cloud", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "A 20- foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Hold Breath", "While out of water, the octopus can hold its breath for 1 hour."),
                new MonsterFeatureApi(0, "Underwater Camouflage", "The octopus has advantage on Dexterity (Stealth) checks made while underwater."),
                new MonsterFeatureApi(0, "Water Breathing", "The octopus can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 11, 8, 10, 0, 0, 60, 0, false, 0, large, unaligned, ChallengeRating.ONE, 17, 13, 13, 4, 10, 4, null, null, perceptionStealth, null, null, darkvision60, actions, features, null);

        name = "Giant Owl";
        languageProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Flyby", "The owl doesn''t provoke opportunity attacks when it flies out of an enemy''s reach."),
                new MonsterFeatureApi(0, "Keen Hearing and Sight", "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight.")
        ));
        insert(name, BEAST_ID, "", 12, 3, 5, 0, 0, 0, 60, false, 0, large, neutral, ChallengeRating.QUARTER, 13, 15, 12, 8, 13, 10, languageProfs, null, perceptionStealth, null, null, darkvision120, actions, features, null);

        name = "Giant Poisonous Snake";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, BEAST_ID, "", 14, 2, 30, 0, 0, 30, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 10, 18, 13, 2, 10, 3, null, null, perception, null, null, blindsight10, actions, null, null);

        name = "Giant Rat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The rat has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The rat has advantage on an attack roll against a creature if at least one of the rat''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 12, 2, 30, 0, 0, 0, 0, false, 0, small, unaligned, ChallengeRating.EIGHTH, 7, 15, 11, 2, 10, 4, null, null, null, null, null, darkvision60, actions, features, null);

        name = "Diseased Giant Rat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "If the target is a creature, it must succeed on a DC 10 Constitution saving throw or contract a disease. Until the disease is cured, the target can''t regain hit points except by magical means, and the target''s hit point maximum decreases by 3 (1d6) every 24 hours. If the target''s hit point maximum drops to 0 as a result of this disease, the target dies.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The rat has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The rat has advantage on an attack roll against a creature if at least one of the rat''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 12, 2, 30, 0, 0, 0, 0, false, 0, small, unaligned, ChallengeRating.EIGHTH, 7, 15, 11, 2, 10, 4, null, null, null, null, null, darkvision60, actions, features, null);

        name = "Giant Scorpion";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The scorpion makes three attacks: two with its claws and one with its sting."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 12). The scorpion has two claws, each of which can grapple only one target."),
                createAction("Sting", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, "The target must make a DC 12 Constitution saving throw, taking 22 (4d10) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, BEAST_ID, "", 15, 7, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.THREE, 15, 13, 15, 1, 9, 3, null, null, null, null, null, blindsight60, actions, null, null);

        name = "Giant Sea Horse";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Ram", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the sea horse moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) bludgeoning damage. It the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Water Breathing", "The sea horse can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 13, 3, 0, 0, 0, 40, 0, false, 0, large, unaligned, ChallengeRating.HALF, 12, 15, 11, 2, 12, 5, null, null, null, null, null, null, actions, features, null);

        name = "Giant Shark";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.TEN, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Blood Frenzy", "The shark has advantage on melee attack rolls against any creature that doesn''t have all its hit points."),
                new MonsterFeatureApi(0, "Water Breathing", "The shark can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 13, 11, 0, 0, 0, 50, 0, false, 0, huge, unaligned, ChallengeRating.FIVE, 23, 11, 21, 1, 10, 5, null, null, perception, null, null, blindsight60, actions, features, null);

        name = "Giant Spider";
        senses = new ArrayList<>(Arrays.asList(
                new MonsterSenseApi(Sense.BLINDSIGHT, 10),
                new MonsterSenseApi(Sense.DARKVISION, 60)
        ));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "The target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."),
                createActionRange("Web", 0, "30/60 ft.", AttackType.ATTACK, 5, 0, DiceSize.FOUR, bludgeoning, null, 0, "The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage).", MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Spider Climb", "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Web Sense", "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."),
                new MonsterFeatureApi(0, "Web Walker", "The spider ignores movement restrictions caused by webbing.")
        ));
        insert(name, BEAST_ID, "", 14, 4, 30, 0, 30, 0, 0, false, 0, large, unaligned, ChallengeRating.ONE, 14, 16, 12, 2, 11, 4, null, null, stealth, null, null, senses, actions, features, null);

        name = "Giant Toad";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, 1, DiceSize.TEN, poison, null, 0, "The target is grappled (escape DC 13). Until this grapple ends, the target is restrained, and the toad can''t bite another target."),
                createAction("Swallow", "The toad makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the toad, and it takes 10 (3d6) acid damage at the start of each of the toad''s turns. The toad can have only one target swallowed at a time.\\n\\nIf the toad dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 feet of movement, exiting prone.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The toad can breathe air and water."),
                new MonsterFeatureApi(0, "Standing Leap", "The toad''s long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.")
        ));
        insert(name, BEAST_ID, "", 11, 6, 20, 0, 0, 40, 0, false, 0, large, unaligned, ChallengeRating.ONE, 15, 13, 13, 2, 10, 3, null, null, null, null, null, darkvision30, actions, features, null);

        name = "Giant Vulture";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The vulture makes two attacks: one with its beak and one with its talons."),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.FOUR, piercing, STR_ID, 0, ""),
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Sight and Smell", "The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The vulture has advantage on an attack roll against a creature if at least one of the vulture''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 10, 3, 10, 0, 0, 0, 60, false, 0, large, neutralEvil, ChallengeRating.ONE, 15, 10, 15, 6, 12, 7, common, null, perception, null, null, null, actions, features, null);

        name = "Giant Wasp";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Sting", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, "The target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.")
        ));
        insert(name, BEAST_ID, "", 12, 3, 10, 0, 0, 0, 50, false, 0, medium, unaligned, ChallengeRating.HALF, 10, 14, 10, 1, 10, 3, null, null, null, null, null, null, actions, null, null);

        name = "Giant Weasel";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell.")
        ));
        insert(name, BEAST_ID, "", 13, 2, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.EIGHTH, 11, 16, 10, 4, 12, 5, null, null, perceptionStealth, null, null, darkvision60, actions, features, null);

        name = "Giant Wolf Spider";
        senses = new ArrayList<>(Arrays.asList(
                new MonsterSenseApi(Sense.BLINDSIGHT, 10),
                new MonsterSenseApi(Sense.DARKVISION, 60)
        ));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, "The target must make a DC 11 Constitution saving throw, taking 7 (2d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Spider Climb", "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Web Sense", "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."),
                new MonsterFeatureApi(0, "Web Walker", "The spider ignores movement restrictions caused by webbing.")
        ));
        insert(name, BEAST_ID, "", 13, 2, 40, 0, 40, 0, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 12, 16, 13, 3, 12, 4, null, null, perceptionStealth, null, null, senses, actions, features, null);

        name = "Goat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Ram", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the goat moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 10 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Sure-Footed", "The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.")
        ));
        insert(name, BEAST_ID, "", 10, 1, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.ZERO, 12, 10, 11, 2, 10, 5, null, null, null, null, null, null, actions, features, null);

        name = "Hawk";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 0, DiceSize.FOUR, slashing, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight", "The hawk has advantage on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, BEAST_ID, "", 13, 1, 10, 0, 0, 0, 60, false, 0, tiny, unaligned, ChallengeRating.ZERO, 5, 16, 8, 2, 14, 6, null, null, perception, null, null, null, actions, features, null);

        name = "Hunter Shark";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Blood Frenzy", "The shark has advantage on melee attack rolls against any creature that doesn''t have all its hit points."),
                new MonsterFeatureApi(0, "Water Breathing", "The shark can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 12, 6, 0, 0, 0, 40, 0, false, 0, large, unaligned, ChallengeRating.TWO, 18, 13, 15, 1, 10, 4, null, null, perception, null, null, blindsight30, actions, features, null);

        name = "Hyena";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Pack Tactics", "The hyena has advantage on an attack roll against a creature if at least one of the hyena''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 11, 1, 50, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.ZERO, 11, 13, 12, 2, 12, 5, null, null, perception, null, null, null, actions, features, null);

        name = "Jackal";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 1, 1, DiceSize.FOUR, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The jackal has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The jackal has advantage on an attack roll against a creature if at least one of the jackal''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 40, 0, 0, 0, 0, false, 0, small, unaligned, ChallengeRating.ZERO, 8, 15, 11, 3, 12, 6, null, null, perception, null, null, null, actions, features, null);

        name = "Killer Whale";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 5, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Echolocation", "The whale can''t use its blindsight while deafened."),
                new MonsterFeatureApi(0, "Hold Breath", "The whale can hold its breath for 30 minutes."),
                new MonsterFeatureApi(0, "Keen Hearing", "The whale has advantage on Wisdom (Perception) checks that rely on hearing.")
        ));
        insert(name, BEAST_ID, "", 12, 12, 0, 0, 0, 60, 0, false, 0, huge, unaligned, ChallengeRating.THREE, 19, 10, 13, 3, 12, 7, null, null, perception, null, null, blindsight120, actions, features, null);

        name = "Lion";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The lion has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The lion has advantage on an attack roll against a creature if at least one of the lion''s allies is within 5 feet of the creature and the ally isn''t incapacitated."),
                new MonsterFeatureApi(0, "Pounce", "If the lion moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action."),
                new MonsterFeatureApi(0, "Running Leap", "With a 10-foot running start, the lion can long jump up to 25 feet.")
        ));
        insert(name, BEAST_ID, "", 12, 4, 50, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.ONE, 17, 15, 13, 3, 12, 8, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Lizard";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 0, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        insert(name, BEAST_ID, "", 10, 1, 20, 0, 20, 0, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 11, 10, 1, 8, 3, null, null, null, null, null, darkvision30, actions, null, null);

        name = "Mammoth";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 4, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Stomp", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 4, DiceSize.TEN, bludgeoning, STR_ID, 0, "One prone creature")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Trampling Charge", "If the mammoth moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 13, 11, 40, 0, 0, 0, 0, false, 0, huge, unaligned, ChallengeRating.SIX, 24, 9, 21, 3, 11, 6, null, null, null, null, null, null, actions, features, null);

        name = "Mastiff";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.EIGHTH, 13, 14, 12, 3, 12, 7, null, null, perception, null, null, null, actions, features, null);

        name = "Mule";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Beast of Burden", "The mule is considered to be a Large animal for the purpose of determining its carrying capacity."),
                new MonsterFeatureApi(0, "Sure-Footed", "The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.")
        ));
        insert(name, BEAST_ID, "", 10, 2, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.EIGHTH, 14, 10, 13, 2, 10, 5, null, null, null, null, null, null, actions, features, null);

        name = "Octopus";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Tentacles", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 0, DiceSize.FOUR, bludgeoning, null, 1, "The target is grappled (escape DC 10). Until this grapple ends, the octopus can''t use its tentacles on another target."),
                createAction("Ink Cloud", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "A 5- foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Hold Breath", "While out of water, the octopus can hold its breath for 30 minutes."),
                new MonsterFeatureApi(0, "Underwater Camouflage", "The octopus has advantage on Dexterity (Stealth) checks made while underwater."),
                new MonsterFeatureApi(0, "Water Breathing", "The octopus can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 5, 0, 0, 30, 0, false, 0, small, unaligned, ChallengeRating.ZERO, 4, 15, 11, 3, 10, 4, null, null, perceptionStealth, null, null, darkvision30, actions, features, null);

        name = "Owl";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 0, DiceSize.FOUR, slashing, null, 1, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Flyby", "The owl doesn''t provoke opportunity attacks when it flies out of an enemy''s reach."),
                new MonsterFeatureApi(0, "Keen Hearing and Sight", "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight.")
        ));
        insert(name, BEAST_ID, "", 11, 1, 5, 0, 0, 0, 60, false, 0, tiny, unaligned, ChallengeRating.ZERO, 3, 13, 8, 2, 12, 7, null, null, perceptionStealth, null, null, darkvision120, actions, features, null);

        name = "Panther";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The panther has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Pounce", "If the panther moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 12, 3, 50, 0, 40, 0, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 14, 15, 10, 3, 14, 7, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Phase Spider";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, piercing, STR_ID, 0, "The target must make a DC 11 Constitution saving throw, taking 18 (4d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Ethereal Jaunt", "As a bonus action, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa."),
                new MonsterFeatureApi(0, "Spider Climb", "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Web Walker", "The spider ignores movement restrictions caused by webbing.")
        ));
        insert(name, MONSTROSITY_ID, "", 13, 5, 30, 0, 30, 0, 0, false, 0, large, unaligned, ChallengeRating.THREE, 15, 15, 12, 6, 10, 6, null, null, stealth, null, null, darkvision60, actions, features, null);

        name = "Poisonous Snake";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 0, DiceSize.FOUR, piercing, null, 1, "The target must make a DC 10 Constitution saving throw, taking 5 (2d4) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, BEAST_ID, "", 13, 1, 30, 0, 0, 30, 0, false, 0, tiny, unaligned, ChallengeRating.EIGHTH, 2, 16, 11, 1, 10, 3, null, null, null, null, null, blindsight10, actions, null, null);

        name = "Polar Bear";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The bear makes two attacks: one with its bite and one with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The bear has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 40, 0, 0, 30, 0, false, 0, large, unaligned, ChallengeRating.TWO, 20, 10, 16, 2, 13, 7, null, null, perception, null, null, null, actions, features, null);

        name = "Pony";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 10, 2, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.EIGHTH, 15, 10, 13, 2, 11, 7, null, null, null, null, null, null, actions, null, null);

        name = "Quipper";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Blood Frenzy", "The quipper has advantage on melee attack rolls against any creature that doesn''t have all its hit points."),
                new MonsterFeatureApi(0, "Water Breathing", "The quipper can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 13, 1, 0, 0, 0, 40, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 16, 9, 1, 7, 2, null, null, null, null, null, darkvision60, actions, features, null);

        name = "Rat";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 0, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The rat has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        insert(name, BEAST_ID, "", 10, 1, 20, 0, 0, 0, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 11, 9, 2, 10, 4, null, null, null, null, null, darkvision30, actions, features, null);

        name = "Raven";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Mimicry", "The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 10, 0, 0, 0, 50, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 14, 8, 2, 12, 6, null, null, perception, null, null, null, actions, features, null);

        name = "Reef Shark";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Pack Tactics", "The shark has advantage on an attack roll against a creature if at least one of the shark''s allies is within 5 feet of the creature and the ally isn''t incapacitated."),
                new MonsterFeatureApi(0, "Water Breathing", "The shark can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 12, 4, 0, 0, 0, 40, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 14, 13, 13, 1, 10, 4, null, null, perception, null, null, blindsight30, actions, features, null);

        name = "Rhinoceros";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Charge", "If the rhinoceros moves at least 20 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.")
        ));
        insert(name, BEAST_ID, "", 11, 6, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.TWO, 21, 8, 15, 2, 12, 6, null, null, null, null, null, null, actions, features, null);

        name = "Riding Horse";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 10, 2, 60, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.QUARTER, 16, 10, 12, 2, 11, 7, null, null, null, null, null, null, actions, null, null);

        name = "Saber-Toothed Tiger";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The tiger has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Pounce", "If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 12, 7, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.TWO, 18, 14, 15, 3, 12, 8, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Scorpion";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Sting", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 0, DiceSize.FOUR, piercing, null, 1, "The target must make a DC 9 Constitution saving throw, taking 4 (1d8) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, BEAST_ID, "", 11, 1, 10, 0, 0, 0, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 11, 8, 1, 8, 2, null, null, null, null, null, blindsight10, actions, null, null);

        name = "Sea Horse";
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Water Breathing", "The sea horse can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 11, 1, 0, 0, 0, 20, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 1, 12, 8, 1, 10, 2, null, null, null, null, null, null, null, features, null);

        name = "Spider";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 0, DiceSize.FOUR, piercing, null, 1, "The target must succeed on a DC 9 Constitution saving throw or take 2 (1d4) poison damage.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Spider Climb", "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Web Sense", "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."),
                new MonsterFeatureApi(0, "Web Walker", "The spider ignores movement restrictions caused by webbing.")
        ));
        insert(name, BEAST_ID, "", 12, 1, 20, 0, 20, 0, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 2, 14, 8, 1, 10, 2, null, null, null, null, null, darkvision30, actions, features, null);

        name = "Swarm of Bats";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.FOUR, piercing, null, 0, "2 (1d4) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Echolocation", "The swarm can''t use its blindsight while deafened."),
                new MonsterFeatureApi(0, "Keen Hearing", "The swarm has advantage on Wisdom (Perception) checks that rely on hearing."),
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 0, 0, 0, 0, 30, false, 0, medium, unaligned, ChallengeRating.QUARTER, 5, 15, 10, 2, 12, 4, null, null, null, swarmResistances, swarmImmunities, blindsight60, actions, features, null);

        name = "Swarm of Insects";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 4, DiceSize.FOUR, piercing, null, 0, "5 (2d4) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 20, 0, 20, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 3, 13, 10, 1, 7, 1, null, null, null, swarmResistances, swarmImmunities, blindsight10, actions, features, null);

        name = "Swarm of Beetles";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 4, DiceSize.FOUR, piercing, null, 0, "5 (2d4) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 20, 0, 20, 0, 0, false, 5, medium, unaligned, ChallengeRating.HALF, 3, 13, 10, 1, 7, 1, null, null, null, swarmResistances, swarmImmunities, blindsight10, actions, features, null);

        name = "Swarm of Centipedes";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 4, DiceSize.FOUR, piercing, null, 0, "5 (2d4) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Poisoned", "A creature reduced to 0 hit points by a swarm of centipedes is stable but poisoned for 1 hour, even after regaining hit points, and paralyzed while poisoned in this way."),
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 20, 0, 20, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 3, 13, 10, 1, 7, 1, null, null, null, swarmResistances, swarmImmunities, blindsight10, actions, features, null);

        name = "Swarm of Spiders";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 4, DiceSize.FOUR, piercing, null, 0, "5 (2d4) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Spider Climb", "The swarm can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Web Sense", "While in contact with a web, the swarm knows the exact location of any other creature in contact with the same web."),
                new MonsterFeatureApi(0, "Web Walker", "The swarm ignores movement restrictions caused by webbing."),
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 20, 0, 20, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 3, 13, 10, 1, 7, 1, null, null, null, swarmResistances, swarmImmunities, blindsight10, actions, features, null);

        name = "Swarm of Insects";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 4, DiceSize.FOUR, piercing, null, 0, "5 (2d4) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 20, 0, 20, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 3, 13, 10, 1, 7, 1, null, null, null, swarmResistances, swarmImmunities, blindsight10, actions, features, null);

        name = "Swarm of Poisonous Snakes";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, null, 0, "3 (1d6) piercing damage if the swarm has half of its hit points or fewer. The target must make a DC 10 Constitution saving throw, taking 14 (4d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 14, 8, 30, 0, 0, 30, 0, false, 0, medium, unaligned, ChallengeRating.TWO, 8, 18, 11, 1, 10, 3, null, null, null, swarmResistances, swarmImmunities, blindsight10, actions, features, null);

        name = "Swarm of Quippers";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 4, DiceSize.SIX, piercing, null, 0, "7 (2d6) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Blood Frenzy", "The swarm has advantage on melee attack rolls against any creature that doesn''t have all its hit points."),
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. The swarm can''t regain hit points or gain temporary hit points."),
                new MonsterFeatureApi(0, "Water Breathing", "The swarm can breathe only underwater.")
        ));
        insert(name, BEAST_ID, "", 13, 8, 0, 0, 0, 40, 0, false, 0, medium, unaligned, ChallengeRating.ONE, 13, 16, 9, 1, 7, 2, null, null, null, swarmResistances, swarmImmunities, darkvision60, actions, features, null);

        name = "Swarm of Rats";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 2, DiceSize.SIX, piercing, null, 0, "3 (1d6) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The swarm has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 10, 7, 30, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 9, 11, 9, 2, 10, 3, null, null, null, swarmResistances, swarmImmunities, darkvision30, actions, features, null);

        name = "Swarm of Ravens";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, piercing, null, 0, "3 (1d6) piercing damage if the swarm has half of its hit points or fewer.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Swarm", "The swarm can occupy another creature''s space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. The swarm can''t regain hit points or gain temporary hit points.")
        ));
        insert(name, BEAST_ID, "", 12, 7, 10, 0, 0, 0, 50, false, 0, medium, unaligned, ChallengeRating.QUARTER, 6, 14, 8, 3, 12, 6, null, null, perception, swarmResistances, swarmImmunities, null, actions, features, null);

        name = "Tiger";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The tiger has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Pounce", "If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 12, 5, 40, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.ONE, 17, 15, 14, 3, 12, 8, null, null, perceptionStealth, null, null, darkvision60, actions, features, null);

        name = "Vulture";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, piercing, null, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Sight and Smell", "The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The vulture has advantage on an attack roll against a creature if at least one of the vulture''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 10, 1, 10, 0, 0, 0, 50, false, 0, medium, unaligned, ChallengeRating.ZERO, 7, 10, 13, 2, 12, 4, null, null, perception, null, null, null, actions, features, null);

        name = "Warhorse";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Trampling Charge", "If the horse moves at least 20 feet straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 11, 3, 60, 0, 0, 0, 0, false, 0, large, unaligned, ChallengeRating.HALF, 18, 12, 13, 2, 12, 7, null, null, null, null, null, null, actions, features, null);

        name = "Weasel";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 0, DiceSize.FOUR, piercing, null, 1, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell.")
        ));
        insert(name, BEAST_ID, "", 13, 1, 30, 0, 0, 0, 0, false, 0, tiny, unaligned, ChallengeRating.ZERO, 3, 16, 8, 2, 12, 3, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Winter Wolf";
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, GIANT_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, "If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."),
                createAction("Cold Breath", MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The wolf has advantage on an attack roll against a creature if at least one of the wolf''s allies is within 5 feet of the creature and the ally isn''t incapacitated."),
                new MonsterFeatureApi(0, "Snow Camouflage", "The wolf has advantage on Dexterity (Stealth) checks made to hide in snowy terrain.")
        ));
        insert(name, MONSTROSITY_ID, "", 13, 10, 50, 0, 0, 0, 0, false, 0, large, neutralEvil, ChallengeRating.THREE, 18, 13, 14, 7, 12, 8, languageProfs, null, perceptionStealth, coldImmune, null, null, actions, features, null);

        name = "Wolf";
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.FOUR, piercing, DEX_ID, 0, "If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The wolf has advantage on attack rolls against a creature if at least one of the wolf''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, BEAST_ID, "", 13, 2, 40, 0, 0, 0, 0, false, 0, medium, unaligned, ChallengeRating.QUARTER, 12, 15, 12, 3, 12, 6, null, null, perceptionStealth, null, null, null, actions, features, null);

        name = "Worg";
        languageProfs = new ArrayList<>(Collections.singletonList(GOBLIN_LANG_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, piercing, STR_ID, 0, "If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell.")
        ));
        insert(name, MONSTROSITY_ID, "", 13, 4, 50, 0, 0, 0, 0, false, 0, large, neutralEvil, ChallengeRating.HALF, 16, 13, 13, 7, 11, 8, languageProfs, null, perception, null, null, darkvision60, actions, features, null);

        name = "Acolyte";
        skillProfs = new ArrayList<>(Arrays.asList(MEDICINE_ID, RELIGION_ID));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(CLUB_ID, "", 1)
        ));
        spells = getSpellIds("'Light', 'Sacred Flame', 'Thaumaturgy', 'Bless', 'Cure Wounds', 'Sanctuary'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Club", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, ""),
                createSpellAction(false, "Sacred Flame", 0, DEX_ID, false, 1, DiceSize.EIGHT, radiant),
                createSpellAction(false, AttackType.HEAL, "Cure Wounds", 0, null, false, 1, DiceSize.EIGHT, "", WIS_ID, 0, 1, 1, 1, DiceSize.EIGHT, "", null, 0)
        ));
        insertCaster(name, HUMANOID_ID, "", 10, 2, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.QUARTER, 10, 10, 10, 10, 14, 11, null, "@level1Id", WIS_ID, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, spells, common, null, skillProfs, null, null, null, actions, null, equipment);

        name = "Archmage";
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(DAGGER_ID, "", 1)
        ));
        savingThrowProfs = new ArrayList<>(Arrays.asList(INT_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant
        ));
        spells = getSpellIds("'Fire Bolt', 'Light', 'Mage Hand', 'Prestidigitation', 'Shocking Grasp', 'Detect Magic', 'Identify', 'Mage Armor', 'Magic Missile', 'Detect Thoughts', 'Mirror Image', 'Misty Step', 'Counterspell', 'Fly', 'Lightning Bolt', 'Banishment', 'Fire Shield', 'Stoneskin', 'Cone of Cold', 'Scrying', 'Wall of Force', 'Globe of Invulnerability', 'Teleport', 'Mind Blank', 'Time Stop'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Dagger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.FOUR, bludgeoning, DEX_ID, 0, ""),
                createSpellAction(false, "Fire Bolt", 0, null, false, 4, DiceSize.TEN, fire),
                createSpellAction(false, "Shocking Grasp", 0, null, false, 4, DiceSize.EIGHT, lightning),
                createSpellAction(false, AttackType.ATTACK, "Magic Missile", 0, null, false, 3, DiceSize.FOUR, force, null, 3, 1, 1, 1, DiceSize.FOUR, force, null, 1),
                createSpellAction(false, "Lightning Bolt", 0, DEX_ID, true, 8, DiceSize.SIX, lightning, 3, 1, 1, DiceSize.SIX, lightning),
                createSpellAction(false, "Cone of Cold", 0, CON_ID, true, 8, DiceSize.EIGHT, cold, 5, 1, 1, DiceSize.EIGHT, cold)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Magic Resistance", "The archmage has advantage on saving throws against spells and other magical effects.")
        ));
        insertCaster(name, HUMANOID_ID, "", 12, 18, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.TWELVE, 10, 14, 12, 20, 15, 16, null, "@level18Id", INT_ID, 0, 0, 4, 3, 3, 3, 3, 1, 1, 1, 1, spells, common, savingThrowProfs, skillProfs, damageModifiers, null, null, actions, features, equipment);

        name = "Assassin";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_STUDDED_LEATHER_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(LIGHT_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, INT_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ACROBATICS_ID, DECEPTION_ID, PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Collections.singletonList(poisonResistant));
        languageProfs = new ArrayList<>(Arrays.asList(THIEVES_CANT_ID, COMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The assassin makes two shortsword attacks.\\n"),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.SIX, piercing, DEX_ID, 0, "The target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."),
                createActionRange("Light Crossbow", CROSSBOW_BOLT_ID, "80/320 ft.", AttackType.ATTACK, 6, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "The target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Assassinate", "During its first turn, the assassin has advantage on attack rolls against any creature that hasn''t taken a turn. Any hit the assassin scores against a surprised creature is a critical hit."),
                new MonsterFeatureApi(0, "Evasion", "If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."),
                new MonsterFeatureApi(0, "Sneak Attack", "Once per turn, the assassin deals an extra 14 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the assassin that isn''t incapacitated and the assassin doesn''t have disadvantage on the attack roll.")
        ));
        insert(name, HUMANOID_ID, "", 15, 12, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.EIGHT, 11, 16, 14, 13, 11, 10, languageProfs, savingThrowProfs, skillProfs, damageModifiers, null, null, actions, features, equipment);

        name = "Bandit";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_LEATHER_ID, "", 1),
                new ListObject(SCIMITAR_ID, "", 1),
                new ListObject(LIGHT_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Scimitar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, slashing, DEX_ID, 0, ""),
                createActionRange("Light Crossbow", CROSSBOW_BOLT_ID, "80/320 ft.", AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        insert(name, HUMANOID_ID, "", 12, 2, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.EIGHTH, 11, 12, 12, 10, 10, 10, common, null, null, null, null, null, actions, null, equipment);

        name = "Bandit Captain";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_STUDDED_LEATHER_ID, "", 1),
                new ListObject(SCIMITAR_ID, "", 1),
                new ListObject(DAGGER_ID, "", 1)
        ));
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, DEX_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, DECEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers."),
                createAction("Scimitar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, slashing, DEX_ID, 0, ""),
                createAction("Dagger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, DEX_ID, 0, ""),
                createReaction("Parry", "The captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon.")
        ));
        insert(name, HUMANOID_ID, "", 15, 10, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.TWO, 15, 16, 14, 14, 11, 14, common, savingThrowProfs, skillProfs, null, null, null, actions, null, equipment);

        name = "Berserker";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_HIDE_ID, "", 1),
                new ListObject(GREATAXE_ID, "", 1)
        ));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Greataxe", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TWELVE, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Reckless", "At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn.")
        ));
        insert(name, HUMANOID_ID, "", 13, 9, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.TWO, 16, 12, 17, 9, 11, 9, common, null, null, null, null, null, actions, features, equipment);

        name = "Commoner";
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(CLUB_ID, "", 1)
        ));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Club", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, HUMANOID_ID, "", 10, 1, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.ZERO, 10, 10, 10, 10, 10, 10, common, null, null, null, null, null, actions, null, equipment);

        name = "Cultist";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_LEATHER_ID, "", 1),
                new ListObject(SCIMITAR_ID, "", 1)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, RELIGION_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Scimitar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, slashing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Dark Devotion", "The cultist has advantage on saving throws against being charmed or frightened.")
        ));
        insert(name, HUMANOID_ID, "", 12, 2, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.EIGHTH, 11, 12, 10, 10, 11, 10, common, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Cult Fanatic";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_LEATHER_ID, "", 1),
                new ListObject(DAGGER_ID, "", 1)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, PERSUASION_ID, RELIGION_ID));
        spells = getSpellIds("'Light', 'Sacred Flame', 'Thaumaturgy', 'Command', 'Inflict Wounds', 'Shield of Faith', 'Hold Person', 'Spiritual Weapon'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The fanatic makes two melee attacks."),
                createAction("Dagger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, ""),
                createSpellAction(false, "Sacred Flame", 0, DEX_ID, false, 1, DiceSize.EIGHT, radiant),
                createSpellAction(false, "Inflict Wounds", 0, null, false, 3, DiceSize.TEN, necrotic, 1, 1, 1, DiceSize.TEN, necrotic),
                createSpellAction(false, AttackType.ATTACK, "Spiritual Weapon", 0, null, false, 1, DiceSize.EIGHT, force, WIS_ID, 0, 2, 1, 1, DiceSize.EIGHT, force, null, 0)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Dark Devotion", "The fanatic has advantage on saving throws against being charmed or frightened.")
        ));
        insertCaster(name, HUMANOID_ID, "", 13, 6, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.TWO, 11, 14, 12, 10, 13, 14, "@fullCasterId", "@level4Id", WIS_ID, 0, 0, 4, 3, 0, 0, 0, 0, 0, 0, 0, spells, common, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Druid";
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(QUARTERSTAFF_ID, "", 1)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(MEDICINE_ID, NATURE_ID, PERCEPTION_ID));
        languageProfs = new ArrayList<>(Arrays.asList(DRUIDIC_ID, COMMON_ID));
        spells = getSpellIds("'Druidcraft', 'Produce Flame', 'Shillelagh', 'Entangle', 'Longstrider', 'Speak with Animals', 'Thunderwave', 'Animal Messenger', 'Barkskin'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Quarterstaff", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createAction("Quarterstaff (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createSpellAction(false, "Produce Flame", 0, null, false, 1, DiceSize.EIGHT, fire),
                createSpellAction(false, "Thunderwave", 0, CON_ID, true, 2, DiceSize.EIGHT, thunder, 1, 1, 1, DiceSize.EIGHT, thunder)
        ));
        insertCaster(name, HUMANOID_ID, "", 11, 5, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.TWO, 10, 12, 13, 12, 15, 11, "@fullCasterId", "@level4Id", WIS_ID, 0, 0, 4, 3, 0, 0, 0, 0, 0, 0, 0, spells, languageProfs, null, skillProfs, null, null, null, actions, null, equipment);

        name = "Gladiator";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_STUDDED_LEATHER_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(SPEAR_ID, "", 1)
        ));
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, DEX_ID, CON_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, INTIMIDATION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The gladiator makes three melee attacks or two ranged attacks."),
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Shield Bash", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, "If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."),
                createReaction("Parry", "The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Brave", "The gladiator has advantage on saving throws against being frightened."),
                new MonsterFeatureApi(0, "Brute", "A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).")
        ));
        insert(name, HUMANOID_ID, "", 16, 15, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.FIVE, 18, 15, 16, 10, 12, 15, common, savingThrowProfs, skillProfs, null, null, null, actions, features, equipment);

        name = "Guard";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_CHAIN_SHIRT_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(SPEAR_ID, "", 1)
        ));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        insert(name, HUMANOID_ID, "", 16, 2, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.EIGHTH, 13, 12, 12, 10, 11, 10, common, null, perception, null, null, null, actions, null, equipment);

        name = "Knight";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(GREATSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The knight makes two melee attacks."),
                createAction("Greatsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 2, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createAction("Leadership", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 feet of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated."),
                createReaction("Parry", "The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Brave", "The gladiator has advantage on saving throws against being frightened."),
                new MonsterFeatureApi(0, "Brute", "A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).")
        ));
        insert(name, HUMANOID_ID, "", 18, 8, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.THREE, 16, 11, 14, 11, 11, 15, common, savingThrowProfs, null, null, null, null, actions, features, equipment);

        name = "Mage";
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(DAGGER_ID, "", 1)
        ));
        savingThrowProfs = new ArrayList<>(Arrays.asList(INT_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID));
        spells = getSpellIds("'Fire Bolt', 'Light', 'Mage Hand', 'Prestidigitation', 'Detect Magic', 'Mage Armor', 'Magic Missile', 'Shield', 'Misty Step', 'Suggestion', 'Counterspell', 'Fireball', 'Fly', 'Greater Invisibility', 'Ice Storm', 'Cone of Cold'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Dagger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, DEX_ID, 0, ""),
                createSpellAction(false, "Fire Bolt", 0, null, false, 2, DiceSize.TEN, fire),
                createSpellAction(false, AttackType.ATTACK, "Magic Missile", 0, null, false, 3, DiceSize.FOUR, force, null, 3, 1, 1, 1, DiceSize.FOUR, force, null, 1),
                createSpellAction(false, "Fireball", 0, DEX_ID, true, 8, DiceSize.SIX, fire, 3, 1, 1, DiceSize.SIX, fire),
                createSpellAction(false, AttackType.ATTACK, "Ice Storm", 0, DEX_ID, true, 2, DiceSize.EIGHT, bludgeoning, null, 0, 4, DiceSize.SIX, cold, null, 0, 4, 1, 1, DiceSize.EIGHT, bludgeoning, null, 0),
                createSpellAction(false, "Cone of Cold", 0, CON_ID, true, 8, DiceSize.EIGHT, cold, 5, 1, 1, DiceSize.EIGHT, cold)
        ));
        insertCaster(name, HUMANOID_ID, "", 12, 9, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.SIX, 9, 14, 11, 17, 12, 11, "@fullCasterId", "@level9Id", INT_ID, 0, 0, 4, 3, 3, 3, 1, 0, 0, 0, 0, spells, common, savingThrowProfs, skillProfs, null, null, null, actions, null, equipment);

        name = "Noble";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_BREASTPLATE_ID, "", 1),
                new ListObject(RAPIER_ID, "", 1)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERSUASION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Rapier", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, ""),
                createReaction("Parry", "The noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon.")
        ));
        insert(name, HUMANOID_ID, "", 15, 2, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.EIGHTH, 11, 12, 11, 12, 14, 16, common, null, skillProfs, null, null, null, actions, null, equipment);

        name = "Priest";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_CHAIN_SHIRT_ID, "", 1),
                new ListObject(MACE_ID, "", 1)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(MEDICINE_ID, PERSUASION_ID, RELIGION_ID));
        spells = getSpellIds("'Light', 'Sacred Flame', 'Thaumaturgy', 'Cure Wounds', 'Guiding Bolt', 'Sanctuary', 'Lesser Restoration', 'Spiritual Weapon', 'Dispel Magic', 'Spirit Guardians'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Mace", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createSpellAction(false, "Sacred Flame", 0, DEX_ID, false, 2, DiceSize.EIGHT, radiant),
                createSpellAction(false, AttackType.HEAL, "Cure Wounds", 0, null, false, 1, DiceSize.EIGHT, "", WIS_ID, 0, 1, 1, 1, DiceSize.EIGHT, "", null, 0),
                createSpellAction(false, "Guiding Bolt", 0, null, false, 4, DiceSize.SIX, radiant, 1, 1, 1, DiceSize.SIX, radiant),
                createSpellAction(false, AttackType.ATTACK, "Spiritual Weapon", 0, null, false, 1, DiceSize.EIGHT, force, WIS_ID, 0, 2, 1, 1, DiceSize.EIGHT, force, null, 0),
                createSpellAction(false, "Spirit Guardians", 0, WIS_ID, true, 2, DiceSize.EIGHT, necrotic, 3, 1, 1, DiceSize.EIGHT, necrotic)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Divine Eminence", "As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.")
        ));
        insertCaster(name, HUMANOID_ID, "", 13, 5, 25, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.TWO, 10, 10, 12, 13, 16, 13, "@fullCasterId", "@level5Id", WIS_ID, 0, 0, 4, 3, 2, 0, 0, 0, 0, 0, 0, spells, common, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Scout";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_LEATHER_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(NATURE_ID, PERCEPTION_ID, STEALTH_ID, SURVIVAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The scout makes two melee attacks or two ranged attacks."),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Hearing and Sight", "The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight.")
        ));
        insert(name, HUMANOID_ID, "", 13, 3, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.HALF, 11, 14, 12, 11, 13, 11, common, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Spy";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HAND_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, INVESTIGATION_ID, PERCEPTION_ID, PERSUASION_ID, SLEIGHT_OF_HAND_ID, STEALTH_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The spy makes two melee attacks."),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createActionRange("Hand Crossbow", CROSSBOW_BOLT_ID, "30/120 ft.", AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Cunning Action", "On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action."),
                new MonsterFeatureApi(0, "Sneak Attack", "Once per turn, the spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the spy that isn''t incapacitated and the spy doesn''t have disadvantage on the attack roll.")
        ));
        insert(name, HUMANOID_ID, "", 12, 6, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.ONE, 10, 15, 10, 12, 14, 16, common, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Thug";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_LEATHER_ID, "", 1),
                new ListObject(MACE_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        skillProfs = new ArrayList<>(Collections.singletonList(INTIMIDATION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The thug makes two melee attacks."),
                createAction("Mace", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 2, 1, DiceSize.TEN, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Pack Tactics", "The thug has advantage on an attack roll against a creature if at least one of the thug''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, HUMANOID_ID, "", 11, 5, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.HALF, 15, 11, 14, 10, 10, 11, common, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Tribal Warrior";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_HIDE_ID, "", 1),
                new ListObject(SPEAR_ID, "", 1)
        ));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The thug makes two melee attacks."),
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Pack Tactics", "The warrior has advantage on an attack roll against a creature if at least one of the warrior''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, HUMANOID_ID, "", 12, 2, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.EIGHTH, 13, 11, 12, 8, 11, 8, common, null, null, null, null, null, actions, features, equipment);

        name = "Veteran";
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_SPLINT_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, "")
        ));
        insert(name, HUMANOID_ID, "", 17, 9, 30, 0, 0, 0, 0, false, 0, medium, any, ChallengeRating.THREE, 16, 13, 14, 10, 11, 10, common, null, skillProfs, null, null, null, actions, null, equipment);
    }

    public void initializeData() throws Exception {
        List<String> spells;
        List<String> innateSpells;
        List<Integer> languageProfs;
        List<Integer> savingThrowProfs;
        List<Integer> skillProfs;
        List<MonsterDamageModifierApi> damageModifiers;
        List<Integer> conditionImmunities;
        List<MonsterSenseApi> senses;
        List<MonsterActionApi> actions;
        List<MonsterFeatureApi> features;
        List<ListObject> equipment;

        List<Integer> allLanguages = new ArrayList<>(Arrays.asList(COMMON_ID, DWARVISH_ID, ELVISH_ID, GIANT_LANG_ID, GNOMISH_ID, GOBLIN_LANG_ID, HALFLING_LANG_ID, ORC_LANG_ID, ABYSSAL_ID, CELESTIAL_LANGUAGE_ID, DRACONIC_ID, DEEP_SPEECH_ID, INFERNAL_ID, PRIMORDIAL_ID, SYLVAN_ID, UNDERCOMMON_ID, DRUIDIC_ID, THIEVES_CANT_ID));
        List<Integer> infernal = new ArrayList<>(Collections.singletonList(INFERNAL_ID));
        List<Integer> commonDraconic = new ArrayList<>(Arrays.asList(COMMON_ID, DRACONIC_ID));
        List<Integer> draconic = new ArrayList<>(Collections.singletonList(DRACONIC_ID));
        List<Integer> common = new ArrayList<>(Collections.singletonList(COMMON_ID));
        List<Integer> giant = new ArrayList<>(Collections.singletonList(GIANT_LANG_ID));
        List<Integer> commonGiant = new ArrayList<>(Arrays.asList(COMMON_ID, GIANT_LANG_ID));
        List<Integer> commonSphinx = new ArrayList<>(Arrays.asList(COMMON_ID, SPHINX_ID));

        MonsterSenseApi blindsight10 = new MonsterSenseApi(Sense.BLINDSIGHT, 10);
        MonsterSenseApi blindsight30 = new MonsterSenseApi(Sense.BLINDSIGHT, 30);
        MonsterSenseApi blindsight60 = new MonsterSenseApi(Sense.BLINDSIGHT, 60);
        MonsterSenseApi blindsight120 = new MonsterSenseApi(Sense.BLINDSIGHT, 120);
        MonsterSenseApi darkvision60 = new MonsterSenseApi(Sense.DARKVISION, 60);
        MonsterSenseApi darkvision90 = new MonsterSenseApi(Sense.DARKVISION, 90);
        MonsterSenseApi darkvision120 = new MonsterSenseApi(Sense.DARKVISION, 120);
        MonsterSenseApi tremorsense60 = new MonsterSenseApi(Sense.TREMORSENSE, 60);
        MonsterSenseApi telepathy60 = new MonsterSenseApi(Sense.TELEPATHY, 60);
        MonsterSenseApi telepathy120 = new MonsterSenseApi(Sense.TELEPATHY, 120);
        MonsterSenseApi truesight120 = new MonsterSenseApi(Sense.TRUESIGHT, 120);

        final MonsterDamageModifierApi coldVulnerable = createModifier(cold, DamageModifierType.VULNERABLE, "");
        final MonsterDamageModifierApi fireVulnerable = createModifier(fire, DamageModifierType.VULNERABLE, "");
        final MonsterDamageModifierApi radiantVulnerable = createModifier(radiant, DamageModifierType.VULNERABLE, "");
        final MonsterDamageModifierApi thunderVulnerable = createModifier(thunder, DamageModifierType.VULNERABLE, "");

        final MonsterDamageModifierApi bludgeoningVulnerable = createModifier(bludgeoning, DamageModifierType.VULNERABLE, "");

        final MonsterDamageModifierApi acidResistant = createModifier(acid, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi coldResistant = createModifier(cold, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi fireResistant = createModifier(fire, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi lightningResistant = createModifier(lightning, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi necroticResistant = createModifier(necrotic, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi poisonResistant = createModifier(poison, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi radiantResistant = createModifier(radiant, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi thunderResistant = createModifier(thunder, DamageModifierType.RESISTANT, "");

        final MonsterDamageModifierApi bludgeoningResistant = createModifier(bludgeoning, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi piercingResistant = createModifier(piercing, DamageModifierType.RESISTANT, "");
        final MonsterDamageModifierApi slashingResistant = createModifier(slashing, DamageModifierType.RESISTANT, "");

        final MonsterDamageModifierApi nonmagicalBludgeoningResistant = createModifier(bludgeoning, DamageModifierType.RESISTANT, nonmagical);
        final MonsterDamageModifierApi nonmagicalPiercingResistant = createModifier(piercing, DamageModifierType.RESISTANT, nonmagical);
        final MonsterDamageModifierApi nonmagicalSlashingResistant = createModifier(slashing, DamageModifierType.RESISTANT, nonmagical);

        final MonsterDamageModifierApi adamantineBludgeoningResistant = createModifier(bludgeoning, DamageModifierType.RESISTANT, adamantine);
        final MonsterDamageModifierApi adamantinePiercingResistant = createModifier(piercing, DamageModifierType.RESISTANT, adamantine);
        final MonsterDamageModifierApi adamantineSlashingResistant = createModifier(slashing, DamageModifierType.RESISTANT, adamantine);

        final MonsterDamageModifierApi silveredBludgeoningResistant = createModifier(bludgeoning, DamageModifierType.RESISTANT, silvered);
        final MonsterDamageModifierApi silveredPiercingResistant = createModifier(piercing, DamageModifierType.RESISTANT, silvered);
        final MonsterDamageModifierApi silveredSlashingResistant = createModifier(slashing, DamageModifierType.RESISTANT, silvered);

        final MonsterDamageModifierApi acidImmune = createModifier(acid, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi coldImmune = createModifier(cold, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi fireImmune = createModifier(fire, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi lightningImmune = createModifier(lightning, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi necroticImmune = createModifier(necrotic, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi poisonImmune = createModifier(poison, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi psychicImmune = createModifier(psychic, DamageModifierType.IMMUNE, "");
        final MonsterDamageModifierApi thunderImmune = createModifier(thunder, DamageModifierType.IMMUNE, "");

        final MonsterDamageModifierApi slashingImmune = createModifier(slashing, DamageModifierType.IMMUNE, "");

        final MonsterDamageModifierApi nonmagicalBludgeoningImmune = createModifier(bludgeoning, DamageModifierType.IMMUNE, nonmagical);
        final MonsterDamageModifierApi nonmagicalPiercingImmune = createModifier(piercing, DamageModifierType.IMMUNE, nonmagical);
        final MonsterDamageModifierApi nonmagicalSlashingImmune = createModifier(slashing, DamageModifierType.IMMUNE, nonmagical);

        final MonsterDamageModifierApi aamantineBludgeoningImmune = createModifier(bludgeoning, DamageModifierType.IMMUNE, adamantine);
        final MonsterDamageModifierApi adamantinePiercingImmune = createModifier(piercing, DamageModifierType.IMMUNE, adamantine);
        final MonsterDamageModifierApi adamantineSlashingImmune = createModifier(slashing, DamageModifierType.IMMUNE, adamantine);

        final MonsterDamageModifierApi silveredBludgeoningImmune = createModifier(bludgeoning, DamageModifierType.IMMUNE, silvered);
        final MonsterDamageModifierApi silveredPiercingImmune = createModifier(piercing, DamageModifierType.IMMUNE, silvered);
        final MonsterDamageModifierApi silveredSlashingImmune = createModifier(slashing, DamageModifierType.IMMUNE, silvered);

        final List<MonsterDamageModifierApi> fiendMonsterDamageModifierApis = new ArrayList<>(Arrays.asList(
                coldResistant, fireResistant, lightningResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                poisonImmune
        ));

        final List<MonsterDamageModifierApi> devilMonsterDamageModifierApis = new ArrayList<>(Arrays.asList(
                coldResistant, silveredBludgeoningResistant, silveredPiercingResistant, silveredSlashingResistant,
                fireImmune, poisonImmune
        ));

        final List<MonsterDamageModifierApi> skeletonMonsterDamageModifierApis = new ArrayList<>(Arrays.asList(
                bludgeoningVulnerable,
                poisonImmune
        ));

        final List<MonsterDamageModifierApi> vampireMonsterDamageModifierApis = new ArrayList<>(Arrays.asList(
                necroticResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant
        ));

        final List<MonsterDamageModifierApi> wereMonsterDamageModifierApis = new ArrayList<>(Arrays.asList(
                silveredBludgeoningImmune, silveredPiercingImmune, silveredSlashingImmune
        ));

        final List<MonsterDamageModifierApi> poisonPsychicImmune = new ArrayList<>(Arrays.asList(
                poisonImmune, psychicImmune
        ));

        final List<MonsterDamageModifierApi> firePoisonImmuneList = new ArrayList<>(Arrays.asList(
                fireImmune, poisonImmune
        ));

        final List<MonsterDamageModifierApi> acidResistantList = new ArrayList<>(Collections.singletonList(acidResistant));
        final List<MonsterDamageModifierApi> coldResistantList = new ArrayList<>(Collections.singletonList(coldResistant));
        final List<MonsterDamageModifierApi> fireResistantList = new ArrayList<>(Collections.singletonList(fireResistant));
        final List<MonsterDamageModifierApi> lightningResistantList = new ArrayList<>(Collections.singletonList(lightningResistant));
        final List<MonsterDamageModifierApi> poisonResistantList = new ArrayList<>(Collections.singletonList(poisonResistant));

        final List<MonsterDamageModifierApi> acidImmuneList = new ArrayList<>(Collections.singletonList(acidImmune));
        final List<MonsterDamageModifierApi> coldImmuneList = new ArrayList<>(Collections.singletonList(coldImmune));
        final List<MonsterDamageModifierApi> fireImmuneList = new ArrayList<>(Collections.singletonList(fireImmune));
        final List<MonsterDamageModifierApi> poisonImmuneList = new ArrayList<>(Collections.singletonList(poisonImmune));

        String name = "Aboleth";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, INT_ID, WIS_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        skillProfs = new ArrayList<>(Arrays.asList(HISTORY_ID, PERCEPTION_ID));
        languageProfs = new ArrayList<>(Collections.singletonList(DEEP_SPEECH_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The aboleth makes three tentacle attacks."),
                createAction("Tentacle", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "Reach 10ft., one target. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature''s skin becomes translucent and slimy, the creature can''t regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed."),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.SIX, bludgeoning, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Enslave", MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, "The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth''s control and can''t take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\\n\\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth."),
                createLegendaryAction("Detect", 1, "The aboleth makes a Wisdom (Perception) check."),
                createLegendaryAction("Tail Swipe", 1, "The aboleth makes one tail attack."),
                createLegendaryAction("Psychic Drain", 2, "One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The aboleth can breathe air and water."),
                new MonsterFeatureApi(0, "Mucous Cloud", "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater."),
                new MonsterFeatureApi(0, "Probing Telepathy", "If a creature communicates telepathically with the aboleth, the aboleth learns the creature''s greatest desires if the aboleth can see the creature.")
        ));
        insert(name, true, ABERRATION_ID, "", 17, 18, 10, 0, 0, 40, 0, false, 0, large, lawfulEvil, ChallengeRating.TEN, 21, 9, 15, 18, 15, 18, languageProfs, savingThrowProfs, skillProfs, null, null, senses, actions, features, null);

        name = "Deva";
        savingThrowProfs = new ArrayList<>(Arrays.asList(WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                radiantResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        innateSpells = getSpellIds("'Detect Evil and Good', 'Commune', 'Raise Dead'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The deva makes two melee attacks."),
                createAction("Mace", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, 4, DiceSize.EIGHT, radiant, null, 0, ""),
                createAction("Healing Touch", MonsterActionAttackType.OTHER, AttackType.HEAL, 0, null, false, 4, DiceSize.EIGHT, "", null, 2, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, "The deva touches another creature. The target magically regains 20 (4d8 + 2) hit points and is freed from any curse, disease, poison, blindness, or deafness"),
                createAction("Change Shape", "The deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva''s choice).\\n\\nIn a new form, the deva retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and special senses are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks."),
                createSpellAction(true, "Detect Evil and Good", 0),
                createSpellAction(true, "Commune", 1),
                createSpellAction(true, "Raise Dead", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Angelic Weapons", "The deva''s weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack)."),
                new MonsterFeatureApi(0, "Magic Resistance", "The deva has advantage on saving throws against spells and other magical effects.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(MACE_ID, "", 1)
        ));
        insertInnate(name, CELESTIAL_ID, "", 17, 16, 30, 0, 0, 0, 90, false, 0, medium, lawfulGood, ChallengeRating.TEN, 18, 18, 18, 17, 20, 20, CHA_ID, 0, 0, innateSpells, allLanguages, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);

        name = "Planetar";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                radiantResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        innateSpells = getSpellIds("'Detect Evil and Good', 'Invisibility', 'Blade Barrier', 'Dispel Evil and Good', 'Flame Strike', 'Raise Dead', 'Commune', 'Control Weather', 'Insect Plague'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The planetar makes two melee attacks"),
                createAction("Greatsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 4, DiceSize.SIX, slashing, STR_ID, 0, 5, DiceSize.EIGHT, radiant, null, 0, ""),
                createAction("Healing Touch", MonsterActionAttackType.OTHER, AttackType.HEAL, 0, null, false, 6, DiceSize.EIGHT, "", null, 3, MonsterLimitedUseType.NUM_PER_DAY, 4, 0, 0, "The planetar touches another creature. The target magically regains 30 (6d8 + 3) hit points and is freed from any curse, disease, poison, blindness, or deafness."),
                createSpellAction(true, "Detect Evil and Good", 0),
                createSpellAction(true, "Invisibility", 0),
                createSpellAction(true, "Blade Barrier", 3, DEX_ID, true, 6, DiceSize.TEN, slashing),
                createSpellAction(true, "Dispel Evil and Good", 3),
                createSpellAction(true, "Flame Strike", 3, DEX_ID, true, 4, DiceSize.SIX, fire, 5, 1, 1, DiceSize.SIX, fire),
                createSpellAction(true, "Raise Dead", 3),
                createSpellAction(true, "Commune", 1),
                createSpellAction(true, "Control Weather", 1),
                createSpellAction(true, "Insect Plague", 1, CON_ID, true, 4, DiceSize.TEN, piercing, 5, 1, 1, DiceSize.TEN, piercing)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Angelic Weapons", "The planetar''s weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack)."),
                new MonsterFeatureApi(0, "Divine Awareness", "The planetar knows if it hears a lie"),
                new MonsterFeatureApi(0, "Magic Resistance", "The planetar has advantage on saving throws against spells and other magical effects")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATSWORD_ID, "", 1)
        ));
        insertInnate(name, CELESTIAL_ID, "", 19, 16, 40, 0, 0, 0, 120, false, 0, large, lawfulGood, ChallengeRating.SIXTEEN, 24, 20, 24, 19, 22, 25, CHA_ID, 0, 0, innateSpells,  allLanguages, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);

        name = "Solar";
        savingThrowProfs = new ArrayList<>(Arrays.asList(INT_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                radiantResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                necroticImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        innateSpells = getSpellIds("'Detect Evil and Good', 'Invisibility', 'Blade Barrier', 'Dispel Evil and Good', 'Resurrection', 'Commune', 'Control Weather'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The solar makes two greatsword attacks."),
                createAction("Greatsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 15, 4, DiceSize.SIX, slashing, STR_ID, 0, 6, DiceSize.EIGHT, radiant, null, 0, ""),
                createActionRange("Slaying Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 13, 2, DiceSize.EIGHT, piercing, DEX_ID, 0, 6, DiceSize.EIGHT, radiant, null, 0, "If the target is a creature that has 100 hit points or fewer, it must succeed on a DC 15 Constitution saving throw or die."),
                createAction("Flying Sword", "The solar releases its greatsword to hover magically in an unoccupied space within 5 feet of it. If the solar can see the sword, the solar can mentally command it as a bonus action to fly up to 50 feet and either make one attack against a target or return to the solar''s hands. If the hovering sword is targeted by any effect, the solar is considered to be holding it. The hovering sword falls if the solar dies."),
                createAction("Healing Touch", MonsterActionAttackType.OTHER, AttackType.HEAL, 0, null, false, 8, DiceSize.EIGHT, "", null, 4, MonsterLimitedUseType.NUM_PER_DAY, 4, 0, 0, "The planetar touches another creature. The target magically regains 30 (6d8 + 3) hit points and is freed from any curse, disease, poison, blindness, or deafness."),
                createLegendaryAction("Teleport", 1, "The solar magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."),
                createLegendarySave("Searing Burst", 23, DEX_ID, true, 4, DiceSize.SIX, fire, null, 0, 4, DiceSize.SIX, radiant, null, 0, 2, "The solar emits magical, divine energy. Each creature of its choice in a 10-foot radius must make a DC 23 Dexterity saving throw, taking 14 (4d6) fire damage plus 14 (4d6) radiant damage on a failed save, or half as much damage on a successful one."),
                createLegendarySave("Blinding Gaze", 15, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, 3, "The solar targets one creature it can see within 30 feet of it. If the target can see it, the target must succeed on a DC 15 Constitution saving throw or be blinded until magic such as the lesser restoration spell removes the blindness."),
                createSpellAction(true, "Detect Evil and Good", 0),
                createSpellAction(true, "Invisibility", 0),
                createSpellAction(true, "Blade Barrier", 3, DEX_ID, true, 6, DiceSize.TEN, slashing),
                createSpellAction(true, "Dispel Evil and Good", 3),
                createSpellAction(true, "Resurrection", 3),
                createSpellAction(true, "Commune", 1),
                createSpellAction(true, "Control Weather", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Angelic Weapons", "The solar''s weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack)."),
                new MonsterFeatureApi(0, "Divine Awareness", "The solar knows if it hears a lie."),
                new MonsterFeatureApi(0, "Magic Resistance", "The solar has advantage on saving throws against spells and other magical effects.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(GREATSWORD_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insertInnate(name, true, CELESTIAL_ID, "", 21, 18, 50, 0, 0, 0, 150, false, 0, large, neutral, ChallengeRating.TWENTY_ONE, 26, 22, 26, 25, 25, 30, CHA_ID, 0, 0, innateSpells,  allLanguages, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);

        name = "Animated Armor";
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The armor makes two melee attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Antimagic Susceptibility", "The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constitution saving throw against the caster''s spell save DC or fall unconscious for 1 minute."),
                new MonsterFeatureApi(0, "False Apperance", "While the armor remains motionless, it is indistinguishable from a normal suit of armor.")
        ));
        insert(name, CONSTRUCT_ID, "", 18, 6, 25, medium, unaligned, ChallengeRating.ONE, 14, 11, 13, 1, 3, 1, null, null, null, poisonPsychicImmune, conditionImmunities, senses, actions, features, null);

        name = "Flying Sword";
        savingThrowProfs = new ArrayList<>(Collections.singletonList(DEX_ID));
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Antimagic Susceptibility", "The sword is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the sword must succeed on a Constitution saving throw against the caster''s spell save DC or fall unconscious for 1 minute."),
                new MonsterFeatureApi(0, "False Apperance", "While the sword remains motionless and isn''t flying, it is indistinguishable from a normal sword.")
        ));
        insert(name, CONSTRUCT_ID, "", 17, 5, 0, 0, 0, 0, 50, true, 0, small, unaligned, ChallengeRating.QUARTER, 12, 15, 11, 1, 5, 1, null, savingThrowProfs, null, poisonPsychicImmune, conditionImmunities, senses, actions, features, null);

        name = "Rug of Smothering";
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Smother", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "The creature is grappled (escape DC 13). Until this grapple ends, the target is restrained, blinded, and at risk of suffocating, and the rug can''t smother another target. In addition, at the start of each of the target''s turns, the target takes 10 (2d6 + 3) bludgeoning damage.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Antimagic Susceptibility", "The rug is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the rug must succeed on a Constitution saving throw against the caster''s spell save DC or fall unconscious for 1 minute."),
                new MonsterFeatureApi(0, "Damage Transfer", "While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature grappled by the rug takes the other half."),
                new MonsterFeatureApi(0, "False Apperance", "While the rug remains motionless, it is indistinguishable from a normal rug.")
        ));
        insert(name, CONSTRUCT_ID, "", 12, 6, 10, large, unaligned, ChallengeRating.TWO, 17, 14, 10, 1, 3, 1, null, null, null, poisonPsychicImmune, conditionImmunities, senses, actions, features, null);

        name = "Ankheg";
        senses = new ArrayList<>(Arrays.asList(darkvision60, tremorsense60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, 1, DiceSize.SIX, acid, null, 0, "If the target is a Large or smaller creature, it is grappled (escape DC 13). Until this grapple ends, the ankheg can bite only the grappled creature and has advantage on attack rolls to do so."),
                createActionSave("Acid Spray", 13, DEX_ID, true, 3, DiceSize.SIX, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "The ankheg spits acid in a line that is 30 feet long and 5 feet wide, provided that it has no creature grappled. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, MONSTROSITY_ID, "", 14, 6, 30, 0, 0, 0, 0, false, 10, large, unaligned, ChallengeRating.TWO, 17, 11, 13, 1, 13, 6, null, null, null, null, null, senses, actions, null, null);

        name = "Azer";
        savingThrowProfs = new ArrayList<>(Collections.singletonList(CON_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        languageProfs = new ArrayList<>(Collections.singletonList(IGNAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Warhammer", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, 1, DiceSize.SIX, fire, null, 0, ""),
                createAction("Warhammer (Two-handed)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, bludgeoning, STR_ID, 0, 1, DiceSize.SIX, fire, null, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Heated Body", "A creature that touches the azer or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage"),
                new MonsterFeatureApi(0, "Heated Weapons", "When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) fire damage (included in the attack)."),
                new MonsterFeatureApi(0, "Illumination", "The azer sheds bright light in a 10-foot radius and dim light for an additional 10 feet.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(WAR_HAMMER_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1)
        ));
        insert(name, ELEMENTAL_ID, "", 17, 6, 30, medium, lawfulNeutral, ChallengeRating.TWO, 17, 12, 15, 12, 13, 10, languageProfs, savingThrowProfs, null, firePoisonImmuneList, conditionImmunities, null, actions, features, equipment);

        name = "Basilisk";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, piercing, STR_ID, 0, 2, DiceSize.SIX, poison, null, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Petrifying Gaze", "If a creature starts its turn within 30 feet of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn''t incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.\\n\\nA creature that isn''t surprised can avert its eyes to avoid the saving throw at the start of its turn. If it does so, it can''t see the basilisk until the start of its next turn, when it can avert its eyes again. If it looks at the basilisk in the meantime, it must immediately make the save.\\n\\nIf the basilisk sees its reflection within 30 feet of it in bright light, it mistakes itself for a rival and targets itself with its gaze.")
        ));
        insert(name, MONSTROSITY_ID, "", 15, 8, 20, medium, unaligned, ChallengeRating.THREE, 16, 8, 15, 2, 8, 7, null, null, null, null, null, senses, actions, features, null);

        name = "Behir";
        skillProfs = new ArrayList<>(Arrays.asList(STEALTH_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision90));
        languageProfs = new ArrayList<>(Collections.singletonList(DRACONIC_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The behir makes two attacks: one with its bite and one to constrict."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 3, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Constrict", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.TEN, bludgeoning, STR_ID, 0, 2, DiceSize.TEN, slashing, STR_ID, 0, "One Large or Smaller Creature: The target is grappled (escape DC 16) if the behir isn''t already constricting a creature, and the target is restrained until this grapple ends."),
                createActionSave("Lightning Breath", 16, DEX_ID, true, 12, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The behir exhales a line of lightning that is 20 feet long and 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createAction("Swallow", "The behir makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is also swallowed, and the grapple ends. While swallowed, the target is blinded and restrained, it has total cover against attacks and other effects outside the behir, and it takes 21 (6d6) acid damage at the start of each of the behir''s turns. A behir can have only one creature swallowed at a time.\\n\\nIf the behir takes 30 damage or more on a single turn from the swallowed creature, the behir must succeed on a DC 14 Constitution saving throw at the end of that turn or regurgitate the creature, which falls prone in a space within 10 feet of the behir. If the behir dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 15 feet of movement, exiting prone")
        ));
        insert(name, MONSTROSITY_ID, "", 17, 16, 50, 0, 40, 0, 0, false, 0, huge, neutralEvil, ChallengeRating.ELEVEN, 23, 16, 18, 7, 14, 12, languageProfs, null, skillProfs, fireImmuneList, null, senses, actions, null, null);

        name = "Bugbear";
        skillProfs = new ArrayList<>(Arrays.asList(STEALTH_ID, SURVIVAL_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, GOBLIN_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Morningstar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Javelin", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Javelin", 0, "30/120 ft.", AttackType.ATTACK, 4, 2, DiceSize.SIX, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Brute", "A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack)."),
                new MonsterFeatureApi(0, "Surprise Attack", "If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_HIDE_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(MORNINGSTAR_ID, "", 1),
                new ListObject(JAVELIN_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, goblinoid, 16, 5, 30, medium, chaoticEvil, ChallengeRating.ONE, 15, 14, 13, 8, 11, 9, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Bulette";
        senses = new ArrayList<>(Arrays.asList(darkvision60, tremorsense60));
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", ""),
                createActionSave("Deadly Leap", 16, DEX_ID, true, 3, DiceSize.SIX, bludgeoning, STR_ID, 0, 3, DiceSize.SIX, slashing, STR_ID, 0, "If the bulette jumps at least 15 feet as part of its movement, it can then use this action to land on its feet in a space that contains one or more other creatures. Each of those creatures must succeed on a DC 16 Strength or Dexterity saving throw (target''s choice) or be knocked prone and take 14 (3d6 + 4) bludgeoning damage plus 14 (3d6 + 4) slashing damage. On a successful save, the creature takes only half the damage, isn''t knocked prone, and is pushed 5 feet out of the bulette''s space into an unoccupied space of the creature''s choice. If no unoccupied space is within range, the creature instead falls prone in the bulette''s space.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Standing Leap", "The bulette''s long jump is up to 30 feet and its high jump is up to 15 feet, with or without a running start.")
        ));
        insert(name, MONSTROSITY_ID, "", 17, 9, 40, 0, 0, 0, 0, false, 40, large, unaligned, ChallengeRating.FIVE, 19, 11, 21, 2, 10, 5, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Centaur";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID, SURVIVAL_ID));
        languageProfs = new ArrayList<>(Arrays.asList(ELVISH_ID, SYLVAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The centaur makes two attacks: one with its pike and one with its hooves or two with its longbow."),
                createAction("Pike", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Charge", "If the centaur moves at least 30 feet straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) piercing damage.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(PIKE_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, MONSTROSITY_ID, "", 12, 6, 50, large, neutralGood, ChallengeRating.TWO, 18, 14, 14, 9, 13, 11, languageProfs, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Chimera";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(DRACONIC_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Horns", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.TWELVE, bludgeoning, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionSave("Fire Breath", 15, DEX_ID, true, 7, DiceSize.EIGHT, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, MONSTROSITY_ID, "", 14, 12, 30, 0, 0, 0, 60, false, 0, large, chaoticEvil, ChallengeRating.SIX, 19, 11, 19, 3, 14, 10, languageProfs, null, skillProfs, null, null, senses, actions, null, null);

        name = "Chuul";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        languageProfs = new ArrayList<>(Collections.singletonList(DEEP_SPEECH_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once."),
                createAction("Pincer", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 14) if it is a Large or smaller creature and the chuul doesn''t have two other creatures grappled."),
                createActionSave("Tentacles", 13, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, "One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The chuul can breathe air and water."),
                new MonsterFeatureApi(0, "Sense Magic", "The chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn''t itself magical.")
        ));
        insert(name, ABERRATION_ID, "", 16, 11, 30, 0, 0, 30, 0, false, 0, large, chaoticEvil, ChallengeRating.FOUR, 19, 10, 16, 5, 11, 5, languageProfs, null, skillProfs, poisonImmuneList, conditionImmunities, null, actions, features, null);

        name = "Cloaker";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(DEEP_SPEECH_ID, UNDERCOMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The cloaker makes two attacks: one with its bite and one with its tail."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, "If the target is Large or smaller, the cloaker attaches to it. If the cloaker has advantage against the target, the cloaker attaches to the target''s head, and the target is blinded and unable to breathe while the cloaker is attached. While attached, the cloaker can make this attack only against the target and has advantage on the attack roll. The cloaker can detach itself by spending 5 feet of its movement. A creature, including the target, can take its action to detach the cloaker by succeeding on a DC 16 Strength check."),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.EIGHT, slashing, STR_ID, 0, "Reach 10 ft., one creature"),
                createActionSave("Moan", 13, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, "Each creature within 60 feet of the cloaker that can hear its moan and that isn''t an aberration must succeed on a DC 13 Wisdom saving throw or become frightened until the end of the cloaker''s next turn. If a creature''s saving throw is successful, the creature is immune to the cloaker''s moan for the next 24 hours"),
                createAction("Phantasms", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "The cloaker magically creates three illusory duplicates of itself if it isn''t in bright light. The duplicates move with it and mimic its actions, shifting position so as to make it impossible to track which cloaker is the real one. If the cloaker is ever in an area of bright light, the duplicates disappear.\\n\\nWhenever any creature targets the cloaker with an attack or a harmful spell while a duplicate remains, that creature rolls randomly to determine whether it targets the cloaker or one of the duplicates. A creature is unaffected by this magical effect if it can''t see or if it relies on senses other than sight.\\n\\nA duplicate has the cloaker''s AC and uses its saving throws. If an attack hits a duplicate, or if a duplicate fails a saving throw against an effect that deals damage, the duplicate disappears.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Damage Transfer", "While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down), and that creature takes the other half."),
                new MonsterFeatureApi(0, "False Apperance", "While the cloaker remains motionless without its underside exposed, it is indistinguishable from a dark leather cloak."),
                new MonsterFeatureApi(0, "Light Sensitivity", "While in bright light, the cloaker has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, ABERRATION_ID, "", 14, 12, 10, 0, 0, 0, 40, false, 0, large, chaoticNeutral, ChallengeRating.EIGHT, 17, 15, 12, 13, 12, 14, languageProfs, null, skillProfs, null, null, senses, actions, features, null);

        name = "Cockatrice";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must succeed on a DC 11 Constitution saving throw against being magically petrified. On a failed save, the creature begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified for 24 hours.")
        ));
        insert(name, MONSTROSITY_ID, "", 11, 6, 20, 0, 0, 0, 40, false, 0, small, unaligned, ChallengeRating.HALF, 6, 12, 12, 2, 13, 5, null, null, null, null, null, senses, actions, null, null);

        name = "Couatl";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID, CHA_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                radiantResistant,
                psychicImmune, nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        innateSpells = getSpellIds("'Detect Evil and Good', 'Detect Magic', 'Detect Thoughts', 'Bless', 'Create Food and Water', 'Cure Wounds', 'Lesser Restoration', 'Protection from Poison', 'Sanctuary', 'Shield', 'Dream', 'Greater Restoration', 'Scrying'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.SIX, piercing, DEX_ID, 0, "The target must succeed on a DC 13 Constitution saving throw or be poisoned for 24 hours. Until this poison ends, the target is unconscious. Another creature can use an action to shake the target awake."),
                createAction("Constrict", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 15). Until this grapple ends, the target is restrained, and the couatl can''t constrict another target."),
                createAction("Change Shape", "The couatl magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the couatl''s choice).\\n\\nIn a new form, the couatl retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and other actions are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks. If the new form has a bite attack, the couatl can use its bite in that form."),
                createSpellAction(true, "Detect Evil and Good", 0),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Detect Thoughts", 0),
                createSpellAction(true, "Bless", 3),
                createSpellAction(true, "Create Food and Water", 3),
                createSpellAction(true, AttackType.HEAL, "Cure Wounds", 3, null, false, 1, DiceSize.EIGHT, "", CHA_ID, 0, 1, 1, 1, DiceSize.EIGHT, "", null, 0),
                createSpellAction(true, "Lesser Restoration", 3),
                createSpellAction(true, "Protection from Poison", 3),
                createSpellAction(true, "Sanctuary", 3),
                createSpellAction(true, "Shield", 3),
                createSpellAction(true, "Dream", 1),
                createSpellAction(true, "Greater Restoration", 1),
                createSpellAction(true, "Scrying", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Magic Weapons", "The couatl''s weapon attacks are magical"),
                new MonsterFeatureApi(0, "Shielded Mind", "The couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location.")
        ));
        insertInnate(name, CELESTIAL_ID, "", 19, 13, 30, 0, 0, 0, 90, false, 0, medium, lawfulGood, ChallengeRating.FOUR, 16, 20, 17, 18, 20, 18, CHA_ID, 0, 0, innateSpells,  allLanguages, savingThrowProfs, null, damageModifiers, null, senses, actions, features, null);

        name = "Darkmantle";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Crush", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, "The darkmantle attaches to the target. If the target is Medium or smaller and the darkmantle has advantage on the attack roll, it attaches by engulfing the target''s head, and the target is also blinded and unable to breathe while the darkmantle is attached in this way. While attached to the target, the darkmantle can attack no other creature except the target but has advantage on its attack rolls. The darkmantle''s speed also becomes 0, it can''t benefit from any bonus to its speed, and it moves with the target. A creature can detach the darkmantle by making a successful DC 13 Strength check as an action. On its turn, the darkmantle can detach itself from the target by using 5 feet of movement."),
                createAction("Darkness Aura", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "A 15-foot radius of magical darkness extends out from the darkmantle, moves with it, and spreads around corners. The darkness lasts as long as the darkmantle maintains concentration, up to 10 minutes (as if concentrating on a spell). Darkvision can''t penetrate this darkness, and no natural light can illuminate it. If any of the darkness overlaps with an area of light created by a spell of 2nd level or lower, the spell creating the light is dispelled.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Echolocation", "The darkmantle can''t use its blindsight while deafened."),
                new MonsterFeatureApi(0, "False Appearance", "While the darkmantle remains motionless, it is indistinguishable from a cave formation such as a stalactite or stalagmite.")
        ));
        insert(name, MONSTROSITY_ID, "", 11, 5, 10, 0, 0, 0, 30, false, 0, small, unaligned, ChallengeRating.HALF, 16, 12, 13, 2, 10, 5, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Balor";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The balor makes two attacks: one with its longsword and one with its whip."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 3, DiceSize.EIGHT, slashing, STR_ID, 0, 3, DiceSize.EIGHT, lightning, null, 0, "If the balor scores a critical hit, it rolls damage dice three times, instead of twice."),
                createAction("Whip", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.EIGHT, slashing, STR_ID, 0, 3, DiceSize.SIX, fire, null, 0, "The target must succeed on a DC 20 Strength saving throw or be pulled up to 25 feet toward the balor"),
                createAction("Teleport", "The balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Death Throes", "When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren''t being worn or carried, and it destroys the balor''s weapons."),
                new MonsterFeatureApi(0, "Fire Aura", "At the start of each of the balor''s turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura that aren''t being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage."),
                new MonsterFeatureApi(0, "Magic Resistance", "The balor has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The balor''s weapon attacks are magical.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(WHIP_ID, "", 1)
        ));
        insert(name, FIEND_ID, demon, 19, 21, 40, 0, 0, 0, 80, false, 0, huge, chaoticEvil, ChallengeRating.NINETEEN, 26, 15, 22, 20, 16, 22, languageProfs, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, equipment);

        name = "Dretch";
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant, fireResistant, lightningResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision60, telepathy60));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dretch makes two attacks: one with its bite and one with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 2, DiceSize.FOUR, slashing, STR_ID, 0, ""),
                createAction("Fetid Cloud", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "A 10-foot radius of disgusting green gas extends out from the dretch. The gas spreads around corners, and its area is lightly obscured. It lasts for 1 minute or until a strong wind disperses it. Any creature that starts its turn in that area must succeed on a DC 11 Constitution saving throw or be poisoned until the start of its next turn. While poisoned in this way, the target can take either an action or a bonus action on its turn, not both, and can''t take reactions.")
        ));
        insert(name, FIEND_ID, demon, 11, 4, 20, small, chaoticEvil, ChallengeRating.QUARTER, 11, 11, 12, 5, 8, 3, languageProfs, null, null, damageModifiers, conditionImmunities, senses, actions, null, null);

        name = "Glabrezu";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        innateSpells = getSpellIds("'Darkness', 'Detect Magic', 'Dispel Magic', 'Confusion', 'Fly', 'Power Word Stun'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The glabrezu makes four attacks: two with its pincers and two with its fists. Alternatively, it makes two attacks with its pincers and casts one spell."),
                createAction("Pincer", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.TEN, bludgeoning, STR_ID, 0, "Reach 10 ft., one target: If the target is a Medium or smaller creature, it is grappled (escape DC 15). The glabrezu has two pincers, each of which can grapple only one target."),
                createAction("Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.FOUR, bludgeoning, DEX_ID, 0, ""),
                createSpellAction(true, "Darkness", 0),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Dispel Magic", 0),
                createSpellAction(true, "Confusion", 1),
                createSpellAction(true, "Fly", 1),
                createSpellAction(true, "Power Word Stun", 1)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Magic Resistance", "The glabrezu has advantage on saving throws against spells and other magical effects.")
        ));
        insertInnate(name, FIEND_ID, demon, 17, 15, 40, 0, 0, 0, 0, false, 0, large, chaoticEvil, ChallengeRating.NINE, 20, 15, 21, 19, 17, 16, INT_ID, 0, 0, innateSpells,  languageProfs, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Hezrou";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The hezrou makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Magic Resistance", "The hezrou has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Stench", "Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou''s stench for 24 hours")
        ));
        insert(name, FIEND_ID, demon, 16, 13, 30, large, chaoticEvil, ChallengeRating.EIGHT, 19, 17, 20, 5, 12, 13, languageProfs, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Marilith";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The marilith makes seven attacks: six with its longswords and one with its tail."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.TEN, bludgeoning, STR_ID, 0, "If the target is Medium or smaller, it is grappled (escape DC 19). Until this grapple ends, the target is restrained, the marilith can automatically hit the target with its tail, and the marilith can''t make tail attacks against other targets."),
                createAction("Teleport", "The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."),
                createReaction("Parry", "The marilith adds 5 to its AC against one melee attack that would hit it. To do so, the marilith must see the attacker and be wielding a melee weapon.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Magic Resistance", "The marilith has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The marilith''s weapon attacks are magical."),
                new MonsterFeatureApi(0, "Reactive", "The marilith can take one reaction on every turn in a combat.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(LONGSWORD_ID, "", 1)
        ));
        insert(name, FIEND_ID, demon, 18, 18, 40, large, chaoticEvil, ChallengeRating.SIXTEEN, 18, 20, 20, 18, 16, 20, languageProfs, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, equipment);

        name = "Nalfeshnee";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, INT_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 5, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 3, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionSave("Horror Nimbus", 15, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the nalfeshnee''s Horror Nimbus for the next 24 hours."),
                createAction("Teleport", "The nalfeshnee magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Magic Resistance", "The nalfeshnee has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, demon, 18, 16, 20, 0, 0, 0, 30, false, 0, large, chaoticEvil, ChallengeRating.THIRTEEN, 21, 10, 22, 19, 12, 15, languageProfs, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Quasit";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, COMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claw (Bite in Beast Form)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must succeed on a DC 10 Constitution saving throw or take 5 (2d4) poison damage and become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createActionSave("Scare", 10, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "One creature of the quasit''s choice within 20 feet of it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success."),
                createAction("Invisibility", "The quasit magically turns invisible until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit wears or carries is invisible with it.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The quasit can use its action to polymorph into a beast form that resembles a bat (speed 10 ft. fly 40 ft.), a centipede (40 ft., climb 40 ft.), or a toad (40 ft., swim 40 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Magic Resistance", "The quasit has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, "Demon, Shapechanger", 13, 3, 40, tiny, chaoticEvil, ChallengeRating.ONE, 5, 17, 10, 7, 10, 10, languageProfs, null, skillProfs, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Vrock";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The vrock makes two attacks: one with its beak and one with its talons."),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Spores", MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "A 15-foot-radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target takes 5 (1d10) poison damage at the start of each of its turns. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it."),
                createAction("Stunning Screech", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "The vrock emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn''t a demon must succeed on a DC 14 Constitution saving throw or be stunned until the end of the vrock''s next turn.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Magic Resistance", "The vrock has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, demon, 15, 11, 40, 0, 0, 0, 60, false, 0, large, chaoticEvil, ChallengeRating.SIX, 17, 15, 18, 8, 13, 8, languageProfs, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Barbed Devil";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The devil makes three melee attacks: one with its tail and two with its claws. Alternatively, it can use Hurl Flame twice."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Hurl Flame", 0, "150 ft.", AttackType.ATTACK, 5, 3, DiceSize.SIX, fire, null, 0, "If the target is a flammable object that isn''t being worn or carried, it also catches fire.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Barbed Hide", "At the start of each of its turns, the barbed devil deals 5 (1d10) piercing damage to any creature grappling it."),
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the devil''s darkvision."),
                new MonsterFeatureApi(0, "Magic Resistance", "The devil has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, devil, 15, 13, 30, medium, lawfulEvil, ChallengeRating.FIVE, 16, 17, 18, 12, 14, 14, infernal, savingThrowProfs, skillProfs, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Bearded Devil";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The devil makes two attacks: one with its beard and one with its glaive."),
                createAction("Beard", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "The target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. While poisoned in this way, the target can''t regain hit points. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Glaive", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, "Reach 10 ft., one target: If the target is a creature other than an undead or a construct, it must succeed on a DC 12 Constitution saving throw or lose 5 (1d10) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 5 (1d10). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the devil''s darkvision"),
                new MonsterFeatureApi(0, "Magic Resistance", "The devil has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Steadfast", "The devil can''t be frightened while it can see an allied creature within 30 feet of it.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GLAIVE_ID, "", 1)
        ));
        insert(name, FIEND_ID, devil, 13, 8, 30, medium, lawfulEvil, ChallengeRating.THREE, 16, 15, 15, 9, 11, 11, infernal, savingThrowProfs, null, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, equipment);

        name = "Bone Devil";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The devil makes three attacks: two with its claws and one with its sting."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Sting", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.EIGHT, piercing, STR_ID, 0, 5, DiceSize.SIX, poison, null, 0, "The target must succeed on a DC 14 Constitution saving throw or become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the devil''s darkvision."),
                new MonsterFeatureApi(0, "Magic Resistance", "The devil has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, devil, 19, 15, 40, 0, 0, 0, 40, false, 0, large, lawfulEvil, ChallengeRating.NINE, 18, 16, 18, 13, 14, 16, infernal, null, skillProfs, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Chain Devil";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The devil makes two attacks with its chains."),
                createAction("Chain", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.SIX, slashing, STR_ID, 0, "The target is grappled (escape DC 14) if the devil isn''t already grappling a creature. Until this grapple ends, the target is restrained and takes 7 (2d6) piercing damage at the start of each of its turns."),
                createAction("Animate Chains", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil''s control, provided that the chains aren''t being worn or carried.\\n\\nEach animated chain is an object with AC 20, 20 hit points, resistance to piercing damage, and immunity to psychic and thunder damage. When the devil uses Multiattack on its turn, it can use each animated chain to make one additional chain attack. An animated chain can grapple one creature of its own but can''t make attacks while grappling. An animated chain reverts to its inanimate state if reduced to 0 hit points or if the devil is incapacitated or dies."),
                createReaction("Unnerving Mask", "When a creature the devil can see starts its turn within 30 feet of the devil, the devil can create the illusion that it looks like one of the creature''s departed loved ones or bitter enemies. If the creature can see the devil, it must succeed on a DC 14 Wisdom saving throw or be frightened until the end of its turn.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the devil''s darkvision."),
                new MonsterFeatureApi(0, "Magic Resistance", "The devil has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, devil, 16, 10, 30, medium, lawfulEvil, ChallengeRating.EIGHT, 18, 15, 18, 11, 12, 14, infernal, savingThrowProfs, null, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Erinyes";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The erinyes makes three attacks."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.EIGHT, slashing, STR_ID, 0, 3, DiceSize.EIGHT, poison, null, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.TEN, slashing, STR_ID, 0, 3, DiceSize.EIGHT, poison, null, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 7, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, 3, DiceSize.EIGHT, poison, null, 0, "The target must succeed on a DC 14 Constitution saving throw or be poisoned. The poison lasts until it is removed by the lesser restoration spell or similar magic."),
                createReaction("Parry", "The erinyes adds 4 to its AC against one melee attack that would hit it. To do so, the erinyes must see the attacker and be wielding a melee weapon.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Hellish Weapons", "The erinyes''s weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks)."),
                new MonsterFeatureApi(0, "Magic Resistance", "The erinyes has advantage on saving throws against spells and other magical effects.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(ARMOR_PLATE_ID, "", 1)
        ));
        insert(name, FIEND_ID, devil, 18, 18, 30, 0, 0, 0, 60, false, 0, medium, lawfulEvil, ChallengeRating.TWELVE, 18, 16, 18, 14, 14, 18, infernal, savingThrowProfs, null, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, equipment);

        name = "Horned Devil";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, DEX_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The devil makes three melee attacks: two with its fork and one with its tail. It can use Hurl Flame in place of any melee attack."),
                createAction("Fork", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "If the target is a creature other than an undead or a construct, it must succeed on a DC 17 Constitution saving throw or lose 10 (3d6) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 10 (3d6). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing. Hurl Flame. Ranged Spell Attack: +7"),
                createActionRange("Hurl Flame", 0, "150 ft.", AttackType.ATTACK, 7, 4, DiceSize.SIX, fire, null, 0, "If the target is a flammable object that isn''t being worn or carried, it also catches fire.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the devil''s darkvision."),
                new MonsterFeatureApi(0, "Magic Resistance", "The devil has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, devil, 18, 17, 20, 0, 0, 0, 60, false, 0, large, lawfulEvil, ChallengeRating.ELEVEN, 22, 17, 21, 12, 16, 17, infernal, savingThrowProfs, null, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Ice Devil";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                bludgeoningResistant, piercingResistant, slashingResistant,
                coldImmune, fireImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight60, darkvision120, telepathy120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The devil makes three attacks: one with its bite, one with its claws, and one with its tail."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.SIX, piercing, STR_ID, 0, 3, DiceSize.SIX, cold, null, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.FOUR, slashing, STR_ID, 0, 3, DiceSize.SIX, cold, null, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 3, DiceSize.SIX, cold, null, 0, ""),
                createAction("Wall of Ice", MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it''s a hemispherical dome up to 20 feet in diameter.\\n\\nWhen the wall appears, each creature in its space is pushed out of it by the shortest route. The creature chooses which side of the wall to end up on, unless the creature is incapacitated. The creature then makes a DC 17 Dexterity saving throw, taking 35 (10d6) cold damage on a failed save, or half as much damage on a successful one.\\n\\nThe wall lasts for 1 minute or until the devil is incapacitated or dies. The wall can be damaged and breached; each 10-foot section has AC 5, 30 hit points, vulnerability to fire damage, and immunity to acid, cold, necrotic, poison, and psychic damage. If a section is destroyed, it leaves behind a sheet of frigid air in the space the wall occupied. Whenever a creature finishes moving through the frigid air on a turn, willingly or otherwise, the creature must make a DC 17 Constitution saving throw, taking 17 (5d6) cold damage on a failed save, or half as much damage on a successful one. The frigid air dissipates when the rest of the wall vanishes.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the devil''s darkvision."),
                new MonsterFeatureApi(0, "Magic Resistance", "The devil has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, devil, 18, 19, 40, large, lawfulEvil, ChallengeRating.FOURTEEN, 21, 14, 18, 18, 15, 18, infernal, savingThrowProfs, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Imp";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERSUASION_ID, STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(INFERNAL_ID, COMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Sting (Bite in Beast Form)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must make on a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one."),
                createAction("Invisibility", "The imp magically turns invisible until it attacks or until its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisible with it.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The imp can use its action to polymorph into a beast form that resembles a rat (speed 20 ft.), a raven (20 ft., fly 60 ft.), or a spider (20 ft., climb 20 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the imp''s darkvision."),
                new MonsterFeatureApi(0, "Magic Resistance", "The imp has advantage on saving throws against spells and other magical effects.")
        ));
        insert(name, FIEND_ID, "Devil, Shapechanger", 13, 3, 20, 0, 0, 0, 40, false, 0, tiny, lawfulEvil, ChallengeRating.ONE, 6, 17, 13, 11, 12, 14, languageProfs, null, skillProfs, devilMonsterDamageModifierApis, conditionImmunities, senses, actions, features, null);

        name = "Lemure";
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant,
                fireImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, FRIGHTENED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Devil''s Sight", "Magical darkness doesn''t impede the lemure''s darkvision."),
                new MonsterFeatureApi(0, "Hellish Rejuvenation", "A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a bless spell cast on that creature or its remains are sprinkled with holy water")
        ));
        insert(name, FIEND_ID, devil, 7, 3, 15, medium, lawfulEvil, ChallengeRating.ZERO, 10, 5, 11, 1, 11, 3, infernal, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Pit Fiend";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        innateSpells = getSpellIds("'Detect Magic', 'Fireball', 'Hold Monster', 'Wall of Fire'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The pit fiend makes four attacks: one with its bite, one with its claw, one with its mace, and one with its tail."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 4, DiceSize.SIX, piercing, STR_ID, 0, "The target must succeed on a DC 21 Constitution saving throw or become poisoned. While poisoned in this way, the target can''t regain hit points, and it takes 21 (6d6) poison damage at the start of each of its turns. The poisoned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.EIGHT, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Mace", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 6, DiceSize.SIX, fire, null, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 3, DiceSize.TEN, bludgeoning, STR_ID, 0, ""),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Fireball", 0, DEX_ID, true, 8, DiceSize.SIX, fire, 3, 1, 1, DiceSize.SIX, fire),
                createSpellAction(true, "Hold Monster", 3),
                createSpellAction(true, "Wall of Fire", 3, DEX_ID, true, 5, DiceSize.EIGHT, fire, 4, 1, 1, DiceSize.EIGHT, fire)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Fear Aura", "Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature''s saving throw is successful, the creature is immune to the pit fiend''s Fear Aura for the next 24 hours."),
                new MonsterFeatureApi(0, "Magic Resistance", "The pit fiend has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The pit fiend''s weapon attacks are magical.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(MACE_ID, "", 1)
        ));
        insertInnate(name, FIEND_ID, devil, 19, 24, 30, 0, 0, 0, 60, false, 0, large, lawfulEvil, ChallengeRating.TWENTY, 26, 14, 24, 22, 18, 24, innateSpells, infernal, savingThrowProfs, null, fiendMonsterDamageModifierApis, conditionImmunities, senses, actions, features, equipment);

        name = "Pieiosaurus";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 3, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Hold Breath", "The plesiosaurus can hold its breath for 1 hour.")
        ));
        insert(name, BEAST_ID, "", 13, 8, 20, 0, 0, 40, 0, false, 0, large, unaligned, ChallengeRating.TWO, 18, 15, 16, 2, 12, 5, null, null, skillProfs, null, null, null, actions, features, null);

        name = "Triceratops";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 4, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Stomp", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.TEN, bludgeoning, STR_ID, 0, "One prone creature")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Trampling Charge", "If the triceratops moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the triceratops can make one stomp attack against it as a bonus action.")
        ));
        insert(name, BEAST_ID, "", 13, 10, 50, huge, unaligned, ChallengeRating.FIVE, 22, 9, 17, 2, 11, 5, null, null, null, null, null, null, actions, features, null);

        name = "Tyrannosaurus Rex";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can''t make both attacks against the same target."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 4, DiceSize.TWELVE, piercing, STR_ID, 0, "If the target is a Medium or smaller creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the tyrannosaurus can''t bite another target."),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 3, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, BEAST_ID, "", 13, 13, 50, huge, unaligned, ChallengeRating.EIGHT, 25, 10, 19, 2, 12, 9, null, null, skillProfs, null, null, null, actions, null, null);

        name = "Doppelganger";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(CHARMED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(COMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The doppelganger makes two melee attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.SIX, bludgeoning, DEX_ID, 0, ""),
                createAction("Read Thoughts", "The doppelganger magically reads the surface thoughts of one creature within 60 feet of it. The effect can penetrate barriers, but 3 feet of wood or dirt, 2 feet of stone, 2 inches of metal, or a thin sheet of lead blocks it. While the target is in range, the doppelganger can continue reading its thoughts, as long as the doppelganger''s concentration isn''t broken (as if concentrating on a spell). While reading the target''s mind, the doppelganger has advantage on Wisdom (Insight) and Charisma (Deception, Intimidation, and Persuasion) checks against the target.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The doppelganger can use its action to polymorph into a Small or Medium humanoid it has seen, or back into its true form. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Ambusher", "In the first round of a combat, the doppelganger has advantage on attack rolls against any creature it has surprised."),
                new MonsterFeatureApi(0, "Surprise Attack", "If the doppelganger surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 10 (3d6) damage from the attack.")
        ));
        insert(name, MONSTROSITY_ID, shapeChanger, 14, 8, 30, medium, neutral, ChallengeRating.THREE, 11, 18, 40, 11, 12, 14, languageProfs, null, skillProfs, null, conditionImmunities, senses, actions, features, null);

        initializeDragons(); //had to move this code out to be separate because of a max size for a single method in java (error: code to large)

        name = "Dragon Turtle";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(AQUAN_ID, DRACONIC_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The dragon turtle makes three attacks: one with its bite and two with its claws. It can make one tail attack in place of its two claw attacks."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 3, DiceSize.TWELVE, piercing, STR_ID, 0, "Reach 15 ft., one target"),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 2, DiceSize.EIGHT, slashing, STR_ID, 0, "Reach 10 ft., one target"),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 3, DiceSize.TWELVE, bludgeoning, STR_ID, 0, "Reach 15 ft., one target: If the target is a creature, it must succeed on a DC 20 Strength saving throw or be pushed up to 10 feet away from the dragon turtle and knocked prone."),
                createActionSave("Storm Breath", 18, CON_ID, true, 15, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much damage on a successful one. Being underwater doesn''t grant resistance against this damage.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The dragon turtle can breathe air and water.")
        ));
        insert(name, DRAGON_ID, "", 20, 22, 20, 0, 0, 40, 0, false, 0, gargantuan, neutral, ChallengeRating.SEVENTEEN, 25, 10, 20, 10, 12, 12, languageProfs, savingThrowProfs, null, fireResistantList, null, senses, actions, features, null);

        name = "Drider";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(ELVISH_ID, UNDERCOMMON_ID));
        innateSpells = getSpellIds("'Dancing Lights', 'Darkness', 'Faerie Fire'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The drider makes three attacks, either with its longsword or its longbow. It can replace one of those attacks with a bite attack"),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.FOUR, piercing, null, 0, 2, DiceSize.EIGHT, poison, null, 0, ""),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 6, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, ""),
                createSpellAction(true, "Dancing Lights", 0),
                createSpellAction(true, "Darkness", 1),
                createSpellAction(true, "Faerie Fire", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Fey Ancestry", "The drider has advantage on saving throws against being charmed, and magic can''t put the drider to sleep."),
                new MonsterFeatureApi(0, "Spider Climb", "The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."),
                new MonsterFeatureApi(0, "Web Walker", "The drider ignores movement restrictions caused by webbing.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insertInnate(name, MONSTROSITY_ID, "", 19, 13, 30, 0, 30, 0, 0, false, 0, large, neutral, ChallengeRating.SIX, 16, 16, 18, 13, 14, 12, WIS_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Dryad";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(ELVISH_ID, SYLVAN_ID));
        innateSpells = getSpellIds("'Druidcraft', 'Entangle', 'Goodberry', 'Barkskin', 'Pass without Trace', 'Shillelagh'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Club", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, ""),
                createAction("Club (Shillelagh)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.FOUR, bludgeoning, STR_ID, 4, ""),
                createActionSave("Fey Charm", 14, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, "The dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Wisdom saving throw or be magically charmed. The charmed creature regards the dryad as a trusted friend to be heeded and protected. Although the target isn''t under the dryad''s control, it takes the dryad''s requests or actions in the most favorable way it can.\\n\\nEach time the dryad or its allies do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the dryad dies, is on a different plane of existence from the target, or ends the effect as a bonus action. If a target''s saving throw is successful, the target is immune to the dryad''s Fey Charm for the next 24 hours.\\n\\nThe dryad can have no more than one humanoid and up to three beasts charmed at a time."),
                createSpellAction(true, "Druidcraft", 0),
                createSpellAction(true, "Entangle", 3),
                createSpellAction(true, "Goodberry", 3),
                createSpellAction(true, "Barkskin", 1),
                createSpellAction(true, "Pass without Trace", 1),
                createSpellAction(true, "Shillelagh", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Magic Resistance", "The dryad has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Speak with Beasts and Plants", "The dryad can communicate with beasts and plants as if they shared a language."),
                new MonsterFeatureApi(0, "Tree Stride", "Once on her turn, the dryad can use 10 feet of her movement to step magically into one living tree within her reach and emerge from a second living tree within 60 feet of the first tree, appearing in an unoccupied space within 5 feet of the second tree. Both trees must be Large or bigger.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(CLUB_ID, "", 1)
        ));
        insertInnate(name, FEY_ID, "", 11, 5, 30, 0, 0, 0, 0, false, 0, medium, neutral, ChallengeRating.ONE, 10, 12, 11, 14, 15, 18, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Duergar";
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(DWARVISH_ID, UNDERCOMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Enlarge", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks (included in the attacks), and makes Strength checks and Strength saving throws with advantage. If the duergar lacks the room to become Large, it attains the maximum size possible in the space available."),
                createAction("War Pick", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("War Pick (Enlarged)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Javelin", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Javelin (Enlarged)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Invisibility", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "The duergar magically turns invisible until it attacks, casts a spell, or uses its Enlarge, or until its concentration is broken, up to 1 hour (as if concentrating on a spell). Any equipment the duergar wears or carries is invisible with it.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Duergar Resilience", "The duergar has advantage on saving throws against poison, spells, and illusions, as well as to resist being charmed or paralyzed."),
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the duergar has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(WAR_PICK_ID, "", 1),
                new ListObject(JAVELIN_ID, "", 1),
                new ListObject(ARMOR_SCALE_MAIL_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, "Dwarf", 16, 4, 25, medium, lawfulEvil, ChallengeRating.ONE, 14, 11, 14, 11, 10, 9, languageProfs, null, null, poisonResistantList, null, senses, actions, features, equipment);

        name = "Air Elemental";
        damageModifiers = new ArrayList<>(Arrays.asList(
                lightningResistant, thunderResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(AURAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The elemental makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.EIGHT, bludgeoning, DEX_ID, 0, ""),
                createActionSave("Whirlwind", 13, STR_ID, true, 3, DiceSize.EIGHT, bludgeoning, STR_ID, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 4, 6, "Each creature in the elemental''s space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone.\\n\\nIf the saving throw is successful, the target takes half the bludgeoning damage and isn''t flung away or knocked prone.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Air Form", "The elemental can enter a hostile creature''s space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.")
        ));
        insert(name, ELEMENTAL_ID, "", 15, 12, 0, 0, 0, 0, 90, true, 0, large, neutral, ChallengeRating.FIVE, 14, 20, 14, 6, 10, 6, languageProfs, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Earth Elemental";
        damageModifiers = new ArrayList<>(Arrays.asList(
                thunderVulnerable,
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision60, tremorsense60));
        languageProfs = new ArrayList<>(Collections.singletonList(TERRAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The elemental makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "reach 10 ft., one target")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Earth Glide", "The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn''t disturb the material it moves through."),
                new MonsterFeatureApi(0, "Siege Monster", "The elemental deals double damage to objects and structures.")
        ));
        insert(name, ELEMENTAL_ID, "", 17, 12, 30, 0, 0, 0, 0, false, 30, large, neutral, ChallengeRating.FIVE, 20, 8, 20, 5, 10, 5, languageProfs, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Fire Elemental";
        damageModifiers = new ArrayList<>(Arrays.asList(
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                fireImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(IGNAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The elemental makes two touch attacks."),
                createAction("Touch", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, fire, DEX_ID, 0, "If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes 5 (1d10) fire damage at the start of each of its turns.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Fire Form", "The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature''s space and stop there. The first time it enters a creature''s space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns."),
                new MonsterFeatureApi(0, "Illumination", "The elemental sheds bright light in a 30- foot radius and dim light in an additional 30 feet."),
                new MonsterFeatureApi(0, "Water Susceptibility", "For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.")
        ));
        insert(name, ELEMENTAL_ID, "", 13, 12, 50, large, neutral, ChallengeRating.FIVE, 10, 17, 16, 6, 10, 7, languageProfs, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Water Elemental";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(AQUAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The elemental makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createActionSave("Whelm", 15, STR_ID, false, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 4, 6,  "Each creature in the elemental''s space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental''s space.\\n\\nThe elemental can grapple one Large creature or up to two Medium or smaller creatures at one time. At the start of each of the elemental''s turns, each target grappled by it takes 13 (2d8 + 4) bludgeoning damage. A creature within 5 feet of the elemental can pull a creature or object out of it by taking an action to make a DC 14 Strength and succeeding.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Water Form", "The elemental can enter a hostile creature''s space and stop there. It can move through a space as narrow as 1 inch wide without squeezing."),
                new MonsterFeatureApi(0, "Freeze", "If the elemental takes cold damage, it partially freezes; its speed is reduced by 20 feet until the end of its next turn.")
        ));
        insert(name, ELEMENTAL_ID, "", 14, 12, 30, 0, 0, 90, 0, false, 0, large, neutral, ChallengeRating.FIVE, 18, 14, 18, 5, 10, 8, languageProfs, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Drow";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(ELVISH_ID, UNDERCOMMON_ID));
        innateSpells = getSpellIds("'Dancing Lights', 'Darkness', 'Faerie Fire'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createActionRange("Hand Crossbow", CROSSBOW_BOLT_ID, "30/120 ft.", AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, "The target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake."),
                createSpellAction(true, "Dancing Lights", 0),
                createSpellAction(true, "Darkness", 1),
                createSpellAction(true, "Faerie Fire", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Fey Ancestry", "The drow has advantage on saving throws against being charmed, and magic can''t put the drow to sleep."),
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_CHAIN_SHIRT_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HAND_CROSSBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insertInnate(name, HUMANOID_ID, "Elf", 15, 3, 30, medium, neutralEvil, ChallengeRating.QUARTER, 10, 14, 10, 11, 11, 12, innateSpells, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Ettercap";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID, SURVIVAL_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The ettercap makes two attacks: one with its bite and one with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, 1, DiceSize.EIGHT, poison, null, 0, "The target must succeed on a DC 11 Constitution saving throw or be poisoned for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.FOUR, slashing, STR_ID, 0, ""),
                createAction("Web", MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "+4 to hit, range 30/60 ft., one Large or smaller creature. Hit: The creature is restrained by webbing. As an action, the restrained creature can make a DC 11 Strength check, escaping from the webbing on a success. The effect also ends if the webbing is destroyed. The webbing has AC 10, 5 hit points, vulnerability to fire damage, and immunity to bludgeoning, poison, and psychic damage.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Spider Climb", "The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Web Sense", "While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web."),
                new MonsterFeatureApi(0, "Web Walker", "The ettercap ignores movement restrictions caused by webbing.")
        ));
        insert(name, MONSTROSITY_ID, "", 13, 8, 30, 0, 30, 0, 0, false, 0, medium, neutralEvil, ChallengeRating.TWO, 14, 15, 13, 7, 12, 8, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Ettin";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(GIANT_LANG_ID, ORC_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The ettin makes two attacks: one with its battleaxe and one with its morningstar."),
                createAction("Battleaxe", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Morningstar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Two Heads", "The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious."),
                new MonsterFeatureApi(0, "Wakeful", "When one of the ettin''s heads is asleep, its other head is awake.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(BATTLEAXE_ID, "", 1),
                new ListObject(MORNINGSTAR_ID, "", 1)
        ));
        insert(name, GIANT_ID, "", 12, 10, 40, large, chaoticEvil, ChallengeRating.FOUR, 21, 8, 17, 6, 10, 8, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Shrieker";
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, DEAFENED_ID, FRIGHTENED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight30));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Shriek", "When bright light or a creature is within 30 feet of the shrieker, it emits a shriek audible within 300 feet of it. The shrieker continues to shriek until the disturbance moves out of range and for 1d4 of the shrieker''s turns afterward.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "False Appearance", "While the shrieker remains motionless, it is indistinguishable from an ordinary fungus.")
        ));
        insert(name, PLANT_ID, "", 5, 3, 0, medium, unaligned, ChallengeRating.ZERO, 1, 1, 10, 1, 3, 1, null, null, null, null, conditionImmunities, senses, actions, features, null);

        name = "Violet Fungus";
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, DEAFENED_ID, FRIGHTENED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight30));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The fungus makes 1d4 Rotting Touch attacks."),
                createAction("Rotting Touch", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.EIGHT, necrotic, null, 0, "Reach 10 ft., one creature")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "False Appearance", "While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus.")
        ));
        insert(name, PLANT_ID, "", 5, 4, 5, medium, unaligned, ChallengeRating.QUARTER, 3, 1, 10, 1, 3, 1, null, null, null, null, conditionImmunities, senses, actions, features, null);

        name = "Gargoyle";
        damageModifiers = new ArrayList<>(Arrays.asList(
                adamantineBludgeoningResistant, adamantinePiercingResistant, adamantineSlashingResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(TERRAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The gargoyle makes two attacks: one with its bite and one with its claws"),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "False Appearance", "While the gargoyle remains motionless, it is indistinguishable from an inanimate statue.")
        ));
        insert(name, ELEMENTAL_ID, "", 15, 7, 30, 0, 0, 0, 60, false, 0, medium, chaoticEvil, ChallengeRating.TWO, 15, 11, 16, 6, 11, 7, languageProfs, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Djinni";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, WIS_ID, CHA_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                lightningImmune, thunderImmune
        ));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Collections.singletonList(AURAN_ID));
        innateSpells = getSpellIds("'Detect Evil and Good', 'Detect Magic', 'Thunderwave', 'Create Food and Water', 'Tongues', 'Wind Walk', 'Conjure Elemental', 'Creation', 'Gaseous Form', 'Invisibility', 'Major Image', 'Plane Shift'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The djinni makes three scimitar attacks."),
                createAction("Scimitar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 2, DiceSize.SIX, slashing, STR_ID, 0, 1, DiceSize.SIX, lightning, null, 0, "Lightning or Thunder damage (Djinni''s Choice)"),
                createAction("Create Whirlwind", "A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it.\\n\\nA creature can use its action to free a creature restrained by the whirlwind, including itself, by succeeding on a DC 18 Strength check. If the check succeeds, the creature is no longer restrained and moves to the nearest space outside the whirlwind."),
                createSpellAction(true, "Detect Evil and Good", 0),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Thunderwave", 0, CON_ID, true, 2, DiceSize.EIGHT, thunder, 1, 1, 1, DiceSize.EIGHT, thunder),
                createSpellAction(true, "Create Food and Water", 3),
                createSpellAction(true, "Tongues", 3),
                createSpellAction(true, "Wind Walk", 3),
                createSpellAction(true, "Conjure Elemental", 1),
                createSpellAction(true, "Creation", 1),
                createSpellAction(true, "Gaseous Form", 1),
                createSpellAction(true, "Invisibility", 1),
                createSpellAction(true, "Major Image", 1),
                createSpellAction(true, "Plane Shift", 1)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Elemental Demise", "If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SCIMITAR_ID, "", 1)
        ));
        insertInnate(name, ELEMENTAL_ID, "", 17, 14, 30, 0, 0, 0, 90, false, 0, large, chaoticGood, ChallengeRating.ELEVEN, 21, 15, 22, 15, 16, 20, CHA_ID, 0, 0, innateSpells,  languageProfs, savingThrowProfs, null, damageModifiers, null, senses, actions, features, equipment);

        name = "Efreeti";
        savingThrowProfs = new ArrayList<>(Arrays.asList(INT_ID, WIS_ID, CHA_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Collections.singletonList(IGNAN_ID));
        innateSpells = getSpellIds("'Detect Magic', 'Enlarge/Reduce', 'Tongues', 'Conjure Elemental', 'Gaseous Form', 'Invisibility', 'Major Image', 'Plane Shift', 'Wall of Fire'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The efreeti makes two scimitar attacks or uses its Hurl Flame twice."),
                createAction("Scimitar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 2, DiceSize.SIX, slashing, STR_ID, 0, 2, DiceSize.SIX, fire, null, 0, ""),
                createAction("Hurl Flame", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 5, DiceSize.SIX, fire, null, 0, "Range 120 ft., one target"),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Enlarge/Reduce", 3),
                createSpellAction(true, "Tongues", 3),
                createSpellAction(true, "Conjure Elemental", 1),
                createSpellAction(true, "Gaseous Form", 1),
                createSpellAction(true, "Invisibility", 1),
                createSpellAction(true, "Major Image", 1),
                createSpellAction(true, "Plane Shift", 1),
                createSpellAction(true, "Wall of Fire", 1)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Elemental Demise", "If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the efreeti was wearing or carrying.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SCIMITAR_ID, "", 1)
        ));
        insertInnate(name, ELEMENTAL_ID, "", 17, 16, 40, 0, 0, 0, 60, false, 0, large, lawfulEvil, ChallengeRating.ELEVEN, 22, 12, 24, 16, 15, 16, CHA_ID, 0, 0, innateSpells,  languageProfs, savingThrowProfs, null, fireImmuneList, null, senses, actions, features, equipment);

        name = "Ghost";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant, fireResistant, lightningResistant, thunderResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                coldImmune, necroticImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Withering Touch", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 4, DiceSize.SIX, necrotic, CHA_ID, 0, ""),
                createAction("Etherealness", "The ghost enters the Ethereal Plane from the Material Plane, or vice versa. It is visible on the Material Plane while it is in the Border Ethereal, and vice versa, yet it can''t affect or be affected by anything on the other plane."),
                createAction("Horrifying Visage", "Each non-undead creature within 60 feet of the ghost that can see it must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years. A frightened target can repeat the saving throw at the end of each of its turns, ending the frightened condition on itself on a success. If a target''s saving throw is successful or the effect ends for it, the target is immune to this ghost''s Horrifying Visage for the next 24 hours. The aging effect can be reversed with a greater restoration spell, but only within 24 hours of it occurring"),
                createActionSave("Possession", 13, CHA_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6,  "One humanoid that the ghost can see within 5 feet of it must succeed on a DC 13 Charisma saving throw or be possessed by the ghost; the ghost then disappears, and the target is incapacitated and loses control of its body. The ghost now controls the body but doesn''t deprive the target of awareness. The ghost can''t be targeted by any attack, spell, or other effect, except ones that turn undead, and it retains its alignment, Intelligence, Wisdom, Charisma, and immunity to being charmed and frightened. It otherwise uses the possessed target''s statistics, but doesn''t gain access to the target''s knowledge, class features, or proficiencies.\\n\\nThe possession lasts until the body drops to 0 hit points, the ghost ends it as a bonus action, or the ghost is turned or forced out by an effect like the dispel evil and good spell. When the possession ends, the ghost reappears in an unoccupied space within 5 feet of the body. The target is immune to this ghost''s Possession for 24 hours after succeeding on the saving throw or after the possession ends.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Ethereal Sight", "The ghost can see 60 feet into the Ethereal Plane when it is on the Material Plane, and vice versa."),
                new MonsterFeatureApi(0, "Incrporeal Movement", "The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.")
        ));
        insert(name, UNDEAD_ID, "", 11, 10, 0, 0, 0, 0, 40, true, 0, medium, any, ChallengeRating.FOUR, 7, 13, 10, 10, 12, 17, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Ghast";
        damageModifiers = new ArrayList<>(Arrays.asList(
                necroticResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 2, DiceSize.EIGHT, piercing, DEX_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, "If the target is a creature other than an undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Stench", "Any creature that starts its turn within 5 feet of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast''s Stench for 24 hours"),
                new MonsterFeatureApi(0, "Turning Defiance", "The ghast and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead.")
        ));
        insert(name, UNDEAD_ID, "", 13, 8, 30, medium, chaoticEvil, ChallengeRating.TWO, 16, 17, 10, 11, 10, 8, common, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Ghoul";
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 2, DiceSize.EIGHT, piercing, DEX_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, slashing, DEX_ID, 0, "If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        insert(name, UNDEAD_ID, "", 12, 5, 30, medium, chaoticEvil, ChallengeRating.ONE, 13, 15, 10, 7, 10, 6, common, null, null, poisonImmuneList, conditionImmunities, senses, actions, null, null);

        name = "Cloud Giant";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(INSIGHT_ID, PERCEPTION_ID));
        innateSpells = getSpellIds("'Detect Magic', 'Fog Cloud', 'Light', 'Feather Fall', 'Fly', 'Misty Step', 'Telekinesis', 'Control Weather', 'Gaseous Form'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The giant makes two morningstar attacks."),
                createAction("Morningstar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 3, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/240 ft.", AttackType.ATTACK, 12, 4, DiceSize.TEN, bludgeoning, STR_ID, 0, ""),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Fog Cloud", 0),
                createSpellAction(true, "Light", 0),
                createSpellAction(true, "Feather Fall", 3),
                createSpellAction(true, "Fly", 3),
                createSpellAction(true, "Misty Step", 3),
                createSpellAction(true, "Telekinesis", 3),
                createSpellAction(true, "Control Weather", 1),
                createSpellAction(true, "Gaseous Form", 1)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Smell", "The giant has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(MORNINGSTAR_ID, "", 1)
        ));
        insertInnate(name, GIANT_ID, "", 14, 16, 40, 0, 0, 0, 0, false, 0, huge, neutralGood, ChallengeRating.NINE, 27, 10, 22, 12, 16, 16, CHA_ID, 0, 0, innateSpells,  commonGiant, savingThrowProfs, skillProfs, null, null, null, actions, features, equipment);

        name = "Fire Giant";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The giant makes two greatsword attacks."),
                createAction("Greatsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 6, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/240 ft.", AttackType.ATTACK, 11, 4, DiceSize.TEN, bludgeoning, STR_ID, 0, "")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATSWORD_ID, "", 1)
        ));
        insert(name, GIANT_ID, "", 18, 13, 30, huge, lawfulEvil, ChallengeRating.NINE, 25, 9, 23, 10, 14, 13, giant, savingThrowProfs, skillProfs, fireImmuneList, null, null, actions, null, equipment);

        name = "Frost Giant";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The giant makes two greataxe attacks."),
                createAction("Greataxe", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.TWELVE, slashing, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/240 ft.", AttackType.ATTACK, 9, 4, DiceSize.TEN, bludgeoning, STR_ID, 0, "")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATAXE_ID, "", 1)
        ));
        insert(name, GIANT_ID, "", 15, 12, 40, huge, neutralEvil, ChallengeRating.EIGHT, 23, 9, 21, 9, 10, 12, giant, savingThrowProfs, skillProfs, coldImmuneList, null, null, actions, null, equipment);

        name = "Hill Giant";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The giant makes two greatclub attacks."),
                createAction("Greatclub", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 3, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/240 ft.", AttackType.ATTACK, 8, 3, DiceSize.TEN, bludgeoning, STR_ID, 0, "")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATCLUB_ID, "", 1)
        ));
        insert(name, GIANT_ID, "", 13, 10, 40, huge, chaoticEvil, ChallengeRating.FIVE, 21, 8, 19, 5, 9, 6, giant, null, skillProfs, null, null, null, actions, null, equipment);

        name = "Stone Giant";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The giant makes two greatclub attacks."),
                createAction("Greatclub", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/240 ft.", AttackType.ATTACK, 9, 4, DiceSize.TEN, bludgeoning, STR_ID, 0, "If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone."),
                createReaction("Rock Catching", "If a rock or similar object is hurled at the giant, the giant can, with a successful DC 10 Dexterity saving throw, catch the missile and take no bludgeoning damage from it.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Stone Camouflage", "The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATCLUB_ID, "", 1)
        ));
        insert(name, GIANT_ID, "", 17, 11, 40, huge, neutral, ChallengeRating.SEVEN, 23, 15, 20, 10, 12, 9, giant, savingThrowProfs, skillProfs, null, null, senses, actions, features, equipment);

        name = "Storm Giant";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, HISTORY_ID, PERCEPTION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant,
                lightningImmune, thunderImmune
        ));
        innateSpells = getSpellIds("'Detect Magic', 'Feather Fall', 'Levitate', 'Light', 'Control Weather', 'Water Breathing'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The giant makes two greatsword attacks."),
                createAction("Greatsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 14, 6, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/240 ft.", AttackType.ATTACK, 14, 4, DiceSize.TWELVE, bludgeoning, STR_ID, 0, ""),
                createActionSave("Lightning Strike", 17, DEX_ID, true, 12, DiceSize.EIGHT, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6,  "The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much damage on a successful one."),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, "Feather Fall", 0),
                createSpellAction(true, "Levitate", 0),
                createSpellAction(true, "Light", 0),
                createSpellAction(true, "Control Weather", 3),
                createSpellAction(true, "Water Breathing", 3)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The giant can breathe air and water.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATSWORD_ID, "", 1)
        ));
        insertInnate(name, GIANT_ID, "", 16, 20, 50, 0, 0, 50, 0, false, 0, huge, chaoticGood, ChallengeRating.THIRTEEN, 29, 14, 20, 16, 18, 18, CHA_ID, 0, 0, innateSpells, commonGiant, savingThrowProfs, skillProfs, damageModifiers, null, null, actions, features, equipment);

        name = "Gibbering Mouther";
        conditionImmunities = new ArrayList<>(Collections.singletonList(PRONE_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The gibbering mouther makes one bite attack and, if it can, uses its Blinding Spittle."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 5, DiceSize.SIX, piercing, STR_ID, 0, "If the target is Medium or smaller, it must succeed on a DC 10 Strength saving throw or be knocked prone. If the target is killed by this damage, it is absorbed into the mouther."),
                createAction("Blinding Spittle", MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The mouther spits a chemical glob at a point it can see within 15 feet of it. The glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Dexterity saving throw or be blinded until the end of the mouther''s next turn.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Aberrant Ground", "The ground in a 10-foot radius around the mouther is doughlike difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Strength saving throw or have its speed reduced to 0 until the start of its next turn."),
                new MonsterFeatureApi(0, "Gibbering", "The mouther babbles incoherently while it can see any creature and isn''t incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Wisdom saving throw. On a failure, the creature can''t take reactions until the start of its next turn and rolls a d8 to determine what it does during its turn. On a 1 to 4, the creature does nothing. On a 5 or 6, the creature takes no action or bonus action and uses all its movement to move in a randomly determined direction. On a 7 or 8, the creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can''t make such an attack.")
        ));
        insert(name, ABERRATION_ID, "", 9, 9, 10, 0, 0, 10, 0, false, 0, medium, neutral, ChallengeRating.TWO, 10, 8, 16, 3, 10, 6, null, null, null, null, conditionImmunities, senses, actions, features, null);

        name = "Gnoll";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(GNOLL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, STR_ID, 0, ""),
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, "Range 20/60 ft., one target"),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Rampage", "When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_HIDE_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(SPEAR_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Gnoll", 15, 5, 30, medium, chaoticEvil, ChallengeRating.HALF, 14, 12, 11, 6, 10, 7, languageProfs, null, null, null, null, senses, actions, features, equipment);

        name = "Deep Gnome (Svirfneblin)";
        skillProfs = new ArrayList<>(Arrays.asList(INVESTIGATION_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(GNOMISH_ID, TERRAN_ID, UNDERCOMMON_ID));
        innateSpells = getSpellIds("'Nondetection', 'Blindness/Deafness', 'Blur', 'Disguise Self'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("War Pick", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createActionRange("Poisoned Dart", DART_ID, "150/600 ft.", AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createSpellAction(true, "Nondetection", 0),
                createSpellAction(true, "Blindness/Deafness", 1),
                createSpellAction(true, "Blur", 1),
                createSpellAction(true, "Disguise Self", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Stone Camouflage", "The gnome has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."),
                new MonsterFeatureApi(0, "Gnome Cunning", "The gnome has advantage on Intelligence, Wisdom, and Charisma saving throws against magic.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_CHAIN_SHIRT_ID, "", 1),
                new ListObject(WAR_PICK_ID, "", 1),
                new ListObject(DART_ID, "", 10)
        ));
        insertInnate(name, HUMANOID_ID, "Gnome", 15, 3, 20, 0, 0, 0, 0, false, 0, small, neutralGood, ChallengeRating.HALF, 15, 14, 14, 12, 10, 9, INT_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Goblin";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, GOBLIN_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Scimitar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, slashing, DEX_ID, 0, ""),
                createActionRange("Shortbow", ARROW_ID, "80/320 ft.", AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Nimble Escape", "The goblin can take the Disengage or Hide action as a bonus action on each of its turns.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_LEATHER_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(SCIMITAR_ID, "", 1),
                new ListObject(SHORTBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, goblinoid, 15, 2, 30, small, neutralEvil, ChallengeRating.QUARTER, 8, 14, 10, 10, 8, 8, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Clay Golem";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidImmune, poisonImmune, psychicImmune, aamantineBludgeoningImmune, adamantinePiercingImmune, adamantineSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The golem makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.TEN, bludgeoning, STR_ID, 0, "If the target is a creature, it must succeed on a DC 15 Constitution saving throw or have its hit point maximum reduced by an amount equal to the damage taken. The target dies if this attack reduces its hit point maximum to 0. The reduction lasts until removed by the greater restoration spell or other magic."),
                createAction("Haste", MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its slam attack as a bonus action.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Acid Absorption", "Whenever the golem is subjected to acid damage, it takes no damage and instead regains a number of hit points equal to the acid damage dealt."),
                new MonsterFeatureApi(0, "Berserk", "Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points"),
                new MonsterFeatureApi(0, "Immutable Form", "The golem is immune to any spell or effect that would alter its form."),
                new MonsterFeatureApi(0, "Magic Resistance", "The golem has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The golem''s weapon attacks are magical.")
        ));
        insert(name, CONSTRUCT_ID, "", 14, 14, 20, large, unaligned, ChallengeRating.NINE, 20, 9, 18, 3, 8, 1, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Flesh Golem";
        damageModifiers = new ArrayList<>(Arrays.asList(
                lightningImmune, poisonImmune, aamantineBludgeoningImmune, adamantinePiercingImmune, adamantineSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The golem makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Berserk", "Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\\n\\nThe golem''s creator, if within 60 feet of the berserk golem, can try to calm it by speaking firmly and persuasively. The golem must be able to hear its creator, who must take an action to make a DC 15 Charisma (Persuasion) check. If the check succeeds, the golem ceases being berserk. If it takes damage while still at 40 hit points or fewer, the golem might go berserk again"),
                new MonsterFeatureApi(0, "Adversion of Fire", "If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn."),
                new MonsterFeatureApi(0, "Immutable Form", "The golem is immune to any spell or effect that would alter its form."),
                new MonsterFeatureApi(0, "Lightning Absorption", "Whenever the golem is subjected to lightning damage, it takes no damage and instead regains a number of hit points equal to the lightning damage dealt."),
                new MonsterFeatureApi(0, "Magic Resistance", "The golem has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The golem''s weapon attacks are magical.")
        ));
        insert(name, CONSTRUCT_ID, "", 9, 11, 30, medium, neutral, ChallengeRating.FIVE, 19, 9, 18, 6, 10, 5, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Iron Golem";
        damageModifiers = new ArrayList<>(Arrays.asList(
                fireImmune, poisonImmune, psychicImmune, aamantineBludgeoningImmune, adamantinePiercingImmune, adamantineSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The golem makes two melee attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 3, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createAction("Sword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 3, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createActionSave("Poison Breath", 19, CON_ID, true, 10, DiceSize.EIGHT, poison, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6,  "The golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Fire Absorption", "Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt."),
                new MonsterFeatureApi(0, "Immutable Form", "The golem is immune to any spell or effect that would alter its form."),
                new MonsterFeatureApi(0, "Magic Resistance", "The golem has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The golem''s weapon attacks are magical.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATSWORD_ID, "", 1)
        ));
        insert(name, CONSTRUCT_ID, "", 20, 20, 30, large, unaligned, ChallengeRating.SIXTEEN, 24, 9, 20, 3, 11, 1, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, equipment);

        name = "Stone Golem";
        damageModifiers = new ArrayList<>(Arrays.asList(
                poisonImmune, psychicImmune, aamantineBludgeoningImmune, adamantinePiercingImmune, adamantineSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The golem makes two melee attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 3, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createActionSave("Slow", 17, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6,  "The golem targets one or more creatures it can see within 10 feet of it. Each target must make a DC 17 Wisdom saving throw against this magic. On a failed save, a target can''t use reactions, its speed is halved, and it can''t make more than one attack on its turn. In addition, the target can take either an action or a bonus action on its turn, not both. These effects last for 1 minute. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Immutable Form", "The golem is immune to any spell or effect that would alter its form."),
                new MonsterFeatureApi(0, "Magic Resistance", "The golem has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The golem''s weapon attacks are magical.")
        ));
        insert(name, CONSTRUCT_ID, "", 17, 17, 30, large, unaligned, ChallengeRating.TEN, 22, 9, 20, 3, 11, 1, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Gorgon";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(PETRIFIED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.TWELVE, piercing, STR_ID, 0, ""),
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.TEN, bludgeoning, STR_ID, 0, ""),
                createActionSave("Petrifying Breath", 13, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6,  "The gorgon exhales petrifying gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw. On a failed save, a target begins to turn to stone and is restrained. The restrained target must repeat the saving throw at the end of its next turn. On a success, the effect ends on the target. On a failure, the target is petrified until freed by the greater restoration spell or other magic.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Trampling Charge", "If the gorgon moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 16 Strength saving throw or be knocked prone. If the target is prone, the gorgon can make one attack with its hooves against it as a bonus action.")
        ));
        insert(name, MONSTROSITY_ID, "", 19, 12, 40, large, unaligned, ChallengeRating.FIVE, 20, 11, 18, 2, 12, 7, null, null, skillProfs, null, conditionImmunities, senses, actions, features, null);

        name = "Grick";
        damageModifiers = new ArrayList<>(Arrays.asList(
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant
        ));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The grick makes one attack with its tentacles. If that attack hits, the grick can make one beak attack against the same target."),
                createAction("Tentacles", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Stone Camouflage", "The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.")
        ));
        insert(name, MONSTROSITY_ID, "", 14, 6, 30, medium, neutral, ChallengeRating.TWO, 14, 14, 11, 3, 14, 5, null, null, null, damageModifiers, null, senses, actions, features, null);

        name = "Griffon";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The griffon makes two attacks: one with its beak and one with its claws."),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight", "The griffon has advantage on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, MONSTROSITY_ID, "", 12, 7, 30, 0, 0, 0, 80, false, 0, large, unaligned, ChallengeRating.TWO, 18, 15, 16, 2, 13, 8, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Grimlock";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID, STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(BLINDED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight30));
        languageProfs = new ArrayList<>(Collections.singletonList(UNDERCOMMON_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("SpikedBone Club", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, 1, DiceSize.FOUR, piercing, null, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Blind Senses", "The grimlock can''t use its blindsight while deafened and unable to smell."),
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The grimlock has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Stone Camouflage", "The grimlock has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(CLUB_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, "Grimlock", 11, 2, 30, medium, neutralEvil, ChallengeRating.QUARTER, 16, 12, 12, 9, 8, 6, languageProfs, null, skillProfs, null, conditionImmunities, senses, actions, features, equipment);

        name = "Green Hag";
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, DECEPTION_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, DRACONIC_ID, SYLVAN_ID));
        innateSpells = getSpellIds("'Dancing Lights', 'Minor Illusion', 'Vicious Mockery'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Illusory Appearance", "The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like another creature of her general size and humanoid shape. The illusion ends if the hag takes a bonus action to end it or if she dies.\\n\\nThe changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have smooth skin, but someone touching her would feel her rough flesh. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 20 Intelligence (Investigation) check to discern that the hag is disguised."),
                createAction("Invisible Passage", "The hag magically turns invisible until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisible, she leaves no physical evidence of her passage, so she can be tracked only by magic. Any equipment she wears or carries is invisible with her."),
                createSpellAction(true, "Dancing Lights", 0),
                createSpellAction(true, "Minor Illusion", 0),
                createSpellAction(true, "Vicious Mockery", 0, WIS_ID, false, 3, DiceSize.FOUR, psychic)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The hag can breathe air and water."),
                new MonsterFeatureApi(0, "Mimicry", "The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Wisdom (Insight) check.")
        ));
        insertInnate(name, FEY_ID, "", 17, 11, 30, 0, 0, 0, 0, false, 0, medium, neutralEvil, ChallengeRating.THREE, 18, 12, 16, 13, 14, 14, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, null, null, senses, actions, features, null);

        name = "Night Hag";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant, fireResistant, silveredBludgeoningResistant, silveredPiercingResistant, silveredSlashingResistant
        ));
        conditionImmunities = new ArrayList<>(Collections.singletonList(CHARMED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, COMMON_ID, INFERNAL_ID, PRIMORDIAL_ID));
        innateSpells = getSpellIds("'Detect Magic', 'Magic Missile', 'Plane Shift', 'Ray of Enfeeblement', 'Sleep'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Change Shape", "The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn''t transformed. She reverts to her true form if she dies."),
                createAction("Etherealness", "The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a heartstone in her possession."),
                createAction("Nightmare Haunting", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A protection from evil and good spell cast on the target prevents this contact, as does a magic circle. As long as the contact persists, the target has dreadful visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10). If this effect reduces the target''s hit point maximum to 0, the target dies, and if the target was evil, its soul is trapped in the hag''s soul bag. The reduction to the target''s hit point maximum lasts until removed by the greater restoration spell or similar magic."),
                createSpellAction(true, "Detect Magic", 0),
                createSpellAction(true, AttackType.ATTACK, "Magic Missile", 0, null, false, 3, DiceSize.FOUR, force, null, 3, 1, 1, 1, DiceSize.FOUR, force, null, 1),
                createSpellAction(true, "Plane Shift", 2),
                createSpellAction(true, "Ray of Enfeeblement", 2),
                createSpellAction(true, "Sleep", 2, null, false, 5, DiceSize.EIGHT, "", 1, 1, 2, DiceSize.EIGHT, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Magic Resistance", "The hag has advantage on saving throws against spells and other magical effects.")
        ));
        insertInnate(name, FIEND_ID, "", 17, 15, 30, 0, 0, 0, 0, false, 0, medium, neutralEvil, ChallengeRating.FIVE, 18, 15, 16, 16, 14, 16, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "See Hag";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(AQUAN_ID, COMMON_ID, GIANT_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionSave("Death Glare", 11, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6,  "The hag targets one frightened creature she can see within 30 feet of her. If the target can see the hag, it must succeed on a DC 11 Wisdom saving throw against this magic or drop to 0 hit points."),
                createAction("Illusory Appearance", "The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape. The effect ends if the hag takes a bonus action to end it or if she dies. The changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have no claws, but someone touching her hand might feel the claws. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 16 Intelligence (Investigation) check to discern that the hag is disguised.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The hag can breathe air and water."),
                new MonsterFeatureApi(0, "Horrific Appearance", "Any humanoid that starts its turn within 30 feet of the hag and can see the hag''s true form must make a DC 11 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the hag is within line of sight, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the hag''s Horrific Appearance for the next 24 hours.\\n\\nUnless the target is surprised or the revelation of the hag''s true form is sudden, the target can avert its eyes and avoid making the initial saving throw. Until the start of its next turn, a creature that averts its eyes has disadvantage on attack rolls against the hag.")
        ));
        insert(name, FEY_ID, "", 14, 7, 30, 0, 0, 40, 0, false, 0, medium, chaoticEvil, ChallengeRating.TWO, 16, 13, 16, 12, 12, 13, languageProfs, null, null, null, null, senses, actions, features, null);

        name = "Half-Black Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Acid Breath", 11, DEX_ID, true, 5, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, acidResistantList, null, senses, actions, null, equipment);

        name = "Half-Copper Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Acid Breath", 11, DEX_ID, true, 4, DiceSize.EIGHT, acid, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales acid in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Slowing Breath", 11, CON_ID, true, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw. On a failed save, the creature can''t use reactions, its speed is halved, and it can''t make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, acidResistantList, null, senses, actions, null, equipment);

        name = "Half-Blue Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Lightning Breath", 12, DEX_ID, true, 4, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, lightningResistantList, null, senses, actions, null, equipment);

        name = "Half-Bronze Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Lightning Breath", 12, DEX_ID, true, 3, DiceSize.TEN, lightning, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales lightning in a 40- foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Repulsion Breath", 12, STR_ID, true, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, lightningResistantList, null, senses, actions, null, equipment);

        name = "Half-Brass Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Fire Breath", 11, DEX_ID, true, 4, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 14 (4d6) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Sleep Breath", 11, CON_ID, true, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw or fall unconscious for 1 minute. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, fireResistantList, null, senses, actions, null, equipment);

        name = "Half-Gold Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Fire Breath", 13, DEX_ID, true, 4, DiceSize.TEN, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Weakening Breath", 13, STR_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, fireResistantList, null, senses, actions, null, equipment);

        name = "Half-Red Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Fire Breath", 15, DEX_ID, true, 7, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The veteran exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, fireResistantList, null, senses, actions, null, equipment);

        name = "Half-Green Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", DART_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Poison Breath", 14, CON_ID, true, 12, DiceSize.SIX, poison, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, poisonResistantList, null, senses, actions, null, equipment);

        name = "Half-Silver Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Cold Breath", 13, CON_ID, true, 4, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast in a 15- foot cone. Each creature in that area must make a DC 13 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Paralyzing Breath", 13, CON_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales paralyzing gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, coldResistantList, null, senses, actions, null, equipment);

        name = "Half-White Dragon Veteran";
        skillProfs = new ArrayList<>(Arrays.asList(ATHLETICS_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Heavy Crossbow", CROSSBOW_BOLT_ID, "100/400 ft.", AttackType.ATTACK, 3, 1, DiceSize.TEN, piercing, DEX_ID, 0, ""),
                createActionSave("Cold Breath", 12, CON_ID, true, 5, DiceSize.EIGHT, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The dragon exhales an icy blast of hail in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (5d8) cold damage on a failed save, or half as much damage on a successful one.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_PLATE_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HEAVY_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Human", 18, 10, 30, medium, any, ChallengeRating.FIVE, 16, 13, 14, 10, 11, 10, commonDraconic, null, skillProfs, coldResistantList, null, senses, actions, null, equipment);

        name = "Harpy";
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The harpy makes two attacks: one with its claws and one with its club."),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 2, DiceSize.FOUR, slashing, STR_ID, 0, ""),
                createAction("Club", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, bludgeoning, STR_ID, 0, ""),
                createAction("Luring Song", "The harpy sings a magical melody. Every humanoid and giant within 300 feet of the harpy that can hear the song must succeed on a DC 11 Wisdom saving throw or be charmed until the song ends. The harpy must take a bonus action on its subsequent turns to continue singing. It can stop singing at any time. The song ends if the harpy is incapacitated.\\n\\nWhile charmed by the harpy, a target is incapacitated and ignores the songs of other harpies. If the charmed target is more than 5 feet away from the harpy, the target must move on its turn toward the harpy by the most direct route, trying to get within 5 feet. It doesn''t avoid opportunity attacks, but before moving into damaging terrain, such as lava or a pit, and whenever it takes damage from a source other than the harpy, the target can repeat the saving throw. A charmed target can also repeat the saving throw at the end of each of its turns. If the saving throw is successful, the effect ends on it.\\n\\nA target that successfully saves is immune to this harpy''s song for the next 24 hours.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(CLUB_ID, "", 1)
        ));
        insert(name, MONSTROSITY_ID, "", 11, 7, 20, 0, 0, 0, 40, false, 0, medium, chaoticEvil, ChallengeRating.ONE, 12, 13, 12, 7, 10, 13, common, null, null, null, null, null, actions, null, equipment);

        name = "Hell Hound";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, STR_ID, 0, 2, DiceSize.SIX, fire, null, 0, ""),
                createActionSave("Fire Breath", 12, DEX_ID, true, 6, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 5, 6, "The hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 21 (6d6) fire damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Pack Tactics", "The hound has advantage on an attack roll against a creature if at least one of the hound''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        insert(name, FIEND_ID, "", 15, 7, 50, medium, lawfulEvil, ChallengeRating.THREE, 17, 12, 14, 6, 13, 6, infernal, null, skillProfs, fireImmuneList, null, senses, actions, features, null);

        name = "Hippogriff";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The hippogriff makes two attacks: one with its beak and one with its claws."),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight", "The hippogriff has advantage on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, MONSTROSITY_ID, "", 11, 3, 40, 0, 0, 0, 60, false, 0, large, unaligned, ChallengeRating.ONE, 17, 13, 13, 2, 12, 8, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Hobgoblin";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, GOBLIN_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Martial Advantace", "Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn''t incapacitated.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_CHAIN_MAIL_ID, "", 1),
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, goblinoid, 18, 2, 30, medium, lawfulEvil, ChallengeRating.HALF, 13, 12, 12, 10, 10, 9, languageProfs, null, null, null, null, senses, actions, features, equipment);

        name = "Homunculus";
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 0, DiceSize.FOUR, piercing, null, 1, "The target must succeed on a DC 10 Constitution saving throw or be poisoned for 1 minute. If the saving throw fails by 5 or more, the target is instead poisoned for 5 (1d10) minutes and unconscious while poisoned in this way.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Telepathic Bond", "While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically.")
        ));
        insert(name, CONSTRUCT_ID, "", 13, 2, 20, 0, 0, 0, 40, false, 0, tiny, neutral, ChallengeRating.ZERO, 4, 15, 11, 10, 10, 7, null, null, null, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Hydra";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The hydra makes as many bite attacks as it has heads."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.TEN, piercing, STR_ID, 0, "Reach 10 ft., one target")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Hold Breath", "The hydra can hold its breath for 1 hour."),
                new MonsterFeatureApi(0, "Multiple Heads", "The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.\\n\\nWhenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies.\\n\\nAt the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown in this way."),
                new MonsterFeatureApi(0, "Reactive Heads", "For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks."),
                new MonsterFeatureApi(0, "Wakeful", "While the hydra sleeps, at least one of its heads is awake.")
        ));
        insert(name, MONSTROSITY_ID, "", 15, 15, 30, 0, 0, 30, 0, false, 0, huge, unaligned, ChallengeRating.EIGHT, 20, 12, 20, 2, 10, 7, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Invisible Stalker";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(AURAN_ID, COMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The stalker makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Invisibility", "The stalker is invisible"),
                new MonsterFeatureApi(0, "Faultless Tracker", "The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner.")
        ));
        insert(name, ELEMENTAL_ID, "", 14, 16, 50, 0, 0, 0, 50, true, 0, medium, neutral, ChallengeRating.SIX, 16, 19, 14, 10, 15, 11, languageProfs, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Kobold";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Dagger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, ""),
                createActionRange("Sling", SLING_BULLET_ID, "30/120 ft.", AttackType.ATTACK, 4, 1, DiceSize.FOUR, bludgeoning, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."),
                new MonsterFeatureApi(0, "Pack Tactics", "The kobold has advantage on an attack roll against a creature if at least one of the kobold''s allies is within 5 feet of the creature and the ally isn''t incapacitated.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(DAGGER_ID, "", 1),
                new ListObject(SLING_ID, "", 1),
                new ListObject(SLING_BULLET_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, "Kobold", 12, 2, 30, small, lawfulEvil, ChallengeRating.EIGHTH, 7, 15, 9, 8, 7, 8, commonDraconic, null, null, null, null, senses, actions, features, equipment);

        name = "Kraken";
        savingThrowProfs = new ArrayList<>(Arrays.asList(STR_ID, DEX_ID, CON_ID, INT_ID, WIS_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                lightningImmune, nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(FRIGHTENED_ID, PARALYZED_ID));
        senses = new ArrayList<>(Arrays.asList(truesight120, telepathy120));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, CELESTIAL_ID, INFERNAL_ID, PRIMORDIAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The kraken makes three tentacle attacks, each of which it can replace with one use of Fling."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 3, DiceSize.EIGHT, piercing, STR_ID, 0, "If the target is a Large or smaller creature grappled by the kraken, that creature is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the kraken, and it takes 42 (12d6) acid damage at the start of each of the kraken''s turns.\\n\\nIf the kraken takes 50 damage or more on a single turn from a creature inside it, the kraken must succeed on a DC 25 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the kraken. If the kraken dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 15 feet of movement, exiting prone."),
                createAction("Tentacle", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 17, 3, DiceSize.SIX, bludgeoning, STR_ID, 0, "The target is grappled (escape DC 18). Until this grapple ends, the target is restrained. The kraken has ten tentacles, each of which can grapple one target."),
                createAction("Fling", "One Large or smaller object held or creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone. If a thrown target strikes a solid surface, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 18 Dexterity saving throw or take the same damage and be knocked prone."),
                createActionSave("Lightning Storm", 23, DEX_ID, true, 4, DiceSize.TEN, lightning, null, 0, "The kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one."),
                createLegendaryAction("Tentacke Attack or Fling", 1, "The kraken makes one tentacle attack or uses its Fling."),
                createLegendaryAction("Lightning Storm", 2, "The kraken uses Lightning Storm."),
                createLegendaryAction("Ink Cloud", 3, "While underwater, the kraken expels an ink cloud in a 60-foot radius. The cloud spreads around corners, and that area is heavily obscured to creatures other than the kraken. Each creature other than the kraken that ends its turn there must succeed on a DC 23 Constitution saving throw, taking 16 (3d10) poison damage on a failed save, or half as much damage on a successful one. A strong current disperses the cloud, which otherwise disappears at the end of the kraken''s next turn.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amphibious", "The kraken can breathe air and water."),
                new MonsterFeatureApi(0, "Freedom of Movement", "The kraken ignores difficult terrain, and magical effects can''t reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled."),
                new MonsterFeatureApi(0, "Siege Monster", "The kraken deals double damage to objects and structures.")
        ));
        insert(name, true, MONSTROSITY_ID, titan, 18, 27, 20, 0, 0, 60, 0, false, 0, gargantuan, chaoticEvil, ChallengeRating.TWENTY_THREE, 30, 11, 25, 22, 18, 20, languageProfs, savingThrowProfs, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Lamia";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, COMMON_ID));
        innateSpells = getSpellIds("'Disguise Self', 'Major Image', 'Charm Person', 'Mirror Image', 'Scrying', 'Suggestion', 'Geas'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The lamia makes two attacks: one with its claws and one with its dagger or Intoxicating Touch."),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Dagger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, STR_ID, 0, ""),
                createAction("Intoxicating Touch", "+5 to hit, reach 5 ft., one creature. Hit: The target is magically cursed for 1 hour. Until the curse ends, the target has disadvantage on Wisdom saving throws and all ability checks."),
                createSpellAction(true, "Disguise Self", 0),
                createSpellAction(true, "Major Image", 0),
                createSpellAction(true, "Charm Person", 3),
                createSpellAction(true, "Mirror Image", 3),
                createSpellAction(true, "Scrying", 3),
                createSpellAction(true, "Suggestion", 3),
                createSpellAction(true, "Geas", 1)
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(DAGGER_ID, "", 1)
        ));
        insertInnate(name, MONSTROSITY_ID, "", 13, 13, 30, 0, 0, 0, 0, false, 0, large, chaoticEvil, ChallengeRating.FOUR, 16, 13, 15, 14, 15, 16, CHA_ID, 0, 0, innateSpells, languageProfs, null, skillProfs, null, null, senses, actions, null, equipment);

        name = "Lich";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, INT_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID, INSIGHT_ID, PERCEPTION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant, lightningResistant, necroticResistant,
                poisonImmune, nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(truesight120));
        spells = getSpellIds("'Mage Hand', 'Prestidigitation', 'Ray of Frost', 'Detect Magic', 'Magic Missile', 'Shield', 'Thunderwave', 'Acid Arrow', 'Detect Thoughts', 'Invisibility', 'Mirror Image', 'Animate Dead', 'Counterspell', 'Dispel Magic', 'Fireball', 'Blight', 'Dimension Door', 'Cloudkill', 'Scrying', 'Disintegrate', 'Globe of Invulnerability', 'Finger of Death', 'Plane Shift', 'Dominate Monster', 'Power Word Stun', 'Power Word Kill'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Paralyzing Touch", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 3, DiceSize.SIX, cold, null, 0, "The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createLegendaryAction("Cantrip", 1, "The lich casts a cantrip."),
                createLegendaryAction("Paralyzing Touch", 2, "The lich uses its Paralyzing Touch."),
                createLegendarySave("Frightening Gaze", 18, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, 2, "The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 18 Wisdom saving throw against this magic or become frightened for 1 minute. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a target''s saving throw is successful or the effect ends for it, the target is immune to the lich''s gaze for the next 24 hours."),
                createLegendaryAction("Disrupt Life", 3, "Each non-undead creature within 20 feet of the lich must make a DC 18 Constitution saving throw against this magic, taking 21 (6d6) necrotic damage on a failed save, or half as much damage on a successful one"),
                createSpellAction(false, "Ray of Frost", 0, null, false, 4, DiceSize.EIGHT, cold),
                createSpellAction(false, AttackType.ATTACK, "Magic Missile", 0, null, false, 3, DiceSize.FOUR, force, null, 3, 1, 1, 1, DiceSize.FOUR, force, null, 1),
                createSpellAction(false, "Thunderwave", 0, CON_ID, true, 2, DiceSize.EIGHT, thunder, 1, 1, 1, DiceSize.EIGHT, thunder),
                createSpellAction(false, "Acid Arrow", 0, null, false, 4, DiceSize.FOUR, acid, 2, 1, 1, DiceSize.FOUR, acid),
                createSpellAction(false, "Fireball", 0, DEX_ID, true, 8, DiceSize.SIX, fire, 3, 1, 1, DiceSize.SIX, fire),
                createSpellAction(false, "Blight", 0, CON_ID, true, 8, DiceSize.EIGHT, necrotic, 4, 1, 1, DiceSize.EIGHT, necrotic),
                createSpellAction(false, "Cloudkill", 0, CON_ID, true, 5, DiceSize.EIGHT, poison, 5, 1, 1, DiceSize.EIGHT, poison),
                createSpellAction(false, AttackType.ATTACK, "Disintegrate", 0, DEX_ID, false, 10, DiceSize.SIX, force, null, 40, 6, 1, 3, DiceSize.SIX, force, null, 0),
                createSpellAction(false, AttackType.ATTACK, "Finger of Death", 0, CON_ID, true, 7, DiceSize.EIGHT, necrotic, null, 30)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the lich fails a saving throw, it can choose to succeed instead."),
                new MonsterFeatureApi(0, "Rejuvenation", "If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery."),
                new MonsterFeatureApi(0, "Turn Resistance", "The lich has advantage on saving throws against any effect that turns undead.")
        ));
        insertCaster(name, true, UNDEAD_ID, "", 17, 18, 30, 0, 0, 0, 0, false, 0, medium, neutralEvil, ChallengeRating.TWENTY_ONE, 11, 16, 16, 20, 14, 16, null, "@level18Id", INT_ID, 0, 0, 4, 3, 3, 3, 3, 1, 1, 1, 1, spells, common, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Lizardfolk";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID, SURVIVAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The lizardfolk makes two melee attacks, each one with a different weapon."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Heavy Club", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createActionRange("Javelin", 0, "30/120 ft.", AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spiked Shield", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Hold Breath", "The lizardfolk can hold its breath for 15 minutes.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_SHIELD_ID, "", 1),
                new ListObject(GREATCLUB_ID, "", 1),
                new ListObject(JAVELIN_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, "Lizardfolk", 15, 4, 30, 0, 0, 30, 0, false, 0, medium, neutral, ChallengeRating.HALF, 15, 10, 13, 7, 12, 7, draconic, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Werebear";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."),
                createAction("Bite (Bear or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, piercing, STR_ID, 0, "If the target is a humanoid, it must succeed on a DC 14 Constitution saving throw or be cursed with werebear lycanthropy"),
                createAction("Claw (Bear or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Greataxe (Humanoid or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.TWELVE, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Keen Smell", "The werebear has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATAXE_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, humanShapechanger, 10, 18, 30, 0, 30, 0, 0, false, 0, medium, neutralGood, ChallengeRating.FIVE, 19, 10, 17, 11, 12, 12, common, null, skillProfs, wereMonsterDamageModifierApis, null, null, actions, features, equipment);

        name = "Wereboar";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The wereboar makes two attacks, only one of which can be with its tusks."),
                createAction("Maul (Humanoiod or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createAction("Tusks (Boar or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, slashing, STR_ID, 0, "If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with wereboar lycanthropy.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Charge (Bear or Hybrid Form Only)", "If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Relentless ", true, MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, true, true, "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(MAUL_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, humanShapechanger, 10, 12, 30, medium, neutralEvil, ChallengeRating.FOUR, 17, 10, 15, 10, 11, 8, common, null, skillProfs, wereMonsterDamageModifierApis, null, null, actions, features, equipment);

        name = "Wererat";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The wererat makes two attacks, only one of which can be a bite."),
                createAction("Bite (Rat or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "If the target is a humanoid, it must succeed on a DC 11 Constitution saving throw or be cursed with wererat lycanthropy."),
                createAction("Shortsword (Humanoid or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createActionRange("Hand Crossbow (Humanoid or Hybrid Form Only)", CROSSBOW_BOLT_ID, "30/120 ft.", AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Keen Smell", "The wererat has advantage on Wisdom (Perception) checks that rely on smell.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(HAND_CROSSBOW_ID, "", 1),
                new ListObject(CROSSBOW_BOLT_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, humanShapechanger, 12, 6, 30, medium, lawfulEvil, ChallengeRating.TWO, 10, 15, 12, 11, 10, 8, common, null, skillProfs, wereMonsterDamageModifierApis, null, senses, actions, features, equipment);

        name = "Weretiger";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks."),
                createAction("Bite (Tiger or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TEN, piercing, STR_ID, 0, "If the target is a humanoid, it must succeed on a DC 13 Constitution saving throw or be cursed with weretiger lycanthropy"),
                createAction("Claw (Tiger or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Scimitar (Humanoid or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionRange("Longbow (Humanoid or Hybrid Form Only)", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."),
                new MonsterFeatureApi(0, "Pounce (Tiger or Hybrid Form Only)", "If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(SCIMITAR_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, HUMANOID_ID, humanShapechanger, 12, 16, 30, medium, neutral, ChallengeRating.FOUR, 17, 15, 16, 10, 13, 11, common, null, skillProfs, wereMonsterDamageModifierApis, null, senses, actions, features, equipment);

        name = "Werewolf";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The werewolf makes two attacks: one with its bite and one with its claws or spear."),
                createAction("Bite (Wolf or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy."),
                createAction("Claw (Wolf or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.FOUR, slashing, STR_ID, 0, ""),
                createAction("Spear (Humanoid or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spear (Two-Hands, Humanoid or Hybrid Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Keen Hearing and Smell", "The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SPEAR_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, humanShapechanger, 11, 9, 30, medium, chaoticEvil, ChallengeRating.THREE, 15, 13, 14, 10, 11, 10, common, null, skillProfs, wereMonsterDamageModifierApis, null, null, actions, features, equipment);

        name = "Magmin";
        damageModifiers = new ArrayList<>(Arrays.asList(
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                fireImmune
        ));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(IGNAN_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Touch", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, fire, null, 0, "If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes 3 (1d6) fire damage at the end of each of its turns.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Death Burst", "When the magmin dies, it explodes in a burst of fire and magma. Each creature within 10 feet of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. Flammable objects that aren''t being worn or carried in that area are ignited."),
                new MonsterFeatureApi(0, "Ignited Illumination", "As a bonus action, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 10 feet.")
        ));
        insert(name, ELEMENTAL_ID, "", 14, 2, 30, small, chaoticNeutral, ChallengeRating.HALF, 7, 15, 12, 8, 11, 10, languageProfs, null, null, damageModifiers, null, senses, actions, features, null);

        name = "Manticore";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createActionRange("Tail Spike", 0, "100/200 ft.", AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Tail Spike Regrowth", "The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest.")
        ));
        insert(name, MONSTROSITY_ID, "", 14, 8, 30, 0, 0, 0, 50, false, 0, large, lawfulEvil, ChallengeRating.THREE, 17, 16, 17, 7, 12, 8, common, null, null, null, null, senses, actions, features, null);

        name = "Medusa";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The medusa makes either three melee attacks — one with its snake hair and two with its shortsword — or two ranged attacks with its longbow."),
                createAction("Snake Hair", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, DEX_ID, 0, 4, DiceSize.SIX, poison, null, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, 2, DiceSize.SIX, poison, null, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Petrifying Gaze", "When a creature that can see the medusa''s eyes starts its turn within 30 feet of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn''t incapacitated and can see the creature. If the saving throw fails by 5 or more, the creature is instantly petrified. Otherwise, a creature that fails the save begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the creature is freed by the greater restoration spell or other magic.\\n\\nUnless surprised, a creature can avert its eyes to avoid the saving throw at the start of its turn. If the creature does so, it can''t see the medusa until the start of its next turn, when it can avert its eyes again. If the creature looks at the medusa in the meantime, it must immediately make the save.\\n\\nIf the medusa sees itself reflected on a polished surface within 30 feet of it and in an area of bright light, the medusa is, due to its curse, affected by its own gaze.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, MONSTROSITY_ID, "", 15, 17, 30, medium, lawfulEvil, ChallengeRating.SIX, 10, 15, 16, 12, 13, 15, common, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Dust Mephit";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                fireVulnerable,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(AURAN_ID, TERRAN_ID));
        innateSpells = getSpellIds("'Sleep'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, slashing, DEX_ID, 0, ""),
                createActionSave("Blinding Breath", 10, DEX_ID, false, 0, DiceSize.FOUR, "", null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "The mephit exhales a 15- foot cone of blinding dust. Each creature in that area must succeed on a DC 10 Dexterity saving throw or be blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."),
                createSpellAction(true, "Sleep", 1, null, false, 5, DiceSize.EIGHT, "", 1, 1, 2, DiceSize.EIGHT, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Death Burst", "When the mephit dies, it explodes in a burst of dust. Each creature within 5 feet of it must then succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A blinded creature can repeat the saving throw on each of its turns, ending the effect on itself on a success.")
        ));
        insertInnate(name, ELEMENTAL_ID, "", 12, 5, 30, 0, 0, 0, 30, false, 0, small, neutralEvil, ChallengeRating.HALF, 5, 14, 10, 9, 11, 10, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Ice Mephit";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                bludgeoningVulnerable, fireVulnerable,
                coldImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(AQUAN_ID, AURAN_ID));
        innateSpells = getSpellIds("'Fog Cloud'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, slashing, DEX_ID, 0, 1, DiceSize.FOUR, cold, null, 0, ""),
                createActionSave("Frost Breath", 10, DEX_ID, true, 2, DiceSize.FOUR, cold, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "The mephit exhales a 15- foot cone of cold air. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much damage on a successful one."),
                createSpellAction(true, "Fog Cloud", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Death Burst", "When the mephit dies, it explodes in a burst of jagged ice. Each creature within 5 feet of it must make a DC 10 Dexterity saving throw, taking 4 (1d8) slashing damage on a failed save, or half as much damage on a successful one."),
                new MonsterFeatureApi(0, "False Appearance", "While the mephit remains motionless, it is indistinguishable from an ordinary shard of ice.")
        ));
        insertInnate(name, ELEMENTAL_ID, "", 11, 6, 30, 0, 0, 0, 30, false, 0, small, neutralEvil, ChallengeRating.HALF, 7, 13, 10, 9, 11, 12, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Magma Mephit";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldVulnerable,
                fireImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(IGNAN_ID, TERRAN_ID));
        innateSpells = getSpellIds("'Heat Metal'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, slashing, DEX_ID, 0, 1, DiceSize.FOUR, fire, null, 0, ""),
                createActionSave("Fire Breath", 11, DEX_ID, true, 2, DiceSize.SIX, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "The mephit exhales a 15-foot cone of fire. Each creature in that area must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one."),
                createSpellAction(true, "Heat Metal", 1, null, false, 2, DiceSize.EIGHT, fire, 2, 1, 1, DiceSize.EIGHT, fire)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Death Burst", "When the mephit dies, it explodes in a burst of lava. Each creature within 5 feet of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one."),
                new MonsterFeatureApi(0, "False Appearance", "While the mephit remains motionless, it is indistinguishable from an ordinary mound of magma.")
        ));
        insertInnate(name, ELEMENTAL_ID, "", 11, 5, 30, 0, 0, 0, 30, false, 0, small, neutralEvil, ChallengeRating.HALF, 8, 12, 12, 7, 10, 10, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Steam Mephit";
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(AQUAN_ID, IGNAN_ID));
        innateSpells = getSpellIds("'Blur'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.FOUR, slashing, DEX_ID, 0, 1, DiceSize.FOUR, fire, null, 0, ""),
                createActionSave("Steam Breath", 10, DEX_ID, true, 1, DiceSize.EIGHT, fire, null, 0, MonsterLimitedUseType.RECHARGE_RANGE, 0, 6, 6, "The mephit exhales a 15- foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 4 (1d8) fire damage on a failed save, or half as much damage on a successful one."),
                createSpellAction(true, "Blur", 1)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Death Burst", "When the mephit dies, it explodes in a cloud of steam. Each creature within 5 feet of the mephit must succeed on a DC 10 Dexterity saving throw or take 4 (1d8) fire damage.")
        ));
        insertInnate(name, ELEMENTAL_ID, "", 10, 6, 30, 0, 0, 0, 30, false, 0, small, neutralEvil, ChallengeRating.QUARTER, 5, 11, 10, 11, 10, 12, CHA_ID, 0, 0, innateSpells,  languageProfs, null, null, firePoisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Merfolk";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        languageProfs = new ArrayList<>(Arrays.asList(AQUAN_ID, COMMON_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The merfolk can breathe air and water")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SPEAR_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, "Merfolk", 11, 2, 10, 0, 0, 40, 0, false, 0, medium, neutral, ChallengeRating.EIGHTH, 10, 13, 12, 11, 11, 12, languageProfs, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Merrow";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, AQUAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The merrow makes two attacks: one with its bite and one with its claws or harpoon."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.FOUR, slashing, STR_ID, 0, ""),
                createActionRange("Harpoon", 0, "20/60 ft.", AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, "If the target is a Huge or smaller creature, it must succeed on a Strength contest against the merrow or be pulled up to 20 feet toward the merrow.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Amphibious", "The merrow can breathe air and water.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SPEAR_ID, "", 1)
        ));
        insert(name, MONSTROSITY_ID, "", 13, 6, 10, 0, 0, 40, 0, false, 0, large, chaoticEvil, ChallengeRating.TWO, 18, 10, 15, 8, 10, 9, languageProfs, null, null, null, null, senses, actions, features, equipment);

        name = "Mimic";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(PRONE_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Pseudopod", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "If the mimic is in object form, the target is subjected to its Adhesive trait."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.EIGHT, piercing, STR_ID, 0, 1, DiceSize.EIGHT, acid, null, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies."),
                new MonsterFeatureApi(0, "Adhesive (Object Form Only)", "The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage."),
                new MonsterFeatureApi(0, "False Appearance (Object Form Only)", "While the mimic remains motionless, it is indistinguishable from an ordinary object."),
                new MonsterFeatureApi(0, "Grappler", "The mimic has advantage on attack rolls against any creature grappled by it.")
        ));
        insert(name, MONSTROSITY_ID, shapeChanger, 12, 9, 15, medium, neutral, ChallengeRating.TWO, 17, 12, 15, 5, 13, 8, null, null, skillProfs, acidImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Minotaur";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Greataxe", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.TWELVE, slashing, STR_ID, 0, ""),
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the minotaur moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone."),
                new MonsterFeatureApi(0, "Labyrinthine Recall", "The minotaur can perfectly recall any path it has traveled."),
                new MonsterFeatureApi(0, "Reckless", "At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATAXE_ID, "", 1)
        ));
        insert(name, MONSTROSITY_ID, "", 14, 9, 40, large, chaoticEvil, ChallengeRating.THREE, 18, 11, 16, 6, 16, 9, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Mummy";
        savingThrowProfs = new ArrayList<>(Collections.singletonList(WIS_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                fireVulnerable,
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                necroticImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."),
                createAction("Rotting Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 3, DiceSize.SIX, necrotic, null, 0, "If the target is a creature, it must succeed on a DC 12 Constitution saving throw or be cursed with mummy rot. The cursed target can''t regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target''s hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the remove curse spell or other magic."),
                createActionSave("Dreadful Glare", 11, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, "The mummy targets one creature it can see within 60 feet of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw against this magic or become frightened until the end of the mummy''s next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies (but not mummy lords) for the next 24 hours.")
        ));
        insert(name, UNDEAD_ID, "", 11, 9, 20, medium, lawfulEvil, ChallengeRating.THREE, 16, 8, 15, 6, 10, 12, null, savingThrowProfs, null, damageModifiers, conditionImmunities, senses, actions, null, null);

        name = "Mummy Lord";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, INT_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(HISTORY_ID, RELIGION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                fireVulnerable,
                necroticImmune, poisonImmune, nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        spells = getSpellIds("'Sacred Flame','Thaumaturgy', 'Command', 'Guiding Bolt', 'Shield of Faith', 'Hold Person', 'Silence', 'Spiritual Weapon', 'Animate Dead', 'Dispel Magic', 'Divination', 'Guardian of Faith', 'Contagion', 'Insect Plague', 'Harm'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."),
                createAction("Rotting Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 3, DiceSize.SIX, necrotic, null, 0, "If the target is a creature, it must succeed on a DC 16 Constitution saving throw or be cursed with mummy rot. The cursed target can''t regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target''s hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the remove curse spell or other magic."),
                createActionSave("Dreadful Glare", 11, WIS_ID, false, 0, DiceSize.FOUR, "", null, 0, "The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy''s next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours"),
                createLegendaryAction("Attack", 1, "The mummy lord makes one attack with its rotting fist or uses its Dreadful Glare."),
                createLegendaryAction("Blinding Dust", 1, "Blinding dust and sand swirls magically around the mummy lord. Each creature within 5 feet of the mummy lord must succeed on a DC 16 Constitution saving throw or be blinded until the end of the creature''s next turn."),
                createLegendaryAction("Blasphemous Word", 2, "The mummy lord utters a blasphemous word. Each non-undead creature within 10 feet of the mummy lord that can hear the magical utterance must succeed on a DC 16 Constitution saving throw or be stunned until the end of the mummy lord''s next turn."),
                createLegendaryAction("Channel Negative Energy", 2, "The mummy lord magically unleashes negative energy. Creatures within 60 feet of the mummy lord, including ones behind barriers and around corners, can''t regain hit points until the end of the mummy lord''s next turn."),
                createLegendaryAction("Whirlwind of Sand", 2, "The mummy lord magically transforms into a whirlwind of sand, moves up to 60 feet, and reverts to its normal form. While in whirlwind form, the mummy lord is immune to all damage, and it can''t be grappled, petrified, knocked prone, restrained, or stunned. Equipment worn or carried by the mummy lord remain in its possession"),
                createSpellAction(false, "Sacred Flame", 0, DEX_ID, false, 2, DiceSize.EIGHT, radiant),
                createSpellAction(false, "Guiding Bolt", 0, null, false, 4, DiceSize.SIX, radiant, 1, 1, 1, DiceSize.SIX, radiant),
                createSpellAction(false, AttackType.ATTACK, "Spiritual Weapon", 0, null, false, 1, DiceSize.EIGHT, radiant, WIS_ID, 0, 2, 1, 1, DiceSize.EIGHT, radiant, null, 0),
                createSpellAction(false, AttackType.SAVE, "Guardian of Faith", 0, DEX_ID, true, 0, DiceSize.FOUR, radiant, null, 20),
                createSpellAction(false, "Insect Plague", 0, CON_ID, true, 4, DiceSize.TEN, piercing, 5, 1, 1, DiceSize.TEN, piercing),
                createSpellAction(false, "Harm", 0, CON_ID, true, 14, DiceSize.SIX, necrotic)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Magic Resistance", "The mummy lord has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Rejuvenation", "A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord''s heart.")
        ));
        insertCaster(name, true, UNDEAD_ID, "", 17, 13, 20, 0, 0, 0, 0, false, 0, medium, lawfulEvil, ChallengeRating.FIFTEEN, 18, 10, 17, 11, 18, 16, "@fullCasterId", "@level10Id", WIS_ID, 0, 0, 4, 3, 3, 3, 2, 1, 0, 0, 0, spells, null, savingThrowProfs, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Guardian Naga";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, INT_ID, WIS_ID, CHA_ID));
        damageModifiers = new ArrayList<>(Collections.singletonList(
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(CELESTIAL_ID, COMMON_ID));
        spells = getSpellIds("'Mending', 'Sacred Flame', 'Thaumaturgy', 'Command', 'Cure Wounds', 'Shield of Faith', 'Calm Emotions', 'Hold Person', 'Bestow Curse', 'Clairvoyance', 'Banishment', 'Freedom of Movement', 'Flame Strike', 'Geas', 'True Seeing'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "Reach 10 ft., one creature: The target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."),
                createActionSave("Spit Poison", 15, CON_ID, true, 10, DiceSize.EIGHT, poison, null, 0, "+8 to hit, range 15/30 ft., one creature. Hit: The target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."),
                createSpellAction(false, "Sacred Flame", 0, DEX_ID, false, 3, DiceSize.EIGHT, radiant),
                createSpellAction(false, AttackType.HEAL, "Cure Wounds", 0, null, false, 1, DiceSize.EIGHT, "", WIS_ID, 0, 1, 1, 1, DiceSize.EIGHT, "", null, 0),
                createSpellAction(false, "Flame Strike", 0, DEX_ID, true, 4, DiceSize.SIX, radiant, 5, 1, 1, DiceSize.SIX, radiant)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Rejuvenation", "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.")
        ));
        insertCaster(name, MONSTROSITY_ID, "", 18, 15, 40, 0, 0, 0, 0, false, 0, large, lawfulGood, ChallengeRating.TEN, 19, 18, 16, 16, 19, 18, "@fullCasterId", "@level11Id", WIS_ID, 0, 0, 4, 3, 3, 3, 2, 1, 0, 0, 0, spells, languageProfs, savingThrowProfs, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Spirit Naga";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, COMMON_ID));
        spells = getSpellIds("'Mage Hand', 'Minor Illusion', 'Ray of Frost', 'Charm Person', 'Detect Magic', 'Sleep', 'Detect Thoughts', 'Hold Person', 'Lightning Bolt', 'Water Breathing', 'Blight', 'Dimension Door', 'Dominate Person'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.SIX, piercing, STR_ID, 0, "Reach 10 ft., one creature: The target must make a DC 13 Constitution saving throw, taking 31 (7d8) poison damage on a failed save, or half as much damage on a successful one."),
                createSpellAction(false, "Ray of Frost", 0, null, false, 2, DiceSize.EIGHT, cold),
                createSpellAction(false, "Lightning Bolt", 0, DEX_ID, true, 8, DiceSize.SIX, lightning, 3, 1, 1, DiceSize.SIX, lightning),
                createSpellAction(false, "Blight", 0, CON_ID, true, 8, DiceSize.EIGHT, necrotic, 4, 1, 1, DiceSize.EIGHT, necrotic)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Rejuvenation", "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.")
        ));
        insertCaster(name, MONSTROSITY_ID, "", 15, 10, 40, 0, 0, 0, 0, false, 0, large, chaoticEvil, ChallengeRating.EIGHT, 18, 17, 14, 16, 15, 16, "@fullCasterId", "@level10Id", INT_ID, 0, 0, 4, 3, 3, 3, 2, 0, 0, 0, 0, spells, languageProfs, savingThrowProfs, null, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Nightmare";
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, COMMON_ID, INFERNAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createAction("Ethereal Stride", "The nightmare and up to three willing creatures within 5 feet of it magically enter the Ethereal Plane from the Material Plane, or vice versa.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Confer Fire Resistance", "The nightmare can grant resistance to fire damage to anyone riding it."),
                new MonsterFeatureApi(0, "Illumination", "The nightmare sheds bright light in a 10- foot radius and dim light for an additional 10 feet.")
        ));
        insert(name, FIEND_ID, "", 13, 8, 60, 0, 0, 0, 90, false, 0, large, neutralEvil, ChallengeRating.THREE, 18, 15, 16, 10, 13, 15, languageProfs, null, null, fireImmuneList, null, null, actions, features, null);

        name = "Ogre";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Greatclub", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createActionRange("Javelin", 0, "30/120 ft.", AttackType.ATTACK, 6, 2, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(GREATCLUB_ID, "", 1),
                new ListObject(JAVELIN_ID, "", 1)
        ));
        insert(name, GIANT_ID, "", 11, 7, 40, large, chaoticEvil, ChallengeRating.TWO, 19, 8, 16, 5, 7, 7, commonGiant, null, null, null, null, senses, actions, null, equipment);

        name = "Oni";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, DECEPTION_ID, PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        innateSpells = getSpellIds("'Darkness', 'Invisibility', 'Charm Person', 'Cone of Cold', 'Gaseous Form', 'Sleep'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The oni makes two attacks, either with its claws or its glaive."),
                createAction("Claw (Oni Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Glaive", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Glaive (Small or Medium Form)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Change Shape", "The oni magically polymorphs into a Small or Medium humanoid, into a Large giant, or back into its true form. Other than its size, its statistics are the same in each form. The only equipment that is transformed is its glaive, which shrinks so that it can be wielded in humanoid form. If the oni dies, it reverts to its true form, and its glaive reverts to its normal size."),
                createSpellAction(true, "Darkness", 0),
                createSpellAction(true, "Invisibility", 0),
                createSpellAction(true, "Charm Person", 1),
                createSpellAction(true, "Cone of Cold", 1),
                createSpellAction(true, "Gaseous Form", 1),
                createSpellAction(true, "Sleep", 1, null, false, 5, DiceSize.EIGHT, "", 1, 1, 2, DiceSize.EIGHT, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Magic Weapons", "The oni''s weapon attacks are magical."),
                new MonsterFeatureApi(0, "Regeneration", "The oni regains 10 hit points at the start of its turn if it has at least 1 hit point.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_CHAIN_MAIL_ID, "", 1),
                new ListObject(GLAIVE_ID, "", 1)
        ));
        insertInnate(name, GIANT_ID, "", 16, 13, 30, 0, 0, 0, 30, false, 0, large, lawfulEvil, ChallengeRating.SEVEN, 19, 11, 16, 14, 12, 15, CHA_ID, 0, 0, innateSpells,  commonGiant, savingThrowProfs, skillProfs, null, null, senses, actions, features, equipment);

        name = "Black Pudding";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidImmune, coldImmune, lightningImmune, slashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PRONE_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Pseudopod", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, 4, DiceSize.EIGHT, acid, null, 0, "In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative −1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10."),
                createReaction("Split", "When a pudding that is Medium or larger is subjected to lightning or slashing damage, it splits into two new puddings if it has at least 10 hit points. Each new pudding has hit points equal to half the original pudding''s, rounded down. New puddings are one size smaller than the original pudding.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amorphous", "The pudding can move through a space as narrow as 1 inch wide without squeezing."),
                new MonsterFeatureApi(0, "Corrosive Form", "A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative −1 penalty to damage rolls. If its penalty drops to −5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage.\\n\\nThe pudding can eat through 2-inch-thick, nonmagical wood or metal in 1 round."),
                new MonsterFeatureApi(0, "Spider Climb", "The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.")
        ));
        insert(name, OOZE_ID, "", 7, 10, 20, 0, 20, 0, 0, false, 0, large, unaligned, ChallengeRating.FOUR, 16, 5, 16, 1, 6, 1, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Gelatinous Cube";
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PRONE_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Pseudopod", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 3, DiceSize.SIX, acid, null, 0, ""),
                createAction("Engulf", "The cube moves up to its speed. While doing so, it can enter Large or smaller creatures'' spaces. Whenever the cube enters a creature''s space, the creature must make a DC 12 Dexterity saving throw.\\n\\nOn a successful save, the creature can choose to be pushed 5 feet back or to the side of the cube. A creature that chooses not to be pushed suffers the consequences of a failed saving throw.\\n\\nOn a failed save, the cube enters the creature''s space, and the creature takes 10 (3d6) acid damage and is engulfed. The engulfed creature can''t breathe, is restrained, and takes 21 (6d6) acid damage at the start of each of the cube''s turns. When the cube moves, the engulfed creature moves with it.\\n\\nAn engulfed creature can try to escape by taking an action to make a DC 12 Strength check. On a success, the creature escapes and enters a space of its choice within 5 feet of the cube.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Ooze Cube", "The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube''s Engulf and has disadvantage on the saving throw.\\n\\nCreatures inside the cube can be seen but have total cover.\\n\\nA creature within 5 feet of the cube can take an action to pull a creature or object out of the cube. Doing so requires a successful DC 12 Strength check, and the creature making the attempt takes 10 (3d6) acid damage.\\n\\nThe cube can hold only one Large creature or up to four Medium or smaller creatures inside it at a time."),
                new MonsterFeatureApi(0, "Transparent", "Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube''s space while unaware of the cube is surprised by the cube.")
        ));
        insert(name, OOZE_ID, "", 6, 8, 15, large, unaligned, ChallengeRating.TWO, 14, 3, 20, 1, 6, 1, null, null, null, null, conditionImmunities, senses, actions, features, null);

        name = "Gray Ooze";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant, coldResistant, fireResistant
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PRONE_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Pseudopod", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, DiceSize.SIX, acid, null, 0, "If the target is wearing nonmagical metal armor, its armor is partly corroded and takes a permanent and cumulative −1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amorphous", "The ooze can move through a space as narrow as 1 inch wide without squeezing."),
                new MonsterFeatureApi(0, "Corrode Metal", "Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative −1 penalty to damage rolls. If its penalty drops to −5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing damage.\\n\\nThe ooze can eat through 2-inch-thick, nonmagical metal in 1 round."),
                new MonsterFeatureApi(0, "False Appearance", "While the ooze remains motionless, it is indistinguishable from an oily pool or wet rock.")
        ));
        insert(name, OOZE_ID, "", 8, 3, 10, 0, 10, 0, 0, false, 0, medium, unaligned, ChallengeRating.HALF, 12, 6, 16, 1, 6, 2, null, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Ochre Jelly";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant,
                lightningImmune, slashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, CHARMED_ID, DEAFENED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PRONE_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Pseudopod", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 1, DiceSize.SIX, acid, null, 0, ""),
                createReaction("Split", "When a jelly that is Medium or larger is subjected to lightning or slashing damage, it splits into two new jellies if it has at least 10 hit points. Each new jelly has hit points equal to half the original jelly''s, rounded down. New jellies are one size smaller than the original jelly.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amorphous", "The jelly can move through a space as narrow as 1 inch wide without squeezing"),
                new MonsterFeatureApi(0, "Spider Climb", "The jelly can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.")
        ));
        insert(name, OOZE_ID, "", 8, 6, 10, 0, 10, 0, 0, false, 0, large, unaligned, ChallengeRating.TWO, 15, 6, 14, 2, 6, 1, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Orc";
        skillProfs = new ArrayList<>(Collections.singletonList(INTIMIDATION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, ORC_LANG_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Greataxe", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.TWELVE, slashing, STR_ID, 0, ""),
                createActionRange("Javelin", 0, "30/120 ft.", AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Aggressive", "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(ARMOR_HIDE_ID, "", 1),
                new ListObject(GREATAXE_ID, "", 1),
                new ListObject(JAVELIN_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, "Orc", 13, 2, 30, medium, chaoticEvil, ChallengeRating.HALF, 16, 12, 16, 7, 11, 10, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Otyugh";
        savingThrowProfs = new ArrayList<>(Collections.singletonList(CON_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Collections.singletonList(OTYUGH_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The otyugh makes three attacks: one with its bite and two with its tentacles."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, piercing, STR_ID, 0, "If the target is a creature, it must succeed on a DC 15 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the target must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. The disease is cured on a success. The target dies if the disease reduces its hit point maximum to 0. This reduction to the target''s hit point maximum lasts until the disease is cured."),
                createAction("Tentacle", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "If the target is Medium or smaller, it is grappled (escape DC 13) and restrained until the grapple ends. The otyugh has two tentacles, each of which can grapple one target"),
                createActionSave("Tentacle Slam", 14, CON_ID, true, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "The otyugh slams creatures grappled by it into each other or a solid surface. Each creature must succeed on a DC 14 Constitution saving throw or take 10 (2d6 + 3) bludgeoning damage and be stunned until the end of the otyugh''s next turn. On a successful save, the target takes half the bludgeoning damage and isn''t stunned.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Limited Telepathy", "The otyugh can magically transmit simple messages and images to any creature within 120 feet of it that can understand a language. This form of telepathy doesn''t allow the receiving creature to telepathically respond.")
        ));
        insert(name, ABERRATION_ID, "", 14, 12, 30, large, neutral, ChallengeRating.FIVE, 16, 11, 19, 6, 13, 6, languageProfs, savingThrowProfs, null, null, null, senses, actions, features, null);

        name = "Owlbear";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The owlbear makes two attacks: one with its beak and one with its claws."),
                createAction("Beak", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight and Smell", "The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell.")
        ));
        insert(name, MONSTROSITY_ID, "", 13, 7, 40, large, unaligned, ChallengeRating.THREE, 20, 12, 17, 3, 12, 7, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Pegasus";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        languageProfs = new ArrayList<>(Arrays.asList(CELESTIAL_ID, COMMON_ID, ELVISH_ID, SYLVAN_ID));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, CELESTIAL_ID, "", 12, 7, 60, 0, 0, 0, 90, false, 0, large, chaoticGood, ChallengeRating.TWO, 18, 15, 16, 10, 15, 13, languageProfs, savingThrowProfs, skillProfs, null, null, null, actions, null, null);

        name = "Pseudodragon";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, ""),
                createAction("Sting", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The target must succeed on a DC 11 Constitution saving throw or become poisoned for 1 hour. If the saving throw fails by 5 or more, the target falls unconscious for the same duration, or until it takes damage or another creature uses an action to shake it awake.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Senses", "The pseudodragon has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell."),
                new MonsterFeatureApi(0, "Magic Resistance", "The pseudodragon has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Limited Telepathy", "The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 feet of it that can understand a language.")
        ));
        insert(name, DRAGON_ID, "", 13, 2, 15, 0, 0, 0, 60, false, 0, tiny, neutralGood, ChallengeRating.QUARTER, 6, 15, 13, 10, 12, 10, commonDraconic, null, skillProfs, null, null, senses, actions, features, null);

        name = "Purple Worm";
        savingThrowProfs = new ArrayList<>(Arrays.asList(CON_ID, WIS_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight30, tremorsense60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The worm makes two attacks: one with its bite and one with its stinger."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.EIGHT, piercing, STR_ID, 0, "If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm. A swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the worm, and it takes 21 (6d6) acid damage at the start of each of the worm''s turns.\\n\\nIf the worm takes 30 damage or more on a single turn from a creature inside it, the worm must succeed on a DC 21 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the worm. If the worm dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 20 feet of movement, exiting prone."),
                createAction("Tail Stinger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 3, DiceSize.SIX, piercing, STR_ID, 0, "The target must make a DC 19 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Tunneler", "The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot-diameter tunnel in its wake.")
        ));
        insert(name, MONSTROSITY_ID, "", 18, 15, 50, 0, 0, 0, 0, false, 30, gargantuan, unaligned, ChallengeRating.FIFTEEN, 28, 7, 22, 1, 8, 4, null, savingThrowProfs, null, null, null, senses, actions, features, null);

        name = "Rakshasa";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                createModifier(piercing, DamageModifierType.VULNERABLE, "from magic weapons wielded by good creatures"),
                nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, INFERNAL_ID));
        innateSpells = getSpellIds("'Detect Thoughts', 'Disguise Self', 'Mage Hand', 'Minor Illusion', 'Charm Person', 'Detect Magic', 'Invisibility', 'Major Image', 'Suggestion', 'Dominate Person', 'Fly', 'Plane Shift', 'True Seeing'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The rakshasa makes two claw attacks."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "The target is cursed if it is a creature. The magical curse takes effect whenever the target takes a short or long rest, filling the target''s thoughts with horrible images and dreams. The cursed target gains no benefit from finishing a short or long rest. The curse lasts until it is lifted by a remove curse spell or similar magic."),
                createSpellAction(true, "Detect Thoughts", 0),
                createSpellAction(true, "Disguise Self", 0),
                createSpellAction(true, "Mage Hand", 0),
                createSpellAction(true, "Minor Illusion", 0),
                createSpellAction(true, "Charm Person", 3),
                createSpellAction(true, "Detect Magic", 3),
                createSpellAction(true, "Invisibility", 3),
                createSpellAction(true, "Major Image", 3),
                createSpellAction(true, "Suggestion", 3),
                createSpellAction(true, "Dominate Person", 1),
                createSpellAction(true, "Fly", 1),
                createSpellAction(true, "Plane Shift", 1),
                createSpellAction(true, "True Seeing", 1)
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Limited Magic Immunity", "The rakshasa can''t be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects.")
        ));
        insertInnate(name, FIEND_ID, "", 16, 13, 40, 0, 0, 0, 0, false, 0, medium, lawfulEvil, ChallengeRating.THIRTEEN, 14, 17, 18, 13, 16, 20, CHA_ID, 0, 0, innateSpells,  languageProfs, null, skillProfs, damageModifiers, null, senses, actions, features, null);

        name = "Remorhaz";
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldImmune, fireImmune
        ));
        senses = new ArrayList<>(Arrays.asList(darkvision60, tremorsense60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 11, 6, DiceSize.TEN, piercing, STR_ID, 0, "If the target is a creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the remorhaz can''t bite another target."),
                createAction("Swallow", "The remorhaz makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the bite''s damage and is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) acid damage at the start of each of the remorhaz''s turns. If the remorhaz takes 30 damage or more on a single turn from a creature inside it, the remorhaz must succeed on a DC 15 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the remorhaz. If the remorhaz dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 15 feet of movement, exiting prone.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Heated Body", "A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.")
        ));
        insert(name, MONSTROSITY_ID, "", 17, 17, 30, 0, 0, 0, 0, false, 20, huge, unaligned, ChallengeRating.ELEVEN, 24, 13, 21, 4, 10, 5, null, null, null, damageModifiers, null, senses, actions, features, null);

        name = "Roc";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The roc makes two attacks: one with its beak and one with its talons."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 4, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Talons", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 13, 4, DiceSize.SIX, slashing, STR_ID, 0, "The target is grappled (escape DC 19). Until this grapple ends, the target is restrained, and the roc can''t use its talons on another target.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Keen Sight", "The roc has advantage on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, MONSTROSITY_ID, "", 15, 16, 20, 0, 0, 0, 120, false, 0, gargantuan, unaligned, ChallengeRating.ELEVEN, 28, 10, 20, 3, 10, 9, null, savingThrowProfs, skillProfs, null, null, null, actions, features, null);

        name = "Roper";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The roper makes four attacks with its tendrils, uses Reel, and makes one attack with its bite."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 4, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Tendril", "+7 to hit, reach 50 ft., one creature. Hit: The target is grappled (escape DC 15). Until the grapple ends, the target is restrained and has disadvantage on Strength checks and Strength saving throws, and the roper can''t use the same tendril on another target."),
                createAction("Reel", "The roper pulls each creature grappled by it up to 25 feet straight toward it.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "False Appearance", "While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite."),
                new MonsterFeatureApi(0, "Grasping Tendrils", "The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes an action and succeeds on a DC 15 Strength check against it."),
                new MonsterFeatureApi(0, "Spider Climb", "The roper can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.")
        ));
        insert(name, MONSTROSITY_ID, "", 20, 11, 10, 0, 10, 0, 0, false, 0, large, neutralEvil, ChallengeRating.FIVE, 18, 8, 17, 7, 16, 6, null, null, skillProfs, null, null, senses, actions, features, null);

        name = "Rust Monster";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Antennae", "The rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet of it. If the object isn''t being worn or carried, the touch destroys a 1-foot cube of it. If the object is being worn or carried by a creature, the creature can make a DC 11 Dexterity saving throw to avoid the rust monster''s touch.\\n\\nIf the object touched is either metal armor or a metal shield being worn or carried, its takes a permanent and cumulative −1 penalty to the AC it offers. Armor reduced to an AC of 10 or a shield that drops to a +0 bonus is destroyed. If the object touched is a held metal weapon, it rusts as described in the Rust Metal trait.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Iron Scent", "The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it."),
                new MonsterFeatureApi(0, "Rust Metal", "Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative −1 penalty to damage rolls. If its penalty drops to −5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed after dealing damage.")
        ));
        insert(name, MONSTROSITY_ID, "", 14, 5, 40, medium, unaligned, ChallengeRating.HALF, 13, 12, 13, 2, 13, 6, null, null, null, null, null, senses, actions, features, null);

        name = "Sahuagin";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        languageProfs = new ArrayList<>(Collections.singletonList(SAHUAGIN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The sahuagin makes two melee attacks: one with its bite and one with its claws or spear."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, piercing, STR_ID, 0, ""),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.FOUR, slashing, STR_ID, 0, ""),
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Blood Frenzy", "The sahuagin has advantage on melee attack rolls against any creature that doesn''t have all its hit points."),
                new MonsterFeatureApi(0, "Limited Amphibiousness", "The sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating."),
                new MonsterFeatureApi(0, "Shark Telepathy", "The sahuagin can magically command any shark within 120 feet of it, using a limited telepathy.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SPEAR_ID, "", 1)
        ));
        insert(name, HUMANOID_ID, "Sahuagin", 12, 4, 30, 0, 0, 40, 0, false, 0, medium, lawfulEvil, ChallengeRating.HALF, 13, 11, 12, 12, 13, 9, languageProfs, null, skillProfs, null, null, senses, actions, features, equipment);

        name = "Salamander";
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldVulnerable,
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                fireImmune
        ));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(IGNAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The salamander makes two attacks: one with its spear and one with its tail."),
                createAction("Spear", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, piercing, STR_ID, 0, 1, DiceSize.SIX, fire, null, 0, ""),
                createAction("Spear (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, piercing, STR_ID, 0, 1, DiceSize.SIX, fire, null, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, 2, DiceSize.SIX, fire, null, 0, "The target is grappled (escape DC 14). Until this grapple ends, the target is restrained, the salamander can automatically hit the target with its tail, and the salamander can''t make tail attacks against other targets.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Heated Body", "A creature that touches the salamander or hits it with a melee attack while within 5 feet of it takes 7 (2d6) fire damage."),
                new MonsterFeatureApi(0, "Heated Weapons", "Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack).")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(SPEAR_ID, "", 1)
        ));
        insert(name, ELEMENTAL_ID, "", 15, 12, 30, large, neutralEvil, ChallengeRating.FIVE, 18, 14, 15, 11, 10, 12, languageProfs, null, null, damageModifiers, null, senses, actions, features, equipment);

        name = "Satyr";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, PERFORMANCE_ID, STEALTH_ID));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, ELVISH_ID, SYLVAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Ram", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, ""),
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createActionRange("Shortbow", ARROW_ID, "80/320 ft.", AttackType.ATTACK, 5, 1, DiceSize.SIX, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Magic Resistance", "The satyr has advantage on saving throws against spells and other magical effects")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(SHORTBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, FEY_ID, "", 14, 7, 40, medium, chaoticNeutral, ChallengeRating.HALF, 12, 16, 11, 12, 10, 14, languageProfs, null, skillProfs, null, null, null, actions, features, equipment);

        name = "Shadow";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                radiantVulnerable,
                acidResistant, coldResistant, fireResistant, lightningResistant, thunderResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                necroticImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, FRIGHTENED_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, PRONE_ID, RESTRAINED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Strength Drain", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.SIX, necrotic, DEX_ID, 0, "The target''s Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest. If a non-evil humanoid dies from this attack, a new shadow rises from the corpse 1d4 hours later.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Amorphous", "The shadow can move through a space as narrow as 1 inch wide without squeezing."),
                new MonsterFeatureApi(0, "Shadow Stealth", "While in dim light or darkness, the shadow can take the Hide action as a bonus action."),
                new MonsterFeatureApi(0, "Sunlight Weakness", "While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws.")
        ));
        insert(name, UNDEAD_ID, "", 12, 3, 40, medium, chaoticEvil, ChallengeRating.HALF, 6, 14, 13, 6, 10, 8, null, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Shambling Mound";
        skillProfs = new ArrayList<>(Collections.singletonList(STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant, fireResistant,
                lightningImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(BLINDED_ID, DEAFENED_ID, EXHAUSTION_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The shambling mound makes two slam attacks. If both attacks hit a Medium or smaller target, the target is grappled (escape DC 14), and the shambling mound uses its Engulf on it."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, ""),
                createAction("Engulf", "The shambling mound engulfs a Medium or smaller creature grappled by it. The engulfed target is blinded, restrained, and unable to breathe, and it must succeed on a DC 14 Constitution saving throw at the start of each of the mound''s turns or take 13 (2d8 + 4) bludgeoning damage. If the mound moves, the engulfed target moves with it. The mound can have only one creature engulfed at a time.")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Lightning Absorption", "Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt.")
        ));
        insert(name, PLANT_ID, "", 15, 16, 20, 0, 0, 20, 0, false, 0, large, unaligned, ChallengeRating.FIVE, 18, 8, 16, 5, 10, 5, null, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Shield Guardian";
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, FRIGHTENED_ID, PARALYZED_ID, POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(blindsight10, darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The guardian makes two fist attacks."),
                createAction("Fist", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createReaction("Shield", "When a creature makes an attack against the wearer of the guardian''s amulet, the guardian grants a +2 bonus to the wearer''s AC if the guardian is within 5 feet of the wearer.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Bound", "The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet''s wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet''s wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian."),
                new MonsterFeatureApi(0, "Regeneration", "The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit point"),
                new MonsterFeatureApi(0, "Spell Storing", "A spellcaster who wears the shield guardian''s amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost.")
        ));
        insert(name, CONSTRUCT_ID, "", 17, 15, 30, large, unaligned, ChallengeRating.SEVEN, 18, 8, 18, 7, 10, 3, null, null, null, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Skeleton";
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Shortsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, ""),
                createActionRange("Shortbow", ARROW_ID, "80/320 ft.", AttackType.ATTACK, 4, 1, DiceSize.SIX, piercing, DEX_ID, 0, "")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(SHORTSWORD_ID, "", 1),
                new ListObject(SHORTBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, UNDEAD_ID, "", 13, 2, 30, medium, lawfulEvil, ChallengeRating.QUARTER, 10, 14, 15, 6, 8, 5, null, null, null, skeletonMonsterDamageModifierApis, conditionImmunities, senses, actions, null, equipment);

        name = "Minotaur Skeleton";
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(ABYSSAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Greataxe", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.TWELVE, slashing, STR_ID, 0, ""),
                createAction("Gore", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Charge", "If the skeleton moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(GREATAXE_ID, "", 1)
        ));
        insert(name, UNDEAD_ID, "", 12, 9, 40, large, lawfulEvil, ChallengeRating.TWO, 18, 11, 15, 6, 8, 5, languageProfs, null, null, skeletonMonsterDamageModifierApis, conditionImmunities, senses, actions, features, equipment);

        name = "Warhorse Skeleton";
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        insert(name, UNDEAD_ID, "", 13, 3, 60, large, lawfulEvil, ChallengeRating.HALF, 18, 12, 15, 2, 8, 5, null, null, null, skeletonMonsterDamageModifierApis, conditionImmunities, senses, actions, null, null);

        name = "Specter";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant, coldResistant, fireResistant, lightningResistant, thunderResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                necroticImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Life Drain", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 3, DiceSize.SIX, necrotic, null, 0, "The target must succeed on a DC 10 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the creature finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Incorporeal Movement", "The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."),
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, UNDEAD_ID, "", 12, 5, 0, 0, 0, 0, 50, true, 0, medium, chaoticEvil, ChallengeRating.ONE, 1, 14, 11, 10, 10, 11, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Androsphinx";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, CON_ID, INT_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, PERCEPTION_ID, RELIGION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                psychicImmune, nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        senses = new ArrayList<>(Collections.singletonList(truesight120));
        spells = getSpellIds("'Sacred Flame', 'Spare the Dying', 'Thaumaturgy', 'Command', 'Detect Evil and Good', 'Detect Magic', 'Lesser Restoration', 'Zone of Truth', 'Dispel Magic', 'Tongues', 'Banishment', 'Freedom of Movement', 'Flame Strike', 'Greater Restoration', 'Heroes'' Feast'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The sphinx makes two claw attacks."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 12, 2, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createAction("Roar", MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, "The sphinx emits a magical roar. Each time it roars before finishing a long rest, the roar is louder and the effect is different, as detailed below. Each creature within 500 feet of the sphinx and able to hear the roar must make a saving throw.\\n\\nFirst Roar: Each creature that fails a DC 18 Wisdom saving throw is frightened for 1 minute. A frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\\n\\nSecond Roar: Each creature that fails a DC 18 Wisdom saving throw is deafened and frightened for 1 minute. A frightened creature is paralyzed and can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\\n\\nThird Roar: Each creature makes a DC 18 Constitution saving throw. On a failed save, a creature takes 44 (8d10) thunder damage and is knocked prone. On a successful save, the creature takes half as much damage and isn''t knocked prone."),
                createLegendaryAction("Claw Attack", 1, "The sphinx makes one claw attack."),
                createLegendaryAction("Teleport", 2, "The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."),
                createLegendaryAction("Cast a Spell", 3, "The sphinx casts a spell from its list of prepared spells, using a spell slot as normal."),
                createSpellAction(false, "Sacred Flame", 0, DEX_ID, false, 3, DiceSize.EIGHT, radiant),
                createSpellAction(false, "Flame Strike", 0, DEX_ID, true, 4, DiceSize.SIX, radiant, 5, 1, 1, DiceSize.SIX, radiant)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Inscrutable", "The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx''s intentions or sincerity have disadvantage."),
                new MonsterFeatureApi(0, "Magic Weapons", "The sphinx''s weapon attacks are magical.")
        ));
        insertCaster(name, true, MONSTROSITY_ID, "", 17, 19, 40, 0, 0, 0, 60, false, 0, large, lawfulNeutral, ChallengeRating.SEVENTEEN, 22, 10, 20, 16, 18, 23, "@fullCasterId", "@level12Id", WIS_ID, 0, 0, 4, 3, 3, 3, 2, 1, 0, 0, 0, spells, commonSphinx, savingThrowProfs, skillProfs, damageModifiers, null, senses, actions, features, null);

        name = "Gynosphinx";
        skillProfs = new ArrayList<>(Arrays.asList(ARCANA_ID, HISTORY_ID, PERCEPTION_ID, RELIGION_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                psychicImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, FRIGHTENED_ID));
        senses = new ArrayList<>(Collections.singletonList(truesight120));
        spells = getSpellIds("'Mage Hand', 'Minor Illusion', 'Prestidigitation', 'Detect Magic', 'Identify', 'Shield', 'Darkness', 'Locate Object', 'Suggestion', 'Dispel Magic', 'Remove Curse', 'Tongues', 'Banishment', 'Greater Invisibility', 'Legend Lore'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The sphinx makes two claw attacks."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 8, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createLegendaryAction("Claw Attack", 1, "The sphinx makes one claw attack."),
                createLegendaryAction("Teleport", 2, "The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."),
                createLegendaryAction("Cast a Spell", 3, "The sphinx casts a spell from its list of prepared spells, using a spell slot as normal.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Inscrutable", "The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx''s intentions or sincerity have disadvantage."),
                new MonsterFeatureApi(0, "Magic Weapons", "The sphinx''s weapon attacks are magical.")
        ));
        insertCaster(name, true, MONSTROSITY_ID, "", 17, 16, 40, 0, 0, 0, 60, false, 0, large, lawfulNeutral, ChallengeRating.ELEVEN, 18, 15, 16, 18, 18, 18, "@fullCasterId", "@level9Id", INT_ID, 0, 0, 4, 3, 3, 3, 1, 0, 0, 0, 0, spells, commonSphinx, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Sprite";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, ELVISH_ID, SYLVAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 2, 0, DiceSize.FOUR, slashing, null, 1, ""),
                createActionRange("Shortbow", ARROW_ID, "40/160 ft.", AttackType.ATTACK, 6, 0, DiceSize.FOUR, piercing, null, 1, "The target must succeed on a DC 10 Constitution saving throw or become poisoned for 1 minute. If its saving throw result is 5 or lower, the poisoned target falls unconscious for the same duration, or until it takes damage or another creature takes an action to shake it awake."),
                createAction("Heart Sight", "The sprite touches a creature and magically knows the creature''s current emotional state. If the target fails a DC 10 Charisma saving throw, the sprite also knows the creature''s alignment. Celestials, fiends, and undead automatically fail the saving throw."),
                createAction("Invisibility", "The sprite magically turns invisible until it attacks or casts a spell, or until its concentration ends (as if concentrating on a spell). Any equipment the sprite wears or carries is invisible with it.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(SHORTBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, FEY_ID, "", 15, 1, 10, 0, 0, 0, 40, false, 0, tiny, neutralGood, ChallengeRating.QUARTER, 3, 18, 10, 14, 13, 11, languageProfs, null, skillProfs, null, null, null, actions, null, equipment);

        name = "Stirge";
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Blood Drain", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.FOUR, piercing, DEX_ID, 0, "The stirge attaches to the target. While attached, the stirge doesn''t attack. Instead, at the start of each of the stirge''s turns, the target loses 5 (1d4 + 3) hit points due to blood loss. The stirge can detach itself by spending 5 feet of its movement. It does so after it drains 10 hit points of blood from the target or the target dies. A creature, including the target, can use its action to detach the stirge.")
        ));
        insert(name, BEAST_ID, "", 14, 1, 10, 0, 0, 0, 40, false, 0, tiny, unaligned, ChallengeRating.EIGHTH, 4, 16, 11, 2, 8, 6, null, null, null, null, null, senses, actions, null, null);

        name = "Succubus/Incubus";
        skillProfs = new ArrayList<>(Arrays.asList(DECEPTION_ID, INSIGHT_ID, PERCEPTION_ID, PERSUASION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                coldResistant, fireResistant, lightningResistant, poisonResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant
        ));
        senses = new ArrayList<>(Arrays.asList(darkvision60, telepathy60));
        languageProfs = new ArrayList<>(Arrays.asList(ABYSSAL_ID, COMMON_ID, INFERNAL_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Claw (Fiend Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 5, 1, DiceSize.SIX, slashing, DEX_ID, 0, ""),
                createAction("Charm", "One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed target obeys the fiend''s verbal or telepathic commands. If the target suffers any harm or receives a suicidal command, it can repeat the saving throw, ending the effect on a success. If the target successfully saves against the effect, or if the effect on it ends, the target is immune to this fiend''s Charm for the next 24 hours.\\n\\nThe fiend can have only one target charmed at a time. If it charms another, the effect on the previous target ends."),
                createActionSave("Draining Kiss", 15, CON_ID, true, 5, DiceSize.TEN, psychic, CHA_ID, 0, "The fiend kisses a creature charmed by it or a willing creature. The target must make a DC 15 Constitution saving throw against this magic, taking 32 (5d10 + 5) psychic damage on a failed save, or half as much damage on a successful one. The target''s hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."),
                createAction("Etherealness", "The fiend magically enters the Ethereal Plane from the Material Plane, or vice versa.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Telepathic Bond", "The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed. The two don''t even need to be on the same plane of existence."),
                new MonsterFeatureApi(0, "Shapechanger", "The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its flying speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn''t transformed. It reverts to its true form if it dies.")
        ));
        insert(name, FIEND_ID, shapeChanger, 15, 12, 30, 0, 0, 0, 60, false, 0, medium, neutralEvil, ChallengeRating.FOUR, 8, 17, 13, 15, 12, 20, languageProfs, null, skillProfs, damageModifiers, null, senses, actions, features, null);

        name = "Tarrasque";
        savingThrowProfs = new ArrayList<>(Arrays.asList(INT_ID, WIS_ID, CHA_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                fireImmune, poisonImmune, nonmagicalBludgeoningImmune, nonmagicalPiercingImmune, nonmagicalSlashingImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, FRIGHTENED_ID, PARALYZED_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(blindsight120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 19, 4, DiceSize.TWELVE, piercing, STR_ID, 0, "Reach 10 ft, one target: If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can''t bite another target."),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 19, 4, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Horns", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 19, 4, DiceSize.TEN, piercing, STR_ID, 0, ""),
                createAction("Tail", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 19, 4, DiceSize.SIX, bludgeoning, STR_ID, 0, "If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone."),
                createAction("Frightful Presence", "Each creature of the tarrasque''s choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature''s saving throw is successful or the effect ends for it, the creature is immune to the tarrasque''s Frightful Presence for the next 24 hours."),
                createAction("Swallow", "The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite''s damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque''s turns.\\n\\nIf the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the tarrasque. If the tarrasque dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 30 feet of movement, exiting prone."),
                createLegendaryAction("Attack", 1, "The tarrasque makes one claw attack or tail attack."),
                createLegendaryAction("Move", 1, "The tarrasque moves up to half its speed."),
                createLegendaryAction("Chomp", 2, "The tarrasque makes one bite attack or uses its Swallow.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the tarrasque fails a saving throw, it can choose to succeed instead."),
                new MonsterFeatureApi(0, "Magic Resistance", "The tarrasque has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Reflective Carapace", "Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target."),
                new MonsterFeatureApi(0, "Siege Monster", "The tarrasque deals double damage to objects and structures.")
        ));
        insert(name, true, MONSTROSITY_ID, titan, 25, 33, 40, gargantuan, unaligned, ChallengeRating.THIRTY, 30, 11, 30, 3, 11, 11, null, savingThrowProfs, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Treant";
        damageModifiers = new ArrayList<>(Arrays.asList(
                fireVulnerable,
                bludgeoningResistant, piercingResistant
        ));
        languageProfs = new ArrayList<>(Arrays.asList(COMMON_ID, DRUIDIC_ID, ELVISH_ID, SYLVAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The treant makes two slam attacks."),
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 10, 3, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createActionRange("Rock", 0, "60/180 ft.", AttackType.ATTACK, 10, 4, DiceSize.TEN, bludgeoning, STR_ID, 0, ""),
                createAction("Animate Trees", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "The treant magically animates one or two trees it can see within 60 feet of it. These trees have the same statistics as a treant, except they have Intelligence and Charisma scores of 1, they can''t speak, and they have only the Slam action option. An animated tree acts as an ally of the treant. The tree remains animate for 1 day or until it dies; until the treant dies or is more than 120 feet from the tree; or until the treant takes a bonus action to turn it back into an inanimate tree. The tree then takes root if possible.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "False Appearance", "While the treant remains motionless, it is indistinguishable from a normal tree."),
                new MonsterFeatureApi(0, "Siege Monster", "The treant deals double damage to objects and structures.")
        ));
        insert(name, PLANT_ID, "", 16, 12, 30, huge, chaoticGood, ChallengeRating.NINE, 23, 8, 21, 12, 16, 12, languageProfs, null, null, damageModifiers, null, null, actions, features, null);

        name = "Troll";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The troll makes three attacks: one with its bite and two with its claws."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.SIX, piercing, STR_ID, 0, ""),
                createAction("Claw", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, slashing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Keen Smell", "The troll has advantage on Wisdom (Perception) checks that rely on smell."),
                new MonsterFeatureApi(0, "Regeneration", "The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn''t function at the start of the troll''s next turn. The troll dies only if it starts its turn with 0 hit points and doesn''t regenerate.")
        ));
        insert(name, GIANT_ID, "", 15, 8, 30, large, chaoticEvil, ChallengeRating.FIVE, 18, 13, 20, 7, 9, 7, giant, null, skillProfs, null, null, senses, actions, features, null);

        name = "Unicorn";
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, PARALYZED_ID, POISONED_ID));
        senses = new ArrayList<>(Arrays.asList(darkvision60, telepathy60));
        languageProfs = new ArrayList<>(Arrays.asList(CELESTIAL_ID, ELVISH_ID, SYLVAN_ID));
        innateSpells = getSpellIds("'Detect Evil and Good', 'Druidcraft', 'Pass without Trace', 'Calm Emotions', 'Dispel Evil and Good', 'Entangle'");
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The unicorn makes two attacks: one with its hooves and one with its horn."),
                createAction("Hooves", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, bludgeoning, STR_ID, 0, ""),
                createAction("Horn", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 1, DiceSize.EIGHT, piercing, STR_ID, 0, ""),
                createAction("Healing Touch", MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, "The unicorn touches another creature with its horn. The target magically regains 11 (2d8 + 2) hit points. In addition, the touch removes all diseases and neutralizes all poisons afflicting the target."),
                createAction("Teleport", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "The unicorn magically teleports itself and up to three willing creatures it can see within 5 feet of it, along with any equipment they are wearing or carrying, to a location the unicorn is familiar with, up to 1 mile away."),
                createLegendaryAction("Hooves", 1, "The unicorn makes one attack with its hooves."),
                createLegendaryAction("Shimmering Shield", 2, "The unicorn creates a shimmering, magical field around itself or another creature it can see within 60 feet of it. The target gains a +2 bonus to AC until the end of the unicorn''s next turn."),
                createLegendaryAction("Heal Self", 3, "The unicorn magically regains 11 (2d8 + 2) hit points."),
                createSpellAction(true, "Detect Evil and Good", 0),
                createSpellAction(true, "Druidcraft", 0),
                createSpellAction(true, "Pass without Trace", 0),
                createSpellAction(true, "Calm Emotions", 1),
                createSpellAction(true, "Dispel Evil and Good", 1),
                createSpellAction(true, "Entangle", 1)
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Charge", "If the unicorn moves at least 20 feet straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."),
                new MonsterFeatureApi(0, "Magic Resistance", "The unicorn has advantage on saving throws against spells and other magical effects."),
                new MonsterFeatureApi(0, "Magic Weapons", "The unicorn''s weapon attacks are magical.")
        ));
        insertInnate(name, true, CELESTIAL_ID, "", 12, 9, 50, 0, 0, 0, 0, false, 0, large, lawfulGood, ChallengeRating.FIVE, 18, 14, 15, 11, 17, 16, CHA_ID, 0, 0, innateSpells,  languageProfs, null, null, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Vampire";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, WIS_ID, CHA_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack (Vampire Form Only)", "The vampire makes two attacks, only one of which can be a bite attack."),
                createAction("Unarmed Strike (Vampire Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 1, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "Instead of dealing damage, the vampire can grapple the target (escape DC 18)."),
                createAction("Bite (Bat or Vampire Form Only)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 9, 1, DiceSize.SIX, piercing, STR_ID, 0, 3, DiceSize.SIX, necrotic, null, 0, "One willing creature, or a creature that is grappled by the vampire, incapacitated or restrained: The target''s hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire''s control."),
                createAction("Charm", "The vampire targets one humanoid it can see within 30 feet of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn''t under the vampire''s control, it takes the vampire''s requests or actions in the most favorable way it can, and it is a willing target for the vampire''s bite attack. Each time the vampire or the vampire''s companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect."),
                createAction("Children of the Night", MonsterLimitedUseType.NUM_PER_DAY, 1, 0, 0, "The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn''t up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action."),
                createLegendaryAction("Move", 1, "The vampire moves up to its speed without provoking opportunity attacks"),
                createLegendaryAction("Unarmed Strike", 1, "The vampire makes one unarmed strike."),
                createLegendaryAction("Bite", 2, "The vampire makes one bite attack.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Shapechanger", "If the vampire isn''t in sunlight or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\\n\\nWhile in bat form, the vampire can''t speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\\n\\nWhile in mist form, the vampire can''t take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature''s space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can''t pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight"),
                new MonsterFeatureApi(0, "Legendary Resistance", true, MonsterLimitedUseType.NUM_PER_DAY, 3, 0, 0, false, false, "If the vampire fails a saving throw, it can choose to succeed instead."),
                new MonsterFeatureApi(0, "Misty Escape", "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn''t in sunlight or running water. If it can''t transform, it is destroyed.\\n\\nWhile it has 0 hit points in mist form, it can''t revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point."),
                new MonsterFeatureApi(0, "Regeneration", "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn''t in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn''t function at the start of the vampire''s next turn."),
                new MonsterFeatureApi(0, "Spider Climb", "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Vampire Weaknesses", "The vampire has the following flaws:\\n\\nForbiddance. The vampire can''t enter a residence without an invitation from one of the occupants.\\n\\nHarmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water.\\n\\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire''s heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed.\\n\\nSunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.")
        ));
        insert(name, true, UNDEAD_ID, shapeChanger, 16, 17, 30, medium, lawfulEvil, ChallengeRating.THIRTEEN, 18, 18, 18, 17, 15, 18, null, savingThrowProfs, skillProfs, vampireMonsterDamageModifierApis, null, senses, actions, features, null);

        name = "Vampire Spawn";
        savingThrowProfs = new ArrayList<>(Arrays.asList(DEX_ID, WIS_ID));
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The vampire makes two attacks, only one of which can be a bite attack."),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.FOUR, bludgeoning, STR_ID, 0, "Instead of dealing damage, the vampire can grapple the target (escape DC 13)."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.SIX, piercing, STR_ID, 0, 2, DiceSize.SIX, necrotic, null, 0, "One willing creature, or a creature that is grappled by the vampire, incapacitated or restrained: The target''s hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Regeneration", "The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn''t in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn''t function at the start of the vampire''s next turn."),
                new MonsterFeatureApi(0, "Spider Climb", "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."),
                new MonsterFeatureApi(0, "Vampire Weaknesses", "The vampire has the following flaws:\\n\\nForbiddance. The vampire can''t enter a residence without an invitation from one of the occupants.\\n\\nHarmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water.\\n\\nStake to the Heart. The vampire is destroyed if a piercing weapon made of wood is driven into its heart while it is incapacitated in its resting place.\\n\\nSunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.")
        ));
        insert(name, UNDEAD_ID, "", 15, 11, 30, medium, neutralEvil, ChallengeRating.FIVE, 16, 16, 16, 11, 10, 12, null, savingThrowProfs, skillProfs, vampireMonsterDamageModifierApis, null, senses, actions, features, null);

        name = "Wight";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                necroticResistant, silveredBludgeoningResistant, silveredPiercingResistant, silveredSlashingResistant,
                poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The wight makes two longsword attacks or two longbow attacks. It can use its Life Drain in place of one longsword attack."),
                createAction("Life Drain", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.SIX, necrotic, CHA_ID, 0, "The target must succeed on a DC 13 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.\\n\\nA humanoid slain by this attack rises 24 hours later as a zombie under the wight''s control, unless the humanoid is restored to life or its body is destroyed. The wight can have no more than twelve zombies under its control at one time."),
                createAction("Longsword", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Longsword (Two-Hands)", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 1, DiceSize.TEN, slashing, STR_ID, 0, ""),
                createActionRange("Longbow", ARROW_ID, "150/600 ft.", AttackType.ATTACK, 4, 1, DiceSize.EIGHT, piercing, DEX_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.")
        ));
        equipment = new ArrayList<>(Arrays.asList(
                new ListObject(LONGSWORD_ID, "", 1),
                new ListObject(LONGBOW_ID, "", 1),
                new ListObject(ARROW_ID, "", 20)
        ));
        insert(name, UNDEAD_ID, "", 14, 6, 30, medium, neutralEvil, ChallengeRating.THREE, 15, 14, 16, 10, 13, 15, null, null, skillProfs, damageModifiers, conditionImmunities, senses, actions, features, equipment);

        name = "Will-o''-Wisp";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant, coldResistant, fireResistant, necroticResistant, thunderResistant, nonmagicalBludgeoningResistant, nonmagicalPiercingResistant, nonmagicalSlashingResistant,
                lightningImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID, UNCONSCIOUS_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision120));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Shock", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 4, 2, DiceSize.EIGHT, lightning, null, 0, ""),
                createAction("Invisibility", "The will-o''-wisp and its light magically become invisible until it attacks or uses its Consume Life, or until its concentration ends (as if concentrating on a spell).")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Consume Life", "As a bonus action, the will-o''-wisp can target one creature it can see within 5 feet of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o''-wisp regains 10 (3d6) hit points."),
                new MonsterFeatureApi(0, "Ephemeral", "The will-o''-wisp can''t wear or carry anything."),
                new MonsterFeatureApi(0, "Incorporeal Movement", "The will-o''-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."),
                new MonsterFeatureApi(0, "Variable Illumination", "The will-o''-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of feet equal to the chosen radius. The will-o''-wisp can alter the radius as a bonus action.")
        ));
        insert(name, UNDEAD_ID, "", 19, 9, 0, 0, 0, 0, 50, true, 0, tiny, chaoticEvil, ChallengeRating.TWO, 1, 28, 10, 13, 14, 11, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Wraith";
        damageModifiers = new ArrayList<>(Arrays.asList(
                acidResistant, coldResistant, fireResistant, lightningResistant, thunderResistant, silveredBludgeoningResistant, silveredPiercingResistant, silveredSlashingResistant,
                necroticImmune, poisonImmune
        ));
        conditionImmunities = new ArrayList<>(Arrays.asList(CHARMED_ID, EXHAUSTION_ID, GRAPPLED_ID, PARALYZED_ID, PETRIFIED_ID, POISONED_ID, PRONE_ID, RESTRAINED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Life Drain", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 4, DiceSize.EIGHT, necrotic, DEX_ID, 0, "The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."),
                createAction("Create Specter", "The wraith targets a humanoid within 10 feet of it that has been dead for no longer than 1 minute and died violently. The target''s spirit rises as a specter in the space of its corpse or in the nearest unoccupied space. The specter is under the wraith''s control. The wraith can have no more than seven specters under its control at one time.")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Incorporeal Movement", "The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."),
                new MonsterFeatureApi(0, "Sunlight Sensitivity", "While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.")
        ));
        insert(name, UNDEAD_ID, "", 13, 9, 0, 0, 0, 0, 60, true, 0, medium, neutralEvil, ChallengeRating.FIVE, 6, 16, 16, 12, 14, 15, null, null, null, damageModifiers, conditionImmunities, senses, actions, features, null);

        name = "Wyvern";
        skillProfs = new ArrayList<>(Collections.singletonList(PERCEPTION_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack."),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, piercing, STR_ID, 0, "Reach 10 ft., one creature"),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.EIGHT, slashing, STR_ID, 0, ""),
                createAction("Stinger", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 7, 2, DiceSize.SIX, piercing, STR_ID, 0, "Reach 10 ft, one creature: The target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.")
        ));
        insert(name, DRAGON_ID, "", 13, 13, 20, 0, 0, 0, 80, false, 0, large, unaligned, ChallengeRating.SIX, 19, 10, 16, 5, 12, 6, null, null, skillProfs, null, null, senses, actions, null, null);

        name = "Xorn";
        skillProfs = new ArrayList<>(Arrays.asList(PERCEPTION_ID, STEALTH_ID));
        damageModifiers = new ArrayList<>(Arrays.asList(
                adamantinePiercingResistant, adamantineSlashingResistant
        ));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        languageProfs = new ArrayList<>(Collections.singletonList(TERRAN_ID));
        actions = new ArrayList<>(Arrays.asList(
                createAction("Multiattack", "The xorn makes three claw attacks and one bite attack."),
                createAction("Claws", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 1, DiceSize.SIX, slashing, STR_ID, 0, ""),
                createAction("Bite", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 3, DiceSize.SIX, piercing, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Arrays.asList(
                new MonsterFeatureApi(0, "Earth Glide", "The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn''t disturb the material it moves through."),
                new MonsterFeatureApi(0, "Stone Camouflage", "The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."),
                new MonsterFeatureApi(0, "Treasure Sense", "The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 feet of it.")
        ));
        insert(name, ELEMENTAL_ID, "", 19, 7, 20, 0, 0, 0, 0, false, 20, medium, neutral, ChallengeRating.FIVE, 17, 10, 22, 11, 10, 11, languageProfs, null, skillProfs, damageModifiers, null, senses, actions, features, null);

        name = "Zombie";
        savingThrowProfs = new ArrayList<>(Collections.singletonList(WIS_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Slam", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 3, 1, DiceSize.SIX, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Undead Fortitude", "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.")
        ));
        insert(name, UNDEAD_ID, "", 8, 3, 20, medium, neutralEvil, ChallengeRating.QUARTER, 13, 6, 16, 3, 6, 5, null, savingThrowProfs, null, poisonImmuneList, conditionImmunities, senses, actions, features, null);

        name = "Ogre Zombie";
        savingThrowProfs = new ArrayList<>(Collections.singletonList(WIS_ID));
        conditionImmunities = new ArrayList<>(Collections.singletonList(POISONED_ID));
        senses = new ArrayList<>(Collections.singletonList(darkvision60));
        actions = new ArrayList<>(Collections.singletonList(
                createAction("Morningstar", MonsterActionAttackType.WEAPON_MELEE, AttackType.ATTACK, 6, 2, DiceSize.EIGHT, bludgeoning, STR_ID, 0, "")
        ));
        features = new ArrayList<>(Collections.singletonList(
                new MonsterFeatureApi(0, "Undead Fortitude", "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.")
        ));
        equipment = new ArrayList<>(Collections.singletonList(
                new ListObject(MORNINGSTAR_ID, "", 1)
        ));
        insert(name, UNDEAD_ID, "", 8, 9, 30, medium, neutralEvil, ChallengeRating.TWO, 19, 6, 18, 3, 6, 5, null, savingThrowProfs, null, poisonImmuneList, conditionImmunities, senses, actions, features, equipment);

        initializeMisc();
    }
}
