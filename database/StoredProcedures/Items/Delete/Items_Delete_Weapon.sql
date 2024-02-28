DROP PROCEDURE IF EXISTS Items_Delete_Weapon;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Weapon(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE weaponId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO weaponId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF weaponId IS NOT NULL THEN
        CALL Items_Delete_Common(weaponId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE wwp FROM weapon_weapon_properties wwp JOIN items i ON i.id = wwp.weapon_id WHERE weapon_id = weaponId AND i.user_id = userId;
            DELETE w FROM weapons w JOIN items i ON i.id = w.item_id WHERE item_id = weaponId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = weaponId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = weaponId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_Weapon(265, 1, 0);
