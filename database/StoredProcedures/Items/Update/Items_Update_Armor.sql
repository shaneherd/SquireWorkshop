DROP PROCEDURE IF EXISTS Items_Update_Armor;

DELIMITER ;;
CREATE PROCEDURE Items_Update_Armor(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN itemName VARCHAR(45),
    IN itemDescription VARCHAR(1000),
    IN isExpendable BIT,
    IN slotValue TINYINT UNSIGNED,
    IN isContainer BIT,
    IN isIgnoreWeight BIT,
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN armorTypeId INT UNSIGNED,
    IN acValue TINYINT UNSIGNED,
    IN abilityModifierId INT UNSIGNED,
    IN maxAbilityModifier TINYINT UNSIGNED,
    IN minStrength TINYINT UNSIGNED,
    IN isStealthDisadvantage BIT
)
BEGIN
    DECLARE valid BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    SET valid = (SELECT user_id FROM items WHERE id = itemId) = userId;

    IF valid THEN
        UPDATE items
        SET name = itemName, description = itemDescription, expendable = isExpendable,
            slot = slotValue, container = isContainer, ignore_weight = isIgnoreWeight, cost = costValue,
            cost_unit = costUnit, weight = weightValue, version = version + 1
        WHERE user_id = userId AND id = itemId;
        
        UPDATE armors
        SET armor_type_id = armorTypeId, ac = acValue, ability_modifier_id = abilityModifierId,
            max_ability_modifier = maxAbilityModifier, min_strength = minStrength,
            stealth_disadvantage = isStealthDisadvantage
        WHERE item_id = itemId;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Items_Update_Armor(265, 1, 'test-changed', 'test-changed-desc', 'ab');
