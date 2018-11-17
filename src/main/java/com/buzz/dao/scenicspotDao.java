package com.buzz.dao;

import com.buzz.entity.scenicspot;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 12:02
 * 景点访问数据库层
 */

@Mapper
public interface scenicspotDao {

    //查询城市的全部景点
    @Select("select * from scenicspot ss,state s where ss.cityId=#{cityId} and ss.stateId=s.stateId and s.stateName='正常'")
    public List<scenicspot> byCityIdQueryScenicspot(@Param("cityId") String cityId);

    //查询景点详情
    @Select("select * from scenicspot where scenicSpotId=#{id}")
    public scenicspot byScenicSpotIdQueryScenicSpot(@Param("id") String scenicSpotId);

    //查询全部景点
    @Select("select * from scenicspot order by uptime desc")
    public List<scenicspot> queryAll();

    //根据景点名称模糊查询
    @Select("select * from scenicspot where chineseName like concat('%',#{ScenicspotName},'%')")
    public List<scenicspot> byScenicspotNameQuery(@Param("ScenicspotName") String ScenicspotName);

    //添加景点
    @Insert("insert into scenicspot(scenicSpotId,chineseName,englishName,address,synopsis,phone,url,traffic,tickets,openingHours,longitude,latitude,cityId,uptime,photo,stateId) values(#{scenicSpotId},#{chineseName},#{englishName},#{address},#{synopsis},#{phone},#{url},#{traffic},#{tickets},#{openingHours},#{longitude},#{latitude},#{cityId},#{uptime},'images/ScenicSpotPhoto/wKgBEFrhb3SAN3dcABAft7C2kYs76.jpg,images/ScenicSpotPhoto/wKgBEFrhb3WAAh2WAA0__QZImJU16.jpg,images/ScenicSpotPhoto/wKgBEFrhb3WAakoZAAf3cRjwZCY02.jpg',#{stateId}) ")
    public int addScenicSpot(@Param("scenicSpotId") String scenicSpotId, @Param("chineseName") String chineseName, @Param("englishName") String englishName, @Param("address") String address, @Param("synopsis") String synopsis, @Param("phone") String phone, @Param("url") String url, @Param("traffic") String traffic, @Param("tickets") String tickets, @Param("openingHours") String openingHours, @Param("longitude") String longitude, @Param("latitude") String latitude, @Param("cityId") String cityId,@Param("uptime") Timestamp uptime,@Param("stateId") String stateId);

    //修改景点
    @Update("update scenicspot set chineseName=#{chineseName},englishName=#{englishName},address=#{address},synopsis=#{synopsis},phone=#{phone},url=#{url},traffic=#{traffic},tickets=#{tickets},openingHours=#{openingHours},longitude=#{longitude},latitude=#{latitude},cityId=#{cityId},uptime=#{uptime},stateId=#{stateId} where scenicSpotId=#{scenicSpotId}")
    public int byScenicspotIdUpdateScenicspot(@Param("scenicSpotId") String scenicSpotId, @Param("chineseName") String chineseName, @Param("englishName") String englishName, @Param("address") String address, @Param("synopsis") String synopsis, @Param("phone") String phone, @Param("url") String url, @Param("traffic") String traffic, @Param("tickets") String tickets, @Param("openingHours") String openingHours, @Param("longitude") String longitude, @Param("latitude") String latitude, @Param("cityId") String cityId,@Param("uptime") Timestamp uptime,@Param("stateId") String stateId);

    //修改景点图片
    @Update("update scenicspot set photo=#{photo} where scenicSpotId=#{scenicSpotId}")
    public int byScenicspotIdUpdatePhoto(@Param("scenicSpotId") String scenicSpotId,@Param("photo") String photo);

    //查詢全部，，写Excel
    @Select("SELECT scenicSpotId,chineseName,englishName,address,synopsis,phone,url,traffic,tickets,openingHours,longitude,latitude,photo,ss.uptime,s.stateName stateId,c.cityName cityId FROM `scenicspot` ss,city c,state s where ss.cityId=c.cityId and ss.stateId=s.stateId;")
    public List<scenicspot> QueryAllScenicspotWriteExcel();

    //查询全部景点名称
    @Select("select chineseName name,120 value from scenicspot")
    public List<Map<String,Object>> queryAllChineseName();

    //查询全部景点名称和坐标
    @Select("select chineseName,longitude,latitude from scenicspot")
    public List<scenicspot> queryAllChineseNameAndZuoBiao();

    /**
     * 根据用户收藏景点编号查询
     * @param usersId
     * @param stateId
     * @return
     */
    @Select("select si.*,sc.scenicSpotCollectId from scenicSpot si inner join scenicSpotCollect sc on si.scenicSpotId=sc.scenicSpotId where sc.usersId=#{usersId} and si.stateId=#{stateId}")
    public List<scenicspot> find_scenicSpotByscenicSpotCollectAndusersId(@Param("usersId") String usersId,@Param("stateId")String stateId);
}
