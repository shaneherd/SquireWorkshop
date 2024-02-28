package com.herd.squire.models.creatures.characters.settings;

import java.util.HashMap;
import java.util.Map;

public enum CharacterSetting {
    RESTRICT_TO_TWENTY(1),
    HIDE_EMPTY_SLOTS(2),
    AUTO_CONVERT_CURRENCY(3),
    CALCULATE_CURRENCY_WEIGHT(4),
    USE_ENCUMBRANCE(5),
    SHOW_HIT_DICE(6),
    HIGHLIGHT_VALUES(7),
    FLASH_LCD(8),
    AUTO_ROLL_CONCENTRATION_CHECKS(9),
    POSTPONE_CONCENTRATION_CHECKS(10),
    REMOVE_PRONE_ON_REVIVE(11),
    DROP_ITEMS_WHEN_DYING(12),
    ATTACK_WITH_UNEQUIPPED(13),
    HIDE_UNPREPARED_SPELL_QUICK_ATTACKS(14),
    NOT_USED(15),
    NOT_USED_2(16),
    SPELLS_DISPLAY_TAGS(17),
    FEATURES_DISPLAY_TAGS(18),
    DISPLAY_PASSIVE(19),
    ALLOW_FEAT_SELECTION(20),
    ASI_FEAT_ONE_ONLY(21),
    AUTO_IGNORE_UNSELECTED_FEATURES(22),
    SPEED_TO_DISPLAY(23),
    SWIMMING_USE_HALF(24),
    SWIMMING_ROUND_UP(25),
    CRAWLING_USE_HALF(26),
    CRAWLING_ROUND_UP(27),
    CLIMBING_USE_HALF(28),
    CLIMBING_ROUND_UP(29),
    AUTO_IGNORE_UNSELECTED_ASI(30),
    MAX_COLUMNS(31),
    HEALTH_SHOW_PROGRESS_BAR(32),
    CARRYING_SHOW_PROGRESS_BAR(33),
    LEVEL_SHOW_PROGRESS_BAR(34),
    AUTO_IGNORE_UNSELECTED_SPELLS(35),
    SPELLS_HIGHLIGHT_ACTIVE(36),
    FEATURES_HIGHLIGHT_ACTIVE(37),
    FEATURES_HIGHLIGHT_NON_ACTIVE(38),
    DISPLAY_CLASS_SPELLCASTING(39),
    DISPLAY_RACE_SPELLCASTING(40),
    DISPLAY_BACKGROUND_SPELLCASTING(41),
    DISPLAY_OTHER_SPELLCASTING(42),
    MAX_ATTUNED_ITEMS(43),
    ENFORCE_ATTUNED_LIMIT(44);

    private final int value;
    private static final Map<Integer, CharacterSetting> map = new HashMap<>();

    CharacterSetting(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CharacterSetting CharacterSetting : CharacterSetting.values()) {
            map.put(CharacterSetting.value, CharacterSetting);
        }
    }

    public static CharacterSetting valueOf(int CharacterSetting) {
        return map.get(CharacterSetting);
    }
}
