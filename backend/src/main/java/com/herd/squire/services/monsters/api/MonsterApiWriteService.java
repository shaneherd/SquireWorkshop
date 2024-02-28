package com.herd.squire.services.monsters.api;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

public class MonsterApiWriteService {
    public static void writeFile(List<MonsterApi> monsters) throws Exception {
        BufferedWriter writer = new BufferedWriter(new FileWriter("monsters.sql"));
        String headerRow = "INSERT INTO monsters (name, monster_type_id, type_variation, size_id, challenge_rating_id, experience, hit_dice_num_dice, hit_dice_size_id, hit_dice_ability_modifier_id, hit_dice_misc_modifier, legendary_points, description, ac, hover, spellcaster, caster_type_id, spellcaster_level_id, spell_attack_modifier, spell_save_modifier, spellcasting_ability_id, innate_spellcaster, innate_spellcaster_level_id, innate_spell_attack_modifier, innate_spell_save_modifier, innate_spellcasting_ability_id, alignment_id, user_id, sid) VALUES";
        writer.write(headerRow);
        writer.write("\n");

        int sid = 1;
        List<String> monsterRows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            monsterRows.add(monster.getMonsterRow(sid));
            sid++;
        }
        String monsterTrowStr = String.join(",\n", monsterRows) + ";";
        writer.write(monsterTrowStr);
        writer.write("\n\n");

        List<String> idRows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            idRows.add(monster.getIdRow());
        }
        String idsStr = String.join("\n", idRows);
        writer.write(idsStr);
        writer.write("\n\n");

        String header;
        String rowsStr;
        List<String> rows;

        // ability scores
        header = "INSERT INTO monster_ability_scores (monster_id, ability_id, value) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getAbilityScores());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // speeds
        header = "INSERT INTO monster_speeds (monster_id, speed_id, value) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getSpeeds());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // senses
        header = "INSERT INTO monster_senses (monster_id, sense_id, `range`) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getSenses());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // damage modifiers
        header = "INSERT INTO monster_damage_modifiers (monster_id, damage_type_id, damage_modifier_type_id, `condition`) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getDamageModifiers());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // condition immunities
        header = "INSERT INTO monster_condition_immunities (monster_id, condition_id) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getConditionImmunities());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // attribute profs
        header = "INSERT INTO monster_attribute_profs (monster_id, attribute_id) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getAttributeProfs());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // item profs
//        header = "INSERT INTO monster_item_profs (monster_id, item_id) VALUES";
//        writer.write(header);
//        writer.write("\n");
//        rows = new ArrayList<>();
//        for (MonsterApi monster : monsters) {
//            rows.addAll(monster.getItemProfs());
//        }
//        rowsStr = String.join(",\n", rows) + ";";
//        writer.write(rowsStr);
//        writer.write("\n\n");

        // spell slots
        header = "INSERT INTO monster_spell_slots (monster_id, slot_1, slot_2, slot_3, slot_4, slot_5, slot_6, slot_7, slot_8, slot_9) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.add(monster.getSpellSlots());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // spells
        header = "INSERT INTO monster_spells (monster_id, spell_id) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getSpellConfigurations());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // innate spells
        header = "INSERT INTO monster_innate_spells (monster_id, spell_id, limited_use_type_id, quantity, ability_modifier_id, dice_size_id) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getInnateSpellConfigurations());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // monster powers
        int powerSid = 1;
        header = "INSERT INTO monster_powers (name, monster_id, monster_power_type_id, recharge_min, recharge_max, user_id, sid) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            List<String> powerRows = monster.getPowerRows(powerSid);
            powerSid += powerRows.size();
            rows.addAll(powerRows);
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        idRows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            List<String> powerIdRows = monster.getMonsterPowerIds();
            idRows.addAll(powerIdRows);
        }
        idsStr = String.join("\n", idRows);
        writer.write(idsStr);
        writer.write("\n\n");

        // monster features
        header = "INSERT INTO monster_features (monster_power_id, description) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getFeatures());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // monster actions
        header = "INSERT INTO monster_actions (monster_power_id, action_type_id, legendary_cost, weapon_range_type_id, reach, normal_range, long_range, ammo_id, attack_type_id, temporary_hp, attack_mod, attack_ability_modifier_id, save_type_id, save_proficiency_modifier, save_ability_modifier_id, half_on_save, description) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getActions());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // monster action damages
        header = "INSERT INTO monster_action_damages (monster_action_id, num_dice, dice_size, ability_modifier_id, misc_mod, damage_type_id, healing) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getActionDamages());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // limited uses
        header = "INSERT INTO monster_power_limited_uses (monster_power_id, limited_use_type_id, quantity, ability_modifier_id, dice_size_id) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getLimitedUses());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        // items
        header = "INSERT INTO monster_items (monster_id, item_id, quantity, user_id) VALUES";
        writer.write(header);
        writer.write("\n");
        rows = new ArrayList<>();
        for (MonsterApi monster : monsters) {
            rows.addAll(monster.getItems());
        }
        rowsStr = String.join(",\n", rows) + ";";
        writer.write(rowsStr);
        writer.write("\n\n");

        writer.close();
    }
}
