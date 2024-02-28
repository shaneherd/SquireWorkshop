DROP PROCEDURE IF EXISTS MonsterPowers_GetList_Actions;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_GetList_Actions(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT p.id AS monster_power_id, p.name, p.sid, p.user_id = userId AS is_author, p.version,
           l.limited_use_type_id, l.quantity, l.ability_modifier_id, l.dice_size_id,
           p.recharge_min, p.recharge_max, a.action_type_id, a.legendary_cost, a.weapon_range_type_id,
           a.reach, a.normal_range, a.long_range, a.ammo_id,
           ai.name AS ammo_name, ai.description AS ammo_description, ai.sid AS ammo_sid, ai.user_id = userId AS ammo_is_author,
           a.attack_type_id, a.temporary_hp, a.attack_mod, a.attack_ability_modifier_id,
           a.save_type_id, saveType.name AS save_type_name, saveType.description AS save_type_description, saveType.sid AS save_type_sid,
           saveType.user_id = userId AS save_type_is_author, saveType.version AS save_type_version,
           a.save_proficiency_modifier, a.save_ability_modifier_id, a.half_on_save,
           a.description
    FROM monster_powers p
        JOIN monster_actions a on p.id = a.monster_power_id AND p.monster_id = monsterId
        JOIN monsters m ON m.id = p.monster_id
        LEFT JOIN monster_power_limited_uses l on p.id = l.monster_power_id
        LEFT JOIN items ai ON a.ammo_id = ai.id
        LEFT JOIN attributes saveType ON saveType.id = a.save_type_id
    WHERE p.user_id = userId OR p.user_id = m.user_id
    ORDER BY p.name;

    CALL MonsterPowers_Get_ModifierConfigurationsForMonster(monsterId, 1, userId);

    # damages
    SELECT d.monster_action_id, d.num_dice, d.dice_size, d.misc_mod,
           d.ability_modifier_id, abilityModifier.name AS ability_modifier_name, abilityModifier.description AS ability_modifier_description,
           abilityModifier.sid AS ability_modifier_sid, abilityModifier.user_id = userId AS ability_modifier_is_author,
           abilityModifier.version AS ability_modifier_version, abilityModifier2.abbr AS ability_modifier_abbr,
           d.damage_type_id, damageType.name AS damage_type_name, damageType.description AS damage_type_description,
           damageType.sid AS damage_type_sid, damageType.user_id = userId AS damage_type_is_author, damageType.version AS damage_type_version,
           d.healing, d.adjustment
    FROM monster_action_damages d
        JOIN monster_powers p ON p.id = d.monster_action_id AND p.monster_id = monsterId
        LEFT JOIN attributes damageType on damageType.id = d.damage_type_id
        LEFT JOIN attributes abilityModifier ON abilityModifier.id = d.ability_modifier_id
        LEFT JOIN abilities abilityModifier2 ON abilityModifier2.attribute_id = abilityModifier.id;
END;;

DELIMITER ;

# CALL MonsterPowers_GetList_Actions(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

