DROP PROCEDURE IF EXISTS MonsterPowers_Create_Feature;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Create_Feature(
    IN powerName VARCHAR(50),
    IN monsterId INT UNSIGNED,
    IN rechargeMin SMALLINT UNSIGNED,
    IN rechargeMax SMALLINT UNSIGNED,
    IN featureDescription VARCHAR(255),
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE powerId INT UNSIGNED;

    INSERT INTO monster_powers (name, monster_power_type_id, monster_id, recharge_min, recharge_max, user_id)
    VALUES (powerName, 2, monsterId, rechargeMin, rechargeMax, userId);

    SET powerId = (SELECT LAST_INSERT_ID());

    INSERT INTO monster_features (monster_power_id, description)
    VALUES (powerId, featureDescription);

    SELECT powerId AS monster_power_id;
END;;

DELIMITER ;

# CALL MonsterPowers_Create_Feature(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

