package com.buzz.dao;

import com.buzz.entity.province;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 省表数据访问层
 */

@Mapper
public interface provinceDao {

    //查询全部数据
    @Select("select * from province,state where province.stateId=state.stateId and stateName='正常' order by uptime desc")
    public List<province> ByStateQueryProvince();


    //查询全部数据
    @Select("select * from province order by uptime desc")
    public List<province> queryAllProvince();

    //查询城市
    @Select("select * from province where provinceId=#{provinceId}")
    public province byProvinceIdQuery(@Param("provinceId") String provinceId);

    //添加省
    @Insert("insert into province(provinceId,provinceName,stateId,uptime) values(#{provinceId},#{provinceName},#{stateId},#{uptime}) ")
    public int addProvince(@Param("provinceId") String provinceId, @Param("provinceName") String provinceName, @Param("stateId") String stateId, @Param("uptime") Timestamp uptime);

    //修改省
    @Update("update province set provinceName=#{provinceName},stateId=#{stateId},uptime=#{uptime} where provinceId=#{provinceId}")
    public int byProvinceIdUpdate(@Param("provinceId") String provinceId,@Param("provinceName") String provinceName,@Param("stateId") String stateId,@Param("uptime") Timestamp uptime);

    //城市集合写入Excel
    @Select("select p.provinceId,p.provinceName,s.stateName stateId,p.uptime from province p,state s where p.stateId=s.stateId")
    public List<province> ProvinceListWriteExcel();

    //查询全部数据
    @Select("<script>select * from province <if test=\"provinceName!=''\">where provinceName like concat('%',#{provinceName},'%')</if> order by uptime desc</script>")
    public List<province> ByProvcinceNameQueryAllProvince(@Param("provinceName") String provinceName);

    //根据搜索次数查询热门省
    @Select("select provinceId,sum(searchNumber) sum from city group by provinceId ORDER BY sum desc LIMIT 0,6")
    public List<Map<String,Object>> queryHotProvince();

}
