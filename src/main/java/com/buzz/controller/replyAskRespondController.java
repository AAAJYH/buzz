package com.buzz.controller;

import com.buzz.entity.askRespond;
import com.buzz.entity.replyAskRespond;
import com.buzz.service.askRespondService;
import com.buzz.service.interestLabelService;
import com.buzz.service.replyAskRespondService;
import com.buzz.service.usersService;
import com.buzz.utils.Encryption;
import com.buzz.utils.Upload;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("replyAskRespondController")
public class replyAskRespondController
{
    @Resource
    private replyAskRespondService replyaskrespondservice;
    @Resource
    private usersService usersservice;
    @Resource
    private askRespondService askrespondservice;
    @Resource
    private interestLabelService interestlabelservice;
    @ResponseBody
    @RequestMapping("insert_replyAskRespondByaskRespondId")
    public Map<String,Object> insert_replyAskRespondByaskRespondId(String askRespondId,String replyHeadPhoto,String replyAskRespondContent,String currentUserId) throws IOException {
        Map<String,Object> map=new HashMap<String,Object>();
        replyAskRespond rask=new replyAskRespond();
        rask.setReplyAskRespondId(Encryption.getUUID());
        rask.setAskRespondId(askRespondId);
        if(null==replyHeadPhoto||"".equals(replyHeadPhoto))
            replyHeadPhoto=null;
        rask.setReplyHeadPhoto(replyHeadPhoto);
        rask.setUserId(currentUserId);
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        String newfilename = "upload/replyAskRespond/replyAskRespondContent/" + Encryption.getUUID() + "." + "txt";
        rask.setReplyAskRespondContent(newfilename);
        rask.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        File file = new File(path + "/" + newfilename);
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            fos.write(replyAskRespondContent.getBytes());
            if (file.exists()) {
                if (0<replyaskrespondservice.insert_replyAskRespondByaskRespondId(rask))
                {
                    rask.setReplyAskRespondContent(replyAskRespondContent);
                    rask.setUser(usersservice.find_userByuseruserId(currentUserId));
                    map.put("replyAskRespond",rask);
                    askRespond ask=askrespondservice.find_askRespondByaskRespondId(askRespondId);
                    if(null!=ask)
                    {
                        if(null!=ask.getInterestLabelId()&&!"".equals(ask.getInterestLabelId()))
                        {
                            map.put("by","interestLabelId");
                        }
                        else if(null!=ask.getCityId()&&!"".equals(ask.getCityId()))
                        {
                            map.put("by","cityId");
                        }
                        else
                        {
                            map.put("by","askRespondTitle");
                            map.put("by","All");
                        }
                    }
                    map.put("result",true);
                }
                else
                {
                    file.delete();
                    map.put("result",false);
                }
            } else
                map.put("result",false);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result",false);
        } finally {
            if (null != fos) {
                fos.flush();
                fos.close();
            }
        }
        return map;
    }
    /**
     * 添加回复问答图片
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    @ResponseBody
    @RequestMapping("add_replyAskRespondPhoto")
    public Map<Object,Object> add_replyAskRespondPhoto(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        File uploads = new File(ResourceUtils.getURL("src/main/resources/static/images/replyAskRespond/photo").getPath().replace("%20", " "));
        return Upload.insert_Photo(uploads,request,response);
    }

    /**
     * 添加回复问答视频
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    @ResponseBody
    @RequestMapping("add_replyAskRespondVideo")
    public Map<Object,Object> add_replyAskRespondVideo(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        File uploads = new File(ResourceUtils.getURL("src/main/resources/static/images/replyAskRespond/video").getPath().replace("%20", " "));
        return Upload.insert_Video(uploads,request,response);
    }
    /**
     * 删除回复问答图片
     * @param src
     * @return
     * @throws FileNotFoundException
     */
    @ResponseBody
    @RequestMapping("delete_replyAskRespondPhoto")
    public boolean delete_replyAskRespondPhoto(String src) throws FileNotFoundException {
        String path=ResourceUtils.getURL("src/main/resources/static/").getPath().replace("%20", " ");
        return Upload.delete_File(path+"/"+src);
    }

    /**
     * 删除回复问答视频
     * @param src
     * @return
     * @throws FileNotFoundException
     */
    @ResponseBody
    @RequestMapping("delete_replyAskRespondVideo")
    public boolean delete_replyAskRespondVideo(String src) throws FileNotFoundException {
        String path=ResourceUtils.getURL("src/main/resources/static/").getPath().replace("%20", " ");
        return Upload.delete_File(path+"/"+src);
    }
}
