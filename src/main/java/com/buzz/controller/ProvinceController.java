package com.buzz.controller;

import com.buzz.dao.provinceDao;
import com.buzz.entity.province;
import com.buzz.service.provinceService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/11/4 15:53
 * 省控制层
 */

@Controller
@RequestMapping("/ProvinceController")
public class ProvinceController {

    @Resource
    provinceService provinceService;

    /**
     * 后台根据省id查询省对象
     * @param provinceId
     * @return
     */
    @RequestMapping("/byProvinceIdQuery")
    @ResponseBody
    public province byProvinceIdQuery(String provinceId){
        return provinceService.byProvinceIdQuery(provinceId);
    }

    @RequestMapping("/queryProvinceAll")
    @ResponseBody
    public List<province> queryProvinceAll(){
        return provinceService.queryAllProvince();
    }

}
