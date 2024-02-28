DROP PROCEDURE IF EXISTS CreatureDefaults_CreatureWealth;

DELIMITER ;;
CREATE PROCEDURE CreatureDefaults_CreatureWealth(
    IN creatureId INT UNSIGNED
)
BEGIN
    INSERT INTO creature_wealth VALUES
    (creatureId, 1, 0, 1, 0),
    (creatureId, 2, 0, 1, 1),
    (creatureId, 3, 0, 1, 2),
    (creatureId, 4, 0, 1, 3),
    (creatureId, 5, 0, 1, 4);
END;;

DELIMITER ;

# CALL CreatureDefaults_CreatureWealth(2);
