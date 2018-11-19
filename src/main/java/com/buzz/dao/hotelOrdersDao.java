package com.buzz.dao;

import com.buzz.entity.hotelorders;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/19 6:50
 * 酒店订单数据库访问
 */

@Mapper
public interface hotelOrdersDao {

    //查询全部订单
    @Select("select * from hotelorders order by subTime desc")
    public List<hotelorders> hotelordersList();

    //添加酒店订单
    @Insert("insert into hotelorders(orderId,hid,roomName,bedType,inDate,outDate,lastTime,productName,orderAmout,passengers,contactName,contactMobile,email,Remark,state,userId,subTime,hotelName,defaultPicture) values(#{h.orderId},#{h.hid},#{h.roomName},#{h.bedType},#{h.inDate},#{h.outDate},#{h.lastTime},#{h.productName},#{h.orderAmout},#{h.passengers},#{h.contactName},#{h.contactMobile},#{h.email},#{h.Remark},#{h.state},#{h.userId},#{h.subTime},#{h.hotelName},#{h.defaultPicture})")
    public int addHotelOrder(@Param("h")hotelorders hotelOrder);

    //查询订单详情
    @Select("select * from hotelorders where orderId=#{id}")
    public hotelorders byHotelOrderIdQuery(@Param("id") String hotelOrderId);

    //修改订单状态
    @Update("update hotelorders set state=#{s} where orderId=#{h}")
    public int byHotelOrderIdUpdateState(@Param("h") String hotelOrderId,@Param("s") String state);

    //查询写Excel
    @Select("select h.orderId,h.hid,h.roomName,h.bedType,h.inDate,h.lastTime,h.outDate,h.productName,h.orderAmout,h.passengers,h.contactName,h.contactMobile,h.email,h.Remark,h.state,h.subTime,u.userName FROM hotelorders h,users u where h.userId=u.userId ")
    public List<hotelorders> HotelOrderWriteExcel();

    //根据状态查询全部订单
    @Select("<script>select * from hotelorders <if test=\"state!=''\">where state=#{state} </if> order by subTime desc</script>")
    public List<hotelorders> byStateQueryHotelOrders(@Param("state") String state);

    /**
     * 通过用户编号和状态查询
     * @param userId
     * @param stateIds
     * @return
     */
    @Select({"<script>select * from hotelOrders where state in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach> and userId=#{userId}</script>"})
    public List<hotelorders> find_hotelOrdersByuserIdAndstateId(@Param("userId")String userId,@Param("stateIds")String...stateIds);
}
