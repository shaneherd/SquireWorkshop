DROP PROCEDURE IF EXISTS User_Defaults;

DELIMITER ;;
CREATE PROCEDURE User_Defaults(
	IN userId INT UNSIGNED
)
BEGIN
    INSERT INTO attributes_shared (attribute_id, user_id)
    SELECT id, userId FROM attributes WHERE user_id = 0;

    INSERT INTO items_shared (item_id, user_id)
    SELECT id, userId FROM items WHERE user_id = 0;

    INSERT INTO powers_shared (power_id, user_id)
    SELECT id, userId FROM powers WHERE user_id = 0;

    INSERT INTO characteristics_shared (characteristic_id, user_id)
    SELECT id, userId FROM characteristics WHERE user_id = 0;

    INSERT INTO creatures_shared (creature_id, user_id)
    SELECT id, userId FROM creatures WHERE user_id = 0;

    INSERT INTO monsters_shared (monster_id, user_id)
    SELECT id, userId FROM monsters WHERE user_id = 0;
END;;

DELIMITER ;

# CALL User_Defaults(1);

