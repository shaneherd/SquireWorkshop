package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.characteristics.Race;
import com.herd.squire.models.powers.AttackType;

public class CharacterRace {
    private Race race;
    private String spellcastingAbility;
    private Spellcasting spellcastingAttack;
    private Spellcasting spellcastingSave;

    public CharacterRace() { }

    public CharacterRace(String spellcastingAbility) {
        this.spellcastingAbility = spellcastingAbility;
        this.race = null;
        this.spellcastingAttack = new Spellcasting(AttackType.ATTACK);
        this.spellcastingSave = new Spellcasting(AttackType.SAVE);
    }

    public Race getRace() {
        return race;
    }

    public void setRace(Race race) {
        this.race = race;
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
}
