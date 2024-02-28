package com.herd.squire.models.creatures;

import com.herd.squire.models.Tag;

import java.util.ArrayList;
import java.util.List;

public class CreatureFeatures {
    private List<CreatureFeature> features;
    private List<Tag> tags;

    public CreatureFeatures() {
        this.features = new ArrayList<>();
        this.tags = new ArrayList<>();
    }

    public CreatureFeatures(List<CreatureFeature> features, List<Tag> tags) {
        this.features = features;
        this.tags = tags;
    }

    public List<CreatureFeature> getFeatures() {
        return features;
    }

    public void setFeatures(List<CreatureFeature> features) {
        this.features = features;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
