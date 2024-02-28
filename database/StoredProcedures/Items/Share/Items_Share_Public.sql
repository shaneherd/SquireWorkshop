DROP PROCEDURE IF EXISTS Items_Share_Public;

DELIMITER ;;
CREATE PROCEDURE Items_Share_Public(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userItemId INT UNSIGNED;

    SET userItemId = (SELECT id FROM items WHERE user_id = userId AND id = itemId);
    IF userItemId IS NOT NULL THEN
        INSERT IGNORE INTO items_public (item_id) VALUES (userItemId);
  END IF;
END;;

DELIMITER ;

# CALL Items_Share_Public(253, 12);
