DROP PROCEDURE IF EXISTS CreaturePowers_Get;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_Get(
    IN creatureId INT UNSIGNED,
    IN powerIdArray VARCHAR(1000),
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL
    );

    IF powerIdArray IS NOT NULL THEN
        SET @sql = CONCAT('INSERT INTO temp_powers (id) SELECT power_id FROM creature_powers WHERE power_id IN (', powerIdArray, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT cp.id, cp.power_id, p.name AS power_name, cp.power_type_id, c.characteristic_type_id,
           cp.assigned_characteristic_id, cp.active, cp.active_target_creature_id, cp.uses_remaining,
           p.recharge_on_short_rest, p.recharge_on_long_rest, p.extra_modifiers, p.modifier_advancement,
           p.modifiers_num_levels_above_base
    FROM creature_powers cp
        JOIN powers p ON cp.power_id = p.id
        LEFT JOIN characteristics c ON c.id = cp.assigned_characteristic_id
    WHERE cp.creature_id = creatureId AND cp.power_id IN (SELECT id FROM temp_powers);

    # Limited Uses
    SELECT p.power_id, p.limited_use_type_id, p.level_id, a.name AS level_name, a.sid AS level_sid,
           a.user_id = userId AS level_is_author, p.quantity, p.ability_modifier_id, p.dice_size_id
    FROM power_limited_uses p
        JOIN character_levels l ON p.level_id = l.attribute_id
        JOIN attributes a ON l.attribute_id = a.id
    WHERE p.power_id IN (SELECT id FROM temp_powers);

    DROP TEMPORARY TABLE IF EXISTS temp_powers;
END;;

DELIMITER ;

# CALL CreaturePowers_Get(1, '323,324');
