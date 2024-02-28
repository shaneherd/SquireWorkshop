package com.herd.squire.jobs;

import com.herd.squire.utilities.SquireProperties;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.ArrayList;
import java.util.List;

public class JobsContextListener implements ServletContextListener {
    List<SquireJob> jobs;

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        this.jobs = new ArrayList<>();
        String env = SquireProperties.getProperty("env");
        if (env != null && env.equals("prod")) {
            this.jobs.add(new SubscriptionJob());

            for (SquireJob job : this.jobs) {
                job.startJob();
            }
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        for (SquireJob job : this.jobs) {
            try {
                job.stopJob();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
