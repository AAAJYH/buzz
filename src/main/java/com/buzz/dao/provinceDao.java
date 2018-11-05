package com.buzz.dao;

import com.buzz.entity.province;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 8:26
 * 省表数据访问层
 */

@Mapper
public interface provinceDao {

    //查询全部数据
    @Select("select * from province order by uptime desc")
    public List<province> queryAllProvince();

    //查询城市
    @Select("select * from province where provinceId=#{provinceId}")
    public province byProvinceIdQuery(@Param("provinceId") String provinceId);

}
