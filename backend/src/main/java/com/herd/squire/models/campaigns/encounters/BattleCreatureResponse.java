package com.herd.squire.models.campaigns.encounters;

import java.util.ArrayList;
import java.util.List;

public class BattleCreatureResponse {
    private List<String> ids;

    public BattleCreatureResponse() {
        this.ids = new ArrayList<>();
    }

    public BattleCreatureResponse(List<String> ids) {
        this.ids = ids;
    }

    public List<String> getIds() {
        return ids;
    }

    public void setIds(List<String> ids) {
        this.ids = ids;
    }
}
