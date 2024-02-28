package com.herd.squire.models.items;

import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.ArmorType;

public class Armor extends Item {
    private ArmorType armorType;
    private int ac;
    private Ability abilityModifier;
    private int maxAbilityModifier;
    private int minStrength;
    private boolean stealthDisadvantage;

    public Armor() {
    }

    public Armor(String id, String name, String description, int sid, boolean author, int version, boolean expendable,
                 EquipmentSlotType slot, boolean container, boolean ignoreWeight, int cost, CostUnit costUnit, double weight,
                 ArmorType armorType, int ac, Ability abilityModifier, int maxAbilityModifier, int minStrength, boolean stealthDisadvantage) {
        super(id, name, ItemType.ARMOR, description, sid, author, version, expendable, true, slot, container, ignoreWeight, cost, costUnit, weight, armorType.getId());
        this.armorType = armorType;
        this.ac = ac;
        this.abilityModifier = abilityModifier;
        this.maxAbilityModifier = maxAbilityModifier;
        this.minStrength = minStrength;
        this.stealthDisadvantage = stealthDisadvantage;
    }

    public ArmorType getArmorType() {
        return armorType;
    }

    public void setArmorType(ArmorType armorType) {
        this.armorType = armorType;
    }

    public int getAc() {
        return ac;
    }

    public void setAc(int ac) {
        this.ac = ac;
    }

    public Ability getAbilityModifier() {
        return abilityModifier;
    }

    public void setAbilityModifier(Ability abilityModifier) {
        this.abilityModifier = abilityModifier;
    }

    public int getMaxAbilityModifier() {
        return maxAbilityModifier;
    }

    public void setMaxAbilityModifier(int maxAbilityModifier) {
        this.maxAbilityModifier = maxAbilityModifier;
    }

    public int getMinStrength() {
        return minStrength;
    }

    public void setMinStrength(int minStrength) {
        this.minStrength = minStrength;
    }

    public boolean isStealthDisadvantage() {
        return stealthDisadvantage;
    }

    public void setStealthDisadvantage(boolean stealthDisadvantage) {
        this.stealthDisadvantage = stealthDisadvantage;
    }
}
