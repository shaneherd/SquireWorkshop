DROP PROCEDURE IF EXISTS Rolls_Get;

DELIMITER ;;
CREATE PROCEDURE Rolls_Get(
    IN rollId INT UNSIGNED,
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_ids
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_ids
    SELECT rollId
    UNION
    SELECT id
    FROM rolls
    WHERE parent_roll_id = rollId;

    # Rolls
    SELECT id, creature_id, roll_type_id, reason, half_on_miss, advantage, disadvantage, critical, timestamp, result
    FROM rolls
    WHERE id = rollId AND creature_id = creatureId;

    # Children Rolls
    SELECT id, creature_id, roll_type_id, reason, half_on_miss, advantage, disadvantage, critical, timestamp, result
    FROM rolls
    WHERE parent_roll_id = rollId
    ORDER BY timestamp DESC;

    # Roll Results
    SELECT roll_id, id AS result_id
    FROM roll_results
    WHERE roll_id IN (SELECT id FROM temp_ids);

    # Dice Results
    SELECT roll_result_id, dice_size_id, modifier, results, critical, damage_type_id, damageType.name AS damage_type_name,
           damageType.description AS damage_type_description, damageType.sid AS damage_type_sid,
           damageType.user_id = userId AS damage_type_is_author, damageType.version AS damage_type_version
    FROM roll_dice_results rdr
        LEFT JOIN attributes damageType ON rdr.damage_type_id = damageType.id
    WHERE roll_result_id IN (
            SELECT id
            FROM roll_results
            WHERE roll_id IN (SELECT id FROM temp_ids)
        );

    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END;;

DELIMITER ;

CALL Rolls_Get(8, 1, 1);

