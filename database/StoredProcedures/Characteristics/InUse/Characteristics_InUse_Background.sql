DROP PROCEDURE IF EXISTS Characteristics_InUse_Background;

DELIMITER ;;
CREATE PROCEDURE Characteristics_InUse_Background(
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

    INSERT INTO temp_creatures
    SELECT c.creature_id, 0
    FROM characters c
        JOIN creatures uc ON uc.user_id = userId AND uc.id = c.creature_id
    WHERE background_id = characteristicId;

    INSERT INTO temp_creatures
    SELECT c.creature_id, 0
    FROM characters c
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = c.creature_id
    WHERE background_id = characteristicId;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 2 AS type_id, c.characteristic_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_characteristics GROUP BY id) AS t
            JOIN characteristics c ON t.id = c.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
END;;

DELIMITER ;

# CALL Characteristics_InUse_Background(57, 1);
