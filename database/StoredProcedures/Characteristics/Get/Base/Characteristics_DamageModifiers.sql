DROP PROCEDURE IF EXISTS Characteristics_DamageModifiers;

DELIMITER ;;
CREATE PROCEDURE Characteristics_DamageModifiers(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT damage_type_id,
           damageType.name AS damage_type_name,
           damageType.description AS damage_type_description,
           damageType.sid AS damage_type_sid,
           damageType.user_id = userId AS damage_type_is_author,
           damageType.version AS damage_type_version,
           damage_modifier_type_id
    FROM characteristic_damage_modifiers dm
        JOIN attributes damageType ON damageType.id = dm.damage_type_id
    WHERE characteristic_id = characteristicId;
END;;

DELIMITER ;

CALL Characteristics_DamageModifiers(2, 1);

