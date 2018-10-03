package com.buzz.dao;

import com.buzz.entity.scenicspotCollect;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 17:47
 * 景点收藏 数据库访问层
 */

@Mapper
public interface scenicspotCollectDao {

    //添加数据
    @Insert("insert into scenicspotCollect(scenicSpotCollectId,scenicSpotId,usersId,collectTime) values(#{s.scenicSpotCollectId},#{s.scenicSpotId},#{s.usersId},#{s.collectTime})")
    public int addScenicspotCollect(@Param("s")scenicspotCollect scenicspotCollect);

}
