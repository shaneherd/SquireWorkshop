DROP PROCEDURE IF EXISTS Items_Delete_Pack;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Pack(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE packId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO packId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF packId IS NOT NULL THEN
        CALL Items_Delete_Common(packId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE pi FROM pack_items pi JOIN items i ON i.id = pi.pack_id WHERE pi.pack_id = packId AND i.user_id = userId;
            DELETE p FROM packs p JOIN items i ON i.id = p.item_id WHERE item_id = packId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = packId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = packId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_Pack(265, 1, 0);
