DROP PROCEDURE IF EXISTS Creature_ActiveConditions;

DELIMITER ;;
CREATE PROCEDURE Creature_ActiveConditions(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    # Active Conditions
    SELECT a.id, a.name, a.sid, a.user_id = userId AS is_author
    FROM creature_conditions cc
        JOIN attributes a ON cc.condition_id = a.id
    WHERE cc.creature_id = characterId;

    # Inherited Active Conditions
    WITH RECURSIVE inheritedConditions (id, name, sid, user_id) AS
    (
        SELECT id, name, sid, user_id
        FROM connecting_conditions cc
            JOIN attributes a ON cc.child_condition_id = a.id
        WHERE parent_condition_id IN (SELECT condition_id FROM creature_conditions WHERE creature_id = characterId)

        UNION ALL

        SELECT a.id, a.name, a.sid, a.user_id
        FROM inheritedConditions ic
            JOIN connecting_conditions cc ON ic.id = cc.parent_condition_id
            JOIN attributes a ON cc.child_condition_id = a.id
    )
    SELECT id, name, sid, user_id = userId AS is_author FROM inheritedConditions;
END;;

DELIMITER ;

# CALL Creature_ActiveConditions(4, 1);

