package com.herd.squire.models;

public class SupportRequest {
    private SupportRequestSubject subject;
    private String message;

    public SupportRequest() {
        subject = SupportRequestSubject.OTHER;
    }

    public SupportRequest(SupportRequestSubject subject, String message) {
        this.subject = subject;
        this.message = message;
    }

    public SupportRequestSubject getSubject() {
        return subject;
    }

    public void setSubject(SupportRequestSubject subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
