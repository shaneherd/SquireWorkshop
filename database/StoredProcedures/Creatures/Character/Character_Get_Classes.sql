DROP PROCEDURE IF EXISTS Character_Get_Classes;

DELIMITER ;;
CREATE PROCEDURE Character_Get_Classes(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE chosenClassId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT id FROM character_chosen_classes WHERE character_id = characterId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;
    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);

    SELECT id FROM character_chosen_classes WHERE character_id = characterId;

    OPEN curs;

    WHILE more_rows DO
        FETCH curs INTO chosenClassId;

        IF more_rows THEN
            CALL Character_Get_ChosenClass(chosenClassId, characterId, userId);
        END IF;
    END WHILE;

    CLOSE curs;
END;;

DELIMITER ;

# CALL Character_Get_Classes(1, 1);

