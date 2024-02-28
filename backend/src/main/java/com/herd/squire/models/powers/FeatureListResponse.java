package com.herd.squire.models.powers;

import java.util.ArrayList;
import java.util.List;

public class FeatureListResponse {
    private List<FeatureListObject> features;
    private boolean hasMore;

    public FeatureListResponse() {
        this.features = new ArrayList<>();
    }

    public FeatureListResponse(List<FeatureListObject> features, boolean hasMore) {
        this.features = features;
        this.hasMore = hasMore;
    }

    public List<FeatureListObject> getFeatures() {
        return features;
    }

    public void setFeatures(List<FeatureListObject> features) {
        this.features = features;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }
}
