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

    /**
     * 根据城市编号查询多个攻略
     * @param cityId
     * @return
     */
    @Select("select * from strategy where cityId=#{cityId}")
    public List<strategy> find_strategyBycityId(@Param("cityId") String cityId);

    /**
     * 根据城市编号查询多个攻略,只返回五条数据
     * @param cityId
     * @return
     */
    @Select("select * from strategy where cityId=#{cityId} LIMIT 0,5")
    public List<strategy> find_strategyBycityIdR5(@Param("cityId") String cityId);
    //攻略下载次数加1
    @Update("update strategy set downloadNumber=downloadNumber+1 where strategyId=#{strategyId}")
    public int updateCityStrategyDownloadNumber(String strategyId);

    /**
     * 通过下载数量倒序查询五条旅游攻略
     * @return
     */
    @Select("select * from strategy order by downloadNumber desc LIMIT 0,5")
    public List<strategy> find_strategyHot5();

    /**
     * 根据旅游攻略编号查询
     * @return
     */
    @Select("select * from strategy where strategyId=#{strategyId}")
    public strategy find_strategyBystrategyId(@Param("strategyId") String strategyId);

}
