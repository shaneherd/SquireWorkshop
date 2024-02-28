DROP PROCEDURE IF EXISTS EmptyDB;

# todo - remove this procedure

DELIMITER ;;
CREATE PROCEDURE EmptyDB()
BEGIN
	#CLEAR OUT TABLES
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE `features`;
    TRUNCATE `background_traits`;
    TRUNCATE `backgrounds`;
    TRUNCATE `class_ability_score_increases`;
    TRUNCATE `class_secondary_attribute_profs`;
    TRUNCATE `class_secondary_item_profs`;
    TRUNCATE `class_secondary_choice_profs`;
    TRUNCATE `classes`;
    TRUNCATE `race_speeds`;
    TRUNCATE `races`;
    TRUNCATE `characteristic_attribute_profs`;
    TRUNCATE `characteristic_attribute_modifiers`;
    TRUNCATE `characteristic_choice_profs`;
    TRUNCATE `characteristic_item_profs`;
    TRUNCATE `characteristic_spell_configurations`;
    TRUNCATE `characteristic_starting_equipments`;
    TRUNCATE `characteristic_damage_modifiers`;
    TRUNCATE `characteristic_senses`;
    TRUNCATE `characteristic_condition_immunities`;
    TRUNCATE `characteristics_public`;
    TRUNCATE `characteristics_private`;
    TRUNCATE `characteristics_shared`;
    TRUNCATE `characteristics`;
    TRUNCATE `pack_items`;
    TRUNCATE `packs`;
    TRUNCATE `magical_item_attunement_alignments`;
    TRUNCATE `magical_item_attunement_classes`;
    TRUNCATE `magical_item_attunement_races`;
    TRUNCATE `magical_item_table_cells`;
    TRUNCATE `magical_item_tables`;
    TRUNCATE `magical_item_spells`;
    TRUNCATE `magical_item_applicable_items`;
    TRUNCATE `magical_item_applicable_spells`;
    TRUNCATE `magical_items`;
    TRUNCATE `ammos`;
    TRUNCATE `armors`;
    TRUNCATE `gears`;
    TRUNCATE `mounts`;
    TRUNCATE `tools`;
    TRUNCATE `treasures`;
    TRUNCATE `vehicles`;
    TRUNCATE `weapon_weapon_properties`;
    TRUNCATE `weapons`;
    TRUNCATE `spell_schools`;
    TRUNCATE `spells`;
    TRUNCATE `power_limited_uses`;
    TRUNCATE `power_damages`;
    TRUNCATE `power_modifiers`;
    TRUNCATE `powers_public`;
    TRUNCATE `powers_private`;
    TRUNCATE `powers_shared`;
    TRUNCATE `powers`;
    TRUNCATE `item_damages`;
    TRUNCATE `items_public`;
    TRUNCATE `items_private`;
    TRUNCATE `items_shared`;
    TRUNCATE `items`;
    TRUNCATE `abilities`;
    TRUNCATE `alignments`;
    TRUNCATE `area_of_effects`;
    TRUNCATE `armor_types`;
    TRUNCATE `caster_type_spell_slots`;
    TRUNCATE `caster_types`;
    TRUNCATE `connecting_conditions`;
    TRUNCATE `conditions`;
    TRUNCATE `damage_types`;
    TRUNCATE `deity_categories`;
    TRUNCATE `deities`;
    TRUNCATE `languages`;
    TRUNCATE `skills`;
    TRUNCATE `tool_categories`;
    TRUNCATE `weapon_properties`;
    TRUNCATE `weapon_types`;
    TRUNCATE `misc_attributes`; -- todo - verify this should be wiped
    TRUNCATE `character_levels`;
    TRUNCATE `attributes_public`;
    TRUNCATE `attributes_private`;
    TRUNCATE `attributes_shared`;
    TRUNCATE `attributes`;

    TRUNCATE `monster_action_damages`;
    TRUNCATE `monster_actions`;
    TRUNCATE `monster_features`;
    TRUNCATE `monster_power_limited_uses`;
    TRUNCATE `monster_powers`;
    TRUNCATE `monster_powers_public`;
    TRUNCATE `monster_powers_private`;
    TRUNCATE `monster_powers_shared`;

    TRUNCATE `monster_spells`;
    TRUNCATE `monster_innate_spells`;
    TRUNCATE `monster_spell_slots`;
    TRUNCATE `monster_attribute_profs`;
    TRUNCATE `monster_item_profs`;
    TRUNCATE `monster_senses`;
    TRUNCATE `monster_speeds`;
    TRUNCATE `monster_condition_immunities`;
    TRUNCATE `monster_damage_modifiers`;
    TRUNCATE `monster_ability_scores`;
    TRUNCATE `monster_items`;
    TRUNCATE `monsters_public`;
    TRUNCATE `monsters_private`;
    TRUNCATE `monsters_shared`;
    TRUNCATE `monsters`;

    TRUNCATE `character_validation_ignored_powers`;
    TRUNCATE `character_validation`;
    TRUNCATE `character_ability_scores_to_increase`;
    TRUNCATE `character_background_traits`;
    TRUNCATE `character_characteristic_spellcasting`;
    TRUNCATE `character_chosen_classes`;
    TRUNCATE `character_health_gain_results`;
    TRUNCATE `character_note_categories`;
    TRUNCATE `character_notes`;
    TRUNCATE `character_pages`;
    TRUNCATE `character_setting_values`;
    TRUNCATE `characters`;

    TRUNCATE `roll_dice_results`;
    TRUNCATE `roll_results`;
    TRUNCATE `rolls`;

    TRUNCATE `creature_ability_scores`;
    TRUNCATE `creature_attribute_profs`;
    TRUNCATE `creature_condition_immunities`;
    TRUNCATE `creature_conditions`;
    TRUNCATE `creature_damage_modifiers`;
    TRUNCATE `creature_wealth`;
    TRUNCATE `creature_health`;
    TRUNCATE `creature_hit_dice`;
    TRUNCATE `creature_item_profs`;
    TRUNCATE `creature_items`;
    TRUNCATE `creature_power_tags`;
    TRUNCATE `creature_powers`;
    TRUNCATE `chained_action_items`;
    TRUNCATE `chained_actions`;
    TRUNCATE `creature_action_powers`;
    TRUNCATE `creature_action_items`;
    TRUNCATE `creature_actions`;
    TRUNCATE `creature_senses`;
    TRUNCATE `creature_spell_configurations`;
    TRUNCATE `creature_spell_slots`;
    TRUNCATE `creature_spellcasting`;
    TRUNCATE `creature_spells`;
    TRUNCATE `creature_stored_filters`;
    TRUNCATE `creature_stored_sorts`;
    TRUNCATE `creature_tags`;
    TRUNCATE `creature_ac_abilities`;
    TRUNCATE `creatures_public`;
    TRUNCATE `creatures_private`;
    TRUNCATE `creatures_shared`;
    TRUNCATE `creatures`;

    SET FOREIGN_KEY_CHECKS = 1;
END;;

DELIMITER ;

# CALL EmptyDB();