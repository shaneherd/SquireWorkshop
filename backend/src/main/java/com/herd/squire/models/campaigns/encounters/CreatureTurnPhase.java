package com.herd.squire.models.campaigns.encounters;

import java.util.HashMap;
import java.util.Map;

public enum CreatureTurnPhase {
    START(1),
    END(2);

    private final int value;
    private static final Map<Integer, CreatureTurnPhase> map = new HashMap<>();

    CreatureTurnPhase(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CreatureTurnPhase creatureTurnPhase : CreatureTurnPhase.values()) {
            map.put(creatureTurnPhase.value, creatureTurnPhase);
        }
    }

    public static CreatureTurnPhase valueOf(int creatureTurnPhase) {
        return map.get(creatureTurnPhase);
    }
}
