DROP PROCEDURE IF EXISTS Creatures_Get_StoredFilters;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_StoredFilters(
    IN creatureId INT UNSIGNED
)
BEGIN
    # Item Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 1;

    # Spell Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 2;

    # Feature Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 3;

    # Skill Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 4;

    # Note Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 5;

    # Companion Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 6;

    # Condition Filters
    SELECT filter_key_id, filter_value
    FROM creature_stored_filters
    WHERE creature_id = creatureId AND filter_type_id = 7;
END;;

DELIMITER ;

# CALL Creatures_Get_StoredFilters(1);