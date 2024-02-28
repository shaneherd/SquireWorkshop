package com.herd.squire.models.creatures.characters.settings;

public class CharacterSpeedSetting {
    private boolean useHalf;
    private boolean roundUp;

    public CharacterSpeedSetting() {
        useHalf = true;
        roundUp = false;
    }

    public CharacterSpeedSetting(boolean useHalf, boolean roundUp) {
        this.useHalf = useHalf;
        this.roundUp = roundUp;
    }

    public boolean isUseHalf() {
        return useHalf;
    }

    public void setUseHalf(boolean useHalf) {
        this.useHalf = useHalf;
    }

    public boolean isRoundUp() {
        return roundUp;
    }

    public void setRoundUp(boolean roundUp) {
        this.roundUp = roundUp;
    }
}
