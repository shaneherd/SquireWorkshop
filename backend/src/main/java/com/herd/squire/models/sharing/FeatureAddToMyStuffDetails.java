package com.herd.squire.models.sharing;

import com.herd.squire.models.powers.Feature;

public class FeatureAddToMyStuffDetails extends AddToMyStuffDetails {
    private Feature authorFeature;

    public FeatureAddToMyStuffDetails(long authorPowerId, int authorUserId, int authorTypeId, long existingPowerId, int existingTypeId, Feature authorFeature) {
        super(authorPowerId, authorUserId, authorTypeId, existingPowerId, existingTypeId);
        this.authorFeature = authorFeature;
    }

    public Feature getAuthorFeature() {
        return authorFeature;
    }

    public void setAuthorFeature(Feature authorFeature) {
        this.authorFeature = authorFeature;
    }
}
