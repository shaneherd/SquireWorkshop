package com.herd.squire.jobs;

public interface SquireJob {
    void startJob();
    void stopJob() throws InterruptedException;
}
