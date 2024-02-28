package com.herd.squire.services.powers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DamageApiService {
    public static void processDamages(String description, String higherLevels, List<DamageApi> damages, List<DamageApi> higher, List<DamageApi> advancementDamageAmounts) {
        String damagesPattern = "(takes|take|and|deals|deals\\san\\sextra)\\s+(\\d+d\\d+)\\s+(\\w+)\\s+damage";
        Pattern pattern = Pattern.compile(damagesPattern);
        Matcher matcher = pattern.matcher(description);
        String originalDamageType = null;
        while (matcher.find( )) {
            String damageAmount = matcher.group(2);
            String damageType = matcher.group(3);
            String[] damageParts = damageAmount.split("d");
            if (damageParts.length == 2) {
                String numDice = damageParts[0];
                String diceSize = damageParts[1];
                String damageTypeId = PowerApiService.getDamageTypeId(damageType);
                if (originalDamageType == null) {
                    originalDamageType = damageTypeId;
                }
                damages.add(new DamageApi(numDice, diceSize, null, damageTypeId, null,false));
            }
        }

        String damagesWithModifiersPattern = "(takes|take|and|deals|deals\\san\\sextra)\\s+(\\d+d\\d+)\\s+\\+\\s(\\d+)\\s(\\w+)\\sdamage";
        pattern = Pattern.compile(damagesWithModifiersPattern);
        matcher = pattern.matcher(description);
        while (matcher.find( )) {
            String damageAmount = matcher.group(2);
            String modifier = matcher.group(3);
            String damageType = matcher.group(4);
            String[] damageParts = damageAmount.split("d");
            if (damageParts.length == 2) {
                String numDice = damageParts[0];
                String diceSize = damageParts[1];
                String damageTypeId = PowerApiService.getDamageTypeId(damageType);
                if (originalDamageType == null) {
                    originalDamageType = damageTypeId;
                }
                damages.add(new DamageApi(numDice, diceSize, modifier, damageTypeId, null,false));
            }
        }

        String higherDamagesPattern = "(\\d+)(th|st|nd|rd)\\s(?:level\\sor\\shigher|or\\shigher\\slevel).*?(\\d+d\\d+).*?above\\s(\\d+)";
        pattern = Pattern.compile(higherDamagesPattern);
        matcher = pattern.matcher(higherLevels);
        while (matcher.find( )) {
            String damageAmount = matcher.group(3);
            String baseLevel = matcher.group(4);
            String[] damageParts = damageAmount.split("d");
            if (damageParts.length == 2) {
                String numDice = damageParts[0];
                String diceSize = damageParts[1];
                higher.add(new DamageApi(numDice, diceSize, null, originalDamageType, baseLevel,false));
            }
        }

        String advancementDamagesPattern = "(\\d+)(th|st|nd|rd)\\slevel\\s\\((\\d+d\\d+)\\)";
        pattern = Pattern.compile(advancementDamagesPattern);
        matcher = pattern.matcher(description);
        while (matcher.find( )) {
            String level = matcher.group(1);
            String damageAmount = matcher.group(3);
            String[] damageParts = damageAmount.split("d");
            if (damageParts.length == 2) {
                String numDice = "1";
                String diceSize = damageParts[1];
                advancementDamageAmounts.add(new DamageApi(numDice, diceSize, null, originalDamageType, level,false));
            }
        }
        matcher = pattern.matcher(higherLevels);
        while (matcher.find( )) {
            String level = matcher.group(1);
            String damageAmount = matcher.group(3);
            String[] damageParts = damageAmount.split("d");
            if (damageParts.length == 2) {
                String numDice = "1";
                String diceSize = damageParts[1];
                advancementDamageAmounts.add(new DamageApi(numDice, diceSize, null, originalDamageType, level,false));
            }
        }
    }

    public static void processHealing(String description, List<DamageApi> healingAmounts) {
        String healingPattern = "(regains|heals).*?(\\d+d\\d+)(\\s\\+\\syour\\sspellcasting\\sability\\smodifier)?";
        Pattern pattern = Pattern.compile(healingPattern);
        Matcher matcher = pattern.matcher(description);
        while (matcher.find( )) {
            String damageAmount = matcher.group(2);
            boolean includeAbility = matcher.groupCount() == 3;
            String[] healingParts = damageAmount.split("d");
            if (healingParts.length == 2) {
                String numDice = healingParts[0];
                String diceSize = healingParts[1];
                healingAmounts.add(new DamageApi(numDice, diceSize, null, null, null, includeAbility));
            }
        }

        String healingPatternModifiers = "(regains|heals).*?(\\d+d\\d+)\\s\\+\\s(\\d+)(\\s\\+\\syour\\sspellcasting\\sability\\smodifier)?";
        pattern = Pattern.compile(healingPatternModifiers);
        matcher = pattern.matcher(description);
        while (matcher.find( )) {
            String damageAmount = matcher.group(2);
            String modifier = matcher.group(3);
            boolean includeAbility = matcher.groupCount() == 4;
            String[] healingParts = damageAmount.split("d");
            if (healingParts.length == 2) {
                String numDice = healingParts[0];
                String diceSize = healingParts[1];
                healingAmounts.add(new DamageApi(numDice, diceSize, modifier, null, null, includeAbility));
            }
        }
    }

    public static List<String> getDamages(String id, List<DamageApi> damageAmounts, List<DamageApi> healingAmounts, List<DamageApi> higherDamageAmounts, List<DamageApi> advancementDamageAmounts) {
        List<String> damages = getDamageRows(id, damageAmounts);
        damages.addAll(getHealingRows(id, healingAmounts));
        damages.addAll(getHigherDamageRows(id, !healingAmounts.isEmpty(), higherDamageAmounts));
        damages.addAll(getAdvancementDamageRows(id, advancementDamageAmounts));
        return damages;
    }

    private static List<String> getDamageRows(String id, List<DamageApi> damageAmounts){
        List<String> damages = new ArrayList<>();
        for(DamageApi damage : damageAmounts) {
            damages.add(DamageApiService.getDamageRow(id, damage, false, false, false));
        }
        return damages;
    }

    private static List<String> getHealingRows(String id, List<DamageApi> healingAmounts){
        List<String> damages = new ArrayList<>();
        for(DamageApi damage : healingAmounts) {
            damages.add(DamageApiService.getDamageRow(id, damage, false, false, true));
        }
        return damages;
    }

    private static List<String> getHigherDamageRows(String id, boolean healing, List<DamageApi> higherDamageAmounts){
        List<String> damages = new ArrayList<>();
        for(DamageApi damage : higherDamageAmounts) {
            damages.add(DamageApiService.getDamageRow(id, damage, false, true, healing));
        }
        return damages;
    }

    private static List<String> getAdvancementDamageRows(String id, List<DamageApi> advancementDamageAmounts){
        List<String> damages = new ArrayList<>();
        for(DamageApi damage : advancementDamageAmounts) {
            damages.add(DamageApiService.getDamageRow(id, damage, true, false, false));
        }
        return damages;
    }

    private static String getDamageRow(String id, DamageApi damage, boolean advancement, boolean extra, boolean healing) {
        List<String> parts = new ArrayList<>();
        parts.add(id); //power_id
        parts.add(advancement ? "1": "0"); //character_advancement
        parts.add(extra ? "1": "0"); //extra
        parts.add(advancement ? PowerApiService.getLevelId(damage.level) : "null"); //character_level_id
        parts.add(damage.numDice); //num_dice
        parts.add(PowerApiService.getDiceId(damage.diceSize)); //dice_size
        parts.add("null"); //ability_modifier_id
        parts.add(damage.modifier == null ? "0" : damage.modifier); //misc_mod
        parts.add(healing ? "null" : damage.damageType); //damage_type_id
        parts.add(healing ? "1": "0"); //healing
        return PowerApiService.getRow(parts);
    }
}
