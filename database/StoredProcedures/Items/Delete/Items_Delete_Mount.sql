DROP PROCEDURE IF EXISTS Items_Delete_Mount;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Mount(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE mountId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO mountId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF mountId IS NOT NULL THEN
        CALL Items_Delete_Common(mountId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE m FROM mounts m JOIN items i ON i.id = m.item_id WHERE item_id = mountId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = mountId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = mountId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_Mount(265, 1, 0);
