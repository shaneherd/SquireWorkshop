DROP PROCEDURE IF EXISTS CreatureActions_ChainedAction_Add;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_ChainedAction_Add(
    IN creatureId INT UNSIGNED,
    IN chainedActionName VARCHAR(50)
)
BEGIN
    DECLARE maxOrder SMALLINT UNSIGNED;
    DECLARE newCreatureActionId INT UNSIGNED;

    SET maxOrder = (SELECT MAX(favorite_order) FROM creature_actions WHERE creature_id = creatureId AND favorite = 1);

    INSERT INTO creature_actions (creature_id, creature_action_type_id, favorite, favorite_order) VALUE
    (creatureId, 4, 1, maxOrder + 1);

    SET newCreatureActionId = (SELECT LAST_INSERT_ID());

    INSERT INTO chained_actions (creature_action_id, name) VALUE
    (newCreatureActionId, chainedActionName);

    SELECT newCreatureActionId; # return the new id
END;;

DELIMITER ;

# CALL CreatureActions_ChainedAction_Add(1, 'name');
