package com.buzz.dao;

import com.buzz.entity.scenicspot;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 12:02
 * 景点访问数据库层
 */

@Mapper
public interface scenicspotDao {

    //查询城市的全部景点
    @Select("select * from scenicspot where cityId=#{cityId}")
    public List<scenicspot> byCityIdQueryScenicspot(@Param("cityId") String cityId);

    //查询景点详情
    @Select("select * from scenicspot where scenicSpotId=#{id}")
    public scenicspot byScenicSpotIdQueryScenicSpot(@Param("id") String scenicSpotId);

    //查询全部景点
    @Select("select * from scenicspot")
    public List<scenicspot> queryAll();

    //根据景点名称模糊查询
    @Select("select * from scenicspot where chineseName like concat('%',#{ScenicspotName},'%')")
    public List<scenicspot> byScenicspotNameQuery(@Param("ScenicspotName") String ScenicspotName);

    /**
     * 根据用户收藏景点编号查询
     * @param usersId
     * @param stateId
     * @return
     */
    @Select("select si.*,sc.scenicSpotCollectId from scenicSpot si inner join scenicSpotCollect sc on si.scenicSpotId=sc.scenicSpotId where sc.usersId=#{usersId} and si.stateId=#{stateId}")
    public List<scenicspot> find_scenicSpotByscenicSpotCollectAndusersId(@Param("usersId") String usersId,@Param("stateId")String stateId);
}
