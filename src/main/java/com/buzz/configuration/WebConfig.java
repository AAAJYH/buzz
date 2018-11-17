package com.buzz.configuration;

import com.buzz.interceptor.LoginInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class
WebConfig implements WebMvcConfigurer
{
    /**
     * 配置静态资源(配置server虚拟路径)
     *  addResourceHandler为前台访问路径
     *  addResourceLocations为file相对应的本地路径
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry)
    {
        registry.addResourceHandler("/images/**").addResourceLocations("file:/E:\\IntelliJ IDEA\\FilePath\\buzz\\src\\main\\resources\\static\\images/");
        registry.addResourceHandler("/music/**").addResourceLocations("file:/E:/IntelliJ IDEA FilePath/buzz/src/main/resources/static/music");
        registry.addResourceHandler("/upload/**").addResourceLocations("file:/E:/IntelliJ IDEA FilePath/buzz/src/main/resources/static/upload");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry)
    {
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/travelNotesController/find_travelNotes_ByuserId")
                .addPathPatterns("/travelNotesController/check_travelNotesNumber")
                .addPathPatterns("/travelNotesController/publish_travelNotes")
                .addPathPatterns("/travelNotesController/preview_travelNotes")
                .addPathPatterns("/travelCollectionController/insert_travelCollectionBytravelNotesId")
                .addPathPatterns("/travelNotesController/insert_travelNotes")
                .addPathPatterns("/replyAskRespondCommentController/insert_replyAskRespondComment")
                .addPathPatterns("/replyAskRespondTopController/insert_replyAskRespondTop")
                .addPathPatterns("/scenicspotCollectController/find_scenicSpotCollectByuserIds")
                .addPathPatterns("/hotelController/find_hotelOrdersByuserIdAndstateId")
                .addPathPatterns("/replyAskRespondController/find_replyAskRespond_Message_askRespondByuserIdAndstateId")
                .addPathPatterns("/replyAskRespondController/find_replyAskRespond_Message_replyAskRespondCommentByuserIdAndstateId")
                .addPathPatterns("/travelNotesController/find_travelNotes_travelNotesReplyByuserIdAndStateId")
                .addPathPatterns("/travelNotesReplyController/insert_travelNotesReply");
    }
}
