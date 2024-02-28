package com.herd.squire.models.campaigns.encounters;

import com.herd.squire.models.campaigns.CampaignCharacter;

public class EncounterCharacter extends EncounterCreature {
    private CampaignCharacter character;
    private int expEarned;

    public EncounterCharacter() {
        super();
    }

    public EncounterCharacter(String id, int initiative, int roundAdded, int order, boolean surprised, boolean removed, CampaignCharacter character, int expEarned) {
        super(id, EncounterCreatureType.CHARACTER, initiative, roundAdded, order, surprised, removed);
        this.character = character;
        this.expEarned = expEarned;
        this.removed = removed;
    }

    public CampaignCharacter getCharacter() {
        return character;
    }

    public void setCharacter(CampaignCharacter character) {
        this.character = character;
    }

    public int getExpEarned() {
        return expEarned;
    }

    public void setExpEarned(int expEarned) {
        this.expEarned = expEarned;
    }
}
