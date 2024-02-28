DROP PROCEDURE IF EXISTS Items_Create_Ammo;

DELIMITER ;;
CREATE PROCEDURE Items_Create_Ammo(
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN attackModifier TINYINT UNSIGNED,
    IN attackAbilityModifierId INT UNSIGNED,
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
    VALUES (itemName, 5, itemDescription, 1, 0, null, 0, 0, costValue, costUnit, weightValue, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO ammos (item_id, attack_modifier, attack_ability_modifier_id)
    VALUES (itemId, attackModifier, attackAbilityModifierId);

#     COMMIT;

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_Ammo('test', 'test_description', 1, 'tst', 1);
