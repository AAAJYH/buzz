package com.buzz.dao;

import com.buzz.entity.city;
import org.apache.ibatis.annotations.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 城市表数据访问层
 */

@Mapper
public interface cityDao {

    //查询省的热门城市
    @Select("select * from city,state where provinceId=#{pid} and city.stateId=state.stateId and stateName='正常' order by searchNumber desc LIMIT 0,6")
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

    /**
     * 根据城市名和状态编号搜索
     * @param cityName
     * @param stateId
     * @return
     */
    @Select("select * from city where cityName=#{cityName} and stateId=#{stateId}")
    public List<city> find_cityBycityNameNolike(@Param("cityName")String cityName,@Param("stateId")String stateId);

    /**
     * 根据城市名和状态编号模糊搜索
     * @param cityName
     * @param stateId
     * @return
     */
    @Select("select * from city where cityName like concat('%',#{cityName},'%') and stateId=#{stateId}")
    public List<city> find_cityBycityNameAndstateId(@Param("cityName") String cityName,@Param("stateId") String stateId);

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
    @Select("select c.cityId,c.cityPhoto,c.cityName,c.citySituation,p.provinceName provinceId,s.stateName stateId,c.searchNumber,c.uptime from city c,state s,province p where s.stateId=c.stateId and c.provinceId=p.provinceId;")
    public List<city> CityListWriteExcel();

    @Select("select o.cityId,o.cityPhoto,o.cityName,o.citySituation,o.stateId,o.searchNumber,o.uptime,o.provinceId from city o,province p where o.provinceId=p.provinceId and ${sql} order by o.uptime desc")
    public List<city> byTypeQuery(@Param("sql") String sql);

    //根据城市名称查询城市
    @Select("select * from city where cityName=#{c}")
    public city byCityNameQueryCity(@Param("c") String cityName);

    //查询城市name和searchNumber
    @Select("select cityName name,searchNumber value from city where searchNumber>0")
    public List<Map<String,Object>> queryCitySearchNumber();

    //查询城市名称和攻略下载次数
    @Select("select sum(s.downloadNumber) value,c.cityName name from city c,strategy s where c.cityId=s.cityId and s.downloadNumber>0 group BY name")
    public List<Map<String,Object>> queryCityNameAndStrategyDownloadNumber();

}
