package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.scenicspot;
import com.buzz.service.cityService;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/5 9:29
 */

@Controller
@RequestMapping("/mapController")
public class mapController {

    @Resource
    scenicspotService scenicspotService;

    /**
     * 查询城市所有景点
     * @param model 保存景点集合
     * @param request 获取ServletContext对象获取city对象
     * @return 地图页面
     */
    @RequestMapping("/mapIndex")
    public String mapIndex(Model model, HttpServletRequest request){
        //获取上下文city对象
        city city=(city) request.getServletContext().getAttribute("city");
        List<scenicspot> scenicspotList=scenicspotService.byCityIdQueryScenicspot(city.getCityId());
        model.addAttribute("scenicspotList",scenicspotList);
        model.addAttribute("total",scenicspotList.size());
        return "front_desk/Map";
    }

    /**
     * 查询全部景点
     * @param model 保存景点集合信息
     * @return 标记集群地图页面
     */
    @RequestMapping("/MarkerClustererMapIndex")
    public String MarkerClustererMapIndex(Model model){
        List<scenicspot> scenicspotList=scenicspotService.queryAll();
        model.addAttribute("scenicspotList",scenicspotList);
        return "front_desk/MarkerClustererMap";
    }

}
