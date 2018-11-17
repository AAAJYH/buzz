package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.scenicspot;
import com.buzz.service.cityService;
import com.buzz.service.scenicSpotCommentService;
import com.buzz.service.scenicspotService;
import com.sun.org.apache.xerces.internal.xs.datatypes.ObjectList;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/5 9:29
 */

@Controller
@RequestMapping("/mapController")
public class mapController {

    @Resource
    scenicspotService scenicspotService;

    @Resource
    scenicSpotCommentService scenicSpotCommentService;

    /**
     * 查询城市所有景点和总评论数
     * @param model 保存景点集合
     * @param request 获取ServletContext对象获取city对象
     * @return 地图页面
     */
    @RequestMapping("/mapIndex")
    public String mapIndex(Model model, HttpServletRequest request){
        //获取上下文city对象
        city city=(city) request.getServletContext().getAttribute("city");
        List<scenicspot> scenicspotList=scenicspotService.byCityIdQueryScenicspot(city.getCityId());
        //重新封装集合，目的把评论数添加到map中
        List<Map<String,Object>> mapList=new ArrayList<Map<String,Object>>();
        for (scenicspot s:scenicspotList) {
            Map m=new HashMap();
            m.put("chineseName",s.getChineseName());
            m.put("photo",s.getPhoto());
            m.put("scenicSpotId",s.getScenicSpotId());
            m.put("address",s.getAddress());
            m.put("englishName",s.getEnglishName());
            m.put("longitude",s.getLongitude());
            m.put("latitude",s.getLatitude());
            m.put("commentNumber",scenicSpotCommentService.queryScenicSpotCommentAll(s.getScenicSpotId()).size());
            mapList.add(m);
        }
        model.addAttribute("scenicspotList",mapList);
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
        //景点集合
        List<scenicspot> scenicspotList=scenicspotService.queryAll();
        model.addAttribute("scenicspotList",scenicspotList);
        return "front_desk/MarkerClustererMap";
    }

}
