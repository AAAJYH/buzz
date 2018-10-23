package com.buzz.service;

import com.buzz.dao.scenicspotDao;
import com.buzz.entity.scenicspot;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
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

}
