package com.herd.squire.models.inUse;

import com.herd.squire.models.characteristics.CharacteristicType;

public class InUseCharacteristic extends InUse {
    private CharacteristicType characteristicType;

    public InUseCharacteristic() {
        super();
    }

    public InUseCharacteristic(int subTypeId, String id, String name, boolean required) {
        super(id, name, required, InUseType.CHARACTERISTIC);
        this.characteristicType = CharacteristicType.valueOf(subTypeId);
    }

    public CharacteristicType getCharacteristicType() {
        return characteristicType;
    }

    public void setCharacteristicType(CharacteristicType characteristicType) {
        this.characteristicType = characteristicType;
    }
}
