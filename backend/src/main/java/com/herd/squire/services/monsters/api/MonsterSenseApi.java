package com.herd.squire.services.monsters.api;

import com.herd.squire.models.Sense;

public class MonsterSenseApi {
    private Sense type;
    private int range;

    public MonsterSenseApi(Sense type, int range) {
        this.type = type;
        this.range = range;
    }

    public Sense getType() {
        return type;
    }

    public int getRange() {
        return range;
    }
}
