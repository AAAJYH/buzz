package com.buzz.dao;

import com.buzz.entity.Log;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/11/11 17:28
 */

@Mapper
public interface LogDao {

    //添加日志
    @Insert("insert into log(logId,requestUrl,requestType,totalTime,ip,createSubtime,requestParam) values(#{logId},#{requestUrl},#{requestType},#{TotalTime},#{ip},#{createSubtime},#{requestParam})")
    public int addLog(@Param("logId") String logId, @Param("requestUrl") String requestUrl, @Param("requestType") String requestType, @Param("TotalTime") long TotalTime, @Param("ip") String ip,@Param("createSubtime") Timestamp createSubtime,@Param("requestParam") String requestParam);

    //查询全部日志
    @Select("select * from log order by createSubtime desc")
    public List<Log> queryAll();

}
