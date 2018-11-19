package com.buzz.service;

import com.buzz.dao.hotelOrdersDao;
import com.buzz.entity.Paging;
import com.buzz.entity.hotelorders;
import com.github.pagehelper.PageHelper;
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

    //后台根据状态分页查询全部订单
    public Paging<hotelorders> PagingQueryHotelOrders(Integer page,Integer rows,String state){
            Integer total=hotelOrdersDao.byStateQueryHotelOrders(state).size();
            PageHelper.startPage(page,rows);
            List<hotelorders> hotelordersList=hotelOrdersDao.byStateQueryHotelOrders(state);
            return new Paging<hotelorders>(hotelordersList,total);
    }

    //查询写Excel
    public List<hotelorders> HotelOrderWriteExcel(){
        return hotelOrdersDao.HotelOrderWriteExcel();
    }
    /**
     * 通过用户编号和状态查询
     * @param userId
     * @param stateIds
     * @return
     */
    public List<hotelorders> find_hotelOrdersByuserIdAndstateId(String userId,String...stateIds)
    {
        return hotelOrdersDao.find_hotelOrdersByuserIdAndstateId(userId,stateIds);
    }

}
