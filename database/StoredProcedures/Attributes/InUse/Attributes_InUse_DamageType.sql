DROP PROCEDURE IF EXISTS Attributes_InUse_DamageType;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_DamageType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_characteristics
    SELECT cdm.characteristic_id, 0
    FROM characteristic_damage_modifiers cdm
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = cdm.characteristic_id AND cdm.damage_type_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cdm.characteristic_id, 0
    FROM characteristic_damage_modifiers cdm
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = cdm.characteristic_id AND cdm.damage_type_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cdm.creature_id, 0
    FROM creature_damage_modifiers cdm
        JOIN creatures uc ON uc.user_id = userId AND uc.id = cdm.creature_id AND cdm.damage_type_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cdm.creature_id, 0
    FROM creature_damage_modifiers cdm
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = cdm.creature_id AND cdm.damage_type_id = attributeId;

    INSERT INTO temp_items
    SELECT d.item_id, 0
    FROM item_damages d
        JOIN items ui ON ui.user_id = userId AND ui.id = d.item_id AND d.damage_type_id = attributeId;

    INSERT INTO temp_items
    SELECT d.item_id, 0
    FROM item_damages d
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = d.item_id AND d.damage_type_id = attributeId;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_action_damages mad
        JOIN monster_actions ma ON ma.monster_power_id = mad.monster_action_id AND mad.damage_type_id = attributeId
        JOIN monster_powers mp ON mp.id = ma.monster_power_id
        JOIN creatures uc ON uc.user_id = userId AND uc.id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_action_damages mad
        JOIN monster_actions ma ON ma.monster_power_id = mad.monster_action_id AND mad.damage_type_id = attributeId
        JOIN monster_powers mp ON mp.id = ma.monster_power_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = mp.monster_id;

    INSERT INTO temp_powers
    SELECT pd.power_id, 0
    FROM power_damages pd
        JOIN powers up ON up.user_id = userId AND up.id = pd.power_id AND pd.damage_type_id = attributeId;

    INSERT INTO temp_powers
    SELECT pd.power_id, 0
    FROM power_damages pd
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = pd.power_id AND pd.damage_type_id = attributeId;

    INSERT INTO temp_creatures
    SELECT uc.id, 0
    FROM roll_dice_results rdr
        JOIN roll_results rr ON rdr.roll_result_id = rr.id AND rdr.damage_type_id = attributeId
        JOIN rolls r ON r.id = rr.roll_id
        JOIN creatures uc ON uc.user_id = userId AND r.creature_id = uc.id;

    INSERT INTO temp_creatures
    SELECT uc.creature_id, 0
    FROM roll_dice_results rdr
        JOIN roll_results rr ON rdr.roll_result_id = rr.id AND rdr.damage_type_id = attributeId
        JOIN rolls r ON r.id = rr.roll_id
        JOIN creatures_shared uc ON uc.user_id = userId AND r.creature_id = uc.creature_id;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 2 AS type_id, c.characteristic_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_characteristics GROUP BY id) AS t
            JOIN characteristics c ON t.id = c.id

        UNION

        SELECT 3 AS type_id, p.power_type_id AS sub_type_id, p.id, p.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_powers GROUP BY id) AS t
            JOIN powers p ON t.id = p.id

        UNION

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_powers;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
END;;

DELIMITER ;

# CALL Attributes_InUse_DamageType(66, 1);

