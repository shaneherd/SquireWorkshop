package com.herd.squire.services.powers;

import org.apache.commons.lang.WordUtils;

import java.util.List;

public class PowerApiService {
    public static String getAbilityIdValue(String ability) {
        switch (ability.toLowerCase()) {
            case "strength":
                return getIdValue("str", true);
            case "dexterity":
                return getIdValue("dex", true);
            case "constitution":
                return getIdValue("con", true);
            case "intelligence":
                return getIdValue("int", true);
            case "wisdom":
                return getIdValue("wis", true);
            case "charisma":
                return getIdValue("cha", true);
            default:
                return null;
        }
    }

    public static String getIdValue(String value) {
        return getIdValue(value, false);
    }

    public static String getIdValue(String value, boolean lowerFirst) {
        String id = WordUtils.capitalize(value);
        if (lowerFirst) {
            id = Character.toLowerCase(id.charAt(0)) + id.substring(1);
        }
        id = id.replaceAll(" ", "");
        id = id.replaceAll("'", "");
        id = id.replaceAll(",", "");
        id = id.replaceAll("/", "");
        id = id.replaceAll("-", "");
        id = id.replaceAll(":", "");
        id = id.replaceAll("\\(", "");
        id = id.replaceAll("\\)", "");
        id = id.replaceAll("\\+", "Plus");
        return "@" + id + "Id";
    }

    public static String getDiceId(String diceSize) {
        return getIdValue("d" + diceSize, true);
    }

    public static String getLevelId(String level) {
        return getIdValue("level" + level, true);
    }

    public static String getDamageTypeId(String damageType) {
        return getIdValue(damageType + "DamageType", true);
    }

    public static String getRow(List<String> parts) {
        if (parts.size() == 0) {
            return "";
        }
        String row = String.join(", ", parts);
        row = "(" + row + ")";
        return row;
    }
}
