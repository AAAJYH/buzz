package com.buzz.dao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/11/11 17:28
 */

@Mapper
public interface LogDao {

    //添加日志
    @Insert("insert into log(logId,requestUrl,requestType,responseContent,TotalTime,ip,createSubtime,requestParam) values(#{logId},#{requestUrl},#{requestType},#{responseContent},#{TotalTime},#{ip},#{createSubtime},#{requestParam})")
    public int addLog(@Param("logId") String logId, @Param("requestUrl") String requestUrl, @Param("requestType") String requestType,@Param("responseContent") String responseContent, @Param("TotalTime") long TotalTime, @Param("ip") String ip,@Param("createSubtime") Timestamp createSubtime,@Param("requestParam") String requestParam);

}
