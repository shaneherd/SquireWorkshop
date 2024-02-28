package com.herd.squire.models.items.magical_item;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.damages.DamageConfiguration;
import com.herd.squire.models.items.CostUnit;
import com.herd.squire.models.items.EquipmentSlotType;
import com.herd.squire.models.items.Item;
import com.herd.squire.models.items.ItemType;
import com.herd.squire.models.powers.AttackType;

import java.util.ArrayList;
import java.util.List;

public class MagicalItem extends Item {
    private MagicalItemType magicalItemType;
    private Rarity rarity;
    private List<MagicalItemTable> tables;

    private boolean requiresAttunement;
    private MagicalItemAttunementType attunementType;
    private boolean cursed;
    private String curseEffect;

    private boolean hasCharges;
    private int maxCharges;
    private boolean rechargeable;
    private DiceCollection rechargeRate;
    private boolean rechargeOnLongRest;
    private boolean chanceOfDestruction;

    private List<MagicalItemSpellConfiguration> spells;
    private boolean additionalSpells;
    private boolean additionalSpellsRemoveOnCasting;

    private AttackType attackType;
    private boolean temporaryHP;
    private int attackMod;
    private ListObject saveType;
    private boolean halfOnSave;
    private List<DamageConfiguration> damages;

    private int acMod;
    private List<MagicalItemApplicability> applicableWeapons;
    private List<MagicalItemApplicability> applicableAmmos;
    private List<MagicalItemApplicability> applicableArmors;
    private List<MagicalItemApplicability> applicableSpells;
    private List<ListObject> attunementClasses;
    private List<ListObject> attunementRaces;
    private List<ListObject> attunementAlignments;

    private MagicalItemSpellAttackCalculationType spellAttackCalculationType;
    private int spellAttackModifier;
    private int spellSaveDC;

    public MagicalItem() {
        this.spells = new ArrayList<>();
        this.damages = new ArrayList<>();
        this.applicableWeapons = new ArrayList<>();
        this.applicableAmmos = new ArrayList<>();
        this.applicableArmors = new ArrayList<>();
        this.applicableSpells = new ArrayList<>();
        this.attunementClasses = new ArrayList<>();
        this.attunementRaces = new ArrayList<>();
        this.attunementAlignments = new ArrayList<>();
        this.tables = new ArrayList<>();
        this.spellAttackCalculationType = MagicalItemSpellAttackCalculationType.TABLE;
        this.spellAttackModifier = 5;
        this.spellSaveDC = 13;
    }

    public MagicalItem(String id, String name, String description, int sid, boolean author, int version,
                       boolean expendable, boolean equippable, EquipmentSlotType slot, boolean container, boolean ignoreWeight,
                       int cost, CostUnit costUnit, double weight, MagicalItemType magicalItemType, Rarity rarity,
                       boolean requiresAttunement, MagicalItemAttunementType attunementType, String curseEffect,
                       int maxCharges, boolean rechargeable, DiceCollection rechargeRate, boolean rechargeOnLongRest,
                       boolean chanceOfDestruction, boolean additionalSpells, boolean additionalSpellsRemoveOnCasting, AttackType attackType, boolean temporaryHP,
                       int attackMod, ListObject saveType, boolean halfOnSave, int acMod, MagicalItemSpellAttackCalculationType spellAttackCalculationType,
                       int spellAttackModifier, int spellSaveDC) {
        super(id, name, ItemType.MAGICAL_ITEM, description, sid, author, version, expendable, equippable, slot, container, ignoreWeight, cost, costUnit, weight);
        this.magicalItemType = magicalItemType;
        this.rarity = rarity;
        this.attunementType = attunementType;
        this.setRequiresAttunement(requiresAttunement);
        this.requiresAttunement = requiresAttunement;
        this.cursed = curseEffect.length() > 0;
        this.curseEffect = curseEffect;
        this.hasCharges = maxCharges > 0;
        this.maxCharges = maxCharges;
        this.rechargeable = rechargeable;
        this.rechargeRate = rechargeRate;
        this.rechargeOnLongRest = rechargeOnLongRest;
        this.chanceOfDestruction = chanceOfDestruction;
        this.additionalSpells = additionalSpells;
        this.additionalSpellsRemoveOnCasting = additionalSpellsRemoveOnCasting;
        this.attackType = attackType;
        this.temporaryHP = temporaryHP;
        this.attackMod = attackMod;
        this.saveType = saveType;
        this.halfOnSave = halfOnSave;
        this.acMod = acMod;
        this.spellAttackCalculationType = spellAttackCalculationType;
        this.spellAttackModifier = spellAttackModifier;
        this.spellSaveDC = spellSaveDC;

        this.spells = new ArrayList<>();
        this.damages = new ArrayList<>();
        this.applicableWeapons = new ArrayList<>();
        this.applicableAmmos = new ArrayList<>();
        this.applicableArmors = new ArrayList<>();
        this.applicableSpells = new ArrayList<>();
        this.attunementClasses = new ArrayList<>();
        this.attunementRaces = new ArrayList<>();
        this.attunementAlignments = new ArrayList<>();
        this.tables = new ArrayList<>();
    }

