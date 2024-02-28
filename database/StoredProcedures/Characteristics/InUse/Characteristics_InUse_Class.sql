DROP PROCEDURE IF EXISTS Characteristics_InUse_Class;

DELIMITER ;;
CREATE PROCEDURE Characteristics_InUse_Class(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
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
    SELECT ccc.character_id, 1
    FROM character_chosen_classes ccc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ccc.character_id
    WHERE class_id = characteristicId;

    INSERT INTO temp_creatures
    SELECT ccc.character_id, 1
    FROM character_chosen_classes ccc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ccc.character_id
    WHERE class_id = characteristicId;

    INSERT INTO temp_creatures
    SELECT ccc.character_id, 1
    FROM character_chosen_classes ccc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ccc.character_id
    WHERE subclass_id = characteristicId;

    INSERT INTO temp_creatures
    SELECT ccc.character_id, 1
    FROM character_chosen_classes ccc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ccc.character_id
    WHERE subclass_id = characteristicId;

    INSERT INTO temp_items
    SELECT miac.magical_item_id, 1
    FROM magical_item_attunement_classes miac
        JOIN items ui ON ui.user_id = userId AND ui.id = miac.magical_item_id
    WHERE miac.class_id = characteristicId;

    INSERT INTO temp_items
    SELECT miac.magical_item_id, 1
    FROM magical_item_attunement_classes miac
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = miac.magical_item_id
    WHERE miac.class_id = characteristicId;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
END;;

DELIMITER ;

# CALL Characteristics_InUse_Class(55, 1);
