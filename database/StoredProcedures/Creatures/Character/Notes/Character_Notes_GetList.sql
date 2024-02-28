DROP PROCEDURE IF EXISTS Character_Notes_GetList;

DELIMITER ;;
CREATE PROCEDURE Character_Notes_GetList(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN categoryValue VARCHAR(100)
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    SELECT n.id, c.id AS category_id, c.name AS category_name, c.expanded, n.note, n.date
    FROM character_notes n
        LEFT JOIN character_note_categories c ON n.character_note_category_id = c.id
    WHERE n.character_id = characterId
        AND (categoryValue IS NULL OR c.name = categoryValue)
    ORDER BY `order`, date;
END;;

DELIMITER ;

# CALL Character_Notes_GetList(1, 1, null, 'name', 0);
