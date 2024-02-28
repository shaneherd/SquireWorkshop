package com.herd.squire.models.creatures.companions;

import com.herd.squire.models.creatures.Creature;
import com.herd.squire.models.creatures.CreatureType;
import com.herd.squire.models.creatures.characters.Spellcasting;
import com.herd.squire.models.monsters.MonsterSummary;
import com.herd.squire.models.powers.AttackType;

import java.util.ArrayList;
import java.util.List;

public class Companion extends Creature {
    private CompanionType companionType;
    private MonsterSummary monster;
    private int maxHp;
    private boolean rollOverDamage;
    private CompanionModifier acModifier;
    private CompanionModifier savingThrowModifier;
    private CompanionModifier skillCheckModifier;
    private CompanionModifier attackModifier;
    private CompanionModifier damageModifier;
    private boolean includeCharacterSaves;
    private boolean includeCharacterSkills;
    private List<CompanionScoreModifier> abilityScoreModifiers;

    public Companion() {
        this.companionType = CompanionType.BEAST;
        this.abilityScoreModifiers = new ArrayList<>();
    }

    public Companion(String id, String name, CompanionType companionType, int maxHp,
                     boolean rollOverDamage, CompanionModifier acModifier, CompanionModifier savingThrowModifier,
                     CompanionModifier skillCheckModifier, CompanionModifier attackModifier,
                     CompanionModifier damageModifier, boolean includeCharacterSaves, boolean includeCharacterSkills) {
        super(id, name, CreatureType.COMPANION, 0, 0, null);
        this.companionType = companionType;
        this.maxHp = maxHp;
        this.rollOverDamage = rollOverDamage;
        this.acModifier = acModifier;
        this.savingThrowModifier = savingThrowModifier;
        this.skillCheckModifier = skillCheckModifier;
        this.attackModifier = attackModifier;
        this.damageModifier = damageModifier;
        this.includeCharacterSaves = includeCharacterSaves;
        this.includeCharacterSkills = includeCharacterSkills;
        this.abilityScoreModifiers = new ArrayList<>();

        this.creatureSpellCasting.setSpellcastingAttack(new Spellcasting(AttackType.ATTACK));
        this.creatureSpellCasting.setSpellcastingSave(new Spellcasting(AttackType.SAVE));
    }

    public CompanionType getCompanionType() {
        return companionType;
    }

    public void setCompanionType(CompanionType companionType) {
        this.companionType = companionType;
    }

    public MonsterSummary getMonster() {
        return monster;
    }

    public void setMonster(MonsterSummary monster) {
        this.monster = monster;
    }

    public int getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(int maxHp) {
        this.maxHp = maxHp;
    }

    public boolean isRollOverDamage() {
        return rollOverDamage;
    }

    public void setRollOverDamage(boolean rollOverDamage) {
        this.rollOverDamage = rollOverDamage;
    }

    public CompanionModifier getAcModifier() {
        return acModifier;
    }

    public void setAcModifier(CompanionModifier acModifier) {
        this.acModifier = acModifier;
    }

    public CompanionModifier getSavingThrowModifier() {
        return savingThrowModifier;
    }

    public void setSavingThrowModifier(CompanionModifier savingThrowModifier) {
        this.savingThrowModifier = savingThrowModifier;
    }

    public CompanionModifier getSkillCheckModifier() {
        return skillCheckModifier;
    }

    public void setSkillCheckModifier(CompanionModifier skillCheckModifier) {
        this.skillCheckModifier = skillCheckModifier;
    }

    public CompanionModifier getAttackModifier() {
        return attackModifier;
    }

    public void setAttackModifier(CompanionModifier attackModifier) {
        this.attackModifier = attackModifier;
    }

    public CompanionModifier getDamageModifier() {
        return damageModifier;
    }

    public void setDamageModifier(CompanionModifier damageModifier) {
        this.damageModifier = damageModifier;
    }

    public boolean isIncludeCharacterSaves() {
        return includeCharacterSaves;
    }

    public void setIncludeCharacterSaves(boolean includeCharacterSaves) {
        this.includeCharacterSaves = includeCharacterSaves;
    }

    public boolean isIncludeCharacterSkills() {
        return includeCharacterSkills;
    }

    public void setIncludeCharacterSkills(boolean includeCharacterSkills) {
        this.includeCharacterSkills = includeCharacterSkills;
    }

    public List<CompanionScoreModifier> getAbilityScoreModifiers() {
        return abilityScoreModifiers;
    }

    public void setAbilityScoreModifiers(List<CompanionScoreModifier> abilityScoreModifiers) {
        this.abilityScoreModifiers = abilityScoreModifiers;
    }
}
