DROP PROCEDURE IF EXISTS Character_Notes_Update;

DELIMITER ;;
CREATE PROCEDURE Character_Notes_Update(
    IN noteId INT UNSIGNED,
    IN characterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN noteCategoryName VARCHAR(45),
    IN noteValue VARCHAR(1000)
)
BEGIN
    DECLARE originalNoteCategoryId INT UNSIGNED;
    DECLARE characterNoteCategoryId INT UNSIGNED;
    DECLARE characterNoteId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    IF noteCategoryName = '' THEN
        SET noteCategoryName = NULL;
    END IF;

    SET characterNoteId = (SELECT note.id FROM character_notes note JOIN creatures c ON c.id = note.character_id WHERE note.id = noteId AND note.character_id = characterId AND c.user_id = userId);
    SET originalNoteCategoryId = (SELECT character_note_category_id FROM character_notes WHERE id = characterNoteId);
    SET characterNoteCategoryId = (SELECT id FROM character_note_categories WHERE character_id = characterId AND name = noteCategoryName);

    IF characterNoteId IS NOT NULL THEN
        IF (originalNoteCategoryId = characterNoteCategoryId) OR (originalNoteCategoryId IS NULL AND noteCategoryName IS NULL) THEN
            UPDATE character_notes SET note = noteValue WHERE id = characterNoteId;
        ELSE
            IF noteCategoryName IS NOT NULL AND characterNoteCategoryId IS NULL THEN
                INSERT INTO `character_note_categories` (`character_id`, `name`)
                VALUES (characterId, noteCategoryName);
                SET characterNoteCategoryId = (SELECT LAST_INSERT_ID());
            END IF;

            UPDATE character_notes SET note = noteValue, character_note_category_id = characterNoteCategoryId WHERE id = characterNoteId;

            IF (originalNoteCategoryId IS NOT NULL AND (SELECT COUNT(*) FROM character_notes WHERE character_note_category_id = originalNoteCategoryId) = 0) THEN
                DELETE FROM character_note_categories WHERE character_id = characterId AND id = originalNoteCategoryId;
            END IF;
        END IF;
    END IF;

    COMMIT;

    CALL Character_Notes_Get(noteId, characterId, userId);
END;;

DELIMITER ;

# CALL Character_Notes_Update(2);
