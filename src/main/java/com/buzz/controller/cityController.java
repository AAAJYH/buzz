package com.buzz.controller;

import com.buzz.entity.Paging;
import com.buzz.entity.city;
import com.buzz.service.cityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@Controller
@RequestMapping("cityController")
public class cityController {
    @Resource
    private cityService cityservice;
    @ResponseBody
    @RequestMapping("find_cityBykeyUp")
    public List<city> find_cityBykeyUp(String cityName)
    {
        return cityservice.byCityNameQuery(cityName);
    }

    /**
     * 后台城市管理页面
     * @return
     */
    @RequestMapping("/cityManageIndex")
    public String cityManageIndex(){
        return "backstage_supporter/cityManage";
    }

    /**
     * 分页查询全部城市
     * @param page 要显示的页数
     * @param rows 每页显示的行数
     * @return 城市集合
     */
    @RequestMapping("/pagingQueryCity")
    @ResponseBody
    public Paging<city> pagingQueryCity(Integer page,Integer rows){
        return cityservice.PagingQueryAll(page,rows);
    }

}
