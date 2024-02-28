DROP PROCEDURE IF EXISTS Attributes_Delete_ToolCategory;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_ToolCategory(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE toolCategoryId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO toolCategoryId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF toolCategoryId IS NOT NULL THEN
        UPDATE tools t JOIN items i ON i.id = t.item_id SET tool_category_id = NULL WHERE tool_category_id = toolCategoryId AND i.user_id = userId; # this should throw an exception if a match is found
        CALL Attributes_Delete_Common(toolCategoryId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE tc FROM tool_categories tc JOIN attributes a ON a.id = tc.attribute_id WHERE attribute_id = toolCategoryId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = toolCategoryId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = toolCategoryId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_ToolCategory(265, 1, 0);
