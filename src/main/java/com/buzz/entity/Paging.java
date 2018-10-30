package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/25 8:10
 */

@Data
@AllArgsConstructor
public class Paging<T> {

    private List<T> rows;
    private Integer total;

}
