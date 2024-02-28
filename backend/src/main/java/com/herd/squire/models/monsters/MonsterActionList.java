package com.herd.squire.models.monsters;

import java.util.ArrayList;
import java.util.List;

public class MonsterActionList {
    private List<MonsterAction> actions;

    public MonsterActionList() {
        this.actions = new ArrayList<>();
    }

    public MonsterActionList(List<MonsterAction> actions) {
        this.actions = actions;
    }

    public List<MonsterAction> getActions() {
        return actions;
    }

    public void setActions(List<MonsterAction> actions) {
        this.actions = actions;
    }
}
