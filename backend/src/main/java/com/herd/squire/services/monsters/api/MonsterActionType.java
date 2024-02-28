package com.herd.squire.services.monsters.api;

public enum MonsterActionType {
    NORMAL(1, "Normal"),
    LEGENDARY(2, "Legendary"),
    LAIR(3, "Lair"),
    REACTION(4, "Reaction");

    private final int value;
    private final String name;

    MonsterActionType(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public String getName(){
        return name;
    }

    public static MonsterActionType getMonsterActionType(int value){
        switch (value){
            case 1:
                return NORMAL;
            case 2:
                return LEGENDARY;
            case 3:
                return LAIR;
            case 4:
                return REACTION;
            default:
                return NORMAL;
        }
    }
}
