package com.herd.squire.models.rolls;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Roll {
    private String id;
    private RollType rollType;
    private String reason;
    private boolean halfOnMiss;
    private boolean advantage;
    private boolean disadvantage;
    private boolean critical;
    private Date timestamp;
    private List<RollResult> results;
    private int totalResult;
    private List<Roll> childrenRolls;

    public Roll() {
        results = new ArrayList<>();
    }

    public Roll(String id, RollType rollType, String reason, boolean halfOnMiss, boolean advantage, boolean disadvantage, boolean critical,
                Date timestamp, List<RollResult> results, int totalResult) {
        this.id = id;
        this.rollType = rollType;
        this.reason = reason;
        this.halfOnMiss = (rollType == RollType.ATTACK || rollType == RollType.SAVE) && halfOnMiss;
        this.advantage = (rollType == RollType.STANDARD || rollType == RollType.ATTACK) && advantage;
        this.disadvantage = (rollType == RollType.STANDARD || rollType == RollType.ATTACK) && disadvantage;
        this.critical = (rollType == RollType.STANDARD || rollType == RollType.ATTACK) && critical;
        this.timestamp = timestamp;
        this.results = results;
        this.childrenRolls = new ArrayList<>();

        if (results == null) {
            this.results = new ArrayList<>();
        }
        this.setTotalResult(totalResult);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public boolean isCritical() {
        return critical;
    }

    public void setCritical(boolean critical) {
        this.critical = critical;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public List<RollResult> getResults() {
        return results;
    }

    public void setResults(List<RollResult> results) {
        this.results = results;
        if (this.results != null) {
            this.setTotalResult(0);
        }
    }

    public void setTotalResult(int totalResult) {
        this.totalResult = totalResult;
        if (getResults() != null && getResults().size() > 0) {
            int roll1 = getResults().get(0).getTotalResult();
            if (getResults().size() > 1 && (isAdvantage() || isDisadvantage()) && !(isAdvantage() && isDisadvantage())) {
                int roll2 = getResults().get(1).getTotalResult();
                if (isAdvantage()) {
                    this.totalResult = Math.max(roll1, roll2);
                } else {
                    this.totalResult = Math.min(roll1, roll2);
                }
            } else {
                this.totalResult = roll1;
            }
        }
    }

    public int getTotalResult() {
        return this.totalResult;
    }

    public List<Roll> getChildrenRolls() {
        return childrenRolls;
    }

    public void setChildrenRolls(List<Roll> childrenRolls) {
        this.childrenRolls = childrenRolls;
    }
}
