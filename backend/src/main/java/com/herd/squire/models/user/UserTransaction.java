package com.herd.squire.models.user;

import java.sql.Timestamp;

public class UserTransaction {
    private UserTransactionType userTransactionType;
    private Timestamp eventTime;
    private Long paddleSubscriptionPlanId;
    private Long paddleProductId;

    public UserTransaction() { }

    public UserTransaction(UserTransactionType userTransactionType) {
        this.userTransactionType = userTransactionType;
        this.eventTime = new Timestamp(System.currentTimeMillis());
        this.paddleSubscriptionPlanId = null;
        this.paddleProductId = null;
    }

    public UserTransaction(UserTransactionType userTransactionType, Long paddleSubscriptionPlanId, Long paddleProductId) {
        this.userTransactionType = userTransactionType;
        this.eventTime = new Timestamp(System.currentTimeMillis());
        this.paddleSubscriptionPlanId = paddleSubscriptionPlanId;
        this.paddleProductId = paddleProductId;
    }

    public UserTransactionType getUserTransactionType() {
        return userTransactionType;
    }

    public void setUserTransactionType(UserTransactionType userTransactionType) {
        this.userTransactionType = userTransactionType;
    }

    public Timestamp getEventTime() {
        return eventTime;
    }

    public void setEventTime(Timestamp eventTime) {
        this.eventTime = eventTime;
    }

    public Long getPaddleSubscriptionPlanId() {
        return paddleSubscriptionPlanId;
    }

    public void setPaddleSubscriptionPlanId(Long paddleSubscriptionPlanId) {
        this.paddleSubscriptionPlanId = paddleSubscriptionPlanId;
    }

    public Long getPaddleProductId() {
        return paddleProductId;
    }

    public void setPaddleProductId(Long paddleProductId) {
        this.paddleProductId = paddleProductId;
    }
}
