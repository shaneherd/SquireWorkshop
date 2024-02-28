package com.herd.squire.models.characteristics;

import com.herd.squire.models.ListObject;

public class SpellConfiguration {
    private ListObject spell;
    private ListObject characterClass;
    private ListObject levelGained;
    private boolean alwaysPrepared;
    private boolean countTowardsPrepared;
    private String notes;
    private boolean author;

    public SpellConfiguration() {}

    public SpellConfiguration(ListObject spell, ListObject levelGained, boolean alwaysPrepared, boolean countTowardsPrepared,
                              String notes, boolean author) {
        this.spell = spell;
        this.levelGained = levelGained;
        this.alwaysPrepared = alwaysPrepared;
        this.countTowardsPrepared = countTowardsPrepared;
        this.notes = notes;
        this.author = author;
    }

    public ListObject getSpell() {
        return spell;
    }

    public void setSpell(ListObject spell) {
        this.spell = spell;
    }

    public ListObject getCharacterClass() {
        return characterClass;
    }

    public void setCharacterClass(ListObject characterClass) {
        this.characterClass = characterClass;
    }

    public ListObject getLevelGained() {
        return levelGained;
    }

    public void setLevelGained(ListObject levelGained) {
        this.levelGained = levelGained;
    }

    public boolean isAlwaysPrepared() {
        return alwaysPrepared;
    }

    public void setAlwaysPrepared(boolean alwaysPrepared) {
        this.alwaysPrepared = alwaysPrepared;
    }

    public boolean isCountTowardsPrepared() {
        return countTowardsPrepared;
    }

    public void setCountTowardsPrepared(boolean countTowardsPrepared) {
        this.countTowardsPrepared = countTowardsPrepared;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }
}
