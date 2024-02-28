DROP PROCEDURE IF EXISTS Characteristics_Delete_Race;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Delete_Race(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE raceId INT UNSIGNED;
    DECLARE isOwner BIT;

    SELECT id, user_id = userId
    INTO raceId, isOwner
    FROM characteristics
    WHERE user_id IN (0, userId) AND id = characteristicId;

    IF raceId IS NOT NULL THEN
        UPDATE characters ch JOIN creatures c ON c.id = ch.creature_id SET race_id = NULL WHERE race_id = raceId AND c.user_id = userId; # this should throw an exception if a match is found
        DELETE miar FROM magical_item_attunement_races miar JOIN items i ON i.id = miar.magical_item_id WHERE race_id = raceId AND i.user_id = userId;

        CALL Characteristics_Delete_Common(raceId, userId);

        IF isOwner THEN
            DELETE FROM characteristics_public WHERE characteristic_id = characteristicId;
            DELETE FROM characteristics_private WHERE characteristic_id = characteristicId;
            UPDATE characteristics SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = characteristicId;

            DELETE rs FROM race_speeds rs JOIN characteristics c ON c.id = rs.race_id WHERE race_id = raceId AND c.user_id = userId;
            DELETE r FROM races r JOIN characteristics c ON c.id = r.characteristic_id WHERE characteristic_id = raceId AND c.user_id = userId;
            DELETE FROM characteristics WHERE user_id = userId AND id = raceId;
        ELSE
            DELETE FROM characteristics_shared WHERE user_id = userId AND characteristic_id = raceId;
        END IF;
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Delete(72, 1);
