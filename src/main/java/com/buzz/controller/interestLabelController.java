package com.buzz.controller;

import com.buzz.entity.interestLabel;
import com.buzz.service.interestLabelService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@Controller
@RequestMapping("interestLabelController")
public class interestLabelController
{
    @Resource
    private interestLabelService interestlabelservice;
    /**
     * 通过状态编号查询兴趣标签
     * @return
     */
    @ResponseBody
    @RequestMapping("find_interestLabelBystateId")
    public List<interestLabel> find_interestLabelBystateId()
    {
        return interestlabelservice.find_interestLabelBystateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
    }
}
