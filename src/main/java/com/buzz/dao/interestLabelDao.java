package com.buzz.dao;

import com.buzz.entity.interestLabel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface interestLabelDao
{
    /**
     * 通过状态编号查询兴趣标签
     * @param stateId
     * @return
     */
    @Select("select * from interestLabel where stateId=#{stateId}")
    public List<interestLabel> find_interestLabelBystateId(@Param("stateId") String stateId);

    /**
     * 通过兴趣编号获取兴趣标签
     * @param interestLabelId
     * @return
     */
    @Select("select * from interestLabel where interestLabelId=#{interestLabelId}")
    public interestLabel find_interestLabelByinterestLabelId(@Param("interestLabelId")String interestLabelId);
}
