package com.buzz.dao;

import com.buzz.entity.scenicspotCollect;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.sql.Timestamp;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 17:47
 * 景点收藏 数据库访问层
 */

@Mapper
public interface scenicspotCollectDao {

    //查询用户是否收藏此景点
    @Select("select * from scenicspotcollect where scenicSpotId=#{scenicSpotId} and usersId=#{userId}")
    public scenicspotCollect byUseridAndScenicspotIdQuery(@Param("scenicSpotId")String scenicSpotId,@Param("userId") String userId);

    //添加用户景点收藏
    @Insert("insert into scenicspotcollect(scenicSpotCollectId,scenicSpotId,usersId,collectTime) values(#{scenicSpotCollectId},#{scenicSpotId},#{userid},#{collectTime})")
    public int addScenicspotCollect(@Param("scenicSpotCollectId") String scenicSpotCollectId,@Param("scenicSpotId") String scenicSpotId,@Param("userid") String userid,@Param("collectTime") Timestamp collectTime);

}
