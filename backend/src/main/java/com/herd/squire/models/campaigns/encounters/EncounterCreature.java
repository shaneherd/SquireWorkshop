package com.herd.squire.models.campaigns.encounters;

public class EncounterCreature {
    protected String id;
    protected EncounterCreatureType encounterCreatureType;
    protected int initiative;
    protected int roundAdded;
    protected int order;
    protected boolean surprised;
    protected boolean removed;

    public EncounterCreature() {}

    public EncounterCreature(String id, EncounterCreatureType encounterCreatureType, int initiative, int roundAdded, int order, boolean surprised, boolean removed) {
        this.id = id;
        this.encounterCreatureType = encounterCreatureType;
        this.initiative = initiative;
        this.roundAdded = roundAdded;
        this.order = order;
        this.surprised = surprised;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public boolean isSurprised() {
        return surprised;
    }

    public void setSurprised(boolean surprised) {
        this.surprised = surprised;
    }

    public EncounterCreatureType getEncounterCreatureType() {
        return encounterCreatureType;
    }

    public void setEncounterCreatureType(EncounterCreatureType encounterCreatureType) {
        this.encounterCreatureType = encounterCreatureType;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }
}
