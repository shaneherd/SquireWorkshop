DROP PROCEDURE IF EXISTS CreaturePowers_Add;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_Add(
    IN creatureId INT UNSIGNED,
    IN powerId INT UNSIGNED,
    IN powerTypeId TINYINT UNSIGNED,
    IN assignedCharacteristicId INT UNSIGNED,
    IN usesRemaining TINYINT UNSIGNED
)
BEGIN
    DECLARE originalCreaturePowerId INT UNSIGNED;
    DECLARE newCreaturePowerId INT UNSIGNED;

    SET originalCreaturePowerId = (SELECT id FROM creature_powers WHERE creature_id = creatureId AND power_id = powerId AND assigned_characteristic_id = assignedCharacteristicId);

    IF originalCreaturePowerId IS NULL THEN
        INSERT INTO creature_powers (creature_id, power_id, power_type_id, assigned_characteristic_id, uses_remaining) VALUES (creatureId, powerId, powerTypeId, assignedCharacteristicId, usesRemaining);

        IF powerTypeId = 1 THEN
            SET newCreaturePowerId = (SELECT LAST_INSERT_ID());
            INSERT INTO creature_spells (creature_power_id, concentrating, prepared) VALUES (newCreaturePowerId, 0, 0);
        END IF;

        CALL CreatureActions_Powers_Add(creatureId, powerId);
    END IF;
END;;

DELIMITER ;

# CALL CreaturePowers_Add(3, 1, 1, 4);

# select * from creature_powers where creature_id = 3 and assigned_characteristic_id = 4
# select * from creature_spells where creature_power_id in (select id from creature_powers where creature_id = 3 and assigned_characteristic_id = 4)
# select * from characteristics where id = 4
