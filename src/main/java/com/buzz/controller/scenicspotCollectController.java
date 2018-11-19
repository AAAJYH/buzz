package com.buzz.controller;

import com.buzz.entity.scenicspot;
import com.buzz.entity.users;
import com.buzz.service.cityService;
import com.buzz.service.scenicspotCollectService;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    @Resource
    private scenicspotService scenicspotservice;
    @Resource
    private cityService cityservice;
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

    /**
     * 通过当前登录用户获取景点收藏
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("find_scenicSpotCollectByuserIds")
    public Map<String,Object> find_scenicSpotCollectByuserId(HttpSession session)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        users user= (users) session.getAttribute("user");
        map.put("user",user);
        List<scenicspot> scenicSpots=scenicspotservice.find_scenicSpotByscenicSpotCollectAndusersId(user.getUserId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6");
        for(scenicspot s:scenicSpots)
            s.setCity(cityservice.byCityIdQuery(s.getCityId()));
        map.put("scenicSpots",scenicSpots);
        return map;
    }

    /**
     * 根据收藏景点编号删除
     * @param scenicSpotCollectId
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_scenicSpotCollectByscenicSpotCollectId")
    public boolean delete_scenicSpotCollectByscenicSpotCollectId(String scenicSpotCollectId)
    {
        if(0<scenicspotCollectService.delete_scenicSpotCollectByscenicSpotCollectId(scenicSpotCollectId))
            return true;
        else
            return false;
    }
}
