DROP PROCEDURE IF EXISTS Character_Notes_Add;

DELIMITER ;;
CREATE PROCEDURE Character_Notes_Add(
    IN characterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN noteCategoryName VARCHAR(45),
    IN noteValue VARCHAR(1000)
)
BEGIN
    DECLARE characterNoteCategoryId INT UNSIGNED;
    DECLARE noteId INT UNSIGNED;
    DECLARE noteOrder INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS character_note_id;
    END;

    START TRANSACTION;

    IF noteCategoryName = '' THEN
        SET noteCategoryName = NULL;
    END IF;

    SET characterNoteCategoryId = (SELECT id FROM character_note_categories WHERE character_id = characterId AND name = noteCategoryName);

    IF noteCategoryName IS NOT NULL AND characterNoteCategoryId IS NULL THEN
        INSERT INTO `character_note_categories` (`character_id`, `name`, `expanded`)
        VALUES (characterId, noteCategoryName, 1);
        SET characterNoteCategoryId = (SELECT LAST_INSERT_ID());
    END IF;

    SET noteOrder = (SELECT COUNT(*) + 1 FROM character_notes WHERE character_note_category_id = characterNoteCategoryId OR (character_note_category_id IS NULL AND characterNoteCategoryId IS NULL));

    INSERT INTO `character_notes` (`character_id`, `character_note_category_id`, `note`, `order`)
    VALUES (characterId, characterNoteCategoryId, noteValue, noteOrder);

    COMMIT;

    SET noteId = (SELECT LAST_INSERT_ID());

    CALL Character_Notes_Get(noteId, characterId, userId);
END;;

DELIMITER ;

CALL Character_Notes_Add(1, 1, '', 'test-note');
