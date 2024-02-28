DROP PROCEDURE IF EXISTS Characteristics_Delete_Class;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Delete_Class(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE classId INT UNSIGNED;
    DECLARE isOwner BIT;

    SELECT id, user_id = userId
    INTO classId, isOwner
    FROM characteristics
    WHERE user_id IN (0, userId) AND id = characteristicId;

    IF classId IS NOT NULL THEN
        UPDATE character_chosen_classes ccc JOIN creatures c ON c.id = ccc.character_id SET class_id = NULL WHERE class_id = classId AND c.user_id = userId; # this should throw an exception if a match is found

        # not doing this so that the delete will throw an exception if the subclass is currently in use
#     UPDATE character_chosen_classes ccc JOIN creatures c ON c.id = ccc.character_id SET subclass_id = NULL WHERE subclass_id = classId AND c.user_id = userId;
        DELETE asi FROM class_ability_score_increases asi JOIN characteristics c ON c.id = asi.class_id WHERE class_id = classId AND c.user_id = userId;
        DELETE p FROM class_secondary_attribute_profs p JOIN characteristics c ON c.id = p.class_id WHERE class_id = classId AND c.user_id = userId;
        DELETE p FROM class_secondary_choice_profs p JOIN characteristics c ON c.id = p.class_id WHERE class_id = classId AND c.user_id = userId;
        DELETE p FROM class_secondary_item_profs p JOIN characteristics c ON c.id = p.class_id WHERE class_id = classId AND c.user_id = userId;
        DELETE miac FROM magical_item_attunement_classes miac JOIN items i ON i.id = miac.magical_item_id WHERE class_id = classId AND i.user_id = userId;

        CALL Characteristics_Delete_Common(classId, userId);

        IF isOwner THEN
            DELETE FROM characteristics_public WHERE characteristic_id = characteristicId;
            DELETE FROM characteristics_private WHERE characteristic_id = characteristicId;
            UPDATE characteristics SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = characteristicId;

            DELETE cl FROM classes cl JOIN characteristics c ON c.id = cl.characteristic_id WHERE characteristic_id = classId AND c.user_id = userId;
            DELETE FROM characteristics WHERE user_id = userId AND id = classId;
        ELSE
            DELETE FROM characteristics_shared WHERE user_id = userId AND characteristic_id = classId;
        END IF;
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Delete_Class(265, 1, 0);
