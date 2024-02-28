DROP PROCEDURE IF EXISTS Powers_Delete_Spell;

DELIMITER ;;
CREATE PROCEDURE Powers_Delete_Spell(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE spellId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO spellId, isOwner
    FROM powers
    WHERE user_id IN (0, userId) AND id = powerId;

    IF spellId IS NOT NULL THEN
        DELETE ms FROM monster_spells ms JOIN monsters m ON m.id = ms.monster_id WHERE ms.spell_id = spellId AND (m.user_id = userId OR ms.user_id = userId);
        DELETE mis FROM monster_innate_spells mis JOIN monsters m ON m.id = mis.monster_id WHERE mis.spell_id = spellId AND (m.user_id = userId OR mis.user_id = userId);
        DELETE csc FROM characteristic_spell_configurations csc JOIN characteristics c ON c.id = csc.characteristic_id WHERE csc.spell_id = spellId AND (c.user_id = userId OR csc.user_id = userId);
        DELETE csc FROM creature_spell_configurations csc JOIN creatures c ON c.id = csc.creature_id WHERE csc.spell_id = spellId AND (c.user_id = userId OR csc.user_id = userId);
        DELETE cas FROM creature_active_spells cas JOIN creatures  c ON c.id = cas.creature_id WHERE cas.spell_id = spellId AND c.user_id = userId;
        DELETE cis FROM creature_item_spells cis JOIN creature_items ci ON ci.id = cis.creature_item_id JOIN creatures c ON c.id = ci.creature_id WHERE cis.spell_id = spellId AND c.user_id = userId;
        DELETE mis FROM magical_item_spells mis JOIN items i ON i.id = mis.magical_item_id WHERE mis.spell_id = spellId AND i.user_id = userId;
        DELETE mias FROM magical_item_applicable_spells mias JOIN items i ON i.id = mias.magical_item_id WHERE mias.spell_id = spellId AND i.user_id = userId;

        CALL Powers_Delete_Common(spellId, userId);

        IF isOwner THEN
            DELETE FROM powers_public WHERE power_id = powerId;
            DELETE FROM powers_private WHERE power_id = powerId;
            UPDATE powers SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = powerId;

            DELETE s FROM spells s JOIN powers p ON p.id = s.power_id WHERE power_id = spellId AND p.user_id = userId;
            DELETE FROM powers WHERE user_id = userId AND id = spellId;
        ELSE
            DELETE FROM powers_shared WHERE user_id = userId AND power_id = spellId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Powers_Delete_Spell(265, 1, 0);
