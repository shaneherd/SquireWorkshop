package com.herd.squire.services.monsters.api;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.SpeedType;
import com.herd.squire.models.SpellSlots;
import com.herd.squire.models.damages.DamageModifierType;
import com.herd.squire.models.items.ItemQuantity;
import com.herd.squire.models.monsters.ChallengeRating;
import com.herd.squire.models.monsters.InnateSpellConfiguration;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.services.powers.PowerApiService;

import java.util.ArrayList;
import java.util.List;

public class MonsterApi {
    private String sid;
    public String id;
    public String name;
    public String monsterType;
    public String typeVariation;
    public int ac;
    public int hpNumDice;
    public DiceSize hpDiceSize;
    public int hpMod;
    public int speed;
    public int crawling;
    public int climbing;
    public int swimming;
    public int flying;
    public boolean hover;
    public int burrow;
    public String size;
    public String alignment;
    public ChallengeRating challengeRating;
    public int exp;
    public int str;
    public int dex;
    public int con;
    public int intelligence;
    public int wis;
    public int cha;

    public boolean spellcaster;
    public boolean innateSpellcaster;
    public String spellcastingAbilityId;
    public String innateSpellcastingAbilityId;
    public int spellSaveDCMod;
    public int spellAttackMod;
    public int innateSpellSaveDCMod;
    public int innateSpellAttackMod;
    public SpellSlots spellSlots;
    public int legendaryPoints;
    public String casterTypeId;
    public String casterLevelId;
    public String innateCasterLevelId;

    public List<String> spellIds;
    public List<String> innateSpellIds;
    public List<InnateSpellConfiguration> innateSpells;

    public List<String> skillProfs;
    public List<String> languageProfs;
    public List<String> savingThrowProfs;
    public List<MonsterDamageModifierApi> damageModifiers;
    public List<String> conditionImmunities;
    public List<MonsterSenseApi> senses;

    public List<MonsterActionApi> actions;
    public List<MonsterFeatureApi> features;
    public List<ItemQuantity> items;

    public MonsterApi(String name, String monsterType, String typeVariation, int ac, int hpNumDice, DiceSize hpDiceSize,
                      int hpMod, int speed, int crawling, int climbing, int swimming, int flying, boolean hover, int burrow,
                      String size, String alignment, ChallengeRating challengeRating, int exp, int str, int dex, int con,
                      int intelligence, int wis, int cha, boolean spellcaster, boolean innateSpellcaster, String casterTypeId, String casterLevelId, String spellcastingAbilityId,
                      String innateSpellcastingAbilityId, int spellSaveDCMod, int spellAttackMod, int innateSpellSaveDCMod,
                      int innateSpellAttackMod, SpellSlots spellSlots, int legendaryPoints, List<String> spellIds,
                      List<String> innateSpellIds, List<String> skillProfs,
                      List<String> languageProfs, List<String> savingThrowProfs, List<MonsterDamageModifierApi> damageModifiers,
                      List<String> conditionImmunities, List<MonsterSenseApi> senses, List<MonsterActionApi> actions,
                      List<MonsterFeatureApi> features, List<ItemQuantity> items) {
        this.id = PowerApiService.getIdValue(name);
        this.name = name;
        this.monsterType = monsterType;
        this.typeVariation = typeVariation;
        this.ac = ac;
        this.hpNumDice = hpNumDice;
        this.hpDiceSize = hpDiceSize;
        this.hpMod = hpMod;
        this.speed = speed;
        this.crawling = crawling;
        this.climbing = climbing;
        this.swimming = swimming;
        this.flying = flying;
        this.hover = hover;
        this.burrow = burrow;
        this.size = size;
        this.alignment = alignment;
        this.challengeRating = challengeRating;
        this.exp = exp;
        this.str = str;
        this.dex = dex;
        this.con = con;
        this.intelligence = intelligence;
        this.wis = wis;
        this.cha = cha;
        this.spellcaster = spellcaster;
        this.innateSpellcaster = innateSpellcaster;
        this.casterTypeId = casterTypeId;
        this.casterLevelId = casterLevelId;
        this.spellcastingAbilityId = spellcastingAbilityId;
        this.innateSpellcastingAbilityId = innateSpellcastingAbilityId;
        this.spellSaveDCMod = spellSaveDCMod;
        this.spellAttackMod = spellAttackMod;
        this.innateSpellSaveDCMod = innateSpellSaveDCMod;
        this.innateSpellAttackMod = innateSpellAttackMod;
        this.spellSlots = spellSlots;
        this.legendaryPoints = legendaryPoints;
        this.spellIds = spellIds;
        this.innateSpellIds = innateSpellIds;
        this.skillProfs = skillProfs;
        this.languageProfs = languageProfs;
        this.savingThrowProfs = savingThrowProfs;
        this.damageModifiers = damageModifiers;
        this.conditionImmunities = conditionImmunities;
        this.senses = senses;
        this.actions = actions;
        this.features = features;
        this.items = items;

        this.updateInnateSpells();
        this.removeSpellActions();
    }

