DROP PROCEDURE IF EXISTS Creatures_Delete_ChosenClass;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete_ChosenClass(
    IN creatureId INT UNSIGNED,
    IN classId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE chosenClassId INT UNSIGNED;
    DECLARE subclassId INT UNSIGNED;

    SELECT id, subclass_id
    INTO chosenClassId, subclassId
    FROM character_chosen_classes WHERE character_id = creatureId AND class_id = classId;

    CALL Creatures_Delete_Characteristic(creatureId, classId, userId);
    CALL Creatures_Delete_Characteristic(creatureId, subclassId, userId);

    DELETE h FROM character_health_gain_results h JOIN character_chosen_classes ccc ON ccc.id = h.chosen_class_id JOIN creatures c ON c.id = ccc.character_id WHERE ccc.id = chosenClassId AND c.user_id = userId;
    DELETE ccc FROM character_chosen_classes ccc JOIN creatures c ON c.id = ccc.character_id WHERE ccc.id = chosenClassId AND c.user_id = userId;
END;;

DELIMITER ;
