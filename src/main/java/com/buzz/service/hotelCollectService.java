package com.buzz.service;

import com.buzz.dao.hotelCollectDao;
import com.buzz.entity.hotelCollect;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

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
    public int addHotelCollect(String hotelCollectId,String userid,String hotelId){
        return hotelCollectDao.addHotelCollect(hotelCollectId,userid,hotelId);
    }


}
