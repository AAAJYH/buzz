package com.buzz.service;

import com.buzz.dao.provinceDao;
import com.buzz.entity.province;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 省业务层
 */

@Service
public class provinceService {

    @Resource
    provinceDao provinceDao;

    //查询全部数据
    public List<province> queryAllProvince(){
        return provinceDao.queryAllProvince();
    }

    //查询城市
    public province byProvinceIdQuery(String provinceId){
        return provinceDao.byProvinceIdQuery(provinceId);
    }

}
