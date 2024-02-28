DROP PROCEDURE IF EXISTS MonsterPowers_GetList_Features;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_GetList_Features(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT p.id AS monster_power_id, p.name, p.sid, p.user_id = userId AS is_author, p.version,
           l.limited_use_type_id, l.quantity, l.ability_modifier_id, l.dice_size_id,
           p.recharge_min, p.recharge_max, f.description
    FROM monster_powers p
        JOIN monster_features f on p.id = f.monster_power_id AND p.monster_id = monsterId
        JOIN monsters m ON m.id = p.monster_id
        LEFT JOIN monster_power_limited_uses l on p.id = l.monster_power_id
    WHERE p.user_id = userId OR p.user_id = m.user_id
    ORDER BY p.name;

    CALL MonsterPowers_Get_ModifierConfigurationsForMonster(monsterId, 2, userId);
END;;

DELIMITER ;

# CALL MonsterPowers_GetList_Features(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

