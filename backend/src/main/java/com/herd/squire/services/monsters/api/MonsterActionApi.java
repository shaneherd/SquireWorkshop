package com.herd.squire.services.monsters.api;

import com.herd.squire.models.Action;
import com.herd.squire.models.DiceSize;
import com.herd.squire.models.items.weapon.WeaponRangeType;
import com.herd.squire.models.monsters.MonsterAttackDamage;
import com.herd.squire.models.monsters.MonsterPowerType;
import com.herd.squire.models.powers.AttackType;
import com.herd.squire.services.powers.PowerApiService;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MonsterActionApi extends MonsterPowerApi {
    public MonsterActionType monsterActionType;
    public boolean attack;
    public boolean nonAttackSpell;
    public MonsterActionAttackType monsterActionAttackType;
    public Integer ammo;
    public String range;
    public String spell;
    public AttackType attackType;
    public int attackMod;
    public int saveMod;
    public Integer saveType;
    public boolean halfOnMissSave;
    public List<MonsterAttackDamage> attackDamages;
    public int baseLevelSlot;
    public int numLevelsAbove;
    public List<MonsterAttackDamage> extraDamages;
    public String description;
    public int legendaryCost;

    public WeaponRangeType rangeType;
    public int reach;
    public int normalRange;
    public int longRange;
    public String ammoId;
    public String saveTypeId;

    public MonsterActionApi(int id, String name, MonsterActionType monsterActionType, boolean attack,
                            MonsterActionAttackType monsterActionAttackType, Integer ammo, String range, String spell,
                            AttackType attackType, int attackMod, int saveMod, Integer saveType,
                            boolean halfOnMissSave, int baseLevelSlot, int numLevelsAbove, boolean limitedUse,
                            MonsterLimitedUseType limitedUseType, int numPerDay, int rechargeMin, int rechargeMax,
                            boolean rechargeOnShortRest, boolean rechargeOnLongRest, String description,
                            int legendaryCost, List<MonsterAttackDamage> attackDamages, List<MonsterAttackDamage> extraDamages) throws Exception {
        super(name, MonsterPowerType.ACTION, limitedUse, limitedUseType, numPerDay, rechargeMin, rechargeMax);

        this.monsterActionType = monsterActionType;
        this.attack = attack;
        this.nonAttackSpell = false;
        this.monsterActionAttackType = monsterActionAttackType;
        this.ammo = ammo;
        this.range = range;
        this.spell = spell;
        this.attackType = attackType;
        this.attackMod = attackMod;
        this.saveMod = saveMod;
        this.saveType = saveType;
        this.halfOnMissSave = halfOnMissSave;
        this.attackDamages = attackDamages;
        this.baseLevelSlot = baseLevelSlot;
        this.numLevelsAbove = numLevelsAbove;
        this.extraDamages = extraDamages;
        this.description = description;
        this.legendaryCost = legendaryCost;

        this.update();
    }

    public MonsterActionApi(int id, String name, MonsterActionType monsterActionType, boolean attack, boolean nonAttackSpell,
                            MonsterActionAttackType monsterActionAttackType, Integer ammo, String range, String spell,
                            AttackType attackType, int attackMod, int saveMod, Integer saveType,
                            boolean halfOnMissSave, int baseLevelSlot, int numLevelsAbove, boolean limitedUse,
                            MonsterLimitedUseType limitedUseType, int numPerDay, int rechargeMin, int rechargeMax,
                            boolean rechargeOnShortRest, boolean rechargeOnLongRest, String description,
                            int legendaryCost, List<MonsterAttackDamage> attackDamages, List<MonsterAttackDamage> extraDamages) throws Exception {
        super(name, MonsterPowerType.ACTION, limitedUse, limitedUseType, numPerDay, rechargeMin, rechargeMax);
        this.monsterActionType = monsterActionType;
        this.attack = attack;
        this.nonAttackSpell = nonAttackSpell;
        this.monsterActionAttackType = monsterActionAttackType;
        this.ammo = ammo;
        this.range = range;
        this.spell = spell;
        this.attackType = attackType;
        this.attackMod = attackMod;
        this.saveMod = saveMod;
        this.saveType = saveType;
        this.halfOnMissSave = halfOnMissSave;
        this.attackDamages = attackDamages;
        this.baseLevelSlot = baseLevelSlot;
        this.numLevelsAbove = numLevelsAbove;
        this.extraDamages = extraDamages;
        this.description = description;
        this.legendaryCost = legendaryCost;

        this.update();
    }

    public MonsterActionApi(int id, String name, MonsterActionType monsterActionType, boolean attack, boolean nonAttackSpell,
                            MonsterActionAttackType monsterActionAttackType, Integer ammo, String range, String spell,
                            AttackType attackType, int attackMod, int saveMod, Integer saveType,
                            boolean halfOnMissSave, int baseLevelSlot, int numLevelsAbove, boolean limitedUse,
                            MonsterLimitedUseType limitedUseType, int numPerDay, int numUsesRemaining, int rechargeMin, int rechargeMax,
                            boolean rechargeOnShortRest, boolean rechargeOnLongRest, String description,
                            int legendaryCost, List<MonsterAttackDamage> attackDamages, List<MonsterAttackDamage> extraDamages) throws Exception {
        super(name, MonsterPowerType.ACTION, limitedUse, limitedUseType, numPerDay, rechargeMin, rechargeMax);
        this.monsterActionType = monsterActionType;
        this.attack = attack;
        this.nonAttackSpell = nonAttackSpell;
        this.monsterActionAttackType = monsterActionAttackType;
        this.ammo = ammo;
        this.range = range;
        this.spell = spell;
        this.attackType = attackType;
        this.attackMod = attackMod;
        this.saveMod = saveMod;
        this.saveType = saveType;
        this.halfOnMissSave = halfOnMissSave;
        this.attackDamages = attackDamages;
        this.baseLevelSlot = baseLevelSlot;
        this.numLevelsAbove = numLevelsAbove;
        this.extraDamages = extraDamages;
        this.description = description;
        this.legendaryCost = legendaryCost;

        this.update();
    }

    private Action getAction() {
        switch (monsterActionType) {
            case NORMAL:
                return Action.STANDARD;
            case LEGENDARY:
                return Action.LEGENDARY;
            case LAIR:
                return Action.LAIR;
            case REACTION:
                return Action.REACTION;
        }
        return Action.STANDARD;
    }

    private void update() throws Exception {
        ammoId = "null";
        saveTypeId = "null";
        rangeType = WeaponRangeType.MELEE;

        if (attack && monsterActionAttackType != MonsterActionAttackType.SPELL) {
            if (monsterActionAttackType == MonsterActionAttackType.WEAPON_MELEE || monsterActionAttackType == MonsterActionAttackType.OTHER) {
                reach = getReachValue();
            } else if (monsterActionAttackType == MonsterActionAttackType.WEAPON_RANGED) {
                rangeType = WeaponRangeType.RANGED;
                List<Integer> ranges = this.getRangeValues();
                normalRange = ranges.size() > 0 ? ranges.get(0) : 0;
                longRange = ranges.size() > 1 ? ranges.get(1) : 0;
                if (ammo != null) {
                    ammoId = MonsterApiService.getItem(ammo);
                }
            }

            if (attackType == AttackType.SAVE) {
                attackMod = saveMod;
                saveTypeId = MonsterApiService.getAbility(saveType);
            } else if (attackType != AttackType.ATTACK) {
                attackMod = 0;
            }
        } else if (monsterActionAttackType == MonsterActionAttackType.SPELL || nonAttackSpell) {
//            attackType = AttackType.SPELL;
            attackMod = 0;
        } else {
            attackType = AttackType.NONE;
            attackMod = 0;
        }
    }

    public String getActionRow() {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_power_id,
        parts.add(String.valueOf(getAction().getValue())); //action_type_id,
        parts.add(String.valueOf(legendaryCost)); //legendary_cost,
        parts.add(String.valueOf(rangeType.getValue())); //weapon_range_type_id,
        parts.add(String.valueOf(reach)); //reach,
        parts.add(String.valueOf(normalRange)); //normal_range,
        parts.add(String.valueOf(longRange)); //long_range,
        parts.add(ammoId); //ammo_id,
        parts.add(String.valueOf(attackType.getValue())); //attack_type_id,
        parts.add("0"); //temporary_hp,
        parts.add(String.valueOf(attackMod)); //attack_mod,
        parts.add("null"); //attack_ability_modifier_id, //todo
        parts.add(saveTypeId); //save_type_id,
        parts.add("0"); //save_proficiency_modifier, //todo
        parts.add("null"); //save_ability_modifier_id, //todo
        parts.add(attackType == AttackType.SAVE && halfOnMissSave ? "1" : "0"); //half_on_save,
        parts.add(quoted(description)); //description
        return PowerApiService.getRow(parts);
    }

    private int getReachValue() {
        String regex = "Reach (\\d+)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(description);

        int reach = 5;
        if (matcher.find()) {
            String rangeValue = matcher.group(1);
            reach = Integer.parseInt(rangeValue);
        }

        return reach;
    }

    private List<Integer> getRangeValues() throws Exception {
        List<Integer> rangeValues = new ArrayList<>();
        if (monsterActionAttackType != MonsterActionAttackType.WEAPON_RANGED) {
            return rangeValues;
        }
        String regex = "(\\d+)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(range);

        while (matcher.find()) {
            String rangeValue = matcher.group(1);
            rangeValues.add(Integer.parseInt(rangeValue));
        }

        if (rangeValues.size() == 0) {
            throw new Exception("invalid ranges");
        } else if (rangeValues.size() == 1) {
            rangeValues.add(rangeValues.get(0));
        }

        return rangeValues;
    }

    public List<String> getActionDamageRows() {
        boolean healing = attackType == AttackType.HEAL;
        List<String> rows = new ArrayList<>();
        for (MonsterAttackDamage monsterAttackDamage : attackDamages) {
            String row = getActionDamageRow(monsterAttackDamage, healing);
            if (!row.equals("")) {
                rows.add(row);
            }
        }

//        for (MonsterAttackDamage monsterAttackDamage : extraDamages) {
//            String row = getActionDamageRow(monsterAttackDamage, healing);
//            if (!row.equals("")) {
//                rows.add(row);
//            }
//        }
        return rows;
    }

    private String getActionDamageRow(MonsterAttackDamage damage, boolean healing) {
        String damageType = damage.getDamageType();
        if (damageType.equals("")) {
            damageType = "null";
        }

        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_action_id,
        parts.add(String.valueOf(damage.getNumDice())); //num_dice,
        parts.add(PowerApiService.getDiceId(getDice(damage.getDiceSize()))); //dice_size
        parts.add(MonsterApiService.getAbility(damage.getDamageAbility())); //ability_modifier_id,
        parts.add(String.valueOf(damage.getDamageMod())); //misc_mod,
        parts.add(damageType); //damage_type_id,
        parts.add(healing ? "1" : "0"); //healing
        return PowerApiService.getRow(parts);
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
}
