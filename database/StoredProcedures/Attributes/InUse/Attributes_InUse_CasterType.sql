DROP PROCEDURE IF EXISTS Attributes_InUse_CasterType;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_CasterType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_monsters
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_characteristics
    SELECT c.characteristic_id, 0
    FROM classes c
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = c.characteristic_id
    WHERE spellcaster_type_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT c.characteristic_id, 0
    FROM classes c
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = c.characteristic_id
    WHERE spellcaster_type_id = attributeId;

    # Get Values
    SELECT * FROM (
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
    DROP TEMPORARY TABLE IF EXISTS temp_monsters;
END;;

DELIMITER ;

# CALL Attributes_InUse_CasterType(45, 1);

