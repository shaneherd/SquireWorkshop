DROP PROCEDURE IF EXISTS Powers_GetList_FeaturesForCharacteristic;

DELIMITER ;;
CREATE PROCEDURE Powers_GetList_FeaturesForCharacteristic(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT p.id AS power_id, p.name, p.sid, p.user_id = userId AS is_author, p.version,
           p.attack_type, p.temporary_hp, p.attack_mod,
           p.save_type_id, saveType.name AS save_type_name, saveType.description AS save_type_description, saveType.sid AS save_type_sid, saveType.user_id = userId AS save_type_is_author, saveType.version AS save_type_version, saveType2.abbr AS save_type_abbr,
           p.half_on_save, p.extra_damage, p.num_levels_above_base,
           p.advancement, p.extra_modifiers, p.modifiers_num_levels_above_base, p.modifier_advancement,
           f.characteristic_id, c.name as characteristic_name, c.sid as characteristic_sid, c.user_id = userId AS characteristic_is_author, f.characteristic_type_id,
           f.character_level_id, cl.name AS character_level_name, cl.sid AS character_level_sid, cl.user_id = userId AS character_level_is_author,
           p.range_type, p.range, p.range_unit,
           p.area_of_effect_id, p.radius, p.width, p.height, p.length, a.name as area_of_effect_name, a.description as area_of_effect_description, a.sid AS area_of_effect_sid,
           a.user_id = userId AS area_of_effect_is_author, a.version AS area_of_effect_version,
           aoe.radius AS area_of_effect_radius, aoe.width AS area_of_effect_width, aoe.height AS area_of_effect_height, aoe.length AS area_of_effect_length,
           p.recharge_min, p.recharge_max, p.recharge_on_short_rest, p.recharge_on_long_rest, f.prerequisite, f.description, f.passive, f.save_proficiency_modifier, f.save_ability_modifier_id, action_id
    FROM powers p
        JOIN features f on p.id = f.power_id AND f.characteristic_id = characteristicId
        JOIN characteristics c ON f.characteristic_id = c.id
        LEFT JOIN area_of_effects aoe ON p.area_of_effect_id = aoe.attribute_id
        LEFT JOIN attributes a ON aoe.attribute_id = a.id
        LEFT JOIN attributes cl ON f.character_level_id = cl.id
        LEFT JOIN attributes saveType ON saveType.id = p.save_type_id
        LEFT JOIN abilities saveType2 ON saveType2.attribute_id = saveType.id
    WHERE p.user_id = userId OR p.user_id = c.user_id;

    # todo - if !null

    CALL Powers_Get_DamageConfigurationsForCharacteristic(characteristicId, 0, 0, userId);
    CALL Powers_Get_DamageConfigurationsForCharacteristic(characteristicId, 0, 1, userId);
    CALL Powers_Get_DamageConfigurationsForCharacteristic(characteristicId, 1, 0, userId);

    CALL Powers_Get_ModifierConfigurationsForCharacteristic(characteristicId, 0, 0, userId);
    CALL Powers_Get_ModifierConfigurationsForCharacteristic(characteristicId, 0, 1, userId);
    CALL Powers_Get_ModifierConfigurationsForCharacteristic(characteristicId, 1, 0, userId);

    CALL Powers_Get_LimitedUsesForCharacteristic(characteristicId, userId);
END;;

DELIMITER ;

# CALL Powers_GetList_FeaturesForCharacteristic(2, 1);

