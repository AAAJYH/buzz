package com.buzz.service;

import com.buzz.dao.cityDao;
import com.buzz.entity.Paging;
import com.buzz.entity.city;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

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

    //城市查询次数加一
    @Transactional
    public int SearchNumberAddOne(String cityId){
        return cityDao.SearchNumberAddOne(cityId);
    }

    //分页查询全部
    public Paging<city> PagingQueryAll(Integer pageSize, Integer rows,String type,String val){
        String sql="";
        if(type.equals("")||val.equals("")){
            sql=" 1=1";
        }else{
            sql=" "+type+" like concat('%','"+val+"','%')";
        }
        Integer total=cityDao.byTypeQuery(sql).size();
        PageHelper.startPage(pageSize,rows);
        List<city> cityList=cityDao.byTypeQuery(sql);
        return new Paging<city>(cityList,total);
    }

    //修改城市状态
    @Transactional
    public int byCityIdUpdateState(String cityId,String stateId){
        return cityDao.byCityIdUpdateState(cityId,stateId);
    }

    //添加城市
    @Transactional
    public int addCity(Integer searchNumber,String cityId,String cityName,String citySituation,String provinceId,String stateId,Timestamp uptime){
        return cityDao.addCity(cityId,cityName,citySituation,provinceId,stateId,uptime,searchNumber);
    }

    //修改城市
    @Transactional
    public int byCityIdUpdateInfo(String cityName,String citySituation,String provinceId,String stateId,Timestamp uptime,String cityId){
        return cityDao.byCityIdUpdateInfo(cityName,citySituation,provinceId,stateId,uptime,cityId);
    }

    //修改城市图片
    @Transactional
    public int byCityIdUpdateCityPhoto(String CityId,String cityPhoto){
        return cityDao.byCityIdUpdateCityPhoto(CityId,cityPhoto);
    }

    //城市集合写入Excel
    public List<city> CityListWriteExcel(){
        return cityDao.CityListWriteExcel();
    }

    public List<city> queryAllCity(){
        return cityDao.queryCityAll();
    }

    //根据城市名称查询城市
    public city byCityNameQueryCity(String cityName){
        return cityDao.byCityNameQueryCity(cityName);
    }

    //查询城市name和searchNumber
    public List<Map<String,Object>> queryCitySearchNumber(){
        return cityDao.queryCitySearchNumber();
    }

    //查询城市名称和攻略下载次数
    public List<Map<String,Object>> queryCityNameAndStrategyDownloadNumber(){
        return cityDao.queryCityNameAndStrategyDownloadNumber();
    }


    /**
     * 查询城市热门的前几条数据
     *
     * @param num
     * @return
     */
    public List<city> find_cityByLIMIT(Integer num) {
        return cityDao.find_cityByLIMIT(num);
    }

    //根据搜索次数查询热门城市
    public city find_cityHot1() {
        return cityDao.find_cityHot1();
    }

    /**
     * 查询每个城市,并且每个城市有多少问答
     *
     * @param stateIds
     * @return
     */
    public List<city> find_city_askRespondNum(String... stateIds)
    {
        return  cityDao.find_city_askRespondNum(stateIds);
    }
}
