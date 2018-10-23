package com.buzz.service;

import com.buzz.dao.hotelOrdersDao;
import com.buzz.entity.hotelorders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/19 7:02
 * 酒店订单业务层
 */

@Service
public class hotelOrdersService {

    @Resource
    hotelOrdersDao hotelOrdersDao;

    //查询全部订单
    public List<hotelorders> hotelordersList(){
        return hotelOrdersDao.hotelordersList();
    }

    //添加酒店订单
    @Transactional
    public int addHotelOrder(hotelorders hotelOrder){
        return hotelOrdersDao.addHotelOrder(hotelOrder);
    }

    //查询订单详情
    public hotelorders byHotelOrderIdQuery(String hotelOrderId){
        return hotelOrdersDao.byHotelOrderIdQuery(hotelOrderId);
    }

    //修改订单状态
    @Transactional
    public int byHotelOrderIdUpdateState(String hotelOrderId,String state){
        return hotelOrdersDao.byHotelOrderIdUpdateState(hotelOrderId,state);
    }


}
