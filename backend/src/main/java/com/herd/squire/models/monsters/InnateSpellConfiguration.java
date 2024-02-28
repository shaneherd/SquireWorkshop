package com.herd.squire.models.monsters;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.powers.LimitedUse;

public class InnateSpellConfiguration {
    private ListObject spell;
    private LimitedUse limitedUse;
    private int slot;
    private boolean author;

    public InnateSpellConfiguration() {}

    public InnateSpellConfiguration(ListObject spell, LimitedUse limitedUse, int slot, boolean author) {
        this.spell = spell;
        this.limitedUse = limitedUse;
        this.slot = slot;
        this.author = author;
    }

    public ListObject getSpell() {
        return spell;
    }

    public void setSpell(ListObject spell) {
        this.spell = spell;
    }

    public LimitedUse getLimitedUse() {
        return limitedUse;
    }

    public void setLimitedUse(LimitedUse limitedUse) {
        this.limitedUse = limitedUse;
    }

    public int getSlot() {
        return slot;
    }

    public void setSlot(int slot) {
        this.slot = slot;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }
}
