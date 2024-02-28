package com.herd.squire.models.sharing;

public class AddToMyStuffDetails {
    protected long authorPowerId;
    protected int authorUserId;
    protected int authorTypeId;

    protected long existingPowerId;
    protected int existingTypeId;

    public AddToMyStuffDetails(long authorPowerId, int authorUserId, int authorTypeId, long existingPowerId, int existingTypeId) {
        this.authorPowerId = authorPowerId;
        this.authorUserId = authorUserId;
        this.authorTypeId = authorTypeId;
        this.existingPowerId = existingPowerId;
        this.existingTypeId = existingTypeId;
    }

    public long getAuthorPowerId() {
        return authorPowerId;
    }

    public void setAuthorPowerId(long authorPowerId) {
        this.authorPowerId = authorPowerId;
    }

    public int getAuthorUserId() {
        return authorUserId;
    }

    public void setAuthorUserId(int authorUserId) {
        this.authorUserId = authorUserId;
    }

    public int getAuthorTypeId() {
        return authorTypeId;
    }

    public void setAuthorTypeId(int authorTypeId) {
        this.authorTypeId = authorTypeId;
    }

    public long getExistingPowerId() {
        return existingPowerId;
    }

    public void setExistingPowerId(long existingPowerId) {
        this.existingPowerId = existingPowerId;
    }

    public int getExistingTypeId() {
        return existingTypeId;
    }

    public void setExistingTypeId(int existingTypeId) {
        this.existingTypeId = existingTypeId;
    }
}
