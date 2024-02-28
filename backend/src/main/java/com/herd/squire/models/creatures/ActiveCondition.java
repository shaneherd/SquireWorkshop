package com.herd.squire.models.creatures;

import com.herd.squire.models.ListObject;

public class ActiveCondition {
    private ListObject condition;
    private boolean inherited;

    public ActiveCondition() {}

    public ActiveCondition(ListObject condition, boolean inherited) {
        this.condition = condition;
        this.inherited = inherited;
    }

    public ListObject getCondition() {
        return condition;
    }

    public void setCondition(ListObject condition) {
        this.condition = condition;
    }

    public boolean isInherited() {
        return inherited;
    }

    public void setInherited(boolean inherited) {
        this.inherited = inherited;
    }
}
