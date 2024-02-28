DROP PROCEDURE IF EXISTS Attributes_InUse_Deity;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_Deity(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_creatures
    SELECT ch.creature_id, 0
    FROM characters ch
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ch.creature_id AND deity_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ch.creature_id, 0
    FROM characters ch
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ch.creature_id AND deity_id = attributeId;

    # Get Values
    SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
    FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
        JOIN creatures c ON t.id = c.id
    ORDER BY sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
END;;

DELIMITER ;

# CALL Attributes_InUse_Deity(151, 1);

