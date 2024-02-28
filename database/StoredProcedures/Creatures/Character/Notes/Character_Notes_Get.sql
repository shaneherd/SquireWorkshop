DROP PROCEDURE IF EXISTS Character_Notes_Get;

DELIMITER ;;
CREATE PROCEDURE Character_Notes_Get(
    IN noteId INT UNSIGNED,
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    SELECT note.id, c.id AS category_id, c.name AS category_name, c.expanded, note.note, note.date
    FROM character_notes note
        LEFT JOIN character_note_categories c ON note.character_note_category_id = c.id
    WHERE note.character_id = characterId
        AND note.id = noteId;
END;;

DELIMITER ;

# CALL Character_Notes_Get(1, 1, 1);

