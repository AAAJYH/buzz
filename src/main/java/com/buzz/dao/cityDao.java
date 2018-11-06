package com.buzz.dao;

import com.buzz.entity.city;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 城市表数据访问层
 */

@Mapper
public interface cityDao {

    //查询省的热门城市
    @Select("select * from city,state where provinceId=#{pid} and city.stateId=state.stateId and stateName='正常' order by searchNumber desc LIMIT 0,5")
    public List<city> byProvinceIdQueryHot(@Param("pid") String provinceId);

    //查询城市
    @Select("select * from city where cityId=#{cid}")
    public city byCityIdQuery(@Param("cid") String cityId);

    //根据城市名模糊查询
    @Select("select * from city where cityName like concat('%',#{cityName},'%')")
    public List<city> byCityNameQuery(@Param("cityName") String cityName);

    //城市查询次数加一
    @Update("update city set searchNumber=searchNumber+1 where cityId=#{cityId}")
    public int SearchNumberAddOne(@Param("cityId") String cityId);

    //查询全部
    @Select("select * from city order by uptime desc")
    public List<city> queryCityAll();

    //修改城市状态
    @Update("update city set stateId=#{stateId} where cityId=#{cityId}")
    public int byCityIdUpdateState(@Param("cityId") String cityId,@Param("stateId") String stateId);

    //添加城市
    @Insert("insert into city(cityId,cityName,citySituation,provinceId,stateId,searchNumber,uptime,cityPhoto) value(#{cityId},#{cityName},#{citySituation},#{provinceId},#{stateId},#{searchNumber},#{uptime},'images/cityPhoto/wKgB6lSgx0KAAtuCAAVoSPI1DUk40.jpeg')")
    public int addCity(@Param("cityId") String cityId,@Param("cityName") String cityName,@Param("citySituation")String citySituation,@Param("provinceId")String provinceId,@Param("stateId")String stateId,@Param("uptime")Timestamp uptime,@Param("searchNumber") Integer searchNumber);

    //修改城市
    @Update("update city set cityName=#{cityName},citySituation=#{citySituation},provinceId=#{provinceId},stateId=#{stateId},uptime=#{uptime} where cityId=#{cityId}")
    public int byCityIdUpdateInfo(@Param("cityName") String cityName,@Param("citySituation") String citySituation,@Param("provinceId") String provinceId,@Param("stateId") String stateId,@Param("uptime") Timestamp uptime,@Param("cityId") String cityId);

    //修改城市图片
    @Update("update city set cityPhoto=#{cityPhoto} where cityId=#{cityId}")
    public int byCityIdUpdateCityPhoto(@Param("cityId") String CityId,@Param("cityPhoto") String cityPhoto);

    //城市集合写入Excel
    @Select("select c.cityId,c.cityPhoto,c.cityName,c.citySituation,p.provinceName provinceId,s.stateName stateId,c.searchNumber,c.uptime from city c,state s,province p where s.stateId=c.stateId and c.provinceId=p.provinceId;\n")
    public List<city> CityListWriteExcel();

}
