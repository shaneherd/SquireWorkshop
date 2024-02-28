DROP PROCEDURE IF EXISTS Character_Notes_Delete;

DELIMITER ;;
CREATE PROCEDURE Character_Notes_Delete(
    IN noteId INT UNSIGNED,
    IN characterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE originalNoteCategoryId INT UNSIGNED;
    DECLARE characterNoteId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS success;
    END;

    START TRANSACTION;

    SET characterNoteId = (SELECT note.id FROM character_notes note JOIN creatures c ON c.id = note.character_id WHERE note.id = noteId AND note.character_id = characterId AND c.user_id = userId);
    SET originalNoteCategoryId = (SELECT character_note_category_id FROM character_notes WHERE id = characterNoteId);

    IF characterNoteId IS NOT NULL THEN
        DELETE FROM character_notes WHERE id = characterNoteId;

        IF (originalNoteCategoryId IS NOT NULL AND (SELECT COUNT(*) FROM character_notes WHERE character_note_category_id = originalNoteCategoryId) = 0) THEN
            DELETE FROM character_note_categories WHERE character_id = characterId AND id = originalNoteCategoryId;
        END IF;

        SELECT 1 AS success;
    ELSE
        SELECT 0 AS success;
    END IF;

    COMMIT;
END;;

DELIMITER ;

# CALL Character_Notes_Delete(2);
