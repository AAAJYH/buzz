package com.buzz.service;

import com.buzz.dao.LogDao;
import com.buzz.entity.Log;
import com.buzz.entity.Paging;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/11/11 17:32
 */

@Service
public class LogService {

    @Resource
    LogDao logDao;

    //添加日志
    @Transactional
    public int addLog(String logId,String requestUrl,String requestType,long TotalTime,String ip,Timestamp createSubtime){
        return logDao.addLog( logId, requestUrl, requestType, TotalTime, ip, createSubtime);
    }

    //查询全部日志
    public Paging<Log> queryAll(Integer page,Integer rows){
        Integer total=logDao.queryAll().size();
        PageHelper.startPage(page,rows);
        List<Log> logList=logDao.queryAll();
        return new Paging<Log>(logList,total);
    }

}
