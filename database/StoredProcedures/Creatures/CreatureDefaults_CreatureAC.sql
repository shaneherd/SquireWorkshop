DROP PROCEDURE IF EXISTS CreatureDefaults_CreatureAC;

DELIMITER ;;
CREATE PROCEDURE CreatureDefaults_CreatureAC(
    IN creatureId INT UNSIGNED
)
BEGIN
    DECLARE dexId INT UNSIGNED;
    SET dexId = (SELECT id FROM attributes WHERE sid = 2);

    INSERT INTO creature_ac_abilities (creature_id, ability_id) VALUES
    (creatureId, dexId);
END;;

DELIMITER ;

# CALL CreatureDefaults_CreatureWealth(2);
