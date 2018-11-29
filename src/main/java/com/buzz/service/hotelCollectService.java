package com.buzz.service;

import com.buzz.dao.hotelCollectDao;
import com.buzz.entity.hotelCollect;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/17 21:54
 * 酒店收藏业务层
 */

@Service
public class hotelCollectService {

    @Resource
    hotelCollectDao hotelCollectDao;

    //用户是否收藏当前酒店
    public hotelCollect byUseridAndHotelIdQuery(String userid, String hotelId){
        return hotelCollectDao.byUseridAndHotelIdQuery(userid,hotelId);
    }


    //用户收藏酒店
    @Transactional
    public int addHotelCollect(String hotelCollectId,String userid,String hotelId){
        return hotelCollectDao.addHotelCollect(hotelCollectId,userid,hotelId);
    }

    //查询用户收藏酒店
    public List<hotelCollect> byUseridQuery(String userid){
        return hotelCollectDao.byUseridQuery(userid);
    }

    //删除酒店收藏记录
    @Transactional
    public int byhotelCollectIdDelete(String hotelCollectId){
        return hotelCollectDao.byhotelCollectIdDelete(hotelCollectId);
    }

}
