package com.herd.squire.models.rolls;

import java.util.List;

public class RollRequest {
    private RollType rollType;
    private String reason;
    private boolean halfOnMiss;
    private boolean advantage;
    private boolean disadvantage;
    private List<RollRequestDiceCollection> diceCollections;

    public RollRequest() {}

    public RollRequest(RollType rollType, String reason, boolean halfOnMiss, boolean advantage, boolean disadvantage, List<RollRequestDiceCollection> diceCollections) {
        this.rollType = rollType;
        this.reason = reason;
        this.halfOnMiss = halfOnMiss;
        this.advantage = advantage;
        this.disadvantage = disadvantage;
        this.diceCollections = diceCollections;
    }

    public RollType getRollType() {
        return rollType;
    }

    public void setRollType(RollType rollType) {
        this.rollType = rollType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean isHalfOnMiss() {
        return halfOnMiss;
    }

    public void setHalfOnMiss(boolean halfOnMiss) {
        this.halfOnMiss = halfOnMiss;
    }

    public boolean isAdvantage() {
        return advantage;
    }

    public void setAdvantage(boolean advantage) {
        this.advantage = advantage;
    }

    public boolean isDisadvantage() {
        return disadvantage;
    }

    public void setDisadvantage(boolean disadvantage) {
        this.disadvantage = disadvantage;
    }

    public List<RollRequestDiceCollection> getDiceCollections() {
        return diceCollections;
    }

    public void setDiceCollections(List<RollRequestDiceCollection> diceCollections) {
        this.diceCollections = diceCollections;
    }
}