    private void updateInnateSpells() {
        this.innateCasterLevelId = getInnateCasterLevelId();
        this.innateSpells = new ArrayList<>();
        for (String spellId : innateSpellIds) {
            InnateSpellConfiguration innateSpellConfiguration = new InnateSpellConfiguration();
            innateSpellConfiguration.setSpell(new ListObject(spellId, "", 0, false));
            innateSpellConfiguration.setLimitedUse(getInnateSpellLimitedUse(spellId));
            this.innateSpells.add(innateSpellConfiguration);
        }
    }

    private LimitedUse getInnateSpellLimitedUse(String spellId) {
        for (MonsterActionApi action : actions) {
            if (spellId.equals(action.spell)) {
                return action.limitedUse;
            }
        }
        return null;
    }

    private void removeSpellActions() {
        for (int i = 0; i < this.actions.size(); i++) {
            MonsterActionApi action = this.actions.get(i);
            if (action.spell != null || action.monsterActionAttackType == MonsterActionAttackType.SPELL || action.nonAttackSpell) {
                this.actions.remove(i);
                i--;
            }
        }
    }

    private String getInnateCasterLevelId() {
        if (!innateSpellcaster) {
            return "null";
        }
        switch (challengeRating) {
            case ZERO:
            case EIGHTH:
            case QUARTER:
            case HALF:
            case ONE:
                return "@level1Id";
            case TWO:
                return "@level2Id";
            case THREE:
                return "@level3Id";
            case FOUR:
                return "@level4Id";
            case FIVE:
                return "@level5Id";
            case SIX:
                return "@level6Id";
            case SEVEN:
                return "@level7Id";
            case EIGHT:
                return "@level8Id";
            case NINE:
                return "@level9Id";
            case TEN:
                return "@level10Id";
            case ELEVEN:
                return "@level11Id";
            case TWELVE:
                return "@level12Id";
            case THIRTEEN:
                return "@level13Id";
            case FOURTEEN:
                return "@level14Id";
            case FIFTEEN:
                return "@level15Id";
            case SIXTEEN:
                return "@level16Id";
            case SEVENTEEN:
                return "@level17Id";
            case EIGHTEEN:
                return "@level18Id";
            case NINETEEN:
                return "@level19Id";
            case TWENTY:
            case TWENTY_ONE:
            case TWENTY_TWO:
            case TWENTY_THREE:
            case TWENTY_FOUR:
            case TWENTY_FIVE:
            case TWENTY_SIX:
            case TWENTY_SEVEN:
            case TWENTY_EIGHT:
            case TWENTY_NINE:
            case THIRTY:
                return "@level20Id";
        }

        return "null";
    }

    private String quoted(String string) {
        return "'" + string + "'";
    }

