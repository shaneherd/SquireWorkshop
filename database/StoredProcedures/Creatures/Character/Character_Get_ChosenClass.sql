DROP PROCEDURE IF EXISTS Character_Get_ChosenClass;

DELIMITER ;;
CREATE PROCEDURE Character_Get_ChosenClass(
    IN chosenClassId INT UNSIGNED,
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE classId INT UNSIGNED;
    DECLARE subclassId INT UNSIGNED;

    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);

    SELECT class_id, subclass_id
    INTO classId, subclassId
    FROM character_chosen_classes
    WHERE id = chosenClassId AND character_id = characterId;

    SELECT ccc.id, `primary`, num_hit_dice_mod, spellcasting_ability_id, display_spellcasting,
           level_id, levels.name AS level_name, levels.description AS level_description, levels.sid AS level_sid,
           levels.user_id = userId AS level_is_author, levels.version AS level_version, levels2.min_exp, levels2.prof_bonus
    FROM character_chosen_classes ccc
        JOIN attributes levels ON levels.id = ccc.level_id
        JOIN character_levels levels2 ON levels2.attribute_id = levels.id
    WHERE ccc.id = chosenClassId;

    CALL Characteristics_Get_Class(classId, userId);
    CALL Characteristics_Get_Class(subclassId, userId);

    # Characteristic Spellcasting
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM character_characteristic_spellcasting
    WHERE character_id = characterId AND characteristic_id = classId AND attack_type_id IN (1,2)
    ORDER BY attack_type_id;

    # Health Gain Results
    SELECT chgr.level_id, a.name, a.sid, chgr.value, a.user_id = userId AS is_author
    FROM character_health_gain_results chgr
        JOIN attributes a ON chgr.level_id = a.id
    WHERE chgr.chosen_class_id = chosenClassId;

END;;

DELIMITER ;

# CALL Character_Get_ChosenClass(1, 1);

