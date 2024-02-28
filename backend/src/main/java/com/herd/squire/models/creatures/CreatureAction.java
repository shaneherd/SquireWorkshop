package com.herd.squire.models.creatures;

import com.herd.squire.models.Action;
import com.herd.squire.models.ListObject;

public class CreatureAction {
    private String id;
    private Action action;
    private CreatureActionType creatureActionType;
    private ListObject item;
    private ListObject subItem;
    private boolean favorite;
    private int favoriteOrder;
    private String defaultId;

    public CreatureAction() {}

    public CreatureAction(String id, Action action, CreatureActionType creatureActionType, ListObject item, ListObject subItem, boolean favorite, int favoriteOrder, String defaultId) {
        this.id = id;
        this.action = action;
        this.creatureActionType = creatureActionType;
        this.item = item;
        this.subItem = subItem;
        this.favorite = favorite;
        this.favoriteOrder = favoriteOrder;
        this.defaultId = defaultId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public CreatureActionType getCreatureActionType() {
        return creatureActionType;
    }

    public void setCreatureActionType(CreatureActionType creatureActionType) {
        this.creatureActionType = creatureActionType;
    }

    public ListObject getItem() {
        return item;
    }

    public void setItem(ListObject item) {
        this.item = item;
    }

    public ListObject getSubItem() {
        return subItem;
    }

    public void setSubItem(ListObject subItem) {
        this.subItem = subItem;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public int getFavoriteOrder() {
        return favoriteOrder;
    }

    public void setFavoriteOrder(int favoriteOrder) {
        this.favoriteOrder = favoriteOrder;
    }

    public String getDefaultId() {
        return defaultId;
    }

    public void setDefaultId(String defaultId) {
        this.defaultId = defaultId;
    }
}
