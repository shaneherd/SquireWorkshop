package com.herd.squire.models;

public class SquireImage {
    private String filename;
    private String imageType;
    private String encodedImage;

    public SquireImage() {
    }

    public SquireImage(String filename, String imageType, String encodedImage) {
        this.filename = filename;
        this.imageType = imageType;
        this.encodedImage = encodedImage;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getEncodedImage() {
        return encodedImage;
    }

    public void setEncodedImage(String encodedImage) {
        this.encodedImage = encodedImage;
    }
}
