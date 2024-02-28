package com.herd.squire.models.powers;

import com.herd.squire.models.ListObject;

import java.util.List;

public class PowerList {
    private List<ListObject> powers;

    public PowerList() {
    }

    public PowerList(List<ListObject> powers) {
        this.powers = powers;
    }

    public List<ListObject> getPowers() {
        return powers;
    }

    public void setPowers(List<ListObject> powers) {
        this.powers = powers;
    }
}
