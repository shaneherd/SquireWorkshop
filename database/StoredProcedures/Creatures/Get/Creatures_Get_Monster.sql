DROP PROCEDURE IF EXISTS Creatures_Get_Monster;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_Monster(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE battleMonsterId INT UNSIGNED;
    DECLARE monsterUserId MEDIUMINT UNSIGNED;

    SET battleMonsterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF battleMonsterId IS NULL THEN
        SET battleMonsterId = (SELECT creature_id FROM creatures_public WHERE creature_id = creatureId);
    END IF;
    IF battleMonsterId IS NULL THEN
        SET battleMonsterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    SET monsterUserId = (SELECT user_id FROM creatures WHERE id = battleMonsterId);

    SELECT c.id, c.user_id AS creature_user_id, c.name,
           bm.monster_id, bm.max_hp, c.spellcasting_ability_id, c.innate_spellcasting_ability_id,
           bm.legendary_points, m.legendary_points AS max_legendary_points
    FROM creatures c
        JOIN battle_monsters bm ON bm.creature_id = c.id AND c.id = battleMonsterId
        JOIN monsters m ON m.id = bm.monster_id;

    CALL Creatures_Get_StoredFilters(battleMonsterId);
    CALL Creatures_Get_StoredSorts(battleMonsterId);

    # Ability Scores
    SELECT a.id, a.name, a.description, a.sid, a.user_id = monsterUserId AS is_author, a.version, ab.abbr, cas.value, cas.misc_modifier, cas.asi_modifier
    FROM creature_ability_scores cas
        JOIN abilities ab ON ab.attribute_id = cas.ability_id
        JOIN attributes a ON a.id = ab.attribute_id
    WHERE cas.creature_id = battleMonsterId;

    # AC Abilities
    SELECT a.id, a.name, a.description, a.sid, a.user_id = monsterUserId AS is_author
    FROM creature_ac_abilities cas
        JOIN attributes a ON a.id = cas.ability_id
    WHERE cas.creature_id = battleMonsterId;

    # Wealth
    SELECT cost_unit_id, cu.name AS cost_unit_name, abbreviation AS cost_unit_abbreviation, conversion_unit AS conversion_unit_id, conversion_value, cu.weight AS cost_unit_weight, quantity, display, display_order
    FROM creature_wealth cw
        JOIN cost_units cu ON cw.cost_unit_id = cu.id
    WHERE creature_id = battleMonsterId
    ORDER BY display_order;

    # Creature Health
    SELECT current_hp, temp_hp, max_hp_mod, num_death_saving_throw_successes, num_death_saving_throw_failures, death_save_mod, death_save_advantage, death_save_disadvantage, resurrection_penalty, exhaustion_level, creature_state
    FROM creature_health
    WHERE creature_id = battleMonsterId;

    # Creature Hit Dice
#     SELECT dice_size_id, remaining
#     FROM creature_hit_dice
#     WHERE creature_id = battleMonsterId;

    # Attribute Profs
    SELECT p.attribute_id, a.name, a.description, a.attribute_type_id, a.sid, a.user_id = monsterUserId AS is_author, a.version,
           p.proficient, p.misc_modifier, p.advantage, p.disadvantage, p.double_prof, p.half_prof, p.round_up
    FROM creature_attribute_profs p
        JOIN attributes a ON p.attribute_id = a.id
    WHERE creature_id = battleMonsterId;

    # Item Profs
    SELECT p.item_id, i.name, i.description, i.item_type_id, i.sid, i.user_id = monsterUserId AS is_author, i.version,
           p.misc_modifier, p.advantage, p.disadvantage, p.double_prof, p.half_prof, p.round_up,
           a.armor_type_id, w.weapon_type_id
    FROM creature_item_profs p
        JOIN items i ON p.item_id = i.id
        LEFT JOIN armors a ON a.item_id = i.id
        LEFT JOIN weapons w ON w.item_id = i.id
    WHERE creature_id = battleMonsterId;

    # Damage Modifiers
    SELECT damage_type_id, damage_modifier_type_id, `condition`, damageType.name AS damage_type_name,
           damageType.description AS damage_type_description, damageType.sid AS damage_type_sid,
           damageType.user_id = monsterUserId AS damage_type_is_author, damageType.version AS damage_type_version
    FROM creature_damage_modifiers
        JOIN attributes damageType ON damageType.id = damage_type_id
    WHERE creature_id = battleMonsterId;

    # Condition Immunities
    SELECT a.id, a.name, a.sid, a.user_id = monsterUserId AS is_author
    FROM creature_condition_immunities cci
        JOIN attributes a ON cci.condition_id = a.id
    WHERE cci.creature_id = battleMonsterId;

    # Senses
#     SELECT sense_id, `range`
#     FROM creature_senses
#     WHERE creature_id = battleMonsterId;

    # Active Conditions
    CALL Creature_ActiveConditions(battleMonsterId, monsterUserId);

    # Spell Tags
#     SELECT id, power_type_id, title, color
#     FROM creature_tags
#     WHERE creature_id = monsterId AND power_type_id = 1;

    # Feature Tags
#     SELECT id, power_type_id, title, color
#     FROM creature_tags
#     WHERE creature_id = monsterId AND power_type_id = 2;

    # Creature Spellcasting - Attack
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM creature_spellcasting
    WHERE creature_id = battleMonsterId AND attack_type_id = 1 AND innate = 0;

    # Creature Spellcasting - Save
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM creature_spellcasting
    WHERE creature_id = battleMonsterId AND attack_type_id = 2 AND innate = 0;

    # Spell Slots
    SELECT slot_level, max_modifier, remaining
    FROM creature_spell_slots
    WHERE creature_id = battleMonsterId;

    # Spell Configurations
    SELECT p.id, p.name, p.sid, p.user_id = monsterUserId AS is_author,
           cs.level_gained, a.name AS level_name, a.sid AS level_sid, a.user_id = monsterUserId AS level_is_author,
           cs.always_prepared,
           cs.counts_towards_prepared_limit, cs.notes, cs.user_id = monsterUserId AS config_is_author
    FROM creature_spell_configurations cs
        JOIN spells s ON cs.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        LEFT JOIN attributes a ON cs.level_gained = a.id
    WHERE cs.creature_id = battleMonsterId;

    # Creature Spellcasting - Attack
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM creature_spellcasting
    WHERE creature_id = battleMonsterId AND attack_type_id = 1 AND innate = 1;

    # Creature Spellcasting - Save
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM creature_spellcasting
    WHERE creature_id = battleMonsterId AND attack_type_id = 2 AND innate = 1;

    # Items
    CALL CreatureItems_Get(battleMonsterId, monsterUserId);

    # BattleMonster Settings
    CALL BattleMonster_Settings_Get(battleMonsterId);
END;;

DELIMITER ;

