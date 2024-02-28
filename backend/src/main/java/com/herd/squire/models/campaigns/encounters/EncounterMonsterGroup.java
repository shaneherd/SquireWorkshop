package com.herd.squire.models.campaigns.encounters;

import com.herd.squire.models.creatures.characters.HealthCalculationType;
import com.herd.squire.models.monsters.MonsterSummary;

import java.util.ArrayList;
import java.util.List;

public class EncounterMonsterGroup {
    private String id;
    private int groupNumber;
    private String displayName;
    private MonsterSummary monster;
    private HealthCalculationType healthCalculationType;
    private boolean groupedHp;
    private boolean groupedInitiative;
    private int order;
    private List<EncounterMonster> monsters;

    public EncounterMonsterGroup() {
        this.monsters = new ArrayList<>();
    }

    public EncounterMonsterGroup(String id, String displayName, MonsterSummary monster,
                                 HealthCalculationType healthCalculationType, boolean groupedHp,
                                 boolean groupedInitiative) {
        this.id = id;
        this.displayName = displayName;
        this.monster = monster;
        this.healthCalculationType = healthCalculationType;
        this.groupedHp = groupedHp;
        this.groupedInitiative = groupedInitiative;
        this.monsters = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(int groupNumber) {
        this.groupNumber = groupNumber;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public MonsterSummary getMonster() {
        return monster;
    }

    public void setMonster(MonsterSummary monster) {
        this.monster = monster;
    }

    public int getQuantity() {
        return this.monsters.size();
    }

    public void setQuantity(int quantity) { }

    public HealthCalculationType getHealthCalculationType() {
        return healthCalculationType;
    }

    public void setHealthCalculationType(HealthCalculationType healthCalculationType) {
        this.healthCalculationType = healthCalculationType;
    }

    public boolean isGroupedHp() {
        return groupedHp;
    }

    public void setGroupedHp(boolean groupedHp) {
        this.groupedHp = groupedHp;
    }

    public boolean isGroupedInitiative() {
        return groupedInitiative;
    }

    public void setGroupedInitiative(boolean groupedInitiative) {
        this.groupedInitiative = groupedInitiative;
    }

    public int getOrder() {
        if (this.monsters.isEmpty()) {
            return 0;
        }
        return this.monsters.get(0).getOrder();
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public List<EncounterMonster> getMonsters() {
        return monsters;
    }

    public void setMonsters(List<EncounterMonster> monsters) {
        this.monsters = monsters;
    }
}
