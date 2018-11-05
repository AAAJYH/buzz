package com.buzz.dao;

import com.buzz.entity.State;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * @Author: jyh
 * @Date: 2018/11/4 16:35
 * 状态表数据库访问层
 */

@Mapper
public interface StateDao {

    //查询state对象
    @Select("select * from state where stateId=#{stateId}")
    public State byStateIdQuery(@Param("stateId") String stateId);

}