    @Override
    public boolean isExpendable() {
        if (magicalItemType == MagicalItemType.ARMOR
                || magicalItemType == MagicalItemType.RING
                || magicalItemType == MagicalItemType.ROD
                || magicalItemType == MagicalItemType.STAFF
                || magicalItemType == MagicalItemType.WAND
                || magicalItemType == MagicalItemType.WEAPON) {
            return false;
        } else if (magicalItemType == MagicalItemType.POTION
                || magicalItemType == MagicalItemType.AMMO
                || magicalItemType == MagicalItemType.SCROLL) {
            return true;
        }

        return expendable;
    }

    @Override
    public boolean isEquippable() {
        if (magicalItemType == MagicalItemType.ARMOR
                || magicalItemType == MagicalItemType.RING
                || magicalItemType == MagicalItemType.ROD
                || magicalItemType == MagicalItemType.STAFF
                || magicalItemType == MagicalItemType.WAND
                || magicalItemType == MagicalItemType.WEAPON) {
            return true;
        }

        return equippable;
    }

    @Override
    public EquipmentSlotType getSlot() {
        if (magicalItemType == MagicalItemType.ROD
                || magicalItemType == MagicalItemType.STAFF
                || magicalItemType == MagicalItemType.WAND
                || magicalItemType == MagicalItemType.WEAPON) {
            return EquipmentSlotType.HAND;
        } else if (magicalItemType == MagicalItemType.ARMOR) {
            return EquipmentSlotType.BODY;
        } else if (magicalItemType == MagicalItemType.RING) {
            return EquipmentSlotType.FINGER;
        } else if (magicalItemType == MagicalItemType.AMMO
                || magicalItemType == MagicalItemType.SCROLL
                || magicalItemType == MagicalItemType.POTION) {
            return EquipmentSlotType.NONE;
        }
        return slot;
    }

    public MagicalItemType getMagicalItemType() {
        return magicalItemType;
    }

    public void setMagicalItemType(MagicalItemType magicalItemType) {
        this.magicalItemType = magicalItemType;
    }

    public Rarity getRarity() {
        return rarity;
    }

    public void setRarity(Rarity rarity) {
        this.rarity = rarity;
    }

    public boolean isRequiresAttunement() {
        if (magicalItemType == MagicalItemType.AMMO || magicalItemType == MagicalItemType.POTION || magicalItemType == MagicalItemType.SCROLL) {
            return false;
        }
        return requiresAttunement;
    }

    public void setRequiresAttunement(boolean requiresAttunement) {
        if (magicalItemType == MagicalItemType.AMMO || magicalItemType == MagicalItemType.POTION || magicalItemType == MagicalItemType.SCROLL) {
            this.requiresAttunement = false;
        }
        this.requiresAttunement = requiresAttunement;
    }

    public MagicalItemAttunementType getAttunementType() {
        return attunementType;
    }

    public void setAttunementType(MagicalItemAttunementType attunementType) {
        this.attunementType = attunementType;
    }

    public boolean isCursed() {
        return cursed;
    }

    public void setCursed(boolean cursed) {
        this.cursed = cursed;
    }

    public String getCurseEffect() {
        return curseEffect;
    }

    public void setCurseEffect(String curseEffect) {
        this.curseEffect = curseEffect;
    }

    public boolean isHasCharges() {
        return hasCharges;
    }

    public void setHasCharges(boolean hasCharges) {
        this.hasCharges = hasCharges;
    }

    public int getMaxCharges() {
        return maxCharges;
    }

    public void setMaxCharges(int maxCharges) {
        this.maxCharges = maxCharges;
    }

    public boolean isRechargeable() {
        return rechargeable;
    }

    public void setRechargeable(boolean rechargeable) {
        this.rechargeable = rechargeable;
    }

    public DiceCollection getRechargeRate() {
        return rechargeRate;
    }

    public void setRechargeRate(DiceCollection rechargeRate) {
        this.rechargeRate = rechargeRate;
    }

    public boolean isRechargeOnLongRest() {
        return rechargeOnLongRest;
    }

    public void setRechargeOnLongRest(boolean rechargeOnLongRest) {
        this.rechargeOnLongRest = rechargeOnLongRest;
    }

    public boolean isChanceOfDestruction() {
        return chanceOfDestruction;
    }

