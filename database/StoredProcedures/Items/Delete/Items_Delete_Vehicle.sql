DROP PROCEDURE IF EXISTS Items_Delete_Vehicle;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Vehicle(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE vehicleId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO vehicleId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF vehicleId IS NOT NULL THEN
        CALL Items_Delete_Common(vehicleId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE v FROM vehicles v JOIN items i ON i.id = v.item_id WHERE item_id = vehicleId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = vehicleId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = vehicleId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_Vehicle(265, 1, 0);
