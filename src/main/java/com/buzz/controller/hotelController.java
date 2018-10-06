package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.scenicspot;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/29 10:04
 * 酒店控制层
 */

@Controller
@RequestMapping("/hotelController")
public class hotelController {

    @Resource
    scenicspotService scenicspotService;

    /**
     * 查看城市酒店
     * @param model 景点集合
     * @param request 获取ServletContext对象
     * @param scenicspotId 默认选中的id
     * @return 酒店页面
     */
    @RequestMapping("/hotelIndex")
    public String hotelIndex(Model model, HttpServletRequest request,String scenicspotId){
        //获取上下文city对象
        city city=(city) request.getServletContext().getAttribute("city");
        //保存景点集合
        List<scenicspot> scenicspotList=scenicspotService.byCityIdQueryScenicspot(city.getCityId());
        model.addAttribute("scenicspotList",scenicspotList);
        //默认选中第一个景点
        if (scenicspotId .equals("")) {
            scenicspotId=scenicspotList.get(0).getScenicSpotId();
        }
        scenicspot scenicspot=scenicspotService.byScenicSpotIdQueryScenicSpot(scenicspotId);
        model.addAttribute("scenicspot",scenicspot);
        return "front_desk/Hotel";
    }

}
