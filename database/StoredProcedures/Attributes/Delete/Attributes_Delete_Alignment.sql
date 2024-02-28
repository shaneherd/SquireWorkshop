DROP PROCEDURE IF EXISTS Attributes_Delete_Alignment;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Alignment(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE alignmentId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO alignmentId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF alignmentId IS NOT NULL THEN
        DELETE miaa FROM magical_item_attunement_alignments miaa JOIN alignments a ON miaa.alignment_id = a.attribute_id AND a.attribute_id = attributeId JOIN items i ON i.id = miaa.magical_item_id WHERE i.user_id = userId;
        DELETE al FROM alignments al JOIN attributes a ON a.id = al.attribute_id WHERE attribute_id = alignmentId AND user_id = userId;
        UPDATE creatures SET alignment_id = NULL WHERE alignment_id = alignmentId AND user_id = userId;
        UPDATE deities d JOIN attributes a ON d.attribute_id = a.id SET d.alignment_id = NULL WHERE d.alignment_id = alignmentId AND a.user_id = userId; # should thrown an exception if a match is found
        CALL Attributes_Delete_Common(alignmentId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE al FROM alignments al JOIN attributes a ON a.id = al.attribute_id WHERE attribute_id = alignmentId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = alignmentId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = alignmentId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_Alignment(265, 1, 0);
