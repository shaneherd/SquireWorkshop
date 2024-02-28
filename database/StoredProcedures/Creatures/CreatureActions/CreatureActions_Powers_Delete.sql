DROP PROCEDURE IF EXISTS CreatureActions_Powers_Delete;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Powers_Delete(
    IN creatureId INT UNSIGNED,
    IN powerId INT UNSIGNED
)
BEGIN
    DECLARE quantity SMALLINT UNSIGNED;
    DECLARE creatureActionId INT UNSIGNED;

    SET quantity = (SELECT COUNT(*) FROM creature_powers WHERE creature_id = creatureId AND power_id = powerId);

    IF quantity = 0 THEN
        SET creatureActionId = (SELECT id FROM creature_actions ca JOIN creature_action_powers cap ON ca.id = cap.creature_action_id WHERE creature_id = creatureId AND power_id = powerId);

        IF creatureActionId IS NOT NULL THEN
            DELETE FROM chained_action_items
            WHERE creature_action_id = creatureActionId;

            DELETE FROM creature_action_powers
            WHERE creature_action_id = creatureActionId;

            DELETE FROM creature_actions
            WHERE id = creatureActionId;
        END IF;
    END IF;
END;;

DELIMITER ;

# CALL CreatureActions_Powers_Delete(1, 1, 1, 1);
