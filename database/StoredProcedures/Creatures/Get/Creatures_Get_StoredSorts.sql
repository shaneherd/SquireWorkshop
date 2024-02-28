DROP PROCEDURE IF EXISTS Creatures_Get_StoredSorts;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_StoredSorts(
    IN creatureId INT UNSIGNED
)
BEGIN
    # Item Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 1;

    # Spell Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 2;

    # Feature Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 3;

    # Skill Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 4;

    # Note Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 5;

    # Companion Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 6;

    # Condition Sorts
    SELECT sort_key_id, ascending
    FROM creature_stored_sorts
    WHERE creature_id = creatureId AND sort_type_id = 7;
END;;

DELIMITER ;

# CALL Creatures_Get_StoredSorts(1);