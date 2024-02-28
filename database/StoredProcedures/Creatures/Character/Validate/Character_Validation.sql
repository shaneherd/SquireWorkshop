DROP PROCEDURE IF EXISTS Character_Validation;

DELIMITER ;;
CREATE PROCEDURE Character_Validation(
    IN userId MEDIUMINT UNSIGNED,
    IN characterId INT UNSIGNED
)
BEGIN
    DECLARE classId INT UNSIGNED;
    DECLARE subclassId INT UNSIGNED;
    DECLARE levelId INT UNSIGNED;
    DECLARE parentRaceId INT UNSIGNED;
    DECLARE totalExp MEDIUMINT UNSIGNED;
    DECLARE minExp MEDIUMINT UNSIGNED;
    DECLARE raceId INT UNSIGNED;
    DECLARE backgroundId INT UNSIGNED;
    DECLARE parentBackgroundId INT UNSIGNED;
    DECLARE level1 INT UNSIGNED;
    DECLARE loopCount TINYINT UNSIGNED;

    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT class_id, subclass_id, level_id
                            FROM character_chosen_classes
                            WHERE character_id = characterId
                            ORDER BY class_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    CREATE TEMPORARY TABLE IF NOT EXISTS characteristic_levels_to_validate
    (
        characteristic_id        INT UNSIGNED NOT NULL,
        sub_characteristic_id    INT UNSIGNED NULL,
        characteristic_id_to_use INT UNSIGNED NOT NULL,
        level_id                 INT UNSIGNED NOT NULL,
        visible                  BIT NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS user_power_list
    (
        id INT UNSIGNED NOT NULL
    );

    SET totalExp = (SELECT exp FROM characters WHERE creature_id = characterId);
    SET raceId = (SELECT race_id FROM characters WHERE creature_id = characterId);
    SET backgroundId = (SELECT background_id FROM characters WHERE creature_id = characterId);
    SET level1 = (SELECT id
                   FROM attributes_shared ua
                       JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
                       JOIN character_levels cl ON cl.attribute_id = a.id
                   WHERE cl.min_exp = 0);

    INSERT INTO characteristic_levels_to_validate (characteristic_id, sub_characteristic_id, characteristic_id_to_use, level_id, visible)
    SELECT raceId, NULL, raceId, cl.attribute_id, 1
    FROM attributes_shared ua
        JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
        JOIN character_levels cl ON cl.attribute_id = a.id
    WHERE min_exp <= totalExp
    ORDER BY min_exp;

    SET loopCount = 0;
    SET parentRaceId = (SELECT parent_characteristic_id FROM characteristics WHERE id = raceId);
    WHILE parentRaceId IS NOT NULL AND loopCount < 10 DO
        INSERT INTO characteristic_levels_to_validate (characteristic_id, sub_characteristic_id, characteristic_id_to_use, level_id, visible)
        SELECT parentRaceId, NULL, raceId, cl.attribute_id, 0
        FROM attributes_shared ua
            JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
            JOIN character_levels cl ON cl.attribute_id = a.id
        WHERE min_exp <= totalExp
        ORDER BY min_exp;

        SET loopCount = loopCount + 1;
        SET parentRaceId = (SELECT parent_characteristic_id FROM characteristics WHERE id = parentRaceId);
    END WHILE;

    IF backgroundId IS NOT NULL THEN
        INSERT INTO characteristic_levels_to_validate (characteristic_id, sub_characteristic_id, characteristic_id_to_use, level_id, visible)
        SELECT backgroundId, NULL, backgroundId, cl.attribute_id, 1
        FROM attributes_shared ua
            JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
            JOIN character_levels cl ON cl.attribute_id = a.id
        WHERE min_exp <= totalExp
        ORDER BY min_exp;

        SET loopCount = 0;
        SET parentBackgroundId = (SELECT parent_characteristic_id FROM characteristics WHERE id = backgroundId);
        WHILE parentBackgroundId IS NOT NULL AND loopCount < 10 DO
            INSERT INTO characteristic_levels_to_validate (characteristic_id, sub_characteristic_id, characteristic_id_to_use, level_id, visible)
            SELECT parentBackgroundId, NULL, backgroundId, cl.attribute_id, 0
            FROM attributes_shared ua
                JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
                JOIN character_levels cl ON cl.attribute_id = a.id
            WHERE min_exp <= totalExp
            ORDER BY min_exp;

            SET loopCount = loopCount + 1;
            SET parentBackgroundId = (SELECT parent_characteristic_id FROM characteristics WHERE id = parentBackgroundId);
        END WHILE;
    END IF;

    OPEN curs;

    WHILE more_rows DO
        FETCH curs INTO classId, subclassId, levelId;

        IF more_rows THEN
            SET minExp = (SELECT min_exp
                           FROM attributes_shared ua
                               JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
                               JOIN character_levels cl ON cl.attribute_id = a.id
                           WHERE a.id = levelId);

            INSERT INTO characteristic_levels_to_validate (characteristic_id, sub_characteristic_id, characteristic_id_to_use, level_id, visible)
            SELECT classId, subclassId, classId, cl.attribute_id, 1
            FROM attributes_shared ua
                JOIN attributes a ON a.id = ua.attribute_id AND ua.user_id = userId
                JOIN character_levels cl ON cl.attribute_id = a.id
            WHERE min_exp <= minExp
            ORDER BY min_exp;
        END IF;
    END WHILE;

    CLOSE curs;

    SELECT clv.characteristic_id,
           CASE
                WHEN c.characteristic_type_id = 1 THEN 3 -- class
                WHEN c.characteristic_type_id = 2 THEN 1 -- race
                ELSE 2 -- background
           END AS sort,
           c.name                                        AS characteristic_name,
           c.sid                                         AS characteristic_sid,
           c.user_id = userId                            AS characteristic_is_author,
           clv.sub_characteristic_id,
           c2.name                                       AS sub_characteristic_name,
           c2.sid                                        AS sub_characteristic_sid,
           c2.user_id = userId                           AS sub_characteristic_is_author,
           clv.level_id,
           l.name                                        AS level_name,
           l.sid                                         AS level_sid,
           l.user_id = userId                            AS level_is_author,
           IF(asi.class_id IS NOT NULL, 1, 0)            AS ability_score_increase_applicable,
           IFNULL(cv.ability_score_increases_applied, 0) AS ability_score_increases_applied,
           IFNULL(cv.feat_selected, 0)                   AS feat_selected
    FROM characteristic_levels_to_validate AS clv
        LEFT JOIN character_validation cv ON clv.characteristic_id = cv.characteristic_id
                                                 AND clv.level_id = cv.level_id
                                                 AND cv.character_id = characterId
        JOIN characteristics c ON clv.characteristic_id = c.id
        LEFT JOIN characteristics c2 ON clv.sub_characteristic_id = c2.id
        LEFT JOIN attributes l ON l.id = clv.level_id
        LEFT JOIN class_ability_score_increases asi ON asi.class_id = c.id AND asi.level_id = l.id
    WHERE clv.visible = 1
    ORDER BY sort, c.id, l.id;

    INSERT INTO user_power_list
    SELECT id FROM powers WHERE user_id = userId
    UNION
    SELECT power_id FROM powers_shared WHERE user_id = userId;

    SELECT p.id AS power_id,
           clv.characteristic_id_to_use AS characteristic_id,
           IFNULL(f.character_level_id, level1) AS character_level_id
    FROM user_power_list up
        JOIN powers p ON p.id = up.id
        JOIN features f on p.id = f.power_id
        JOIN characteristic_levels_to_validate clv ON (clv.characteristic_id = f.characteristic_id OR clv.sub_characteristic_id = f.characteristic_id)
            AND ((clv.level_id = level1 AND f.character_level_id IS NULL) OR clv.level_id = f.character_level_id)
        LEFT JOIN characteristics c ON c.id = f.characteristic_id
    WHERE p.id NOT IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId)
      AND p.id NOT IN (SELECT power_id FROM character_validation_ignored_powers WHERE character_id = characterId)
    ORDER BY p.id;

    SELECT csc.spell_id, clv.characteristic_id_to_use AS characteristic_id, csc.level_gained AS character_level_id
    FROM characteristic_spell_configurations csc
        JOIN user_power_list up ON up.id = csc.spell_id
        JOIN characteristic_levels_to_validate clv ON (clv.characteristic_id = csc.characteristic_id OR clv.sub_characteristic_id = csc.characteristic_id)
            AND (clv.level_id = csc.level_gained)
        JOIN characteristics c ON c.id = csc.characteristic_id
    WHERE csc.spell_id NOT IN (SELECT power_id FROM creature_powers WHERE creature_id = characterId)
        AND csc.spell_id NOT IN (SELECT power_id FROM character_validation_ignored_powers WHERE character_id = characterId)
        AND (csc.user_id = userId OR csc.user_id = c.user_id)
    ORDER BY csc.spell_id;

  DROP TEMPORARY TABLE IF EXISTS characteristic_levels_to_validate;
  DROP TEMPORARY TABLE IF EXISTS user_power_list;

END;;

DELIMITER ;

# CALL ValidateCharacter(1, 3);