DROP PROCEDURE IF EXISTS Items_Create_Armor;

DELIMITER ;;
CREATE PROCEDURE Items_Create_Armor(
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
    IN isStealthDisadvantage BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS item_id;
    END;

    START TRANSACTION;

    INSERT INTO items (name, item_type_id, description, expendable, equippable, slot, container, ignore_weight, cost, cost_unit, weight, user_id)
    VALUES (itemName, 2, itemDescription, isExpendable, 1, slotValue, isContainer, isIgnoreWeight, costValue, costUnit, weightValue, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO armors (item_id, armor_type_id, ac, ability_modifier_id, max_ability_modifier, min_strength, stealth_disadvantage)
    VALUES (itemId, armorTypeId, acValue, abilityModifierId, maxAbilityModifier, minStrength, isStealthDisadvantage);

    COMMIT;

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_Armor('test', 'test_description', 1, 'tst', 1);
