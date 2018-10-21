package com.buzz.utils;

import com.buzz.entity.hotelorders;
import com.buzz.service.hotelOrdersService;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/20 10:58
 * 定时任务
 */

@Component
@Log4j2
public class timedTask {

    @Resource
    hotelOrdersService hotelOrdersService;

    /**
     * 订单超时，修改状态
     * @Scheduled：将方法注册为定时任务   Scheduled:安排
     * fixedRate：上一次启动时间点之后x毫秒执行一次    fixedRate:固定汇率
     */
    @Scheduled(fixedRate=1000)
    public void updateOrderState(){
        Long currentMillis= System.currentTimeMillis(); //
        List<hotelorders> hotelordersList=hotelOrdersService.hotelordersList();
        for (hotelorders h:hotelordersList) {
            if(h.getState().equals("待支付")){
                Long orderMillis=h.getSubTime().getTime()+1*60*1000;
                if(currentMillis>=orderMillis){ //订单超时
                    hotelOrdersService.byHotelOrderIdUpdateState(h.getOrderId(),"超时未支付");
                }
            }
        }
    }

}
