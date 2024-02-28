DROP PROCEDURE IF EXISTS Attributes_Delete_CharacterLevel;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_CharacterLevel(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterLevelId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO characterLevelId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF characterLevelId IS NOT NULL THEN
        DELETE ss FROM caster_type_spell_slots ss JOIN attributes a ON a.id = ss.caster_type_id WHERE character_level_id = characterLevelId AND a.user_id = userId;
        UPDATE character_chosen_classes ccc JOIN creatures c ON c.id = ccc.character_id SET level_id = NULL WHERE level_id = characterLevelId AND c.user_id = userId; # this should throw an exception if a match is found
        UPDATE character_health_gain_results h JOIN character_chosen_classes ccc ON ccc.id = h.chosen_class_id JOIN creatures c ON c.id = ccc.character_id SET level_id = NULL WHERE level_id = characterLevelId AND c.user_id = userId; # this should throw an exception if a match is found
        DELETE cv FROM character_validation cv JOIN creatures c ON c.id = cv.character_id WHERE cv.level_id = characterLevelId AND c.user_id = userId;
        UPDATE characteristic_spell_configurations csc JOIN characteristics c ON c.id = csc.characteristic_id SET level_gained = NULL WHERE level_gained = characterLevelId AND (c.user_id = userId OR csc.user_id = userId);
        UPDATE class_ability_score_increases asi JOIN characteristics c ON c.id = asi.class_id SET level_id = NULL WHERE level_id = characterLevelId AND c.user_id = userId;
        UPDATE creature_spell_configurations csc JOIN creatures c ON c.id = csc.creature_id SET level_gained = NULL WHERE level_gained = characterLevelId AND (c.user_id = userId || csc.user_id = userId);
        UPDATE features f JOIN powers p ON p.id = f.power_id SET character_level_id = NULL WHERE character_level_id = characterLevelId AND p.user_id = userId;
        UPDATE monsters SET spellcaster_level_id = NULL WHERE spellcaster_level_id = characterLevelId AND user_id = userId;
        UPDATE monsters SET innate_spellcaster_level_id = NULL WHERE innate_spellcaster_level_id = characterLevelId AND user_id = userId;
        DELETE pd FROM power_damages pd JOIN powers p ON p.id = pd.power_id WHERE pd.character_level_id = characterLevelId AND p.user_id = userId;
        DELETE pl FROM power_limited_uses pl JOIN powers p ON p.id = pl.power_id WHERE pl.level_id = characterLevelId AND p.user_id = userId;
        DELETE pm FROM power_modifiers pm JOIN powers p ON p.id = pm.power_id WHERE pm.character_level_id = characterLevelId AND p.user_id = userId;
        CALL Attributes_Delete_Common(characterLevelId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE l FROM character_levels l JOIN attributes a ON a.id = l.attribute_id WHERE attribute_id = characterLevelId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = characterLevelId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = characterLevelId;
        END IF;
    END IF;

    COMMIT;

    SELECT -1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_CharacterLevel(265, 1, 0);
