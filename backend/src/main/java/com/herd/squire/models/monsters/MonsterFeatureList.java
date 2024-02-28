package com.herd.squire.models.monsters;

import java.util.ArrayList;
import java.util.List;

public class MonsterFeatureList {
    private List<MonsterFeature> features;

    public MonsterFeatureList() {
        this.features = new ArrayList<>();
    }

    public MonsterFeatureList(List<MonsterFeature> features) {
        this.features = features;
    }

    public List<MonsterFeature> getFeatures() {
        return features;
    }

    public void setFeatures(List<MonsterFeature> features) {
        this.features = features;
    }
}
