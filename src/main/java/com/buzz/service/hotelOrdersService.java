package com.buzz.service;

import com.buzz.dao.hotelOrdersDao;
import com.buzz.entity.hotelorders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

/**
 * @Author: jyh
 * @Date: 2018/10/19 7:02
 * 酒店订单业务层
 */

@Service
public class hotelOrdersService {

    @Resource
    hotelOrdersDao hotelOrdersDao;

    //添加酒店订单
    @Transactional
    public int addHotelOrder(hotelorders hotelOrder){
        return hotelOrdersDao.addHotelOrder(hotelOrder);
    }

}
