package com.herd.squire.models.powers;

import com.herd.squire.models.Tag;

import java.util.ArrayList;
import java.util.List;

public class PowerTags {
    private String powerId;
    private List<Tag> tags;

    public PowerTags() {
        this.tags = new ArrayList<>();
    }

    public PowerTags(String powerId, List<Tag> tags) {
        this.powerId = powerId;
        this.tags = tags;
    }

    public String getPowerId() {
        return powerId;
    }

    public void setPowerId(String powerId) {
        this.powerId = powerId;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
