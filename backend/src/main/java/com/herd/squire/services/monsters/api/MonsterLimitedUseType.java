package com.herd.squire.services.monsters.api;

public enum MonsterLimitedUseType {
    NUM_PER_DAY(1, "Num per day"),
    RECHARGE_RANGE(2, "Recharge Range");

    private final int value;
    private final String name;

    MonsterLimitedUseType(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public String getName(){
        return name;
    }

    public static MonsterLimitedUseType getLimitedUseType(int value){
        switch (value){
            case 1:
                return NUM_PER_DAY;
            case 2:
                return RECHARGE_RANGE;
            default:
                return NUM_PER_DAY;
        }
    }
}