    public String getMonsterRow(int sid) {
        this.sid = String.valueOf(sid);
        List<String> parts = new ArrayList<>();
        parts.add(quoted(name));
        parts.add(monsterType);
        parts.add(quoted(typeVariation));
        parts.add(size);
        parts.add(String.valueOf(challengeRating.getId()));
        parts.add(String.valueOf(exp));
        parts.add(String.valueOf(hpNumDice));
        parts.add(PowerApiService.getDiceId(getDice(hpDiceSize)));
        parts.add("@conId"); //hit_dice_ability_modifier_id,
        parts.add(String.valueOf(hpMod));
        parts.add(String.valueOf(legendaryPoints));
        parts.add("''"); //description,
        parts.add(String.valueOf(ac));
        parts.add(hover ? "1": "0");
        parts.add(spellcaster ? "1" : "0");
        parts.add(casterTypeId);
        parts.add(casterLevelId);
        parts.add(String.valueOf(spellAttackMod));
        parts.add(String.valueOf(spellSaveDCMod));
        parts.add(spellcastingAbilityId);
        parts.add(innateSpellcaster ? "1" : "0");
        parts.add(innateCasterLevelId);
        parts.add(String.valueOf(innateSpellAttackMod));
        parts.add(String.valueOf(innateSpellSaveDCMod));
        parts.add(innateSpellcastingAbilityId);
        parts.add(alignment);
        parts.add("userId");
        parts.add(String.valueOf(sid));
        return PowerApiService.getRow(parts);
    }

    public String getIdRow() {
        return "SET " + id + " = (SELECT id FROM monsters WHERE user_id = userId AND sid = " + sid + ");";
    }

    private String getDice(DiceSize diceSize) {
        switch (diceSize) {
            case ONE:
                return "1";
            case TWO:
                return "2";
            case THREE:
                return "3";
            case FOUR:
                return "4";
            case SIX:
                return "6";
            case EIGHT:
                return "8";
            case TEN:
                return "10";
            case TWELVE:
                return "12";
            case TWENTY:
                return "20";
            case HUNDRED:
                return "100";
        }
        return "1";
    }

    /********************* Ability Scores ***********************/

    public List<String> getAbilityScores() {
        List<String> abilityScores = new ArrayList<>();
        abilityScores.add(getAbilityScore("@strId", str));
        abilityScores.add(getAbilityScore("@dexId", dex));
        abilityScores.add(getAbilityScore("@conId", con));
        abilityScores.add(getAbilityScore("@intId", intelligence));
        abilityScores.add(getAbilityScore("@wisId", wis));
        abilityScores.add(getAbilityScore("@chaId", cha));
        return abilityScores;
    }

