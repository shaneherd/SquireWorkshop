DROP PROCEDURE IF EXISTS Items_Update_Ammo;

DELIMITER ;;
CREATE PROCEDURE Items_Update_Ammo(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN attackModifier TINYINT UNSIGNED,
    IN attackAbilityModifierId INT UNSIGNED
)
BEGIN
    DECLARE valid BIT;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT 0 AS valid_request;
#     END;

#     START TRANSACTION;

    SET valid = (SELECT user_id FROM items WHERE id = itemId) = userId;

    IF valid THEN
        UPDATE items
        SET name = itemName, description = itemDescription, cost = costValue, cost_unit = costUnit, weight = weightValue, version = version + 1
        WHERE user_id = userId AND id = itemId;
        
        UPDATE ammos
        SET attack_modifier = attackModifier, attack_ability_modifier_id = attackAbilityModifierId
        WHERE item_id = itemId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Items_Update_Ammo(265, 1, 'test-changed', 'test-changed-desc', 'ab');
