DROP PROCEDURE IF EXISTS MonsterPowers_Update_Action;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Update_Action(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN powerName VARCHAR(50),
    IN rechargeMin SMALLINT UNSIGNED,
    IN rechargeMax SMALLINT UNSIGNED,
    IN actionTypeId TINYINT UNSIGNED,
    IN legendaryCost TINYINT UNSIGNED,
    IN weaponRangeTypeId TINYINT UNSIGNED,
    IN reachValue TINYINT UNSIGNED,
    IN normalRange SMALLINT UNSIGNED,
    IN longRange SMALLINT UNSIGNED,
    IN ammoId INT UNSIGNED,
    IN attackTypeId TINYINT UNSIGNED,
    IN temporaryHP BIT,
    IN attackMod TINYINT,
    IN attackAbilityModifierId INT UNSIGNED,
    IN saveTypeId INT UNSIGNED,
    IN saveProficiencyModifier BIT,
    IN saveAbilityModifierId int UNSIGNED,
    IN halfOnSave BIT,
    IN actionDescription VARCHAR(2000)
)
BEGIN
    DECLARE valid BIT;

    SET valid = (SELECT user_id FROM monster_powers WHERE id = powerId) = userId;

    IF valid THEN
        UPDATE monster_powers
        SET name = powerName, recharge_min = rechargeMin, recharge_max = rechargeMax, version = version + 1
        WHERE user_id = userId AND id = powerId;

        UPDATE monster_actions
        SET action_type_id = actionTypeId, legendary_cost = legendaryCost, weapon_range_type_id = weaponRangeTypeId,
            reach = reachValue, normal_range = normalRange, long_range = longRange, ammo_id = ammoId,
            attack_type_id = attackTypeId, temporary_hp = temporaryHP, attack_mod = attackMod,
            attack_ability_modifier_id = attackAbilityModifierId, save_type_id = saveTypeId,
            save_proficiency_modifier = saveProficiencyModifier, save_ability_modifier_id = saveAbilityModifierId,
            half_on_save = halfOnSave, description = actionDescription
        WHERE monster_power_id = powerId;
    END IF;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL MonsterPowers_GetList_Actions(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

