package com.herd.squire.models.items.magical_item;

import java.util.ArrayList;
import java.util.List;

public class MagicalItemTable {
    private String id;
    private String name;
    private List<String> columns;
    private List<MagicalItemTableRow> rows;

    public MagicalItemTable() {
        this.columns = new ArrayList<>();
        this.rows = new ArrayList<>();
    }

    public MagicalItemTable(String id, String name) {
        this.id = id;
        this.name = name;
        this.columns = new ArrayList<>();
        this.rows = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    public List<MagicalItemTableRow> getRows() {
        return rows;
    }

    public void setRows(List<MagicalItemTableRow> rows) {
        this.rows = rows;
    }
}
