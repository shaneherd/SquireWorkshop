DROP PROCEDURE IF EXISTS Items_GetPublishedDetails;

DELIMITER ;;
CREATE PROCEDURE Items_GetPublishedDetails(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE authorItemId INT UNSIGNED;

    SET authorItemId = (SELECT id FROM items WHERE user_id = userId AND id = itemId);
    SELECT EXISTS(
        SELECT 1 FROM items_public WHERE item_id = authorItemId
        UNION
        SELECT 1 FROM items_private WHERE item_id = authorItemId
    ) AS published;

    SELECT u.username
    FROM items_private ip
        JOIN users u ON u.id = ip.user_id AND ip.item_id = authorItemId;
END;;

DELIMITER ;

# CALL Items_GetPublishedDetails(253, 12);
