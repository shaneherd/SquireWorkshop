package com.herd.squire.models.creatures;

public class CreatureItemRequest {
    private String creatureItemId;
    private int charges;
    private boolean attuned;

    public CreatureItemRequest() {}

    public CreatureItemRequest(String creatureItemId, int charges, boolean attuned) {
        this.creatureItemId = creatureItemId;
        this.charges = charges;
        this.attuned = attuned;
    }

    public String getCreatureItemId() {
        return creatureItemId;
    }

    public void setCreatureItemId(String creatureItemId) {
        this.creatureItemId = creatureItemId;
    }

    public int getCharges() {
        return charges;
    }

    public void setCharges(int charges) {
        this.charges = charges;
    }

    public boolean isAttuned() {
        return attuned;
    }

    public void setAttuned(boolean attuned) {
        this.attuned = attuned;
    }
}
