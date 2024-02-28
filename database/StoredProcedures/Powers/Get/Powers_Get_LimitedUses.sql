DROP PROCEDURE IF EXISTS Powers_Get_LimitedUses;

DELIMITER ;;
CREATE PROCEDURE Powers_Get_LimitedUses(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT p.limited_use_type_id, p.level_id, a.name AS level_name, a.sid AS level_sid,
           a.user_id = userId AS level_is_author, p.quantity, p.ability_modifier_id, p.dice_size_id
    FROM power_limited_uses p
        JOIN character_levels l ON p.level_id = l.attribute_id
        JOIN attributes a ON l.attribute_id = a.id
    WHERE p.power_id = powerId;

END;;

DELIMITER ;

CALL Powers_Get_LimitedUses(1, 1);