DROP PROCEDURE IF EXISTS Powers_Get_DamageConfigurations;

DELIMITER ;;
CREATE PROCEDURE Powers_Get_DamageConfigurations(
    IN powerId INT UNSIGNED,
    IN isCharacterAdvancement BIT,
    IN isExtra BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT pd.character_advancement, pd.extra, pd.character_level_id, a.name AS character_level_name, a.sid AS character_level_sid, a.user_id = userId AS character_level_is_author,
           pd.num_dice, pd.dice_size, pd.misc_mod,
           pd.ability_modifier_id, abilityModifier.name AS ability_modifier_name, abilityModifier.description AS ability_modifier_description,
           abilityModifier.sid AS ability_modifier_sid, abilityModifier.user_id = userId AS ability_modifier_is_author,
           abilityModifier.version AS ability_modifier_version, abilityModifier2.abbr AS ability_modifier_abbr,
           pd.damage_type_id, damageType.name AS damage_type_name, damageType.description AS damage_type_description,
           damageType.sid AS damage_type_sid, damageType.user_id = userId AS damage_type_is_author, damageType.version AS damage_type_version,
           pd.healing, pd.spellcasting_ability_modifier, pd.adjustment
    FROM power_damages pd
        LEFT JOIN attributes a ON pd.character_level_id = a .id
        LEFT JOIN attributes damageType on damageType.id = pd.damage_type_id
        LEFT JOIN attributes abilityModifier ON abilityModifier.id = pd.ability_modifier_id
        LEFT JOIN abilities abilityModifier2 ON abilityModifier2.attribute_id = abilityModifier.id
    WHERE pd.power_id = powerId
      AND character_advancement = isCharacterAdvancement
      AND extra = isExtra;
END;;

DELIMITER ;

CALL Powers_Get_DamageConfigurations(1, 0, 0, 1);