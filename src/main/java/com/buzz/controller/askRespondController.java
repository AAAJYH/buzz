package com.buzz.controller;

import com.buzz.entity.askRespond;
import com.buzz.service.askRespondService;
import com.buzz.service.cityService;
import com.buzz.service.interestLabelService;
import com.buzz.service.usersService;
import com.buzz.utils.Encryption;
import com.buzz.utils.Upload;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

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
@RequestMapping("askRespondController")
public class askRespondController {
    @Resource
    private askRespondService askrespondservice;
    @Resource
    private interestLabelService interestlabelservice;
    @Resource
    private cityService cityservice;
    @Resource
    private usersService usersservice;
    @ResponseBody
    @RequestMapping("insert_askRespond")
    public Map<String,Object> insert_askRespond(String askRespondTitle,String interestLabelId,String askRespondDetail,String cityId,String userId) throws IOException
    {
        Map<String,Object> map=new HashMap<String,Object>();
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        String newfilename = "upload/askRespond/askRespondDetail/" + Encryption.getUUID() + "." + "txt";
        if(null==cityId||"".equals(cityId))
            cityId=null;
        if(null==interestLabelId||"".equals(interestLabelId))
            interestLabelId=null;
        askRespond a=new askRespond();
        String askRespondId=Encryption.getUUID();
        a.setAskRespondId(askRespondId);
        a.setAskRespondTitle(askRespondTitle);
        a.setAskRespondDetail(newfilename);
        a.setUserId(userId);
        a.setCityId(cityId);
        a.setInterestLabelId(interestLabelId);
        a.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        File file = new File(path + "/" + newfilename);
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            fos.write(askRespondDetail.getBytes());
            if (file.exists()) {
                if (0<askrespondservice.insert_askRespond(a))
                {
                    map.put("askRespondId",askRespondId);
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
     * 根据问答编号修改问答详细内容
     * @param askRespondId
     * @param askRespondDetail
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("update_askRespondDetailByaskRespondId")
    public Map<String,Object> update_askRespondDetailByaskRespondId(String askRespondId,String askRespondDetail) throws IOException {
        Map<String,Object>map=new HashMap<String,Object>();
        askRespond ask=askrespondservice.find_askRespondByaskRespondId(askRespondId);
        if(null!=ask)
        {
            if(ask.getStateId().equals("0ee26211-3ae8-48b7-973f-8488bfe837d6"))
            {
                String path = ResourceUtils.getURL("src/main/resources/static").getPath();
                path = path.replace("%20", " ");
                File delete_file=new File(path+'/'+ask.getAskRespondDetail());
                if(delete_file.exists())//判断是否存在进行删除
                    delete_file.delete();
                String newfilename = "upload/askRespond/askRespondDetail/" + Encryption.getUUID() + "." + "txt";
                File file=new File(path+'/'+newfilename);
                FileOutputStream fos=null;
                try
                {
                    fos= new FileOutputStream(file);
                    fos.write(askRespondDetail.getBytes());
                    if(file.exists())
                    {
                        if(0<askrespondservice.update_askRespondDetailByaskRespondId(askRespondId,newfilename))
                        {
                            map.put("askRespondDetail",askRespondDetail);
                            map.put("result",true);
                        }
                        else
                        {
                            file.delete();
                            map.put("result",false);
                        }
                    }
                    else
                        map.put("result",false);
                }
                catch (Exception e)
                {
                    map.put("result",false);
                    e.printStackTrace();
                }
                finally {
                    fos.flush();
                    fos.close();
                }
            }
            else
                map.put("result",false);
        }
        else
            map.put("result",false);
        return map;
    }

    /**
     * 根据问答编号删除
     * @param askRespondId
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_askRespondByaskRespondId")
    public Map<String,Object> delete_askRespondByaskRespondId(String askRespondId) throws FileNotFoundException {
        Map<String,Object> map=new HashMap<String,Object>();
        askRespond ask=askrespondservice.find_askRespondByaskRespondId(askRespondId);
        if(null!=ask)
        {
            try
            {
                if(ask.getStateId().equals("0ee26211-3ae8-48b7-973f-8488bfe837d6"))
                {
                    String path = ResourceUtils.getURL("src/main/resources/static").getPath();
                    path = path.replace("%20", " ");
                    File delete_file=new File(path+'/'+ask.getAskRespondDetail());
                    if(delete_file.exists())//判断是否存在进行删除
                        delete_file.delete();
                    if(0<askrespondservice.update_stateIdByaskRespondId(askRespondId,"ac618998-ffe3-4300-a391-cd581f74078c"))
                        map.put("result",true);
                }
                else
                {
                    map.put("result",false);
                    map.put("message","问答已被回复不能进行删除");
                }
            }
            catch (Exception e)
            {
                map.put("result",false);
                map.put("message","删除问答文件出现错误");
                e.printStackTrace();
            }
        }
        else
        {
            map.put("result",false);
            map.put("message","该问答不存在或已删除");
        }
        return map;
    }
    /**
     * 根据问答编号获取
     * @param askRespondId
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("find_askRespondByaskRespondId")
    public Map<String,Object> find_askRespondByaskRespondId(String askRespondId) throws IOException
    {
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
        path = path.replace("%20", " ");
        Map<String,Object> map=new HashMap<String,Object>();
        askRespond ask=askrespondservice.find_askRespondByaskRespondId(askRespondId);
        if(null!=ask)
        {
            ask.setAskRespondDetail(askrespondservice.format_askRespondDetail(path,ask.getAskRespondDetail()));
            if(null!=ask.getInterestLabelId()&&!"".equals(ask.getInterestLabelId()))
                ask.setInterestlabel(interestlabelservice.find_interestLabelByinterestLabelId(ask.getInterestLabelId()));
            if(null!=ask.getCityId()&&!"".equals(ask.getCityId()))
                ask.setCity(cityservice.byCityIdQuery(ask.getCityId()));
            if(null!=ask.getUserId()&&!"".equals(ask.getUserId()))
                ask.setUser(usersservice.find_userByuseruserId(ask.getUserId()));
            map.put("result",true);
            map.put("askRespond",ask);
        }
        else
            map.put("result",false);
        return map;
    }
    /**
     * 删除问答图片
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_askRespondPhoto")
    public boolean delete_askRespondPhoto(String src) throws FileNotFoundException {
        String path=ResourceUtils.getURL("src/main/resources/static/").getPath().replace("%20", " ");
        return Upload.delete_File(path+"/"+src);
    }

    /**
     * 添加问答图片
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    @ResponseBody
    @RequestMapping("add_askRespondPhoto")
    public Map<Object, Object> add_askRespondPhoto(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        File uploads = new File(ResourceUtils.getURL("src/main/resources/static/images/askRespond/photo").getPath().replace("%20", " "));
        return Upload.insert_Photo(uploads,request,response);
    }
}
