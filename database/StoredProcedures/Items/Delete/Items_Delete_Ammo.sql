DROP PROCEDURE IF EXISTS Items_Delete_Ammo;

DELIMITER ;;
CREATE PROCEDURE Items_Delete_Ammo(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE ammoId INT UNSIGNED;
    DECLARE ammoPropertyId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SET ammoPropertyId = (SELECT id FROM attributes WHERE sid = 119);

    SELECT id, user_id = userId
    INTO ammoId, isOwner
    FROM items
    WHERE user_id IN (0, userId) AND id = itemId;

    IF ammoId IS NOT NULL THEN
        DELETE wwp FROM weapon_weapon_properties wwp JOIN weapons w ON w.item_id = wwp.weapon_id AND w.ammo_id = ammoId AND wwp.weapon_property_id = ammoPropertyId JOIN items i ON w.item_id = i.id AND i.user_id = userId;
        UPDATE weapons w JOIN items i ON i.id = w.item_id SET ammo_id = NULL WHERE ammo_id = ammoId AND i.user_id = userId;
        UPDATE monster_actions ma JOIN monster_powers mp ON mp.id = ma.monster_power_id JOIN creatures c ON c.id = mp.monster_id SET ma.ammo_id = NULL WHERE ma.ammo_id = ammoId AND c.user_id = userId;
        CALL Items_Delete_Common(ammoId, userId);

        IF isOwner THEN
            DELETE FROM items_public WHERE item_id = itemId;
            DELETE FROM items_private WHERE item_id = itemId;
            UPDATE items SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = itemId;

            DELETE a FROM ammos a JOIN items i ON i.id = a.item_id WHERE item_id = ammoId AND i.user_id = userId;
            DELETE FROM items WHERE user_id = userId AND id = ammoId;
        ELSE
            DELETE FROM items_shared WHERE user_id = userId AND item_id = ammoId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Items_Delete_Ammo(265, 1, 0);
