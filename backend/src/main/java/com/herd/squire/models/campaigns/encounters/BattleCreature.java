package com.herd.squire.models.campaigns.encounters;

import com.herd.squire.models.SpeedType;
import com.herd.squire.models.creatures.Creature;

import java.util.ArrayList;
import java.util.List;

public class BattleCreature {
    private String id;
    private EncounterCreatureType encounterCreatureType;
    private Creature creature;
    private int creatureNumber;
    private int initiative;
    private int roundAdded;
    private SpeedType speedToDisplay;
    private boolean actionReadied;
    private boolean surprised;
    private boolean removed;

    private boolean groupedInitiative;
    private String groupId;

    private List<CombatCondition> conditions;
//    private List<ActionState> actionStates;

    public BattleCreature() {
        this.conditions = new ArrayList<>();
    }


    public BattleCreature(String id, EncounterCreatureType encounterCreatureType, int creatureNumber,
                          int initiative, int roundAdded, SpeedType speedToDisplay,
                          boolean actionReadied, boolean surprised, boolean removed, boolean groupedInitiative, String groupId) {
        this.id = id;
        this.encounterCreatureType = encounterCreatureType;
        this.creatureNumber = creatureNumber;
        this.initiative = initiative;
        this.roundAdded = roundAdded;
        this.speedToDisplay = speedToDisplay;
        this.actionReadied = actionReadied;
        this.surprised = surprised;
        this.removed = removed;
        this.groupedInitiative = groupedInitiative;
        this.groupId = groupId;
        this.conditions = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public EncounterCreatureType getEncounterCreatureType() {
        return encounterCreatureType;
    }

    public void setEncounterCreatureType(EncounterCreatureType encounterCreatureType) {
        this.encounterCreatureType = encounterCreatureType;
    }

    public Creature getCreature() {
        return creature;
    }

    public void setCreature(Creature creature) {
        this.creature = creature;
    }

    public int getCreatureNumber() {
        return creatureNumber;
    }

    public void setCreatureNumber(int creatureNumber) {
        this.creatureNumber = creatureNumber;
    }

    public int getInitiative() {
        return initiative;
    }

    public void setInitiative(int initiative) {
        this.initiative = initiative;
    }

    public int getRoundAdded() {
        return roundAdded;
    }

    public void setRoundAdded(int roundAdded) {
        this.roundAdded = roundAdded;
    }

    public SpeedType getSpeedToDisplay() {
        return speedToDisplay;
    }

    public void setSpeedToDisplay(SpeedType speedToDisplay) {
        this.speedToDisplay = speedToDisplay;
    }

    public boolean isActionReadied() {
        return actionReadied;
    }

    public void setActionReadied(boolean actionReadied) {
        this.actionReadied = actionReadied;
    }

    public boolean isSurprised() {
        return surprised;
    }

    public void setSurprised(boolean surprised) {
        this.surprised = surprised;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }

    public boolean isGroupedInitiative() {
        return groupedInitiative;
    }

    public void setGroupedInitiative(boolean groupedInitiative) {
        this.groupedInitiative = groupedInitiative;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public List<CombatCondition> getConditions() {
        return conditions;
    }

    public void setConditions(List<CombatCondition> conditions) {
        this.conditions = conditions;
    }
}
