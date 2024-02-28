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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SpellApiService {
    public class SpellApi {
        public boolean updated = false;
        public String name;
        public String description;
        public String higherLevels;
        public String range;
        public int v;
        public int s;
        public int m;
        public String material;
        public int ritual;
        public String duration;
        public int concentration;
        public String castingTime;
        public int level;
        public String school;

        private List<DamageApi> damageAmounts;
        private List<DamageApi> higherDamageAmounts;
        private List<DamageApi> advancementDamageAmounts;
        private List<DamageApi> healingAmounts;
        private String id;
        private String attackType; //@noneAttackTypeId
        private String schoolId;
        private String castingTimeAmount;
        private String castingTimeUnit; //@actionCastingId
        private String rangeType; //@otherRangeTypeId
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
        private String rangeAmount;
        private String rangeUnit;
        private String areaOfEffectId;
        private String radius;
        private String length;
        private String height;
        private String width;
        private String instantaneous;


        public SpellApi(String name, String description, String higherLevels, String range, int v, int s, int m,
                        String material, int ritual, String duration, int concentration, String castingTime,
                        int level, String school) {
            this.name = name;
            this.description = description;
            this.higherLevels = higherLevels;
            this.range = range;
            this.v = v;
            this.s = s;
            this.m = m;
            this.material = material;
            this.ritual = ritual;
            this.duration = duration;
            this.concentration = concentration;
            this.castingTime = castingTime;
            this.level = level < 0 ? 0 : level;
            this.school = school;
        }

        public void update(SpellUpdates spellUpdates) {
            this.description = spellUpdates.description;
            this.higherLevels = spellUpdates.higher;
            process();
            updated = true;
        }

        public void process() {
            processDamages();
            processSpell();
        }

        private void processDamages() {
            damageAmounts = new ArrayList<>();
            higherDamageAmounts = new ArrayList<>();
            advancementDamageAmounts = new ArrayList<>();
            healingAmounts = new ArrayList<>();

            String areaOfEffect = "";
            String radius = "0";
            String height = "0";
            String width = "0";
            String length = "0";
            String savingThrowType = "";
            boolean halfOnSave = false;

            DamageApiService.processDamages(description, higherLevels, damageAmounts, higherDamageAmounts, advancementDamageAmounts);
            DamageApiService.processHealing(description, healingAmounts);

            String areaOfEffectPattern = "(sphere|cone|cube|cylinder|line|wall)";
            Pattern pattern = Pattern.compile(areaOfEffectPattern);
            Matcher matcher = pattern.matcher(description);
            if (matcher.find()) {
                areaOfEffect = matcher.group(1);
                if (areaOfEffect.equals("wall")) {
                    areaOfEffect = "line";
                }
            }

            String sizePattern = "(\\d+)[\\s-](?:foot|feet)[\\s-](radius|high|tall|wide|thick|long|cone|cube|cylinder|sphere|line|wall)";
            pattern = Pattern.compile(sizePattern);
            matcher = pattern.matcher(description);
            while (matcher.find()) {
                String value = matcher.group(1);
                String type = matcher.group(2);

                switch (type) {
                    case "high":
                    case "tall":
                        height = value;
                        break;
                    case "wide":
                    case "thick":
                    case "cube":
                        width = value;
                        break;
                    case "long":
                    case "line":
                    case "wall":
                        length = value;
                        break;
                    case "radius":
                    case "cone":
                    case "cylinder":
                    case "sphere":
                        radius = value;
                        break;
                }
            }

            String savingThrowPattern = "(\\w+)\\ssaving\\sthrow";
            pattern = Pattern.compile(savingThrowPattern);
            matcher = pattern.matcher(description);
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

            if (areaOfEffect.equals("")) {
                this.areaOfEffectId = "null";
                this.radius = "0";
                this.height = "0";
                this.width = "0";
                this.length = "0";
            } else {
                this.areaOfEffectId = PowerApiService.getIdValue(areaOfEffect, true);
                this.radius = radius;
                this.height = height;
                this.width = width;
                this.length = length;
            }
        }

        private void processSpell() {
            this.id = PowerApiService.getIdValue(name);
            this.schoolId = PowerApiService.getIdValue(school + "School", true);
            this.setCastingTime();
            this.setRange();
            this.attackMod = "0";
            this.extraModifiers = "0";
            this.modifiersNumLevelsAboveBase = "0";
            this.modifierAdvancement = "0";
            this.setInstantaneous();
        }

        private void setCastingTime() {
            this.castingTimeAmount = getCastingTimeAmount();
            this.castingTimeUnit = getCastingTimeUnit();
        }

        private String getCastingTimeAmount() {
            String[] castingTimeParts = castingTime.split(" ");
            return castingTimeParts[0];
        }

        private String getCastingTimeUnit() {
            int index = castingTime.indexOf(" ");
            String unit = castingTime.substring(index + 1);
            switch (unit.toLowerCase()) {
                case "action":
                case "actions":
                    return "@actionCastingId";
                case "bonus action":
                case "bonus actions":
                    return "@bonusActionCastingId";
                case "reaction":
                case "reactions":
                    return "@reactionCastingId";
                case "second":
                case "seconds":
                    return "@secondCastingId";
                case "minute":
                case "minutes":
                    return "@minuteCastingId";
                case "hour":
                case "hours":
                    return "@hourCastingId";
                default:
                        return "";
            }
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

        private void setInstantaneous() {
            this.instantaneous = this.duration.toLowerCase().equals("instantaneous") ? "1": "0";
            if (this.instantaneous.equals("1")) {
                this.duration = "";
            }
        }

        /*********************************** End ProcessSpell **************************************************/

        public String getPowerRow(int sid) {
            List<String> parts = new ArrayList<>();
            parts.add("'" + name + "'"); //name
            parts.add("@spellPowerId"); //power_type_id
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
            return "SET " + id + " = (SELECT id FROM powers WHERE name = '" + name + "' AND user_id = userId AND power_type_id = @spellPowerId);";
        }

        public String getSpellRow() {
            List<String> parts = new ArrayList<>();
            parts.add(id); //power_id
            parts.add(String.valueOf(level)); //level
            parts.add(schoolId); //spell_school_id
            parts.add(String.valueOf(ritual)); //ritual
            parts.add(castingTimeAmount); //casting_time
            parts.add(castingTimeUnit); //casting_time_unit
            parts.add(rangeType); //range_type
            parts.add(rangeAmount); //range
            parts.add(rangeUnit); //range_unit
            parts.add(areaOfEffectId); //area_of_effect_id
            parts.add(radius); //radius
            parts.add(width); //width
            parts.add(height); //height
            parts.add(length); //length
            parts.add(String.valueOf(v)); //verbal
            parts.add(String.valueOf(s)); //somatic
            parts.add(String.valueOf(m)); //material
            parts.add("'" + material + "'"); //components
            parts.add(instantaneous); //instantaneous
            parts.add(String.valueOf(concentration)); //concentration
            parts.add("'" + duration + "'"); //duration
            parts.add("'" + description +"'"); //description
            parts.add("'" + higherLevels + "'"); //higher_levels

            return PowerApiService.getRow(parts);
        }

        public List<String> getDamages() {
            return DamageApiService.getDamages(id, damageAmounts, healingAmounts, higherDamageAmounts, advancementDamageAmounts);
        }
    }

    private class SpellUpdates {
        public String name;
        public String description;
        public String higher;
        public String components;

        public SpellUpdates(String name, String description, String higher, String components) {
            this.name = name;
            this.description = description;
            this.higher = higher;
            this.components = components;
        }
    }

    public class SpellDeserializer extends StdDeserializer<SpellApi> {

        public SpellDeserializer() {
            this(null);
        }

        public SpellDeserializer(Class<?> vc) {
            super(vc);
        }

        @Override
        public SpellApi deserialize(JsonParser jsonParser, DeserializationContext context) throws IOException {
            JsonNode node = jsonParser.getCodec().readTree(jsonParser);

            String name = getValue(node.get("name"));

            List<String> descriptions = new ArrayList<>();
            JsonNode descriptionNodes = node.get("desc");
            if (descriptionNodes != null && descriptionNodes.isArray()) {
                for (final JsonNode description : descriptionNodes) {
                    descriptions.add(description.textValue());
                }
            }
            String description = String.join("\n\n", descriptions);

            List<String> highers = new ArrayList<>();
            JsonNode higherNodes = node.get("higher_level");
            if (higherNodes != null && higherNodes.isArray()) {
                for (final JsonNode higher : higherNodes) {
                    highers.add(higher.textValue());
                }
            }
            String higherLevels = String.join("\n\n", highers);

            int v = 0;
            int s = 0;
            int m = 0;
            JsonNode componentsNode = node.get("components");
            if (componentsNode != null && componentsNode.isArray()) {
                for (final JsonNode component : componentsNode) {
                    String value = component.textValue();
                    if (value.toLowerCase().equals("v")) {
                        v = 1;
                    } else if (value.toLowerCase().equals("s")) {
                        s = 1;
                    } else if (value.toLowerCase().equals("m")) {
                        m = 1;
                    }
                }
            }

            String range = getValue(node.get("range"));
            String material = getValue(node.get("material"));
            String ritual = getValue(node.get("ritual"));
            String duration = getValue(node.get("duration"));
            String concentration = getValue(node.get("concentration"));
            String castingTime = getValue(node.get("casting_time"));

            JsonNode levelNode = node.get("level");
            int level = levelNode == null ? 0 : (Integer)levelNode.numberValue();

            JsonNode schoolNode = node.get("school");
            String school = schoolNode == null ? "" : getValue(schoolNode.get("name"));

            return new SpellApi(name, description, higherLevels, range, v, s, m, material, ritual.toLowerCase().equals("yes") ? 1 : 0,
                    duration, concentration.toLowerCase().equals("yes") ? 1 : 0, castingTime, level, school);
        }

        private String getValue(JsonNode node) {
            return node == null ? "" : node.asText();
        }
    }

    public class SecondSpellDeserializer extends StdDeserializer<SpellUpdates> {

        public SecondSpellDeserializer() {
            this(null);
        }

        public SecondSpellDeserializer(Class<?> vc) {
            super(vc);
        }

        @Override
        public SpellUpdates deserialize(JsonParser jsonParser, DeserializationContext context) throws IOException {
            JsonNode node = jsonParser.getCodec().readTree(jsonParser);
            String name = getValue(node.get("name"));
            String description = getValue(node.get("desc"));
            String higher = getValue(node.get("high"));
            String components = getValue(node.get("comp"));
            return new SpellUpdates(name, description, higher, components);
        }

        private String getValue(JsonNode node) {
            return node == null ? "" : node.asText();
        }
    }

    private void writeFile(List<SpellApi> spells) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("spells.sql"));
        String powerHeaderRow = "INSERT INTO `powers` (`name`, `power_type_id`, `attack_type`, `temporary_hp`, `attack_mod`, `save_type_id`, `half_on_save`, `extra_damage`, `num_levels_above_base`, `advancement`, `extra_modifiers`, `modifiers_num_levels_above_base`, `modifier_advancement`, `user_id`, `sid`) VALUES";
        writer.write(powerHeaderRow);
        writer.write("\n");

        int sid = 382;
        List<String> powerRows = new ArrayList<>();
        for (SpellApi spell : spells) {
            if (!spell.updated) {
                spell.process();
            }
            powerRows.add(spell.getPowerRow(sid));
            sid++;
        }
        String powersStr = String.join(",\n", powerRows) + ";";
        writer.write(powersStr);
        writer.write("\n\n");

        List<String> idRows = new ArrayList<>();
        for (SpellApi spell : spells) {
            idRows.add(spell.getIdRow());
        }
        String idsStr = String.join("\n", idRows);
        writer.write(idsStr);
        writer.write("\n\n");

        String spellHeaderRow = "INSERT INTO `spells` (`power_id`, `level`, `spell_school_id`, `ritual`, `casting_time`, `casting_time_unit`, `range_type`, `range`, `range_unit`, `area_of_effect_id`, `radius`, `width`, `height`, `length`, `verbal`, `somatic`, `material`, `components`, `instantaneous`, `concentration`, `duration`, `description`, `higher_levels`) VALUES";
        writer.write(spellHeaderRow);
        writer.write("\n");

        List<String> spellRows = new ArrayList<>();
        for (SpellApi spell : spells) {
            spellRows.add(spell.getSpellRow());
        }
        String spellsStr = String.join(",\n", spellRows) + ";";
        writer.write(spellsStr);
        writer.write("\n\n");

        String damageHeaderRow = "INSERT INTO `power_damages` (`power_id`, `character_advancement`, `extra`, `character_level_id`, `num_dice`, `dice_size`, `ability_modifier_id`, `misc_mod`, `damage_type_id`, `healing`) VALUES";
        writer.write(damageHeaderRow);
        writer.write("\n");

        List<String> damageRows = new ArrayList<>();
        for (SpellApi spell : spells) {
            damageRows.addAll(spell.getDamages());
        }
        String damageRowsStr = String.join(",\n", damageRows) + ";";
        writer.write(damageRowsStr);

        writer.close();
    }

    public void readApiFile() throws IOException {
        File file = new File("C:\\Users\\ssher\\git\\5e-database\\5e-SRD-Spells.json");

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
        module.addDeserializer(SpellApi.class, new SpellDeserializer());
        mapper.registerModule(module);

        List<SpellApi> spells = mapper.readValue(contentsAsString, new TypeReference<List<SpellApi>>(){});
        readSecondFile(generateMap(spells));
        writeFile(spells);
    }

    private void readSecondFile(Map<String, SpellApi> map) throws IOException {
        File file = new File("C:\\Users\\ssher\\git\\5e-database\\spells.json");

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
        module.addDeserializer(SpellUpdates.class, new SecondSpellDeserializer());
        mapper.registerModule(module);

        List<SpellUpdates> spellUpdates = mapper.readValue(contentsAsString, new TypeReference<List<SpellUpdates>>(){});
        for (SpellUpdates updates : spellUpdates) {
            SpellApi spellApi = map.get(updates.name);
            if (spellApi != null) {
                spellApi.update(updates);
            }
        }
    }

    private Map<String, SpellApi> generateMap(List<SpellApi> spells) {
        Map<String, SpellApi> map = new HashMap<>();
        for (SpellApi spell : spells) {
            map.put(spell.name, spell);
        }
        return map;
    }
}
