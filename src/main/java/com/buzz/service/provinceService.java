package com.buzz.service;

import com.buzz.dao.provinceDao;
import com.buzz.entity.Paging;
import com.buzz.entity.province;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

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
    public List<province> ByStateQueryProvince(){
        return provinceDao.ByStateQueryProvince();
    }

    //查询城市
    public province byProvinceIdQuery(String provinceId){
        return provinceDao.byProvinceIdQuery(provinceId);
    }

    //分页查询
    public Paging<province> PagingQueryProvince(Integer page,Integer rows,String provinceName){
        Integer total=provinceDao.ByProvcinceNameQueryAllProvince(provinceName).size();
        PageHelper.startPage(page,rows);
        List<province> provinceList=provinceDao.ByProvcinceNameQueryAllProvince(provinceName);
        return new Paging<province>(provinceList,total);
    }

    //添加省
    public int addProvince(String provinceId,String provinceName,String stateId,Timestamp uptime){
        return provinceDao.addProvince(provinceId,provinceName,stateId,uptime);
    }

    //修改省
    public int byProvinceIdUpdate(String provinceId,String provinceName,String stateId,Timestamp uptime){
        return provinceDao.byProvinceIdUpdate(provinceId,provinceName,stateId,uptime);
    }

    //城市集合写入Excel
    public List<province> ProvinceListWriteExcel(){
        return provinceDao.ProvinceListWriteExcel();
    }

    //查询热门省
    public List<Map<String,Object>> queryHotProvince(){
        return provinceDao.queryHotProvince();
    }

}
