DROP PROCEDURE IF EXISTS Items_Share_Private;

DELIMITER ;;
CREATE PROCEDURE Items_Share_Private(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN toUsername VARCHAR(45)
)
BEGIN
    DECLARE userItemId INT UNSIGNED;
    DECLARE toUserId MEDIUMINT UNSIGNED;

    SET userItemId = (SELECT id FROM items WHERE user_id = userId AND id = itemId);
    SET toUserId = (SELECT id FROM users WHERE username = toUsername);
    IF userItemId IS NOT NULL AND toUserId IS NOT NULL THEN
        INSERT IGNORE INTO items_private (item_id, user_id) VALUES (userItemId, toUserId);
    END IF;
END;;

DELIMITER ;

# CALL Items_Share_Private(1, 1, 'sherd');
