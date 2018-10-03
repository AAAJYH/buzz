package com.buzz;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
public class SpringBoot_Start {
    public static void main(String[] args) {
        SpringApplication.run(SpringBoot_Start.class,args);
    }
}
