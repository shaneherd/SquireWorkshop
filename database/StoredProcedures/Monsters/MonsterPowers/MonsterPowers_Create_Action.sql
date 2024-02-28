DROP PROCEDURE IF EXISTS MonsterPowers_Create_Action;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Create_Action(
    IN powerName VARCHAR(50),
    IN monsterId INT UNSIGNED,
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
    IN actionDescription VARCHAR(2000),
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE powerId INT UNSIGNED;

    INSERT INTO monster_powers (name, monster_power_type_id, monster_id, recharge_min, recharge_max, user_id)
    VALUES (powerName, 1, monsterId, rechargeMin, rechargeMax, userId);

    SET powerId = (SELECT LAST_INSERT_ID());

    INSERT INTO monster_actions (monster_power_id, action_type_id, legendary_cost, weapon_range_type_id,
                                 reach, normal_range, long_range, ammo_id, attack_type_id, temporary_hp,
                                 attack_mod, attack_ability_modifier_id, save_type_id,
                                 save_proficiency_modifier, save_ability_modifier_id, half_on_save,
                                 description)
    VALUES (powerId, actionTypeId, legendaryCost, weaponRangeTypeId, reachValue, normalRange, longRange,
            ammoId, attackTypeId, temporaryHP, attackMod, attackAbilityModifierId, saveTypeId, saveProficiencyModifier,
            saveAbilityModifierId, halfOnSave, actionDescription);

    SELECT powerId AS monster_power_id;
END;;

DELIMITER ;

# CALL MonsterPowers_Create_Action(1,,, 0, 1, 2, 1,,,,, 0, 1000, 1);

