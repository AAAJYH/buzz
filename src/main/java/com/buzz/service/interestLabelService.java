package com.buzz.service;

import com.buzz.dao.interestLabelDao;
import com.buzz.entity.Paging;
import com.buzz.entity.interestLabel;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
public class interestLabelService
{
    @Resource
    private interestLabelDao interestlabeldao;

    /**
     * 通过状态编号查询兴趣标签
     * @param stateId
     * @return
     */
    public List<interestLabel> find_interestLabelBystateId(String stateId)
    {
        return interestlabeldao.find_interestLabelBystateId(stateId);
    }

    /**
     * 通过兴趣编号获取兴趣标签
     * @param interestLabelId
     * @return
     */
    public interestLabel find_interestLabelByinterestLabelId(String interestLabelId)
    {
        return interestlabeldao.find_interestLabelByinterestLabelId(interestLabelId);
    }

    //分页查询标签
    public Paging<interestLabel> PagingQuery(Integer page, Integer rows,interestLabel interestLabel){
        Integer total=interestlabeldao.queryAll(interestLabel).size();
        PageHelper.startPage(page,rows);
        List<interestLabel> interestLabels=interestlabeldao.queryAll(interestLabel);
        return new Paging<interestLabel>(interestLabels,total);
    }

    //添加标签
    @Transactional
    public int addLabel(interestLabel interestLabel){
        return interestlabeldao.addLabel(interestLabel);
    }

    //修改标签
    @Transactional
    public int updateLabel(interestLabel interestLabel){
        return interestlabeldao.updateLabel(interestLabel);
    }


}
