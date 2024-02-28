package com.herd.squire.models.monsters;

import java.util.HashMap;
import java.util.Map;

public enum ChallengeRating {
    //todo - make this an attribute?
    ZERO(1, "0", 10, 2),
    EIGHTH(2, "1/8", 25, 2),
    QUARTER(3, "1/4", 50, 2),
    HALF(4, "1/2", 100, 2),
    ONE(5, "1", 200, 2),
    TWO(6, "2", 450, 2),
    THREE(7, "3", 700, 2),
    FOUR(8, "4", 1100, 2),
    FIVE(9, "5", 1800, 3),
    SIX(10, "6", 2300, 3),
    SEVEN(11, "7", 2900, 3),
    EIGHT(12, "8", 3900, 3),
    NINE(13, "9", 5000, 4),
    TEN(14, "10", 5900, 4),
    ELEVEN(15, "11", 7200, 4),
    TWELVE(16, "12", 8400, 4),
    THIRTEEN(17, "13", 10000, 5),
    FOURTEEN(18, "14", 11500, 5),
    FIFTEEN(19, "15", 13000, 5),
    SIXTEEN(20, "16", 15000, 5),
    SEVENTEEN(21, "17", 18000, 6),
    EIGHTEEN(22, "18", 20000, 6),
    NINETEEN(23, "19", 22000, 6),
    TWENTY(24, "20", 25000, 6),
    TWENTY_ONE(25, "21", 33000, 7),
    TWENTY_TWO(26, "22", 41000, 7),
    TWENTY_THREE(27, "23", 50000, 7),
    TWENTY_FOUR(28, "24", 62000, 7),
    TWENTY_FIVE(29, "25", 75000, 8),
    TWENTY_SIX(30, "26", 90000, 8),
    TWENTY_SEVEN(31, "27", 105000, 8),
    TWENTY_EIGHT(32, "28", 120000, 8),
    TWENTY_NINE(33, "29", 135000, 9),
    THIRTY(34, "30", 155000, 9);

    private final int id;
    private final String name;
    private final int exp;
    private final int profBonus;

    private static final Map<Integer, ChallengeRating> map = new HashMap<>();

    ChallengeRating(int id, String name, int exp, int profBonus) {
        this.id = id;
        this.name = name;
        this.exp = exp;
        this.profBonus = profBonus;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getExp() {
        return exp;
    }

    public int getProfBonus() {
        return profBonus;
    }

    static {
        for (ChallengeRating challengeRating : ChallengeRating.values()) {
            map.put(challengeRating.id, challengeRating);
        }
    }

    public static ChallengeRating valueOf(int challengeRating) {
        return map.get(challengeRating);
    }
}
