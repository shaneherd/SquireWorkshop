DROP PROCEDURE IF EXISTS MonsterPowers_Delete;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Delete(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterPowerTypeId TINYINT UNSIGNED;

    SET monsterPowerTypeId = (SELECT monster_power_type_id FROM monster_powers WHERE id = monsterPowerId);

    IF monsterPowerTypeId = 1 THEN
        CALL MonsterPowers_Delete_Action(monsterPowerId, userId);
    ELSEIF monsterPowerTypeId = 2 THEN
        CALL MonsterPowers_Delete_Feature(monsterPowerId, userId);
    END IF;
END;;

DELIMITER ;

# CALL MonsterPowers_Get_Feature(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

