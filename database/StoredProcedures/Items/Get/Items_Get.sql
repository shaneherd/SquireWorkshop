DROP PROCEDURE IF EXISTS Items_Get;

DELIMITER ;;
CREATE PROCEDURE Items_Get(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemTypeId TINYINT UNSIGNED;
    SET itemTypeId = (SELECT item_type_id FROM items WHERE id = itemId);
    SELECT itemTypeId AS item_type_id;

    IF itemTypeId = 1 THEN
        CALL Items_Get_Weapon(itemId, userId);
    ELSEIF itemTypeId = 2 THEN
        CALL Items_Get_Armor(itemId, userId);
    ELSEIF itemTypeId = 3 THEN
        CALL Items_Get_Gear(itemId, userId);
    ELSEIF itemTypeId = 4 THEN
        CALL Items_Get_Tool(itemId, userId);
    ELSEIF itemTypeId = 5 THEN
        CALL Items_Get_Ammo(itemId, userId);
    ELSEIF itemTypeId = 6 THEN
        CALL Items_Get_Mount(itemId, userId);
    ELSEIF itemTypeId = 7 THEN
        CALL Items_Get_Treasure(itemId, userId);
    ELSEIF itemTypeId = 8 THEN
        CALL Items_Get_Pack(itemId, userId);
    ELSEIF itemTypeId = 9 THEN
        CALL Items_Get_MagicalItem(itemId, userId);
    ELSEIF itemTypeId = 10 THEN
        CALL Items_Get_Vehicle(itemId, userId);
    END IF;
END;;

DELIMITER ;

# CALL Items_Get(146, 1);
