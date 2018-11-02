package com.buzz.entity;

import lombok.Data;

import java.util.Set;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/23 9:46
 */

@Data
public class Menu {

    private Integer id;
    private String text;
    private String url;
    private int parentId;
    private String icon;
    private Set<Menu> children;
    private String state;

}
