DROP PROCEDURE IF EXISTS MonsterPowers_Get_ModifierConfigurationsForMonster;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Get_ModifierConfigurationsForMonster(
    IN monsterId INT UNSIGNED,
    IN monsterPowerTypeId TINYINT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT pm.monster_power_id, modifier_category_id, modifier_sub_category_id,
           attribute_id, a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
           a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
           value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage,
           pm.ability_modifier_id, ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
    FROM monster_power_modifiers pm
        JOIN monster_powers p ON p.id = pm.monster_power_id AND p.monster_id = monsterId AND p.monster_power_type_id = monsterPowerTypeId
        JOIN attributes a ON pm.attribute_id = a.id
        LEFT JOIN attributes ab ON pm.ability_modifier_id = ab.id;
END;;

DELIMITER ;

# CALL MonsterPowers_Get_ModifierConfigurationsForMonster(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

