DROP PROCEDURE IF EXISTS Powers_Get_ModifierConfigurations;

DELIMITER ;;
CREATE PROCEDURE Powers_Get_ModifierConfigurations(
    IN powerId INT UNSIGNED,
    IN isCharacterAdvancement BIT,
    IN isExtra BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT modifier_category_id, modifier_sub_category_id, characteristic_dependant,
           attribute_id, a.name AS attribute_name, a.description AS attribute_description, a.attribute_type_id, a.sid as attribute_sid,
           a.user_id = userId AS attribute_is_author, a.version AS attribute_version,
           value, adjustment, proficient, half_proficient, round_up, advantage, disadvantage, extra,
           character_advancement, character_level_id, al.name AS character_level_name, al.sid AS character_level_sid,
           al.user_id = userId AS character_level_is_author, pm.use_level, pm.use_half_level, pm.ability_modifier_id,
           ab.name AS ability_modifier_name, ab.sid AS ability_modifier_sid, ab.user_id = userId AS ability_modifier_is_author
    FROM power_modifiers pm
        JOIN attributes a ON pm.attribute_id = a.id
        LEFT JOIN attributes al ON character_level_id = al.id
        LEFT JOIN attributes ab ON ability_modifier_id = ab.id
    WHERE power_id = powerId
        AND character_advancement = isCharacterAdvancement
        AND extra = isExtra;
END;;

DELIMITER ;

# CALL Powers_Get_ModifierConfigurations(1, 0, 0, 1);