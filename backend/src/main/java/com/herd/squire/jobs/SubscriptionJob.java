package com.herd.squire.jobs;

import com.herd.squire.services.SubscriptionService;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import static java.util.concurrent.TimeUnit.HOURS;
import static java.util.concurrent.TimeUnit.SECONDS;

public class SubscriptionJob implements SquireJob {
    private ScheduledExecutorService scheduler;

    @Override
    public void startJob() {
        final Runnable runnable = () -> {
            try {
                SubscriptionService.expireSubscriptions();
            } catch (Exception e) {
                e.printStackTrace();
            }
        };

        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        this.scheduler.scheduleAtFixedRate(runnable, 0, 1, HOURS);
    }

    @Override
    public void stopJob() throws InterruptedException {
        if (this.scheduler != null) {
            this.scheduler.shutdown();
            this.scheduler.awaitTermination(10, SECONDS);
            this.scheduler = null;
        }
    }
}
