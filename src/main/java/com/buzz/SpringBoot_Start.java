package com.buzz;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling //启动定时任务
public class SpringBoot_Start {
    public static void main(String[] args) {
        SpringApplication.run(SpringBoot_Start.class, args);
    }
}