DROP PROCEDURE IF EXISTS CreatureActions_ChainedAction_Delete;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_ChainedAction_Delete(
    IN creatureActionId INT UNSIGNED
)
BEGIN
    DECLARE confirmedId INT UNSIGNED;
    SET confirmedId = (SELECT id FROM creature_actions WHERE id = creatureActionId AND creature_action_type_id = 4);
    IF confirmedId IS NOT NULL THEN
        # delete from actions that reference this action as a chained action
        DELETE FROM chained_action_items
        WHERE creature_action_id = creatureActionId;

        # delete the chained action
        DELETE FROM chained_action_items
        WHERE chained_action_id = creatureActionId;

        DELETE FROM chained_actions
        WHERE creature_action_id = creatureActionId;

        DELETE FROM creature_actions
        WHERE id = creatureActionId;
    END IF;
END;;

DELIMITER ;

# CALL CreatureActions_ChainedAction_Delete(14);
# select * from creature_actions
#
# SELECT id FROM creature_actions WHERE id = 14 AND creature_action_type_id = 4