package com.herd.squire.models.creatures.battle_monsters;

import com.herd.squire.models.creatures.Creature;
import com.herd.squire.models.creatures.CreatureType;
import com.herd.squire.models.monsters.Monster;
import com.herd.squire.models.monsters.MonsterSummary;

import java.util.ArrayList;
import java.util.List;

public class BattleMonster extends Creature {
    private String monsterId;
    private Monster monster;
    private int maxHp;
    private List<BattleMonsterFeature> features;
    private List<BattleMonsterAction> actions;
    private BattleMonsterSettings settings;
    private int legendaryPoints;
    private int maxLegendaryPoints;

    public BattleMonster() {
        super();
        this.features = new ArrayList<>();
        this.actions = new ArrayList<>();
        this.settings = new BattleMonsterSettings();
    }

    public BattleMonster(String id, String name, String monsterId, int maxHp, int legendaryPoints, int maxLegendaryPoints) {
        super(id, name, CreatureType.MONSTER, 0, 0, null);
        this.monsterId = monsterId;
        this.maxHp = maxHp;
        this.legendaryPoints = legendaryPoints;
        this.maxLegendaryPoints = maxLegendaryPoints;
        this.features = new ArrayList<>();
        this.actions = new ArrayList<>();
        this.settings = new BattleMonsterSettings();
    }

    public String getMonsterId() {
        return monsterId;
    }

    public void setMonsterId(String monsterId) {
        this.monsterId = monsterId;
    }

    public Monster getMonster() {
        return monster;
    }

    public void setMonster(Monster monster) {
        this.monster = monster;
    }

    public int getMaxHp() {
        return maxHp;
    }

    public void setMaxHp(int maxHp) {
        this.maxHp = maxHp;
    }

    public List<BattleMonsterFeature> getFeatures() {
        return features;
    }

    public void setFeatures(List<BattleMonsterFeature> features) {
        this.features = features;
    }

    public List<BattleMonsterAction> getActions() {
        return actions;
    }

    public void setActions(List<BattleMonsterAction> actions) {
        this.actions = actions;
    }

    public BattleMonsterSettings getSettings() {
        return settings;
    }

    public void setSettings(BattleMonsterSettings settings) {
        this.settings = settings;
    }

    public int getLegendaryPoints() {
        return legendaryPoints;
    }

    public void setLegendaryPoints(int legendaryPoints) {
        this.legendaryPoints = legendaryPoints;
    }

    public int getMaxLegendaryPoints() {
        return maxLegendaryPoints;
    }

    public void setMaxLegendaryPoints(int maxLegendaryPoints) {
        this.maxLegendaryPoints = maxLegendaryPoints;
    }
}
