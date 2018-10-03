package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.scenicspot;
import com.buzz.service.cityService;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 11:12
 * 景点控制层
 */

@Controller
@RequestMapping("/scenicspotController")
public class scenicspotController {

    @Resource
    scenicspotService scenicspotService;

    @Resource
    cityService cityService;

    //全部景点页面
    @RequestMapping("/ScenicSpotIndex")
    public String ScenicSpotIndex(){
        return "front_desk/ScenicSpot";
    }

    //景点详情页面
    @RequestMapping("/ScenicSpotDetailsIndex")
    public String ScenicSpotDetailsIndex(){
        return "front_desk/ScenicSpotDetails";
    }

    /**
     * 查询城市的全部景点
     * @param cityId
     * @return 景点列表html
     */
    @RequestMapping("/byCityIdQueryScenicspot")
    public String byCityIdQueryScenicspot(String cityId, Model model){
        //景点集合
        List<scenicspot> scenicspotsList=scenicspotService.byCityIdQueryScenicspot(cityId);
        for (scenicspot s:scenicspotsList) {
            s.setSynopsis(s.getSynopsis().substring(0,60));
        }
        model.addAttribute("scenicspotList",scenicspotsList);
        //城市景点信息
        city city=cityService.byCityIdQuery(cityId);
        model.addAttribute("city",city);
        return "front_desk/ScenicSpot";
    }

    /**
     * 查询景点详情
     * @param scenicSpotId
     * @param model 景点对象 城市对象
     * @return 详情页面
     */
    @RequestMapping("/byScenicSpotIdQueryScenicSpot")
    public String byScenicSpotIdQueryScenicSpot(String scenicSpotId,Model model){
        //景点对象
        scenicspot scenicspot=scenicspotService.byScenicSpotIdQueryScenicSpot(scenicSpotId);
        model.addAttribute("scenicspot",scenicspot);
        System.out.println(scenicspot);
        //城市对象
        city city=cityService.byCityIdQuery(scenicspot.getCityId());
        model.addAttribute("city",city);
        return "front_desk/ScenicSpotDetails";
    }

}
