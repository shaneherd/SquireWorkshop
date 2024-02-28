DROP PROCEDURE IF EXISTS Items_Delete_Gear;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Gear(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE gearId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO gearId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF gearId IS NOT NULL THEN
        CALL Items_Delete_Common(gearId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE g FROM gears g JOIN items i ON i.id = g.item_id WHERE item_id = gearId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = gearId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = gearId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_Gear(265, 1, 0);
