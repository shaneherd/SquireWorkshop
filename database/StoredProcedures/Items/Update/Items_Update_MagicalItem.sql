DROP PROCEDURE IF EXISTS Items_Update_MagicalItem;

DELIMITER ;;
CREATE PROCEDURE Items_Update_MagicalItem(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN itemName VARCHAR(50),
    IN itemDescription VARCHAR(10000),
    IN isExpendable BIT,
    IN isEquippable BIT,
    IN slotValue TINYINT UNSIGNED,
    IN isContainer BIT,
    IN isIgnoreWeight BIT,
    IN costValue MEDIUMINT UNSIGNED,
    IN costUnit INT UNSIGNED,
    IN weightValue DECIMAL(6,3),
    IN rarityId TINYINT UNSIGNED,
    IN requiresAttunement BIT,
    IN itemCurseEffect VARCHAR(1000),
    IN itemMaxCharges TINYINT UNSIGNED,
    IN isRechargeable BIT,
    IN rechargeNumDice TINYINT UNSIGNED,
    IN rechargeDiceSizeId TINYINT UNSIGNED,
    IN rechargeMiscMod TINYINT,
    IN chanceOfDestruction BIT,
    IN isVehicle BIT,
    IN attackMod TINYINT,
    IN acMod TINYINT,
    IN additionalSpells BIT,
    IN additionalSpellsRemoveOnCasting BIT,
    IN attackTypeId TINYINT UNSIGNED,
    IN temporaryHp BIT,
    IN saveTypeId INT UNSIGNED,
    IN halfOnSave BIT,
    IN resetChargesOnLongRest BIT,
    IN spellAttackCalculationTypeId TINYINT UNSIGNED,
    IN spellAttackModifier TINYINT,
    IN spellSaveDC TINYINT UNSIGNED,
    IN magicalItemAttunementTypeId TINYINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;

    SET valid = (SELECT user_id FROM items WHERE id = itemId) = userId;

    IF valid THEN
        UPDATE items
        SET name = itemName, description = itemDescription, expendable = isExpendable, equippable = isEquippable,
            slot = slotValue, container = isContainer, ignore_weight = isIgnoreWeight, cost = costValue,
            cost_unit = costUnit, weight = weightValue, version = version + 1
        WHERE user_id = userId AND id = itemId;

        UPDATE magical_items
        SET rarity_id = rarityId, requires_attunement = requiresAttunement,
            curse_effect = itemCurseEffect, max_charges = itemMaxCharges, rechargeable = isRechargeable,
            recharge_num_dice = rechargeNumDice, recharge_dice_size_id = rechargeDiceSizeId, recharge_misc_mod = rechargeMiscMod,
            chance_of_destruction = chanceOfDestruction, is_vehicle = isVehicle, attack_mod = attackMod, ac_mod = acMod,
            additional_spells = additionalSpells, additional_spells_remove_on_casting = additionalSpellsRemoveOnCasting,
            attack_type_id = attackTypeId, temporary_hp = temporaryHp,
            save_type_id = saveTypeId, half_on_save = halfOnSave, recharge_on_long_rest = resetChargesOnLongRest,
            spell_attack_calculation_type_id = spellAttackCalculationTypeId, spell_attack_modifier = spellAttackModifier,
            spell_save_dc = spellSaveDC, magical_item_attunement_type_id = magicalItemAttunementTypeId
        WHERE item_id = itemId;
    END IF;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Items_Update_MagicalItem(265, 1, 'test-changed', 'test-changed-desc', 'ab');
