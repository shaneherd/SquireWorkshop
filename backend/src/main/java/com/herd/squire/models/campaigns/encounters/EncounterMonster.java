package com.herd.squire.models.campaigns.encounters;

import com.herd.squire.models.rolls.Roll;

public class EncounterMonster extends EncounterCreature {
    private int monsterNumber;
    private int hp;

    // these are only used by the front end and are needed here
    // to prevent the json deserializer from breaking
    private String initiativeTooltip;
    private Roll stealthRoll;
    private String stealthRollTooltip;

    private EncounterMonster() {
        super();
    }

    public EncounterMonster(String id, int initiative, int roundAdded, int order, boolean surprised, boolean removed, int monsterNumber, int hp) {
        super(id, EncounterCreatureType.MONSTER, initiative, roundAdded, order, surprised, removed);
        this.monsterNumber = monsterNumber;
        this.hp = hp;
    }

    public int getMonsterNumber() {
        return monsterNumber;
    }

    public void setMonsterNumber(int monsterNumber) {
        this.monsterNumber = monsterNumber;
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }

    public String getInitiativeTooltip() {
        return initiativeTooltip;
    }

    public void setInitiativeTooltip(String initiativeTooltip) {
        this.initiativeTooltip = initiativeTooltip;
    }

    public Roll getStealthRoll() {
        return stealthRoll;
    }

    public void setStealthRoll(Roll stealthRoll) {
        this.stealthRoll = stealthRoll;
    }

    public String getStealthRollTooltip() {
        return stealthRollTooltip;
    }

    public void setStealthRollTooltip(String stealthRollTooltip) {
        this.stealthRollTooltip = stealthRollTooltip;
    }
}
