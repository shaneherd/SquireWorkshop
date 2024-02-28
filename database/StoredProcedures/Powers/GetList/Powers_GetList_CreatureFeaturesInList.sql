DROP PROCEDURE IF EXISTS Powers_GetList_CreatureFeaturesInList;

DELIMITER ;;
CREATE PROCEDURE Powers_GetList_CreatureFeaturesInList(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN featureIds VARCHAR(500)
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_ids
    (
        id INT UNSIGNED NOT NULL
    );

    IF featureIds IS NOT NULL THEN
        SET @sql = CONCAT('INSERT INTO temp_ids (id) SELECT id FROM powers WHERE power_type_id = 2 AND id IN (', featureIds, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    SELECT p.id AS feature_id, p.name AS feature_name, p.sid as feature_sid, p.user_id = userId AS feature_is_author, f.characteristic_type_id,
           c.id AS characteristic_id, c.name AS characteristic_name, c.sid AS characteristic_sid, c.user_id = userId AS characteristic_is_author, f.passive
    FROM temp_ids ti
        JOIN powers p ON p.id = ti.id
        JOIN features f ON f.power_id = p.id
        LEFT JOIN characteristics c ON f.characteristic_id = c.id
    GROUP BY p.id;

    # Tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
        JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = characterId and p.power_id IN (SELECT id FROM temp_ids);

    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END;;

DELIMITER ;

# CALL Powers_GetList_CreatureFeaturesInList(1, 1, '320,321,322,323');
