DROP PROCEDURE IF EXISTS Powers_InUse_Spell;

DELIMITER ;;
CREATE PROCEDURE Powers_InUse_Spell(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_monsters
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_powers cap
        JOIN creature_actions ca ON ca.id = cap.creature_action_id
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ca.creature_id
    WHERE power_id = powerId;

    INSERT INTO temp_creatures
    SELECT ca.creature_id, 0
    FROM creature_action_powers cap
        JOIN creature_actions ca ON ca.id = cap.creature_action_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ca.creature_id
    WHERE power_id = powerId;

    INSERT INTO temp_creatures
    SELECT cp.creature_id, 0
    FROM creature_powers cp
        JOIN creatures uc ON uc.user_id = userId AND uc.id = cp.creature_id
    WHERE power_id = powerId;

    INSERT INTO temp_creatures
    SELECT cp.creature_id, 0
    FROM creature_powers cp
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = cp.creature_id
    WHERE power_id = powerId;

    # spells
    INSERT INTO temp_characteristics
    SELECT csc.characteristic_id, 0
    FROM characteristic_spell_configurations csc
        JOIN characteristics c ON c.user_id = userId AND c.id = csc.characteristic_id AND (csc.user_id = c.user_id OR csc.user_id = userId)
    WHERE spell_id = powerId;

    INSERT INTO temp_characteristics
    SELECT csc.characteristic_id, 0
    FROM characteristic_spell_configurations csc
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = csc.characteristic_id
        JOIN characteristics c ON c.id = csc.characteristic_id AND (csc.user_id = c.user_id OR csc.user_id = userId)
    WHERE spell_id = powerId;

    INSERT INTO temp_creatures
    SELECT csc.creature_id, 0
    FROM creature_spell_configurations csc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = csc.creature_id
    WHERE spell_id = powerId;

    INSERT INTO temp_creatures
    SELECT csc.creature_id, 0
    FROM creature_spell_configurations csc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = csc.creature_id
    WHERE spell_id = powerId;

    INSERT INTO temp_monsters
    SELECT ms.monster_id, 0
    FROM monster_spells ms
        JOIN monsters uc ON uc.user_id = userId AND uc.id = ms.monster_id
    WHERE spell_id = powerId;

    INSERT INTO temp_monsters
    SELECT ms.monster_id, 0
    FROM monster_spells ms
        JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = ms.monster_id
    WHERE spell_id = powerId;

    INSERT INTO temp_monsters
    SELECT ms.monster_id, 0
    FROM monster_innate_spells ms
             JOIN monsters uc ON uc.user_id = userId AND uc.id = ms.monster_id
    WHERE spell_id = powerId;

    INSERT INTO temp_monsters
    SELECT ms.monster_id, 0
    FROM monster_innate_spells ms
             JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = ms.monster_id
    WHERE spell_id = powerId;

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

        SELECT 5 AS type_id, null AS sub_type_id, m.id, m.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_monsters GROUP BY id) AS t
                 JOIN monsters m ON t.id = m.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_monsters;
END;;

DELIMITER ;

# CALL Powers_InUse_Spell(1, 1);
