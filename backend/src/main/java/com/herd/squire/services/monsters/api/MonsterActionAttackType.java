package com.herd.squire.services.monsters.api;

public enum MonsterActionAttackType {
    WEAPON_MELEE(1, "Weapon Melee"),
    WEAPON_RANGED(2, "Weapon Ranged"),
    SPELL(3, "Spell"),
    OTHER(4, "Other");

    private final int value;
    private final String name;

    MonsterActionAttackType(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public String getName(){
        return name;
    }

    public static MonsterActionAttackType getMonsterActionAttackType(int value){
        switch (value){
            case 1:
                return WEAPON_MELEE;
            case 2:
                return WEAPON_RANGED;
            case 3:
                return SPELL;
            case 4:
                return OTHER;
            default:
                return WEAPON_MELEE;
        }
    }
}
