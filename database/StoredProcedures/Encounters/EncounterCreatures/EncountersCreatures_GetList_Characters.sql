DROP PROCEDURE IF EXISTS EncountersCreatures_GetList_Characters;

DELIMITER ;;
CREATE PROCEDURE EncountersCreatures_GetList_Characters(
    IN encounterId INT UNSIGNED
)
BEGIN
    SELECT ecr.id AS encounter_creature_id, ecr.initiative, ecr.round_added, ecr.`order`, ecr.surprised, ec.exp_earned,
           cc.creature_id, cc.id AS campaign_character_id, cc.campaign_character_type_id, c.name AS creature_name,
           ch.exp, p.misc_modifier AS proficiency_misc, ecr.removed
    FROM encounter_characters ec
             JOIN encounter_creatures ecr ON ecr.id = ec.encounter_creature_id
             JOIN campaign_characters cc ON ec.campaign_character_id = cc.id
             LEFT JOIN creatures c ON c.id = cc.creature_id
             LEFT JOIN characters ch ON ch.creature_id = c.id
             LEFT JOIN creature_attribute_profs p ON p.creature_id = c.id AND p.attribute_id = 220 -- proficiency
    WHERE encounter_id = encounterId;
END;;

DELIMITER ;

