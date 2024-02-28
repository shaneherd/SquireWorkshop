package com.herd.squire.models.filters;

public class FilterValue {
    public static final String DEFAULT_OPTION = "ALL";
    public static final String DEFAULT_TAG_OPTION = "0,0,0,0,0,0,0,0,0,0";
    public static final String YES = "1";
    public static final String NO = "0";
    private FilterKey key;
    private String value;

    public FilterValue() {}

    public FilterValue(FilterKey key, String value) {
        this.key = key;
        this.value = value;
    }

    public FilterKey getKey() {
        return key;
    }

    public void setKey(FilterKey key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
