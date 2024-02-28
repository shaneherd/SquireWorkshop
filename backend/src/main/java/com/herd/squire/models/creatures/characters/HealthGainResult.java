package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.ListObject;

public class HealthGainResult {
    private ListObject level;
    private int value;

    public HealthGainResult() {}

    public HealthGainResult(ListObject level, int value) {
        this.level = level;
        this.value = value;
    }

    public ListObject getLevel() {
        return level;
    }

    public void setLevel(ListObject level) {
        this.level = level;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
