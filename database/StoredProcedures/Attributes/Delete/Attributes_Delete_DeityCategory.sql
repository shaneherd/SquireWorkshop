DROP PROCEDURE IF EXISTS Attributes_Delete_DeityCategory;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_DeityCategory(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE deityCategoryId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO deityCategoryId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF deityCategoryId IS NOT NULL THEN
        UPDATE deities d JOIN attributes a ON a.id = d.attribute_id SET deity_category_id = NULL WHERE deity_category_id = deityCategoryId AND a.user_id = userId;
        CALL Attributes_Delete_Common(deityCategoryId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE dc FROM deity_categories dc JOIN attributes a ON a.id = dc.attribute_id WHERE attribute_id = deityCategoryId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = deityCategoryId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = deityCategoryId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_DeityCategory(265, 1, 0);
