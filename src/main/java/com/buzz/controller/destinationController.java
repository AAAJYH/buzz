package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.province;
import com.buzz.entity.scenicspot;
import com.buzz.service.cityService;
import com.buzz.service.provinceService;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/29 10:04
 * 目的地控制层
 */

@Controller
@RequestMapping("/destinationController")
public class destinationController {

    @Resource
    cityService cityService;
    @Resource
    provinceService provinceService;

    @Resource
    scenicspotService scenicspotService;

    //目的地页面
    @RequestMapping("/destinationIndex")
    public String destinationIndex(){
        return "front_desk/Destination";
    }

    /**
     * 查询省以及省的热门城市
     * @param model List{List{province,List<city>}
     * @return 目的地html
     */
    @RequestMapping("/queryAllDestination")
    public String queryAllDestination(Model model){
        List<List> destinationList=new ArrayList<List>();
        List<province> provinceList=provinceService.queryAllProvince();
        for (province p:provinceList) {
            List list=new ArrayList();
            list.add(p);
            List<city> cityList=cityService.byProvinceIdQueryHot(p.getProvinceId());
                list.add(cityList);
            destinationList.add(list);
        }
        model.addAttribute("destinationList",destinationList);
        return "front_desk/Destination";
    }

    /**
     * 模糊查询
     * @param name 景点name或目的地name
     */
    @RequestMapping("/fuzzySearch")
    @ResponseBody
    public List<Map<String,Object>> fuzzySearch(String name){

        List<scenicspot> scenicspotList=scenicspotService.byScenicspotNameQuery(name); //景点集合
        List<city> cityList=cityService.byCityNameQuery(name); //城市集合

        //封装自动补全集合
        List<Map<String,Object>> mapList=new ArrayList<Map<String,Object>>();
        //1.将景点集合添加到mapList中
        for (scenicspot s:scenicspotList) {
            Map<String,Object> map=new HashMap<String, Object>();
            map.put("id",s.getScenicSpotId());
            map.put("name",s.getChineseName());
            map.put("type","景点");
            mapList.add(map);
        }
        //2.将城市集合添加到mapList中
        for (city c: cityList) {
            Map<String,Object> map=new HashMap<String, Object>();
            map.put("id",c.getCityId());
            map.put("name",c.getCityName());
            map.put("type","目的地");
            mapList.add(map);
        }
        return mapList;
    }

}
