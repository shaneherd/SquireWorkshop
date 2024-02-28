package com.herd.squire.models.creatures;

import java.util.ArrayList;
import java.util.List;

public class CreatureHealth {
    private int currentHp;
    private int tempHp;
    private int maxHpMod;
    private List<CreatureHitDice> creatureHitDice;
    private int numDeathSaveThrowSuccesses;
    private int numDeathSaveThrowFailures;
    private int deathSaveMod;
    private boolean deathSaveAdvantage;
    private boolean deathSaveDisadvantage;
    private int resurrectionPenalty;
    private CreatureState creatureState;
    private int exhaustionLevel;

    public CreatureHealth() {
        this.creatureHitDice = new ArrayList<>();
        this.creatureState = CreatureState.CONSCIOUS;
    }

    public CreatureHealth(int currentHp, int temp, int maxHpMod) {
        this.currentHp = currentHp;
        this.tempHp = temp;
        this.maxHpMod = maxHpMod;
        this.creatureState = CreatureState.CONSCIOUS;
        this.creatureHitDice = new ArrayList<>();
    }

    public CreatureHealth(int currentHp, int tempHp, int maxHpMod, List<CreatureHitDice> creatureHitDice,
                          int numDeathSaveThrowSuccesses, int numDeathSaveThrowFailures, int deathSaveMod,
                          boolean deathSaveAdvantage, boolean deathSaveDisadvantage,
                          int resurrectionPenalty, CreatureState creatureState, int exhaustionLevel) {
        this.currentHp = currentHp;
        this.tempHp = tempHp;
        this.maxHpMod = maxHpMod;
        this.creatureHitDice = creatureHitDice;
        this.numDeathSaveThrowSuccesses = numDeathSaveThrowSuccesses;
        this.numDeathSaveThrowFailures = numDeathSaveThrowFailures;
        this.deathSaveMod = deathSaveMod;
        this.deathSaveAdvantage = deathSaveAdvantage;
        this.deathSaveDisadvantage = deathSaveDisadvantage;
        this.resurrectionPenalty = resurrectionPenalty;
        this.creatureState = creatureState;
        this.exhaustionLevel = exhaustionLevel;
    }

    public int getCurrentHp() {
        return currentHp;
    }

    public void setCurrentHp(int currentHp) {
        this.currentHp = currentHp;
    }

    public int getTempHp() {
        return tempHp;
    }

    public void setTempHp(int tempHp) {
        this.tempHp = tempHp;
    }

    public int getMaxHpMod() {
        return maxHpMod;
    }

    public void setMaxHpMod(int maxHpMod) {
        this.maxHpMod = maxHpMod;
    }

    public List<CreatureHitDice> getCreatureHitDice() {
        return creatureHitDice;
    }

    public void setCreatureHitDice(List<CreatureHitDice> creatureHitDice) {
        this.creatureHitDice = creatureHitDice;
    }

    public int getNumDeathSaveThrowSuccesses() {
        return numDeathSaveThrowSuccesses;
    }

    public void setNumDeathSaveThrowSuccesses(int numDeathSaveThrowSuccesses) {
        this.numDeathSaveThrowSuccesses = numDeathSaveThrowSuccesses;
    }

    public int getNumDeathSaveThrowFailures() {
        return numDeathSaveThrowFailures;
    }

    public void setNumDeathSaveThrowFailures(int numDeathSaveThrowFailures) {
        this.numDeathSaveThrowFailures = numDeathSaveThrowFailures;
    }

    public int getDeathSaveMod() {
        return deathSaveMod;
    }

    public void setDeathSaveMod(int deathSaveMod) {
        this.deathSaveMod = deathSaveMod;
    }

    public boolean isDeathSaveAdvantage() {
        return deathSaveAdvantage;
    }

    public void setDeathSaveAdvantage(boolean deathSaveAdvantage) {
        this.deathSaveAdvantage = deathSaveAdvantage;
    }

    public boolean isDeathSaveDisadvantage() {
        return deathSaveDisadvantage;
    }

    public void setDeathSaveDisadvantage(boolean deathSaveDisadvantage) {
        this.deathSaveDisadvantage = deathSaveDisadvantage;
    }

    public int getResurrectionPenalty() {
        return resurrectionPenalty;
    }

    public void setResurrectionPenalty(int resurrectionPenalty) {
        this.resurrectionPenalty = resurrectionPenalty;
    }

    public CreatureState getCreatureState() {
        return creatureState;
    }

    public void setCreatureState(CreatureState creatureState) {
        this.creatureState = creatureState;
    }

    public int getExhaustionLevel() {
        return exhaustionLevel;
    }

    public void setExhaustionLevel(int exhaustionLevel) {
        this.exhaustionLevel = exhaustionLevel;
    }
}
