DROP PROCEDURE IF EXISTS Characteristics_Delete_Background;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Delete_Background(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE backgroundId INT UNSIGNED;
    DECLARE isOwner BIT;

    SELECT id, user_id = userId
    INTO backgroundId, isOwner
    FROM characteristics
    WHERE user_id IN (0, userId) AND id = characteristicId;

    IF backgroundId IS NOT NULL THEN
        DELETE cbt FROM character_background_traits cbt JOIN background_traits bt ON bt.id = cbt.background_trait_id JOIN creatures c ON c.id = cbt.character_id WHERE background_id = backgroundId AND c.user_id = userId;
        UPDATE characters ch JOIN creatures c ON c.id = ch.creature_id SET background_id = NULL WHERE background_id = backgroundId AND c.user_id = userId;
        CALL Characteristics_Delete_Common(backgroundId, userId);

        IF isOwner THEN
            DELETE FROM characteristics_public WHERE characteristic_id = characteristicId;
            DELETE FROM characteristics_private WHERE characteristic_id = characteristicId;
            UPDATE characteristics SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = characteristicId;

            DELETE bt FROM background_traits bt JOIN characteristics c ON c.id = bt.background_id WHERE background_id = backgroundId AND c.user_id = userId;
            DELETE b FROM backgrounds b JOIN characteristics c ON c.id = b.characteristic_id WHERE characteristic_id = backgroundId AND c.user_id = userId;
            DELETE FROM characteristics WHERE user_id = userId AND id = backgroundId;
        ELSE
            DELETE FROM characteristics_shared WHERE user_id = userId AND characteristic_id = backgroundId;
        END IF;
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Delete_Background(265, 1, 0);
