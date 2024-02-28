DROP PROCEDURE IF EXISTS Encounters_Get;

DELIMITER ;;
CREATE PROCEDURE Encounters_Get(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE validatedId INT UNSIGNED;
    SET validatedId = (SELECT id FROM encounters WHERE user_id = userId AND id = encounterId);

    SELECT id, campaign_id, name, description, current_round, current_turn, exp_earned, custom_sort,
           started_at, last_played_at, finished_at, hide_killed
    FROM encounters
    WHERE user_id = userId AND id = validatedId;

    # Encounter Characters
    CALL EncountersCreatures_GetList_Characters (validatedId);

    # Encounter Monster Groups
    CALL EncountersCreatures_GetList_MonsterGroups (validatedId, userId);
END;;

DELIMITER ;

