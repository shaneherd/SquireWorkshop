package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.attributes.CharacterLevel;
import com.herd.squire.models.characteristics.character_class.CharacterClass;
import com.herd.squire.models.powers.AttackType;

import java.util.ArrayList;
import java.util.List;

public class ChosenClass {
    private String id;
    private boolean primary;
    private CharacterLevel characterLevel;
    private CharacterClass characterClass;
    private CharacterClass subclass;
    private List<HealthGainResult> healthGainResults;
    private int numHitDiceMod;

    private String spellcastingAbility;
    private Spellcasting spellcastingAttack;
    private Spellcasting spellcastingSave;
    private boolean displaySpellcasting;

    public ChosenClass() {}

    public ChosenClass(String id, boolean primary, CharacterLevel characterLevel, int numHitDiceMod, String spellcastingAbility, boolean displaySpellcasting) {
        this.id = id;
        this.primary = primary;
        this.characterLevel = characterLevel;
        this.numHitDiceMod = numHitDiceMod;
        this.spellcastingAbility = spellcastingAbility;
        this.displaySpellcasting = displaySpellcasting;

        this.characterClass = null;
        this.subclass = null;
        this.healthGainResults = new ArrayList<>();
        this.spellcastingAttack = new Spellcasting(AttackType.ATTACK);
        this.spellcastingSave = new Spellcasting(AttackType.SAVE);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    public CharacterLevel getCharacterLevel() {
        return characterLevel;
    }

    public void setCharacterLevel(CharacterLevel characterLevel) {
        this.characterLevel = characterLevel;
    }

    public CharacterClass getCharacterClass() {
        return characterClass;
    }

    public void setCharacterClass(CharacterClass characterClass) {
        this.characterClass = characterClass;
    }

    public CharacterClass getSubclass() {
        return subclass;
    }

    public void setSubclass(CharacterClass subclass) {
        this.subclass = subclass;
    }

    public List<HealthGainResult> getHealthGainResults() {
        return healthGainResults;
    }

    public void setHealthGainResults(List<HealthGainResult> healthGainResults) {
        this.healthGainResults = healthGainResults;
    }

    public int getNumHitDiceMod() {
        return numHitDiceMod;
    }

    public void setNumHitDiceMod(int numHitDiceMod) {
        this.numHitDiceMod = numHitDiceMod;
    }

    public String getSpellcastingAbility() {
        return spellcastingAbility;
    }

    public void setSpellcastingAbility(String spellcastingAbility) {
        this.spellcastingAbility = spellcastingAbility;
    }

    public Spellcasting getSpellcastingAttack() {
        return spellcastingAttack;
    }

    public void setSpellcastingAttack(Spellcasting spellcastingAttack) {
        this.spellcastingAttack = spellcastingAttack;
    }

    public Spellcasting getSpellcastingSave() {
        return spellcastingSave;
    }

    public void setSpellcastingSave(Spellcasting spellcastingSave) {
        this.spellcastingSave = spellcastingSave;
    }

    public boolean isDisplaySpellcasting() {
        return displaySpellcasting;
    }

    public void setDisplaySpellcasting(boolean displaySpellcasting) {
        this.displaySpellcasting = displaySpellcasting;
    }
}
