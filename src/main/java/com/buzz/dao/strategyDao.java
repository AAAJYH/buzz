package com.buzz.dao;

import com.buzz.entity.strategy;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 20:19
 * 攻略 数据库访问层
 */

@Mapper
public interface strategyDao {

    //查询城市攻略
    @Select("select * from strategy where cityId=#{cityId}")
    public strategy queryCityStrategy(@Param("cityId") String cityId);

    //攻略下载次数加1
    @Update("update strategy set downloadNumber=downloadNumber+1 where strategyId=#{strategyId}")
    public int updateCityStrategyDownloadNumber(String strategyId);

}