    public void setChanceOfDestruction(boolean chanceOfDestruction) {
        this.chanceOfDestruction = chanceOfDestruction;
    }

    public List<MagicalItemSpellConfiguration> getSpells() {
        return spells;
    }

    public void setSpells(List<MagicalItemSpellConfiguration> spells) {
        this.spells = spells;
    }

    public boolean isAdditionalSpells() {
        return additionalSpells;
    }

    public void setAdditionalSpells(boolean additionalSpells) {
        this.additionalSpells = additionalSpells;
    }

    public boolean isAdditionalSpellsRemoveOnCasting() {
        return additionalSpellsRemoveOnCasting;
    }

    public void setAdditionalSpellsRemoveOnCasting(boolean additionalSpellsRemoveOnCasting) {
        this.additionalSpellsRemoveOnCasting = additionalSpellsRemoveOnCasting;
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

    public ListObject getSaveType() {
        return saveType;
    }

    public void setSaveType(ListObject saveType) {
        this.saveType = saveType;
    }

    public boolean isHalfOnSave() {
        return halfOnSave;
    }

    public void setHalfOnSave(boolean halfOnSave) {
        this.halfOnSave = halfOnSave;
    }

    public List<DamageConfiguration> getDamages() {
        return damages;
    }

    public void setDamages(List<DamageConfiguration> damages) {
        this.damages = damages;
    }

    public int getAcMod() {
        return acMod;
    }

    public void setAcMod(int acMod) {
        this.acMod = acMod;
    }

    public List<MagicalItemApplicability> getApplicableWeapons() {
        if (magicalItemType != MagicalItemType.WEAPON) {
            return new ArrayList<>();
        }
        return applicableWeapons;
    }

    public void setApplicableWeapons(List<MagicalItemApplicability> applicableWeapons) {
        if (magicalItemType == MagicalItemType.WEAPON) {
            this.applicableWeapons = applicableWeapons;
        }
    }

    public List<MagicalItemApplicability> getApplicableAmmos() {
        if (magicalItemType != MagicalItemType.AMMO) {
            return new ArrayList<>();
        }
        return applicableAmmos;
    }

    public void setApplicableAmmos(List<MagicalItemApplicability> applicableAmmos) {
        if (magicalItemType == MagicalItemType.AMMO) {
            this.applicableAmmos = applicableAmmos;
        }
    }

    public List<MagicalItemApplicability> getApplicableArmors() {
        if (magicalItemType != MagicalItemType.ARMOR) {
            return new ArrayList<>();
        }
        return applicableArmors;
    }

    public void setApplicableArmors(List<MagicalItemApplicability> applicableArmors) {
        if (magicalItemType == MagicalItemType.ARMOR) {
            this.applicableArmors = applicableArmors;
        }
    }

    public List<MagicalItemApplicability> getApplicableSpells() {
        if (additionalSpells || magicalItemType == MagicalItemType.SCROLL) {
            return applicableSpells;
        }
        return new ArrayList<>();
    }

    public void setApplicableSpells(List<MagicalItemApplicability> applicableSpells) {
        if (additionalSpells || magicalItemType == MagicalItemType.SCROLL) {
            this.applicableSpells = applicableSpells;
        }
    }

    public MagicalItemSpellAttackCalculationType getSpellAttackCalculationType() {
        return spellAttackCalculationType;
    }

    public void setSpellAttackCalculationType(MagicalItemSpellAttackCalculationType spellAttackCalculationType) {
        this.spellAttackCalculationType = spellAttackCalculationType;
    }

    public int getSpellAttackModifier() {
        return spellAttackModifier;
    }

    public void setSpellAttackModifier(int spellAttackModifier) {
        this.spellAttackModifier = spellAttackModifier;
    }

    public int getSpellSaveDC() {
        return spellSaveDC;
    }

    public void setSpellSaveDC(int spellSaveDC) {
        this.spellSaveDC = spellSaveDC;
    }

    public List<ListObject> getAttunementClasses() {
        return attunementClasses;
    }

    public void setAttunementClasses(List<ListObject> attunementClasses) {
        this.attunementClasses = attunementClasses;
    }

    public List<ListObject> getAttunementRaces() {
        return attunementRaces;
    }

    public void setAttunementRaces(List<ListObject> attunementRaces) {
        this.attunementRaces = attunementRaces;
    }

    public List<ListObject> getAttunementAlignments() {
        return attunementAlignments;
    }

    public void setAttunementAlignments(List<ListObject> attunementAlignments) {
        this.attunementAlignments = attunementAlignments;
    }

    public List<MagicalItemTable> getTables() {
        return tables;
    }

    public void setTables(List<MagicalItemTable> tables) {
        this.tables = tables;
    }
}
