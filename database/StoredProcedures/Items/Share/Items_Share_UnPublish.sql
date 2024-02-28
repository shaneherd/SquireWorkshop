DROP PROCEDURE IF EXISTS Items_Share_UnPublish;

DELIMITER ;;
CREATE PROCEDURE Items_Share_UnPublish(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userItemId INT UNSIGNED;

    SET userItemId = (SELECT id FROM items WHERE user_id = userId AND id = itemId);
    IF userItemId IS NOT NULL THEN
        DELETE FROM items_public WHERE item_id = userItemId;
        DELETE FROM items_private WHERE item_id = userItemId;
    END IF;
END;;

DELIMITER ;

# CALL Items_Share_UnPublish(253, 12);
