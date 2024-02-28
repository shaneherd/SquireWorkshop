DROP PROCEDURE IF EXISTS Powers_GetList_SpellsInList;

DELIMITER ;;
CREATE PROCEDURE Powers_GetList_SpellsInList(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN spellIds VARCHAR(500)
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_ids
    (
        id INT UNSIGNED NOT NULL
    );

    IF spellIds IS NOT NULL THEN
        SET @sql = CONCAT('INSERT INTO temp_ids (id) SELECT id FROM powers WHERE power_type_id = 1 AND id IN (', spellIds, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    SELECT p.id AS spell_id, p.name AS spell_name, p.sid as spell_sid, p.user_id = userId AS spell_is_author, s.level AS spell_level
    FROM temp_ids ti
        JOIN powers p ON p.id = ti.id
        JOIN spells s ON s.power_id = p.id
    GROUP BY p.id;

    # Tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
        JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = characterId and p.power_id IN (SELECT id FROM temp_ids);

    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END;;

DELIMITER ;

# CALL Powers_GetList_SpellsInList(1, 1, '1,2,3');
