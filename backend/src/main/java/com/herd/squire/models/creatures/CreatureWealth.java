package com.herd.squire.models.creatures;

import java.util.ArrayList;
import java.util.List;

public class CreatureWealth {
    private List<CreatureWealthAmount> amounts;

    public CreatureWealth() {
        this.amounts = new ArrayList<>();
    }

    public CreatureWealth(List<CreatureWealthAmount> amounts) {
        this.amounts = amounts;
    }

    public List<CreatureWealthAmount> getAmounts() {
        return amounts;
    }

    public void setAmounts(List<CreatureWealthAmount> amounts) {
        this.amounts = amounts;
    }
}
