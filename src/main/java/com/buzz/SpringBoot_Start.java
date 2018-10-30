package com.buzz;


import org.activiti.spring.boot.SecurityAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.net.InetAddress;
import java.net.UnknownHostException;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class) //不加，activiti启动会报错
@EnableScheduling //启动定时任务
public class SpringBoot_Start {
    public static void main(String[] args) throws UnknownHostException {
        SpringApplication.run(SpringBoot_Start.class,args);
    }
}
