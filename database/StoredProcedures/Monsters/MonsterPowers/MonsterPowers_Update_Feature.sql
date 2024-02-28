DROP PROCEDURE IF EXISTS MonsterPowers_Update_Feature;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_Update_Feature(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN powerName VARCHAR(50),
    IN rechargeMin SMALLINT UNSIGNED,
    IN rechargeMax SMALLINT UNSIGNED,
    IN featureDescription VARCHAR(255)
)
BEGIN
    DECLARE valid BIT;

    SET valid = (SELECT user_id FROM monster_powers WHERE id = powerId) = userId;

    IF valid THEN
        UPDATE monster_powers
        SET name = powerName, recharge_min = rechargeMin, recharge_max = rechargeMax, version = version + 1
        WHERE user_id = userId AND id = powerId;

        UPDATE monster_features
        SET description = featureDescription
        WHERE monster_power_id = powerId;
    END IF;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL MonsterPowers_Update_Feature(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

