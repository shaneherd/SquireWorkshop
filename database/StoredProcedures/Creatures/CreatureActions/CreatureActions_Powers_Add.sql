DROP PROCEDURE IF EXISTS CreatureActions_Powers_Add;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Powers_Add(
    IN creatureId INT UNSIGNED,
    IN powerId INT UNSIGNED
)
BEGIN
    DECLARE creatureActionId INT UNSIGNED;
    DECLARE newCreatureActionId INT UNSIGNED;
    DECLARE quantity SMALLINT UNSIGNED;
    DECLARE powerTypeId TINYINT UNSIGNED;

    SET quantity = (SELECT COUNT(*) FROM creature_powers WHERE creature_id = creatureId AND power_id = powerId);
    SET creatureActionId = (SELECT ca.id FROM creature_action_powers cap JOIN creature_actions ca ON ca.id = cap.creature_action_id WHERE creature_id = creatureId AND power_id = powerId);

    IF quantity > 0 && creatureActionId IS NULL THEN
        SET powerTypeId = (SELECT power_type_id FROM powers WHERE id = powerId);

        INSERT INTO creature_actions (creature_id, creature_action_type_id, favorite, favorite_order) VALUE
        (creatureId, powerTypeId, 0, 0);

        SET newCreatureActionId = (SELECT LAST_INSERT_ID());

        INSERT INTO creature_action_powers (creature_action_id, power_id, default_characteristic_id) VALUE
        (newCreatureActionId, powerId, null);
    END IF;
END;;

DELIMITER ;

# CALL CreatureActions_Powers_Add(1, 1, 1, 1);
