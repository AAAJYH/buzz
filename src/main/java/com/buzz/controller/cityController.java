package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.service.cityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@Controller
@RequestMapping("cityController")
public class cityController
{
    @Resource
    private cityService cityservice;
    @ResponseBody
    @RequestMapping("find_cityBykeyUp")
    public List<city> find_cityBykeyUp(String cityName)
    {
        return cityservice.byCityNameQuery(cityName);
    }

    /**
     * 查询城市的前几条数据
     * @return
     */
    @ResponseBody
    @RequestMapping("find_cityByLIMIT")
    public List<city> find_cityByLIMIT()
    {
        return cityservice.find_cityByLIMIT(8);
    }

    @ResponseBody
    @RequestMapping("find_cityHot1")
    public city find_cityHot1()
    {
        return cityservice.find_cityHot1();
    }
}
