package com.herd.squire.models.creatures;

import java.util.ArrayList;
import java.util.List;

public class CreaturePowerList {
    private List<CreaturePower> creaturePowers;

    public CreaturePowerList() {
        this.creaturePowers = new ArrayList<>();
    }

    public CreaturePowerList(List<CreaturePower> creaturePowers) {
        this.creaturePowers = creaturePowers;
    }

    public List<CreaturePower> getCreaturePowers() {
        return creaturePowers;
    }

    public void setCreaturePowers(List<CreaturePower> creaturePowers) {
        this.creaturePowers = creaturePowers;
    }
}