    private String getAbilityScore(String abilityId, int value) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id,
        parts.add(abilityId); //ability_id,
        parts.add(String.valueOf(value)); //value
        return PowerApiService.getRow(parts);
    }

    /********************* Speeds ***********************/

    public List<String> getSpeeds() {
        List<String> speeds = new ArrayList<>();
        speeds.add(getSpeed(String.valueOf(SpeedType.WALK.getValue()), speed));
        speeds.add(getSpeed(String.valueOf(SpeedType.CRAWL.getValue()), crawling));
        speeds.add(getSpeed(String.valueOf(SpeedType.CLIMB.getValue()), climbing));
        speeds.add(getSpeed(String.valueOf(SpeedType.SWIM.getValue()), swimming));
        speeds.add(getSpeed(String.valueOf(SpeedType.FLY.getValue()), flying));
        speeds.add(getSpeed(String.valueOf(SpeedType.BURROW.getValue()), burrow));
        return speeds;
    }

    private String getSpeed(String speedId, int value) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id,
        parts.add(speedId); //speed_id,
        parts.add(String.valueOf(value)); //value
        return PowerApiService.getRow(parts);
    }

    /********************* Senses ***********************/

    public List<String> getSenses() {
        List<String> rows = new ArrayList<>();
        for (MonsterSenseApi sense : senses) {
            String row = getSenseRow(sense);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    private String getSenseRow(MonsterSenseApi sense) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id
        parts.add(String.valueOf(sense.getType().getValue())); //sense_id
        parts.add(String.valueOf(sense.getRange())); //range
        return PowerApiService.getRow(parts);
    }

    /********************* Damage Modifiers ***********************/

    public List<String> getDamageModifiers() {
        List<String> rows = new ArrayList<>();
        for (MonsterDamageModifierApi modifier : damageModifiers) {
            if (modifier.getDamageModifierType() != DamageModifierType.NORMAL) {
                String row = getDamageModifierRow(modifier);
                if (!row.equals("")) {
                    rows.add(row);
                }
            }
        }
        return rows;
    }

    private String getDamageModifierType(DamageModifierType damageModifierType) {
        switch (damageModifierType) {
            case NORMAL:
                return "@normalDamageModifierTypeId";
            case VULNERABLE:
                return "@vulnerableDamageModifierTypeId";
            case RESISTANT:
                return "@resistantDamageModifierTypeId";
            case IMMUNE:
                return "@immuneDamageModifierTypeId";
        }
        return null;
    }

    private String getDamageModifierRow(MonsterDamageModifierApi modifier) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id
        parts.add(modifier.getDamageType()); //damage_type_id
        parts.add(getDamageModifierType(modifier.getDamageModifierType())); //damage_modifier_type_id
        parts.add(quoted(modifier.getCondition())); //condition - todo - handle condition (silvered, non-magical)
        return PowerApiService.getRow(parts);
    }

    /********************* Condition Immunities ***********************/

    public List<String> getConditionImmunities() {
        List<String> rows = new ArrayList<>();
        for (String condition : conditionImmunities) {
            String row = getConditionRow(condition);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    private String getConditionRow(String condition) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id
        parts.add(condition); //condition_id
        return PowerApiService.getRow(parts);
    }

    /********************* Attribute Profs ***********************/

    public List<String> getAttributeProfs() {
        List<String> rows = getAttributeProfRows(skillProfs);
        rows.addAll(getAttributeProfRows(languageProfs));
        rows.addAll(getAttributeProfRows(savingThrowProfs));
        return rows;
    }

    private List<String> getAttributeProfRows(List<String> profs) {
        List<String> rows = new ArrayList<>();
        for (String prof : profs) {
            String row = getAttributeProfRow(prof);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    private String getAttributeProfRow(String attribute) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id,
        parts.add(attribute); //attribute_id,
        return PowerApiService.getRow(parts);
    }

    /********************* Item Profs ***********************/

    public List<String> getItemProfs() {
        //todo?
//        List<String> rows = getItemProfRows(skillProfs);
//        rows.addAll(getItemProfRows(languageProfs));
//        rows.addAll(getItemProfRows(savingThrowProfs));
//        return rows;
        return new ArrayList<>();
    }

    private List<String> getItemProfRows(List<String> profs) {
        List<String> rows = new ArrayList<>();
        for (String prof : profs) {
            String row = getItemProfRow(prof);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    private String getItemProfRow(String item) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id,
        parts.add(item); //item_id,
        return PowerApiService.getRow(parts);
    }

    /********************* Spell Slots ***********************/

    public String getSpellSlots() {
        //todo - if caster type is not null, set these as 0
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id,
        parts.add(String.valueOf(spellSlots.getSlot1())); //slot_1,
        parts.add(String.valueOf(spellSlots.getSlot2())); //slot_2,
        parts.add(String.valueOf(spellSlots.getSlot3())); //slot_3,
        parts.add(String.valueOf(spellSlots.getSlot4())); //slot_4,
        parts.add(String.valueOf(spellSlots.getSlot5())); //slot_5,
        parts.add(String.valueOf(spellSlots.getSlot6())); //slot_6,
        parts.add(String.valueOf(spellSlots.getSlot7())); //slot_7,
        parts.add(String.valueOf(spellSlots.getSlot8())); //slot_8,
        parts.add(String.valueOf(spellSlots.getSlot9())); //slot_9
        return PowerApiService.getRow(parts);
    }

    /********************* Spell Configurations ***********************/

    public List<String> getSpellConfigurations() {
        List<String> rows = new ArrayList<>();
        for (String spell : spellIds) {
            String row = getSpellRow(spell);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    private String getSpellRow(String spell) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id
        parts.add(spell); //spell_id
        return PowerApiService.getRow(parts);
    }

    /********************* Innate Spell Configurations ***********************/

    public List<String> getInnateSpellConfigurations() {
        List<String> rows = new ArrayList<>();
        for (InnateSpellConfiguration innateSpell : innateSpells) {
            String row = getInnateSpellRow(innateSpell);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    private String getInnateSpellRow(InnateSpellConfiguration config) {
        LimitedUse limitedUse = config.getLimitedUse();
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id
        parts.add(config.getSpell().getId()); //spell_id
        parts.add(limitedUse == null ? "null": String.valueOf(limitedUse.getLimitedUseType().getValue())); //limited_use_type_id
        parts.add(limitedUse == null ? "0" : String.valueOf(limitedUse.getQuantity())); //quantity
        parts.add("null"); //ability_modifier_id
        parts.add("null"); //dice_size_id
        return PowerApiService.getRow(parts);
    }

    /********************* Monster Powers ***********************/

    public List<String> getPowerRows(int sid) {
        List<String> rows = new ArrayList<>();
        for (MonsterFeatureApi monsterFeature : features) {
            String row = monsterFeature.getMonsterPowerRow(sid, id);
            if (!row.equals("")) {
                rows.add(row);
                sid++;
            }
        }

        for (MonsterActionApi monsterAction : actions) {
            String row = monsterAction.getMonsterPowerRow(sid, id);
            if (!row.equals("")) {
                rows.add(row);
                sid++;
            }
        }
        return rows;
    }

    public List<String> getMonsterPowerIds() {
        List<String> rows = new ArrayList<>();
        for (MonsterFeatureApi monsterFeature : features) {
            String row = monsterFeature.getIdRow(id);
            if (!row.equals("")) {
                rows.add(row);
            }
        }

        for (MonsterActionApi monsterAction : actions) {
            String row = monsterAction.getIdRow(id);
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    public List<String> getFeatures() {
        List<String> rows = new ArrayList<>();
        for (MonsterFeatureApi monsterFeature : features) {
            String row = monsterFeature.getFeatureRow();
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    public List<String> getActions() throws Exception {
        List<String> rows = new ArrayList<>();
        for (MonsterActionApi monsterAction : actions) {
            String row = monsterAction.getActionRow();
            if (!row.equals("")) {
                rows.add(row);
            }
        }
        return rows;
    }

    public List<String> getActionDamages() {
        List<String> rows = new ArrayList<>();
        for (MonsterActionApi monsterAction : actions) {
            rows.addAll(monsterAction.getActionDamageRows());
        }
        return rows;
    }

    public List<String> getLimitedUses() {
        List<String> rows = new ArrayList<>();
        for (MonsterFeatureApi monsterFeature : features) {
            String row = monsterFeature.getLimitedUseRow();
            if (!row.equals("")) {
                rows.add(row);
            }
        }

        for (MonsterActionApi monsterAction : actions) {
            String row = monsterAction.getLimitedUseRow();
            if (!row.equals("")) {
                rows.add(row);
            }
        }

        return rows;
    }

    public List<String> getItems() {
        List<String> rows = new ArrayList<>();
        for (ItemQuantity itemQuantity : items) {
            String row = getItem(itemQuantity);
            if (!row.equals("")) {
                rows.add(row);
            }
        }

        return rows;
    }

    public String getItem(ItemQuantity itemQuantity) {
        if (itemQuantity.getQuantity() == 0) {
            return "";
        }

        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_id
        parts.add(itemQuantity.getItem().getId()); //item_id
        parts.add(String.valueOf(itemQuantity.getQuantity())); //quantity
        parts.add("0"); //user_id
        return PowerApiService.getRow(parts);
    }
}
