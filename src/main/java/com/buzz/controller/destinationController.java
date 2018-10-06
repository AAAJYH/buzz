package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.province;
import com.buzz.service.cityService;
import com.buzz.service.provinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/29 10:04
 * 目的地控制层 hahah1
 */

@Controller
@RequestMapping("/destinationController")
public class destinationController {

    @Resource
    cityService cityService;
    @Resource
    provinceService provinceService;

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

}
