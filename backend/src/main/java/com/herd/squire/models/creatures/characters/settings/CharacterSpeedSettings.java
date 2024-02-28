package com.herd.squire.models.creatures.characters.settings;

import com.herd.squire.models.SpeedType;

public class CharacterSpeedSettings {
    private SpeedType speedToDisplay;
    private CharacterSpeedSetting swimming;
    private CharacterSpeedSetting climbing;
    private CharacterSpeedSetting crawling;

    public CharacterSpeedSettings() {
        speedToDisplay = SpeedType.WALK;
        swimming = new CharacterSpeedSetting();
        climbing = new CharacterSpeedSetting();
        crawling = new CharacterSpeedSetting();
    }

    public CharacterSpeedSettings(SpeedType speedToDisplay, CharacterSpeedSetting swimming, CharacterSpeedSetting climbing, CharacterSpeedSetting crawling) {
        this.speedToDisplay = speedToDisplay;
        this.swimming = swimming;
        this.climbing = climbing;
        this.crawling = crawling;
    }

    public SpeedType getSpeedToDisplay() {
        return speedToDisplay;
    }

    public void setSpeedToDisplay(SpeedType speedToDisplay) {
        this.speedToDisplay = speedToDisplay;
    }

    public CharacterSpeedSetting getSwimming() {
        return swimming;
    }

    public void setSwimming(CharacterSpeedSetting swimming) {
        this.swimming = swimming;
    }

    public CharacterSpeedSetting getClimbing() {
        return climbing;
    }

    public void setClimbing(CharacterSpeedSetting climbing) {
        this.climbing = climbing;
    }

    public CharacterSpeedSetting getCrawling() {
        return crawling;
    }

    public void setCrawling(CharacterSpeedSetting crawling) {
        this.crawling = crawling;
    }
}
