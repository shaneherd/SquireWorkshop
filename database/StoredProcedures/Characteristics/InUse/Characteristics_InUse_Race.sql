DROP PROCEDURE IF EXISTS Characteristics_InUse_Race;

DELIMITER ;;
CREATE PROCEDURE Characteristics_InUse_Race(
    IN characteristicId INT UNSIGNED,
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

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_creatures
    SELECT c.creature_id, 1
    FROM characters c
        JOIN creatures uc ON uc.user_id = userId AND uc.id = c.creature_id
    WHERE race_id = characteristicId;

    INSERT INTO temp_creatures
    SELECT c.creature_id, 1
    FROM characters c
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = c.creature_id
    WHERE race_id = characteristicId;

    INSERT INTO temp_items
    SELECT miar.magical_item_id, 1
    FROM magical_item_attunement_races miar
        JOIN items ui ON ui.user_id = userId AND ui.id = miar.magical_item_id
    WHERE miar.race_id = characteristicId;

    INSERT INTO temp_items
    SELECT miar.magical_item_id, 1
    FROM magical_item_attunement_races miar
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = miar.magical_item_id
    WHERE miar.race_id = characteristicId;

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

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
END;;

DELIMITER ;

# CALL Characteristics_InUse_Race(45, 1);
