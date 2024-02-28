package com.herd.squire.models.powers;

import java.util.ArrayList;
import java.util.List;

public class PowerTagList {
    private List<PowerTags> powerTags;
    private List<TagPowers> tagPowers;

    public PowerTagList() {
        this.powerTags = new ArrayList<>();
        this.tagPowers = new ArrayList<>();
    }

    public PowerTagList(List<PowerTags> powerTags, List<TagPowers> tagPowers) {
        this.powerTags = powerTags;
        this.tagPowers = tagPowers;
    }

    public List<PowerTags> getPowerTags() {
        return powerTags;
    }

    public void setPowerTags(List<PowerTags> powerTags) {
        this.powerTags = powerTags;
    }

    public List<TagPowers> getTagPowers() {
        return tagPowers;
    }

    public void setTagPowers(List<TagPowers> tagPowers) {
        this.tagPowers = tagPowers;
    }
}
