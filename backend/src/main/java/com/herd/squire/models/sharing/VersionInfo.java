package com.herd.squire.models.sharing;

public class VersionInfo {
    private int version;
    private int authorVersion;

    public VersionInfo(int version, int authorVersion) {
        this.version = version;
        this.authorVersion = authorVersion;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public int getAuthorVersion() {
        return authorVersion;
    }

    public void setAuthorVersion(int authorVersion) {
        this.authorVersion = authorVersion;
    }
}
