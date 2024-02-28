package com.herd.squire.models.campaigns.encounters;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.damages.DamageConfigurationSimple;

import java.util.ArrayList;
import java.util.List;

public class CombatCondition {
    private String id;
    private ListObject condition;
    private String name;
    private boolean endsOnSave;
    private int saveDc;
    private ListObject saveType;
    private boolean endsOnRoundsCount;
    private int numRounds;
    private int roundStarted;
    private boolean endsOnTargetTurn;
    private String targetCreatureId;
    private CreatureTurnPhase targetCreatureTurnPhase;
    private boolean onGoingDamage;
    private List<DamageConfigurationSimple> damages;

    public CombatCondition() {
        this.damages = new ArrayList<>();
    }

    public CombatCondition(String id, ListObject condition, String name, boolean endsOnSave, int saveDc, ListObject saveType,
                           boolean endsOnRoundsCount, int numRounds, int roundStarted, boolean endsOnTargetTurn,
                           String targetCreatureId, CreatureTurnPhase targetCreatureTurnPhase, boolean onGoingDamage) {
        this.id = id;
        this.condition = condition;
        this.name = name;
        this.endsOnSave = endsOnSave;
        this.saveDc = saveDc;
        this.saveType = saveType;
        this.endsOnRoundsCount = endsOnRoundsCount;
        this.numRounds = numRounds;
        this.roundStarted = roundStarted;
        this.endsOnTargetTurn = endsOnTargetTurn;
        this.targetCreatureId = targetCreatureId;
        this.targetCreatureTurnPhase = targetCreatureTurnPhase;
        this.onGoingDamage = onGoingDamage;
        this.damages = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ListObject getCondition() {
        return condition;
    }

    public void setCondition(ListObject condition) {
        this.condition = condition;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isEndsOnSave() {
        return endsOnSave;
    }

    public void setEndsOnSave(boolean endsOnSave) {
        this.endsOnSave = endsOnSave;
    }

    public int getSaveDc() {
        return saveDc;
    }

    public void setSaveDc(int saveDc) {
        this.saveDc = saveDc;
    }

    public ListObject getSaveType() {
        return saveType;
    }

    public void setSaveType(ListObject saveType) {
        this.saveType = saveType;
    }

    public boolean isEndsOnRoundsCount() {
        return endsOnRoundsCount;
    }

    public void setEndsOnRoundsCount(boolean endsOnRoundsCount) {
        this.endsOnRoundsCount = endsOnRoundsCount;
    }

    public int getNumRounds() {
        return numRounds;
    }

    public void setNumRounds(int numRounds) {
        this.numRounds = numRounds;
    }

    public int getRoundStarted() {
        return roundStarted;
    }

    public void setRoundStarted(int roundStarted) {
        this.roundStarted = roundStarted;
    }

    public boolean isEndsOnTargetTurn() {
        return endsOnTargetTurn;
    }

    public void setEndsOnTargetTurn(boolean endsOnTargetTurn) {
        this.endsOnTargetTurn = endsOnTargetTurn;
    }

    public String getTargetCreatureId() {
        return targetCreatureId;
    }

    public void setTargetCreatureId(String targetCreatureId) {
        this.targetCreatureId = targetCreatureId;
    }

    public CreatureTurnPhase getTargetCreatureTurnPhase() {
        return targetCreatureTurnPhase;
    }

    public void setTargetCreatureTurnPhase(CreatureTurnPhase targetCreatureTurnPhase) {
        this.targetCreatureTurnPhase = targetCreatureTurnPhase;
    }

    public boolean isOnGoingDamage() {
        return onGoingDamage;
    }

    public void setOnGoingDamage(boolean onGoingDamage) {
        this.onGoingDamage = onGoingDamage;
    }

    public List<DamageConfigurationSimple> getDamages() {
        return damages;
    }

    public void setDamages(List<DamageConfigurationSimple> damages) {
        this.damages = damages;
    }
}
