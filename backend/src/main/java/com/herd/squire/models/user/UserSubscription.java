package com.herd.squire.models.user;

import java.sql.Timestamp;
import java.util.Date;

public class UserSubscription {
    private UserSubscriptionType type;
    private Timestamp expiration;
    private Long paddleSubscriptionId;
    private Long paddleSubscriptionPlanId;
    private String paddleSubscriptionStatus; //active, trialing, past_due, paused, deleted
    private String paddleUpdateUrl;
    private String paddleCancelUrl;
    private Date nextBillDate;

    public UserSubscription() {}

    public UserSubscription(UserSubscriptionType type, Timestamp expiration,
                            Long paddleSubscriptionId, Long paddleSubscriptionPlanId, String paddleSubscriptionStatus,
                            String paddleUpdateUrl, String paddleCancelUrl, Date nextBillDate) {
        this.type = type;
        this.expiration = expiration;
        this.paddleSubscriptionId = paddleSubscriptionId;
        this.paddleSubscriptionPlanId = paddleSubscriptionPlanId;
        this.paddleSubscriptionStatus = paddleSubscriptionStatus;
        this.paddleUpdateUrl = paddleUpdateUrl;
        this.paddleCancelUrl = paddleCancelUrl;
        this.nextBillDate = nextBillDate;
    }

    public UserSubscriptionType getType() {
        return type;
    }

    public void setType(UserSubscriptionType type) {
        this.type = type;
    }

    public Timestamp getExpiration() {
        return expiration;
    }

    public void setExpiration(Timestamp expiration) {
        this.expiration = expiration;
    }

    public Long getPaddleSubscriptionId() {
        return paddleSubscriptionId;
    }

    public void setPaddleSubscriptionId(Long paddleSubscriptionId) {
        this.paddleSubscriptionId = paddleSubscriptionId;
    }

    public Long getPaddleSubscriptionPlanId() {
        return paddleSubscriptionPlanId;
    }

    public void setPaddleSubscriptionPlanId(Long paddleSubscriptionPlanId) {
        this.paddleSubscriptionPlanId = paddleSubscriptionPlanId;
    }

    public String getPaddleSubscriptionStatus() {
        return paddleSubscriptionStatus;
    }

    public void setPaddleSubscriptionStatus(String paddleSubscriptionStatus) {
        this.paddleSubscriptionStatus = paddleSubscriptionStatus;
    }

    public String getPaddleUpdateUrl() {
        return paddleUpdateUrl;
    }

    public void setPaddleUpdateUrl(String paddleUpdateUrl) {
        this.paddleUpdateUrl = paddleUpdateUrl;
    }

    public String getPaddleCancelUrl() {
        return paddleCancelUrl;
    }

    public void setPaddleCancelUrl(String paddleCancelUrl) {
        this.paddleCancelUrl = paddleCancelUrl;
    }

    public Date getNextBillDate() {
        return nextBillDate;
    }

    public void setNextBillDate(Date nextBillDate) {
        this.nextBillDate = nextBillDate;
    }
}
