package com.herd.squire.models.campaigns.encounters;

import com.herd.squire.models.ListObject;

import java.sql.Timestamp;

public class EncounterListObject extends ListObject {
    private Timestamp startedAt;
    private Timestamp lastPlayedAt;
    private Timestamp finishedAt;

    public EncounterListObject() {
        super();
    }

    public EncounterListObject(String id, String name, Timestamp startedAt, Timestamp lastPlayedAt, Timestamp finishedAt) {
        super(id, name, 0, true);
        this.startedAt = startedAt;
        this.lastPlayedAt = lastPlayedAt;
        this.finishedAt = finishedAt;
    }

    public Timestamp getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Timestamp startedAt) {
        this.startedAt = startedAt;
    }

    public Timestamp getLastPlayedAt() {
        return lastPlayedAt;
    }

    public void setLastPlayedAt(Timestamp lastPlayedAt) {
        this.lastPlayedAt = lastPlayedAt;
    }

    public Timestamp getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(Timestamp finishedAt) {
        this.finishedAt = finishedAt;
    }
}
