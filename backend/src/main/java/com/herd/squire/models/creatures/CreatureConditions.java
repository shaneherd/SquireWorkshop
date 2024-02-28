package com.herd.squire.models.creatures;

import com.herd.squire.models.ListObject;

import java.util.List;

public class CreatureConditions {
    private List<ListObject> activeConditions;

    public CreatureConditions() {}

    public CreatureConditions(List<ListObject> activeConditions) {
        this.activeConditions = activeConditions;
    }

    public List<ListObject> getActiveConditions() {
        return activeConditions;
    }

    public void setActiveConditions(List<ListObject> activeConditions) {
        this.activeConditions = activeConditions;
    }
}
