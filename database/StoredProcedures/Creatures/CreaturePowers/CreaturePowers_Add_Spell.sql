DROP PROCEDURE IF EXISTS CreaturePowers_Add_Spell;

DELIMITER ;;
CREATE PROCEDURE CreaturePowers_Add_Spell(
    IN creatureId INT UNSIGNED,
    IN powerId INT UNSIGNED,
    IN powerTypeId TINYINT UNSIGNED,
    IN assignedCharacteristicId INT UNSIGNED,
    IN powerInnate BIT,
    IN usesRemaining TINYINT UNSIGNED,
    IN maxUses TINYINT UNSIGNED,
    IN slot TINYINT UNSIGNED
)
BEGIN
    DECLARE originalCreaturePowerId INT UNSIGNED;
    DECLARE newCreaturePowerId INT UNSIGNED;

    SET originalCreaturePowerId = (SELECT id FROM creature_powers WHERE creature_id = creatureId AND power_id = powerId AND assigned_characteristic_id = assignedCharacteristicId);

    IF originalCreaturePowerId IS NULL THEN
        INSERT INTO creature_powers (creature_id, power_id, power_type_id, assigned_characteristic_id, uses_remaining)
        VALUES (creatureId, powerId, powerTypeId, assignedCharacteristicId, usesRemaining);

        SET newCreaturePowerId = (SELECT LAST_INSERT_ID());

        INSERT INTO creature_spells (creature_power_id, concentrating, prepared, innate, innate_max_uses, innate_slot)
        VALUES (newCreaturePowerId, 0, 0, powerInnate, maxUses, slot);

        CALL CreatureActions_Powers_Add(creatureId, powerId);
    END IF;
END;;

DELIMITER ;

