package com.buzz.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer
{
    /**
     * 配置静态资源(配置server虚拟路径)
     *  addResourceHandler为前台访问路径
     *  addResourceLocations为file相对应的本地路径
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry)
    {
        registry.addResourceHandler("/images/**").addResourceLocations("file:E:/IntelliJ IDEA/FilePath/buzz/src/main/resources/static/images/");
        registry.addResourceHandler("/music/**").addResourceLocations("file:/E:/IDEA Working Path/buzz/src/main/resources/static/music/");
        registry.addResourceHandler("/upload/**").addResourceLocations("file:/E:/IDEA Working Path/buzz/src/main/resources/static/upload/");
    }

}