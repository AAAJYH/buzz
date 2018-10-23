package com.buzz.controller;

import com.buzz.entity.users;
import com.buzz.service.scenicspotCollectService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.UUID;

/**
 * @Author: jyh
 * @Date: 2018/10/23 9:33
 */

@Controller
@RequestMapping("/scenicspotCollectController")
public class scenicspotCollectController {

    @Resource
    scenicspotCollectService scenicspotCollectService;

    /**
     * 添加用户景点收藏
     * @param session 获取用户id
     * @param scenicspotId 景点Id
     * @return 添加结果
     */
    @RequestMapping("/addScenicspotCollect")
    @ResponseBody
    public int addScenicspotCollect(HttpSession session, String scenicspotId){
        String scenicspotCollectId= UUID.randomUUID().toString(); //Id
        Timestamp collectTime=new Timestamp(System.currentTimeMillis()); //收藏时间
        String userid=""; //用户ida
        if(session.getAttribute("user")!=null){
            userid =((users)session.getAttribute("user")).getUserId();
        }
        return scenicspotCollectService.addScenicspotCollect(scenicspotCollectId,scenicspotId,userid,collectTime);
    }

}
