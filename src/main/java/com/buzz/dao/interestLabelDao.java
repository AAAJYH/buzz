package com.buzz.dao;

import com.buzz.entity.interestLabel;
import org.apache.ibatis.annotations.*;

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

    //查询全部
    @Select("<script>select * from interestLabel <if test=\"i.interestLabelName!=null\">where interestLabelName like concat('%',#{i.interestLabelName},'%')</if> order by releaseTime desc</script>")
    public List<interestLabel> queryAll(@Param("i") interestLabel interestLabe);

    //添加标签
    @Insert("insert into interestLabel(interestLabelId,interestLabelName,releaseTime,stateId) values(#{i.interestLabelId},#{i.interestLabelName},#{i.releaseTime},#{i.stateId})")
    public int addLabel(@Param("i") interestLabel interestLabel);

    //修改标签
    @Update("update interestLabel set interestLabelName=#{i.interestLabelName},releaseTime=#{i.releaseTime},stateId=#{i.stateId} where interestLabelId=#{i.interestLabelId}")
    public int updateLabel(@Param("i") interestLabel interestLabel);

}
