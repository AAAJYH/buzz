package com.buzz.service;

import com.buzz.dao.cityDao;
import com.buzz.entity.city;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 城市业务层
 */

@Service
public class cityService {

    @Resource
    cityDao cityDao;

    //查询省的热门城市
    public List<city> byProvinceIdQueryHot(String provinceId){
        return cityDao.byProvinceIdQueryHot(provinceId);
    }

    //查询城市
    public city byCityIdQuery(String cityId){
        return cityDao.byCityIdQuery(cityId);
    }

    //根据城市名模糊查询
    public List<city> byCityNameQuery(String cityName){
        return cityDao.byCityNameQuery(cityName);
    }

}
