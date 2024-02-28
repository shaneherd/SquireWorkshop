package com.herd.squire.models.powers;

import com.herd.squire.models.Action;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.characteristics.CharacteristicType;

public class Feature extends Power {
    private ListObject characteristic;
    private CharacteristicType characteristicType;
    private ListObject characterLevel;
    private String prerequisite;
    private String description;
    private boolean passive;
    private Action action;

    public Feature() {}

    public Feature(String id, String name, int sid, boolean author, int version,
                   AttackType attackType, boolean temporaryHP, int attackMod, String attackAbilityModifier, Ability saveType,
                   boolean halfOnSave, boolean extraDamage, int numLevelsAboveBase,
                   boolean advancement, boolean extraModifiers, int modifiersNumLevelsAboveBase, boolean advancementModifiers,
                   ListObject characteristic, CharacteristicType characteristicType,
                   ListObject characterLevel, RangeType rangeType, int range, RangeUnit rangeUnit,
                   PowerAreaOfEffect powerAreaOfEffect, int rechargeMin, int rechargeMax, boolean rechargeOnShortRest, boolean rechargeOnLongRest, String prerequisite,
                   String description, boolean passive, boolean saveProficiencyModifier, String saveAbilityModifier, Action action) {
        super(id, name, sid, author, version, PowerType.FEATURE, attackType, temporaryHP, attackMod, attackAbilityModifier, saveType, halfOnSave,
                extraDamage, numLevelsAboveBase, saveProficiencyModifier, saveAbilityModifier,
                rangeType, range, rangeUnit, powerAreaOfEffect, rechargeMin, rechargeMax, rechargeOnShortRest, rechargeOnLongRest,
                advancement, extraModifiers, modifiersNumLevelsAboveBase, advancementModifiers);
        this.characteristic = characteristic;
        this.characteristicType = characteristicType;
        this.characterLevel = characterLevel;
        this.prerequisite = prerequisite;
        this.description = description;
        this.passive = passive;
        this.action = action;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ListObject getCharacteristic() {
        return characteristic;
    }

    public void setCharacteristic(ListObject characteristic) {
        this.characteristic = characteristic;
    }

    public CharacteristicType getCharacteristicType() {
        return characteristicType;
    }

    public void setCharacteristicType(CharacteristicType characteristicType) {
        this.characteristicType = characteristicType;
    }

    public ListObject getCharacterLevel() {
        return characterLevel;
    }

    public void setCharacterLevel(ListObject characterLevel) {
        this.characterLevel = characterLevel;
    }

    public String getPrerequisite() {
        return prerequisite;
    }

    public void setPrerequisite(String prerequisite) {
        this.prerequisite = prerequisite;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPassive() {
        return passive;
    }

    public void setPassive(boolean passive) {
        this.passive = passive;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }
}
