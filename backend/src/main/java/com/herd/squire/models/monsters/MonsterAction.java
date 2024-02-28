package com.herd.squire.models.monsters;

import com.herd.squire.models.Action;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.items.weapon.WeaponRangeType;
import com.herd.squire.models.powers.AttackType;
import com.herd.squire.models.powers.LimitedUse;

import java.util.ArrayList;
import java.util.List;

public class MonsterAction extends MonsterPower {
    private Action actionType;
    private int legendaryCost;
    private WeaponRangeType rangeType;
    private int reach;
    private int normalRange;
    private int longRange;
    private ListObject ammoType;
    private AttackType attackType;
    private boolean temporaryHP;
    private int attackMod;
    private String attackAbilityModifier;
    private ListObject saveType;
    private boolean saveProficiencyModifier;
    private String saveAbilityModifier;
    private boolean halfOnSave;
    private List<DamageConfiguration> damageConfigurations;
    private String description;

    public MonsterAction() {
        actionType = Action.STANDARD;
        rangeType = WeaponRangeType.MELEE;
        attackType = AttackType.NONE;
        damageConfigurations = new ArrayList<>();
    }

    public MonsterAction(String id, String name, int sid, boolean author, int version, LimitedUse limitedUse, int rechargeMin, int rechargeMax,
                         Action actionType, int legendaryCost, WeaponRangeType rangeType, int reach,
                         int normalRange, int longRange, ListObject ammoType, AttackType attackType,
                         boolean temporaryHP, int attackMod, String attackAbilityModifier, ListObject saveType,
                         boolean saveProficiencyModifier, String saveAbilityModifier, boolean halfOnSave,
                         String description) {
        super(id, name, sid, author, version, MonsterPowerType.ACTION, limitedUse, rechargeMin, rechargeMax);
        this.actionType = actionType;
        this.legendaryCost = legendaryCost;
        this.rangeType = rangeType;
        this.reach = reach;
        this.normalRange = normalRange;
        this.longRange = longRange;
        this.ammoType = ammoType;
        this.attackType = attackType;
        this.temporaryHP = temporaryHP;
        this.attackMod = attackMod;
        this.attackAbilityModifier = attackAbilityModifier;
        this.saveType = saveType;
        this.saveProficiencyModifier = saveProficiencyModifier;
        this.saveAbilityModifier = saveAbilityModifier;
        this.halfOnSave = halfOnSave;
        this.description = description;
        this.damageConfigurations = new ArrayList<>();
    }

    public Action getActionType() {
        return actionType;
    }

    public void setActionType(Action actionType) {
        this.actionType = actionType;
    }

    public int getLegendaryCost() {
        return legendaryCost;
    }

    public void setLegendaryCost(int legendaryCost) {
        this.legendaryCost = legendaryCost;
    }

    public WeaponRangeType getRangeType() {
        return rangeType;
    }

    public void setRangeType(WeaponRangeType rangeType) {
        this.rangeType = rangeType;
    }

    public int getReach() {
        return reach;
    }

    public void setReach(int reach) {
        this.reach = reach;
    }

    public int getNormalRange() {
        return normalRange;
    }

    public void setNormalRange(int normalRange) {
        this.normalRange = normalRange;
    }

    public int getLongRange() {
        return longRange;
    }

    public void setLongRange(int longRange) {
        this.longRange = longRange;
    }

    public ListObject getAmmoType() {
        return ammoType;
    }

    public void setAmmoType(ListObject ammoType) {
        this.ammoType = ammoType;
    }

    public AttackType getAttackType() {
        return attackType;
    }

    public void setAttackType(AttackType attackType) {
        this.attackType = attackType;
    }

    public boolean isTemporaryHP() {
        return temporaryHP;
    }

    public void setTemporaryHP(boolean temporaryHP) {
        this.temporaryHP = temporaryHP;
    }

    public int getAttackMod() {
        return attackMod;
    }

    public void setAttackMod(int attackMod) {
        this.attackMod = attackMod;
    }

    public String getAttackAbilityModifier() {
        return attackAbilityModifier;
    }

    public void setAttackAbilityModifier(String attackAbilityModifier) {
        this.attackAbilityModifier = attackAbilityModifier;
    }

    public ListObject getSaveType() {
        return saveType;
    }

    public void setSaveType(ListObject saveType) {
        this.saveType = saveType;
    }

    public boolean isSaveProficiencyModifier() {
        return saveProficiencyModifier;
    }

    public void setSaveProficiencyModifier(boolean saveProficiencyModifier) {
        this.saveProficiencyModifier = saveProficiencyModifier;
    }

    public String getSaveAbilityModifier() {
        return saveAbilityModifier;
    }

    public void setSaveAbilityModifier(String saveAbilityModifier) {
        this.saveAbilityModifier = saveAbilityModifier;
    }

    public boolean isHalfOnSave() {
        return halfOnSave;
    }

    public void setHalfOnSave(boolean halfOnSave) {
        this.halfOnSave = halfOnSave;
    }

    public List<DamageConfiguration> getDamageConfigurations() {
        return damageConfigurations;
    }

    public void setDamageConfigurations(List<DamageConfiguration> damageConfigurations) {
        this.damageConfigurations = damageConfigurations;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
