DROP PROCEDURE IF EXISTS Items_Delete;

DELIMITER ;;
CREATE PROCEDURE Items_Delete(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemTypeId TINYINT UNSIGNED;

    SET itemTypeId = (SELECT item_type_id FROM items WHERE id = itemId);

    IF itemTypeId = 1 THEN
        CALL Items_Delete_Weapon(itemId, userId);
    ELSEIF itemTypeId = 2 THEN
        CALL Items_Delete_Armor(itemId, userId);
    ELSEIF itemTypeId = 3 THEN
        CALL Items_Delete_Gear(itemId, userId);
    ELSEIF itemTypeId = 4 THEN
        CALL Items_Delete_Tool(itemId, userId);
    ELSEIF itemTypeId = 5 THEN
        CALL Items_Delete_Ammo(itemId, userId);
    ELSEIF itemTypeId = 6 THEN
        CALL Items_Delete_Mount(itemId, userId);
    ELSEIF itemTypeId = 7 THEN
        CALL Items_Delete_Treasure(itemId, userId);
    ELSEIF itemTypeId = 8 THEN
        CALL Items_Delete_Pack(itemId, userId);
    ELSEIF itemTypeId = 9 THEN
        CALL Items_Delete_MagicalItem(itemId, userId);
    ELSEIF itemTypeId = 10 THEN
        CALL Items_Delete_Vehicle(itemId, userId);
    END IF;

END;;

DELIMITER ;

# CALL Items_Delete(265, 1, 0, 0);
