package com.buzz.dao;

import com.buzz.entity.city;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 城市表数据访问层
 */

@Mapper
public interface cityDao {

    //查询省的热门城市
    @Select("select * from city where provinceId=#{pid} order by searchNumber desc LIMIT 0,5")
    public List<city> byProvinceIdQueryHot(@Param("pid") String provinceId);

    //根据搜索次数查询热门城市
    @Select("select * from city order by searchNumber desc LIMIT 0,1")
    public city find_cityHot1();

    //查询城市
    @Select("select * from city where cityId=#{cid}")
    public city byCityIdQuery(@Param("cid") String cityId);

    //根据城市名模糊查询
    @Select("select * from city where cityName like concat('%',#{cityName},'%')")
    public List<city> byCityNameQuery(@Param("cityName") String cityName);

    //城市查询次数加一
    @Update("update city set searchNumber=searchNumber+1 where cityId=#{cityId}")
    public int SearchNumberAddOne(@Param("cityId") String cityId);

    /**
     * 查询城市热门的前几条数据
     * @param num
     * @return
     */
    @Select("select * from city order by searchNumber desc LIMIT 0,#{num}")
    public List<city> find_cityByLIMIT(@Param("num")Integer num);

    /**
     * 查询每个城市,并且每个城市有多少问答
     * @param stateIds
     * @return
     */
    @Select({"<script>select c.*,(select count(a.askRespondId) from askRespond a where c.cityId=a.cityId <if test='null!=stateIds'> and a.stateId in<foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></if>) askRespondNum from city c</script>"})
    public List<city> find_city_askRespondNum(@Param("stateIds") String...stateIds);
}
