package com.buzz.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.buzz.service.hotelOrdersService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradePayModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.buzz.configuration.AlipayConfig;

/**
 * 支付宝支付Controller
 * @author linhongcun
 *
 */
@Controller
@RequestMapping("/alipayController")
public class alipayController {

    @Resource
    hotelOrdersService hotelOrdersService;

    // 获取配置文件的信息
    String app_id = AlipayConfig.app_id;
    String private_key = AlipayConfig.private_key;
    String notify_url = AlipayConfig.notify_url;
    String return_url = AlipayConfig.return_url;
    String url = AlipayConfig.url;
    String charset = AlipayConfig.charset;
    String format = AlipayConfig.format;
    String public_key = AlipayConfig.public_key;
    String signtype = AlipayConfig.signtype;

    @RequestMapping("/indexIndex")
    public String indexIndex(){
        return "alipay/index";
    }

    /**
     * 支付请求
     *
     * @param request
     * @param response
     * @throws Exception
     */
    @RequestMapping("/pay")
    public void pay(HttpServletRequest request, HttpServletResponse response, String money, String orderId,String productName) throws Exception {

        request.getServletContext().setAttribute("orderId",orderId); //保存订单id，支付成功修改状态

        // 模拟从前台传来的数据
        String orderNo = orderId; // 订单号
        String totalAmount = money; // 支付总金额
        String subject = productName; // 订单名称
        String body = "reading"; // 商品描述

        // 封装请求客户端
        AlipayClient client = new DefaultAlipayClient(url, app_id, private_key, format, charset, public_key, signtype);

        // 支付请求
        AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();
        alipayRequest.setReturnUrl(return_url);
        alipayRequest.setNotifyUrl(notify_url);
        AlipayTradePayModel model = new AlipayTradePayModel();
        model.setProductCode("FAST_INSTANT_TRADE_PAY"); // 设置销售产品码
        model.setOutTradeNo(orderNo); // 设置订单号
        model.setSubject(subject); // 订单名称
        model.setTotalAmount(totalAmount); // 支付总金额
        model.setBody(body); // 设置商品描述
        alipayRequest.setBizModel(model);
        String form = client.pageExecute(alipayRequest).getBody(); // 生成表单
        response.setContentType("text/html;charset=" + charset);
        response.getWriter().write(form); // 直接将完整的表单html输出到页面
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 同步跳转
     *
     * @param request
     * @throws Exception
     */
    @RequestMapping("/returnUrl")
    public ModelAndView returnUrl(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();

        // 获取支付宝GET过来反馈信息（官方固定代码）
        Map<String, String> params = new HashMap<String, String>();
        Map<String, String[]> requestParams = request.getParameterMap();
        for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
            }
            params.put(name, valueStr);
        }

        boolean signVerified = AlipaySignature.rsaCheckV1(params, public_key, charset, signtype); // 调用SDK验证签名
        // 返回界面
        if (signVerified) {
            //修改订单状态
            hotelOrdersService.byHotelOrderIdUpdateState(request.getServletContext().getAttribute("orderId").toString(),"已付款");
            mav.setViewName("redirect:/alipayController/paySuccessIndex");
        } else {
            mav.setViewName("redirect:/alipayController/payFailureIndex");
        }
        return mav;
    }

    /**
     * 支付成功页面
     * @return
     */
    @RequestMapping("/paySuccessIndex")
    public String paySuccessIndex(){
        return "front_desk/paySuccess";
    }

    /**
     * 支付失败页面
     * @return
     */
    @RequestMapping("/payFailureIndex")
    public String payFailureIndex(){
        return "front_desk/payFailure";
    }

}
