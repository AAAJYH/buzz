package com.buzz.service;

import com.buzz.dao.scenicspotDao;
import com.buzz.entity.Paging;
import com.buzz.entity.scenicspot;
import com.github.pagehelper.PageHelper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 12:06
 * 景点业务层
 */

@Service
public class scenicspotService {

    @Resource
    scenicspotDao scenicspotDao;

    //查询城市的全部景点
    public List<scenicspot> byCityIdQueryScenicspot(String cityId){
        return scenicspotDao.byCityIdQueryScenicspot(cityId);
    }

    //查询景点详情
    public scenicspot byScenicSpotIdQueryScenicSpot(String scenicSpotId){
        return scenicspotDao.byScenicSpotIdQueryScenicSpot(scenicSpotId);
    }

    //查询全部景点
    public List<scenicspot> queryAll(){
        return scenicspotDao.queryAll();
    }

    //根据景点名称模糊查询
    public List<scenicspot> byScenicspotNameQuery(String ScenicspotName){
        return scenicspotDao.byScenicspotNameQuery(ScenicspotName);
    }

    //后台分页查询景点
    public Paging<scenicspot> PagingQueryScenicspot(Integer page, Integer rows){
        Integer total=scenicspotDao.queryAll().size();
        PageHelper.startPage(page,rows);
        List<scenicspot> scenicspotList=scenicspotDao.queryAll();
        return new Paging<scenicspot>(scenicspotList,total);
    }

    //添加景点
    @Transactional
    public int addScenicSpot(String scenicSpotId,String chineseName,String englishName,String address, String synopsis,String phone,String url,String traffic,String tickets,String openingHours,String longitude,String latitude,String cityId,Timestamp uptime,String stateId){
        return scenicspotDao.addScenicSpot( scenicSpotId, chineseName, englishName, address,  synopsis, phone, url, traffic, tickets, openingHours, longitude, latitude, cityId, uptime,stateId);
    }

    //修改景点
    @Transactional
    public int byScenicspotIdUpdateScenicspot(String scenicSpotId,String chineseName,String englishName,String address,String synopsis,String phone,String url,String traffic,String tickets,String openingHours,String longitude,String latitude,String cityId,Timestamp uptime,String stateId){
        return scenicspotDao.byScenicspotIdUpdateScenicspot( scenicSpotId, chineseName, englishName, address, synopsis, phone, url, traffic, tickets, openingHours, longitude, latitude, cityId, uptime,stateId);
    }

    //修改景点图片
    @Transactional
    public int byScenicspotIdUpdatePhoto(String scenicSpotId,String photo){
        return scenicspotDao.byScenicspotIdUpdatePhoto(scenicSpotId,photo);
    }

    //查詢全部，写Excel
    public List<scenicspot> QueryAllScenicspotWriteExcel(){
        return scenicspotDao.QueryAllScenicspotWriteExcel();
    }

}
