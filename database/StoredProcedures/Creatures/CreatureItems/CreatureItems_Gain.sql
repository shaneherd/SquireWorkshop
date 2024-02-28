DROP PROCEDURE IF EXISTS CreatureItems_Gain;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Gain(
    IN creatureItemId INT UNSIGNED,
    IN itemQuantity SMALLINT UNSIGNED
)
BEGIN
    DECLARE currentContainer INT UNSIGNED;
    DECLARE currentCreatureItemStateId TINYINT UNSIGNED;
    DECLARE isContainer BIT;
    DECLARE isMount BIT;
    DECLARE isVehicle BIT;
    DECLARE hasCharges BIT;
    DECLARE maxCharges SMALLINT UNSIGNED;
    DECLARE isCursed BIT;
    DECLARE isScroll BIT;
    DECLARE spellId INT UNSIGNED;
    DECLARE allowAdditionalSpells BIT;
    DECLARE creatureId INT UNSIGNED;
    DECLARE baseItemId INT UNSIGNED;
    DECLARE magicalItemTypeId INT UNSIGNED;
    DECLARE forceNew BIT;

    SELECT ci.creature_id, ci.item_id, ci.container_id, ci.creature_item_state_id, i.container, i.item_type_id = 6, i.item_type_id = 10, ci.magic_item_type_id, mi.max_charges, ci.cursed, mi.additional_spells, mi.magical_item_type_id = 5
    INTO creatureId, baseItemId, currentContainer, currentCreatureItemStateId, isContainer, isMount, isVehicle, magicalItemTypeId, maxCharges, isCursed, allowAdditionalSpells, isScroll
    FROM creature_items ci
    JOIN items i ON ci.item_id = i.id
    LEFT JOIN magical_items mi ON mi.item_id = i.id
    WHERE ci.id = creatureItemId;

    SET forceNew = currentCreatureItemStateId = 3; -- equipped
    IF forceNew THEN -- equipped
        SET currentCreatureItemStateId = 1; -- carried
        SET currentContainer = NULL;
    END IF;

    IF allowAdditionalSpells IS NULL THEN
        SET allowAdditionalSpells = 0;
    END IF;

    IF isScroll IS NULL THEN
        SET isScroll = 0;
    END IF;

    IF isScroll THEN
        SET spellId = (SELECT spell_id FROM creature_item_spells WHERE creature_item_id = creatureItemId LIMIT 1);
    END IF;

    SET hasCharges = (maxCharges IS NOT NULL AND maxCharges > 0);

    IF isContainer OR isMount OR isVehicle OR hasCharges OR allowAdditionalSpells OR isCursed OR isScroll OR forceNew THEN
        CALL CreatureItems_Add(creatureId,baseItemId,itemQuantity,currentContainer,magicalItemTypeId, spellId,currentCreatureItemStateId,isCursed);
    ELSE
        UPDATE creature_items
        SET quantity = quantity + itemQuantity
        WHERE id = creatureItemId;
    END IF;
END;;

DELIMITER ;

# CALL CreatureItems_Gain(32, 1);
# select i.name, i.item_type_id, ci.* from creature_items ci
# join items i on ci.item_id = i.id
