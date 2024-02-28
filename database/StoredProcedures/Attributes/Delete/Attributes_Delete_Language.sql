DROP PROCEDURE IF EXISTS Attributes_Delete_Language;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Language(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE languageId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO languageId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF languageId IS NOT NULL THEN
        CALL Attributes_Delete_Common(languageId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE l FROM languages l JOIN attributes a ON a.id = l.attribute_id WHERE attribute_id = languageId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = languageId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = languageId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_Language(265, 1, 0);
