package com.herd.squire.models.creatures.battle_monsters;

import com.herd.squire.models.creatures.characters.settings.CharacterSpeedSettings;

public class BattleMonsterSettings {
    private CharacterSpeedSettings speed;

    public BattleMonsterSettings() {
        this.speed = new CharacterSpeedSettings();
    }

    public BattleMonsterSettings(CharacterSpeedSettings speed) {
        this.speed = speed;
    }

    public CharacterSpeedSettings getSpeed() {
        return speed;
    }

    public void setSpeed(CharacterSpeedSettings speed) {
        this.speed = speed;
    }
}
