package com.herd.squire.services.powers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FeatureApiService {
    public static class FeatureApi {
        public String name;
        public String category;
        public String characteristicId;
        public String prerequisites;
        public String description;
        public String minimumLevel;
        public String range;
        public String areaOfEffectId;

        private String id;
        private String sid;

        private List<DamageApi> damageAmounts;
        private List<DamageApi> higherDamageAmounts;
        private List<DamageApi> advancementDamageAmounts;
        private List<DamageApi> healingAmounts;

        private String attackType; //@noneAttackTypeId
        private String temporaryHp;
        private String attackMod;
        private String saveTypeId;
        private String halfOnSave;
        private String extraDamage;
        private String numLevelsAboveBase;
        private String advancement;
        private String extraModifiers;
        private String modifiersNumLevelsAboveBase;
        private String modifierAdvancement;

        private String characteristicType;
        private String rangeType;
        private String rangeAmount;
        private String rangeUnit;
        private String radius;
        private String width;
        private String height;
        private String length;
        private String quantity;
        private String diceSize;
        private String rechargeOnShortRest;
        private String rechargeOnLongRest;
        private String passive;

        public FeatureApi(String name, String category, String characteristicId, String description,
                          String minimumLevel, String range, String areaOfEffectId) {
            this.name = name;
            this.category = category;
            this.characteristicId = characteristicId;
            this.prerequisites = "";
            this.description = description;
            this.minimumLevel = minimumLevel;
            this.range = range;
            this.areaOfEffectId = areaOfEffectId;

            process();
        }

        private void process() {
            this.id = PowerApiService.getIdValue(name);
            setCharacteristic();
            processPrerequisites();
            processDamages();
            setRange();
            setAreaOfEffect();
            setLimitedUse();
            this.attackMod = "0";
            this.extraModifiers = "0";
            this.modifiersNumLevelsAboveBase = "0";
            this.modifierAdvancement = "0";
        }

        private void setCharacteristic() {
            switch (category) {
                case "CLASS":
                    characteristicType = "@classId";
                    id = PowerApiService.getIdValue(characteristicId.substring(1, characteristicId.length() - 2) + name);
                    break;
                case "RACE":
                    characteristicType = "@raceId";
                    id = PowerApiService.getIdValue(characteristicId.substring(1, characteristicId.length() - 2) + name);
                    break;
                case "BACKGROUND":
                    characteristicType = "@backgroundId";
                    id = PowerApiService.getIdValue(characteristicId.substring(1, characteristicId.length() - 2) + name);
                    break;
                case "FEAT":
                default:
                    characteristicType = "null";
                    characteristicId = "null";
                    break;
            }
        }

        private void processPrerequisites() {
            String key = "Prerequisite:";
            if (description.indexOf(key) == 0) {
                prerequisites = description.substring(key.length() + 1, description.indexOf(';'));
                description = description.substring(description.indexOf(';') + 1);
            }
        }

        private void processDamages() {
            damageAmounts = new ArrayList<>();
            higherDamageAmounts = new ArrayList<>();
            advancementDamageAmounts = new ArrayList<>();
            healingAmounts = new ArrayList<>();
            DamageApiService.processDamages(description, "", damageAmounts, higherDamageAmounts, advancementDamageAmounts);
            DamageApiService.processHealing(description, healingAmounts);


            String savingThrowType = "";
            boolean halfOnSave = false;

            String savingThrowPattern = "(\\w+)\\ssaving\\sthrow"; //todo - not working properly
            Pattern pattern = Pattern.compile(savingThrowPattern);
            Matcher matcher = pattern.matcher(description);
            if (matcher.find()) {
                savingThrowType = matcher.group(1);
            }

            String halfOnSavePattern = "(?:failed\\ssave).*?(half as much)";
            pattern = Pattern.compile(halfOnSavePattern);
            matcher = pattern.matcher(description);
            if (matcher.find()) {
                halfOnSave = true;
            }

            this.saveTypeId = "null";
            this.temporaryHp = "0";
            this.halfOnSave = "0";
            if (!savingThrowType.equals("")) {
                this.attackType = "@saveAttackTypeId";
                this.saveTypeId = PowerApiService.getAbilityIdValue(savingThrowType);
                this.halfOnSave = halfOnSave ? "1": "0";
                if (saveTypeId == null) {
                    this.saveTypeId = "null";
                    this.attackType = "@noneAttackTypeId";
                    this.halfOnSave = "0";
                }
            } else if (!healingAmounts.isEmpty()) {
                this.attackType = "@healAttackTypeId";
                this.temporaryHp = description.contains("temporary") ? "1" : "0";
            } else if (!damageAmounts.isEmpty()) {
                this.attackType = "@attackAttackTypeId";
            } else {
                this.attackType = "@noneAttackTypeId";
            }

            this.extraDamage = this.higherDamageAmounts.isEmpty() ? "0" : "1";
            this.numLevelsAboveBase = this.extraDamage;
            this.advancement =  this.advancementDamageAmounts.isEmpty() ? "0" : "1";
        }

        private void setRange() {
            String value = this.range.toLowerCase();
            switch (value) {
                case "self":
                    this.rangeType = "@selfRangeTypeId";
                    this.rangeAmount = "0";
                    this.rangeUnit = "@feetRangeUnitId";
                    break;
                case "touch":
                    this.rangeType = "@touchRangeTypeId";
                    this.rangeAmount = "0";
                    this.rangeUnit = "@feetRangeUnitId";
                    break;
                default:
                    this.rangeType = "@otherRangeTypeId";
                    String[] parts = value.split(" ");
                    if (parts.length > 1) {
                        this.rangeAmount = parts[0];
                        String unit = parts[1];
                        this.rangeUnit = unit.equals("feet") ? "@feetRangeUnitId" : "@mileRangeUnitId";
                    } else {
                        this.rangeAmount = "0";
                        this.rangeUnit = "@feetRangeUnitId";
                    }
                    break;
            }
        }

        private void setAreaOfEffect() {
            this.radius = "0";
            this.height = "0";
            this.width = "0";
            this.length = "0";

            if (areaOfEffectId.equals("0")) {
                this.areaOfEffectId = "null";
            } else {
                String sizePattern = "(\\d+)[\\s-](?:foot|feet)[\\s-](radius|high|tall|wide|thick|long|cone|cube|cylinder|sphere|line|wall)";
                Pattern pattern = Pattern.compile(sizePattern);
                Matcher matcher = pattern.matcher(description);
                while (matcher.find()) {
                    String value = matcher.group(1);
                    String type = matcher.group(2);

                    switch (type) {
                        case "high":
                        case "tall":
                            this.height = value;
                            break;
                        case "wide":
                        case "thick":
                        case "cube":
                            this.width = value;
                            break;
                        case "long":
                        case "line":
                        case "wall":
                            this.length = value;
                            break;
                        case "radius":
                        case "cone":
                        case "cylinder":
                        case "sphere":
                            this.radius = value;
                            break;
                    }
                }
            }
        }

        private void setLimitedUse() {
            //todo
            quantity = "0";
//            diceSize = PowerApiService.getDiceId("1");
            diceSize = "null";
            rechargeOnShortRest = "0";
            rechargeOnLongRest = "0";
            passive = "0";
        }

        /******************************** Get Rows ****************************/

        public String getPowerRow(int sid) {
            this.sid = String.valueOf(sid);
            List<String> parts = new ArrayList<>();
            parts.add("'" + name + "'"); //name
            parts.add("@featurePowerId"); //power_type_id
            parts.add(attackType); //attack_type
            parts.add(temporaryHp); //temporary_hp
            parts.add(attackMod); //attack_mod
            parts.add(saveTypeId); //save_type_id
            parts.add(halfOnSave); //half_on_save
            parts.add(extraDamage); //extra_damage
            parts.add(numLevelsAboveBase); //num_levels_above_base
            parts.add(advancement); //advancement
            parts.add(extraModifiers); //extra_modifiers
            parts.add(modifiersNumLevelsAboveBase); //modifiers_num_levels_above_base
            parts.add(modifierAdvancement); //modifier_advancement
            parts.add("userId"); //user_id
            parts.add(String.valueOf(sid)); //sid

            return PowerApiService.getRow(parts);
        }

        public String getIdRow() {
            return "SET " + id + " = (SELECT id FROM powers WHERE user_id = userId AND sid = " + sid + ");";
        }

        public String getFeatureRow() {
            List<String> parts = new ArrayList<>();
            parts.add(id); //power_id
            parts.add(characteristicId); //characteristic_id
            parts.add(characteristicType); //characteristic_type_id
            parts.add(minimumLevel.equals("0") ? "null" : PowerApiService.getLevelId(minimumLevel)); //character_level_id
            parts.add(rangeType); //range_type
            parts.add(rangeAmount); //range
            parts.add(rangeUnit); //range_unit
            parts.add(areaOfEffectId); //area_of_effect_id
            parts.add(radius); //radius
            parts.add(width); //width
            parts.add(height); //height
            parts.add(length); //length
            parts.add(quantity); //quantity
            parts.add(diceSize); //dice_size_id
            parts.add(rechargeOnShortRest); //recharge_on_short_rest
            parts.add(rechargeOnLongRest); //recharge_on_long_rest
            parts.add(passive); //passive
            parts.add("'" + prerequisites + "'"); //prerequisite
            parts.add("'" + description + "'"); //description
            return PowerApiService.getRow(parts);
        }

        public List<String> getDamages() {
            return DamageApiService.getDamages(id, damageAmounts, healingAmounts, higherDamageAmounts, advancementDamageAmounts);
        }
    }

    public static class FeatureDeserializer extends StdDeserializer<FeatureApi> {

        public FeatureDeserializer() {
            this(null);
        }

        public FeatureDeserializer(Class<?> vc) {
            super(vc);
        }

        @Override
        public FeatureApi deserialize(JsonParser jsonParser, DeserializationContext context) throws IOException {
            JsonNode node = jsonParser.getCodec().readTree(jsonParser);

            String name = getValue(node.get("name"));
            String category = getValue(node.get("category"));
            String characteristicId = getValue(node.get("characteristic_id"));
            String description = getValue(node.get("description"));
            String minimumLevel = getValue(node.get("minimum_level"));
            String range = getValue(node.get("range"));
            String areaOfEffectId = getValue(node.get("area_of_effect_id"));
            return new FeatureApi(name, category, characteristicId, description, minimumLevel, range, areaOfEffectId);
        }

        private String getValue(JsonNode node) {
            return node == null ? "" : node.asText();
        }
    }

    private void writeFile(List<FeatureApi> features) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("features.sql"));
        String powerHeaderRow = "INSERT INTO `powers` (`name`, `power_type_id`, `attack_type`, `temporary_hp`, `attack_mod`, `save_type_id`, `half_on_save`, `extra_damage`, `num_levels_above_base`, `advancement`, `extra_modifiers`, `modifiers_num_levels_above_base`, `modifier_advancement`, `user_id`, `sid`) VALUES";
        writer.write(powerHeaderRow);
        writer.write("\n");

        int sid = 825;
        List<String> powerRows = new ArrayList<>();
        for (FeatureApi feature : features) {
            powerRows.add(feature.getPowerRow(sid));
            sid++;
        }
        String powersStr = String.join(",\n", powerRows) + ";";
        writer.write(powersStr);
        writer.write("\n\n");

        List<String> idRows = new ArrayList<>();
        for (FeatureApi feature : features) {
            idRows.add(feature.getIdRow());
        }
        String idsStr = String.join("\n", idRows);
        writer.write(idsStr);
        writer.write("\n\n");

        String featureHeaderRow = "INSERT INTO `features` (`power_id`, `characteristic_id`, `characteristic_type_id`, `character_level_id`, `range_type`, `range`, `range_unit`, `area_of_effect_id`, `radius`, `width`, `height`, `length`, `quantity`, `dice_size_id`, `recharge_on_short_rest`, `recharge_on_long_rest`, `passive`, `prerequisite`, `description`) VALUES";
        writer.write(featureHeaderRow);
        writer.write("\n");

        List<String> featureRows = new ArrayList<>();
        for (FeatureApi feature : features) {
            featureRows.add(feature.getFeatureRow());
        }
        String featuresStr = String.join(",\n", featureRows) + ";";
        writer.write(featuresStr);
        writer.write("\n\n");

        String damageHeaderRow = "INSERT INTO `power_damages` (`power_id`, `character_advancement`, `extra`, `character_level_id`, `num_dice`, `dice_size`, `ability_modifier_id`, `misc_mod`, `damage_type_id`, `healing`) VALUES";
        writer.write(damageHeaderRow);
        writer.write("\n");

        List<String> damageRows = new ArrayList<>();
        for (FeatureApi feature : features) {
            damageRows.addAll(feature.getDamages());
        }
        String damageRowsStr = String.join(",\n", damageRows) + ";";
        writer.write(damageRowsStr);

        //todo - handle modifiers

        writer.close();
    }

    public void readApiFile() throws IOException {
//        List<FeatureApi> features = readFile("C:\\Users\\ssher\\git\\5e-database\\5e-SRD-Features.json");
        List<FeatureApi> features = readFile("C:\\Users\\ssher\\git\\5e-database\\class_features.json");
        features.addAll(readFile("C:\\Users\\ssher\\git\\5e-database\\race_features.json"));
        features.addAll(readFile("C:\\Users\\ssher\\git\\5e-database\\background_features.json"));
        features.addAll(readFile("C:\\Users\\ssher\\git\\5e-database\\feat_features.json"));
        writeFile(features);
    }

    private List<FeatureApi> readFile(String filename) throws IOException {
        File file = new File(filename);
        BufferedReader reader = new BufferedReader(new FileReader(file));
        StringBuilder builder = new StringBuilder();
        String line;
        boolean initialized = false;
        while ((line = reader.readLine()) != null) {
            if (initialized)
                builder.append("\n");
            initialized = true;
            builder.append(line);
        }
        String contentsAsString = builder.toString();

        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addDeserializer(FeatureApi.class, new FeatureDeserializer());
        mapper.registerModule(module);

        return mapper.readValue(contentsAsString, new TypeReference<List<FeatureApi>>(){});
    }
}
