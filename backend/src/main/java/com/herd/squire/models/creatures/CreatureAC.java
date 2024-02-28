package com.herd.squire.models.creatures;

import com.herd.squire.models.ListObject;

import java.util.ArrayList;
import java.util.List;

public class CreatureAC {
    private List<ListObject> abilities;

    public CreatureAC() {
        this.abilities = new ArrayList<>();
    }

    public CreatureAC(List<ListObject> abilities) {
        this.abilities = abilities;
    }

    public List<ListObject> getAbilities() {
        return abilities;
    }

    public void setAbilities(List<ListObject> abilities) {
        this.abilities = abilities;
    }
}
