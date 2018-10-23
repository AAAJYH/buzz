package com.buzz.dao;

import com.buzz.entity.hotelCollect;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * @Author: jyh
 * @Date: 2018/10/17 21:48
 * 酒店收藏表数据访问层
 */

@Mapper
public interface hotelCollectDao {

    //用户是否收藏当前酒店
    @Select("select * from hotelCollect where userId=#{uid} and hotelId=#{hid}")
    public hotelCollect byUseridAndHotelIdQuery(@Param("uid") String userid,@Param("hid") String hotelId);

    //用户收藏酒店
    @Insert("insert into hotelCollect(hotelCollectId,userId,hotelId) values(#{hcid},#{uid},#{hid})")
    public int addHotelCollect(@Param("hcid")String hotelCollectId,@Param("uid") String userid,@Param("hid") String hotelId);

}
