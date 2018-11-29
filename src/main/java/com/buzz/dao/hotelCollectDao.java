package com.buzz.dao;

import com.buzz.entity.hotelCollect;
import org.apache.ibatis.annotations.*;

import java.util.List;

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

    //查询用户收藏酒店
    @Select("SELECT * FROM `hotelcollect` where userId=#{userid}")
    public List<hotelCollect> byUseridQuery(@Param("userid") String userid);

    //删除酒店收藏记录
    @Delete("delete from hotelcollect where hotelCollectId=#{hotelCollectId}")
    public int byhotelCollectIdDelete(@Param("hotelCollectId") String hotelCollectId);

}
