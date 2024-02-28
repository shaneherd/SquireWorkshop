DROP PROCEDURE IF EXISTS MonsterPowers_Get;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Get(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterPowerTypeId TINYINT UNSIGNED;
    SET monsterPowerTypeId = (SELECT monster_power_type_id FROM monster_powers WHERE id = powerId);
    SELECT monsterPowerTypeId AS monster_power_type_id;

    IF monsterPowerTypeId = 1 THEN
        CALL MonsterPowers_Get_Action(powerId, userId);
    ELSEIF monsterPowerTypeId = 2 THEN
        CALL MonsterPowers_Get_Feature(powerId, userId);
    END IF;
END;;

DELIMITER ;

# CALL MonsterPowers_Get(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

