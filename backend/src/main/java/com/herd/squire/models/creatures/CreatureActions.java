package com.herd.squire.models.creatures;

import java.util.ArrayList;
import java.util.List;

public class CreatureActions {
    private List<CreatureAction> creatureActions;

    public CreatureActions() {
        this.creatureActions = new ArrayList<>();
    }

    public CreatureActions(List<CreatureAction> creatureActions) {
        this.creatureActions = creatureActions;
    }

    public List<CreatureAction> getCreatureActions() {
        return creatureActions;
    }

    public void setCreatureActions(List<CreatureAction> creatureActions) {
        this.creatureActions = creatureActions;
    }
}
