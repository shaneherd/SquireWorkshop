package com.herd.squire.models.powers;

import java.util.ArrayList;
import java.util.List;

public class SpellListResponse {
    private List<SpellListObject> spells;
    private boolean hasMore;

    public SpellListResponse() {
        this.spells = new ArrayList<>();
    }

    public SpellListResponse(List<SpellListObject> spells, boolean hasMore) {
        this.spells = spells;
        this.hasMore = hasMore;
    }

    public List<SpellListObject> getSpells() {
        return spells;
    }

    public void setSpells(List<SpellListObject> spells) {
        this.spells = spells;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }
}
