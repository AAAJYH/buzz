package com.buzz.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface travelNotesDao
{
    /**
     * 根据用户编号查询和状态查询草稿游记
     * @param userId 用户编号
     * @param stateId 状态为草稿
     * @return
     */
    @Select("select count(*) from travelNotes where userId=#{userId} and stateId=#{stateId}")
    public Integer find_travelNotes_NumberByuserId(@Param("userId")String userId,@Param("stateId")String stateId);
}
