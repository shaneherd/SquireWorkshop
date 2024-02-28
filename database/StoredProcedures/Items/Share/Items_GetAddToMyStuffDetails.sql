DROP PROCEDURE IF EXISTS Items_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Items_GetAddToMyStuffDetails(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorItemId INT UNSIGNED;
    DECLARE existingItemId INT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;
    DECLARE authorItemTypeId TINYINT UNSIGNED;
    DECLARE existingItemTypeId TINYINT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorItemId = itemId;
    ELSE
        SET authorItemId = (SELECT published_parent_id FROM items WHERE user_id = userId AND id = itemId);
        IF authorItemId IS NULL THEN
            SET authorItemId = (SELECT item_id FROM items_public WHERE item_id = itemId);
        END IF;
        IF authorItemId IS NULL THEN
            SET authorItemId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
        END IF;
    END IF;

    SELECT user_id, item_type_id
    INTO authorUserId, authorItemTypeId
    FROM items WHERE id = authorItemId;

    SELECT id, item_type_id
    INTO existingItemId, existingItemTypeId
    FROM items WHERE published_parent_id = authorItemId AND user_id = userId;

    SELECT authorItemId AS author_item_id,
           authorUserId AS author_user_id,
           existingItemId AS existing_item_id,
           authorItemTypeId AS author_item_type_id,
           existingItemTypeId AS existing_item_type_id;
END;;

DELIMITER ;

# CALL Items_GetAddToMyStuffDetails(253, 12);
