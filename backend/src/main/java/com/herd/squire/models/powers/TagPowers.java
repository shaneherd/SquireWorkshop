package com.herd.squire.models.powers;

import java.util.ArrayList;
import java.util.List;

public class TagPowers {
    private String tagId;
    private List<String> powerIds;

    public TagPowers() {
        powerIds = new ArrayList<>();
    }

    public TagPowers(String tagId, List<String> powerIds) {
        this.tagId = tagId;
        this.powerIds = powerIds;
    }

    public String getTagId() {
        return tagId;
    }

    public void setTagId(String tagId) {
        this.tagId = tagId;
    }

    public List<String> getPowerIds() {
        return powerIds;
    }

    public void setPowerIds(List<String> powerIds) {
        this.powerIds = powerIds;
    }
}
