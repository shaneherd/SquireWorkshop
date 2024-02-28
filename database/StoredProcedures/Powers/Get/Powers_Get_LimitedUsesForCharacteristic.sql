DROP PROCEDURE IF EXISTS Powers_Get_LimitedUsesForCharacteristic;

DELIMITER ;;
CREATE PROCEDURE Powers_Get_LimitedUsesForCharacteristic(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT p.power_id, p.limited_use_type_id, p.level_id, a.name AS level_name, a.sid AS level_sid, a.user_id = userId AS level_is_author, p.quantity, p.ability_modifier_id, p.dice_size_id
    FROM power_limited_uses p
        JOIN features f ON f.power_id = p.power_id
        JOIN character_levels l ON p.level_id = l.attribute_id
        JOIN attributes a ON l.attribute_id = a.id
    WHERE f.characteristic_id = characteristicId;

END;;

DELIMITER ;

CALL Powers_Get_LimitedUsesForCharacteristic(2, 1);