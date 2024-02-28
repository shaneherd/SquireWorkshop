package com.herd.squire.models.creatures;

import com.herd.squire.models.Tag;
import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.creatures.characters.Spellcasting;

import java.util.ArrayList;
import java.util.List;

public class CreatureSpellCasting {
    private List<CreatureSpell> spells;
    private List<CreatureActiveSpell> activeSpells;
    private String spellcastingAbility;
    private Spellcasting spellcastingAttack;
    private Spellcasting spellcastingSave;
    private List<Tag> tags;

    private List<CreatureSpellSlot> spellSlots;
    private List<SpellConfiguration> spellConfigurations;

    public CreatureSpellCasting() {
        this.spells = new ArrayList<>();
        this.activeSpells = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.spellSlots = new ArrayList<>();
        this.spellConfigurations = new ArrayList<>();
    }

    public CreatureSpellCasting(String spellcastingAbility,
                                Spellcasting spellcastingAttack, Spellcasting spellcastingSave,
                                List<CreatureSpellSlot> spellSlots, List<SpellConfiguration> spellConfigurations,
                                List<Tag> tags) {
        this.spellcastingAbility = spellcastingAbility;
        this.spellcastingAttack = spellcastingAttack;
        this.spellcastingSave = spellcastingSave;
        this.spellSlots = spellSlots;
        this.spellConfigurations = spellConfigurations;
        this.tags = tags;
        this.spells = new ArrayList<>();
        this.activeSpells = new ArrayList<>();
    }

    public List<CreatureSpell> getSpells() {
        return spells;
    }

    public void setSpells(List<CreatureSpell> spells) {
        this.spells = spells;
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

    public List<CreatureSpellSlot> getSpellSlots() {
        return spellSlots;
    }

    public void setSpellSlots(List<CreatureSpellSlot> spellSlots) {
        this.spellSlots = spellSlots;
    }

    public List<SpellConfiguration> getSpellConfigurations() {
        return spellConfigurations;
    }

    public void setSpellConfigurations(List<SpellConfiguration> spellConfigurations) {
        this.spellConfigurations = spellConfigurations;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<CreatureActiveSpell> getActiveSpells() {
        return activeSpells;
    }

    public void setActiveSpells(List<CreatureActiveSpell> activeSpells) {
        this.activeSpells = activeSpells;
    }
}
