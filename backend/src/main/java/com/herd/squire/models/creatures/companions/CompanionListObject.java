package com.herd.squire.models.creatures.companions;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.creatures.CreatureHealth;

public class CompanionListObject extends ListObject {
    private CompanionType companionType;
    private CreatureHealth creatureHealth;
    private int maxHp;

    public CompanionListObject() {
        super();
    }

    public CompanionListObject(String id, String name, int sid, boolean author, CompanionType companionType,
                               CreatureHealth creatureHealth, int maxHp) {
        super(id, name, sid, author);
        this.companionType = companionType;
        this.creatureHealth = creatureHealth;
        this.maxHp = maxHp;
    }

    public CompanionType getCompanionType() {
        return companionType;
    }

    public void setCompanionType(CompanionType companionType) {
        this.companionType = companionType;
    }

    public CreatureHealth getCreatureHealth() {
        return creatureHealth;
    }

    public void setCreatureHealth(CreatureHealth creatureHealth) {
        this.creatureHealth = creatureHealth;
    }

    public int getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(int maxHp) {
        this.maxHp = maxHp;
    }
}
