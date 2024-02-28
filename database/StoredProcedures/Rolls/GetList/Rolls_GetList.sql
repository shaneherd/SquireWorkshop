DROP PROCEDURE IF EXISTS Rolls_GetList;

DELIMITER ;;
CREATE PROCEDURE Rolls_GetList(
    IN creatureId INT UNSIGNED,
    IN isArchived BIT
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_ids
    (
        id INT UNSIGNED NOT NULL
    );
    
    INSERT INTO temp_ids
    SELECT id
    FROM rolls
    WHERE creature_id = creatureId AND archived = isArchived AND parent_roll_id IS NULL;

    # Rolls
    SELECT r.id, creature_id, roll_type_id, reason, half_on_miss, advantage, disadvantage, critical, timestamp, result
    FROM temp_ids ti
        JOIN rolls r ON r.id = ti.id
    ORDER BY timestamp DESC;

    # Children Rolls
    SELECT parent_roll_id, id, creature_id, roll_type_id, reason, half_on_miss, advantage, disadvantage, critical, timestamp, result
    FROM rolls
    WHERE parent_roll_id IN (SELECT id FROM temp_ids)
    ORDER BY timestamp DESC;
    
    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END;;

DELIMITER ;

CALL Rolls_GetList(1, 0);

