DROP PROCEDURE IF EXISTS Items_Create_MagicalItem;

DELIMITER ;;
CREATE PROCEDURE Items_Create_MagicalItem(
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
    IN magicalItemTypeId TINYINT UNSIGNED,
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
    IN magicalItemAttunementTypeId TINYINT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE itemId INT UNSIGNED;

    INSERT INTO items (name, item_type_id, description, expendable, equippable, slot, container, ignore_weight, cost, cost_unit, weight, user_id)
    VALUES (itemName, 9, itemDescription, isExpendable, isEquippable, slotValue, isContainer, isIgnoreWeight, costValue, costUnit, weightValue, userId);

    SET itemId = (SELECT LAST_INSERT_ID());

    INSERT INTO magical_items (item_id, magical_item_type_id, rarity_id, requires_attunement, curse_effect, max_charges,
                               rechargeable, recharge_num_dice, recharge_dice_size_id, recharge_misc_mod, chance_of_destruction,
                               is_vehicle, attack_mod, ac_mod, additional_spells, additional_spells_remove_on_casting, attack_type_id, temporary_hp,
                               save_type_id, half_on_save, recharge_on_long_rest, spell_attack_calculation_type_id,
                               spell_attack_modifier, spell_save_dc, magical_item_attunement_type_id)
    VALUES (itemId, magicalItemTypeId, rarityId, requiresAttunement, itemCurseEffect, itemMaxCharges,
            isRechargeable, rechargeNumDice, rechargeDiceSizeId, rechargeMiscMod, chanceOfDestruction,
            isVehicle, attackMod, acMod, additionalSpells, additionalSpellsRemoveOnCasting, attackTypeId, temporaryHp, saveTypeId, halfOnSave,
            resetChargesOnLongRest, spellAttackCalculationTypeId, spellAttackModifier, spellSaveDC, magicalItemAttunementTypeId);

    SELECT itemId AS item_id;
END;;

DELIMITER ;

# CALL Items_Create_MagicalItem('test', 'test_description', 1, 'tst', 1);
