DROP PROCEDURE IF EXISTS Items_Create_Weapon;

DELIMITER ;;
CREATE PROCEDURE Items_Create_Weapon(
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN isExpendable BIT,
    IN isContainer BIT,
    IN isIgnoreWeight BIT,
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN weaponTypeId INT UNSIGNED,
    IN weaponRangeType TINYINT UNSIGNED,
    IN normalRange SMALLINT UNSIGNED,
    IN longRange SMALLINT UNSIGNED,
    IN attackMod TINYINT UNSIGNED,
    IN ammoId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS item_id;
#     END;

#     START TRANSACTION;

    INSERT INTO items (name, item_type_id, description, expendable, equippable, slot, container, ignore_weight, cost, cost_unit, weight, user_id)
    VALUES (itemName, 1, itemDescription, isExpendable, 1, 2, isContainer, isIgnoreWeight, costValue, costUnit, weightValue, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO weapons (item_id, weapon_type_id, weapon_range_type, normal_range, long_range, attack_mod, ammo_id)
    VALUES (itemId, weaponTypeId, weaponRangeType, normalRange, longRange, attackMod, ammoId);

#     COMMIT;

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_Weapon('test', 'test_description', 1, 'tst', 1);
