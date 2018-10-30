package com.buzz.shiro;

import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/22 15:47
 */

@Configuration
public class ShiroConfiguration {

    /**
     * 定义shiro过滤器并注入sercurityManager安全管理器
     * @param securityManager
     * @return
     */
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager){

        //拦截器对象
        ShiroFilterFactoryBean shiroFilterFactoryBean=new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);

        Map<String,String> filterChain=new LinkedHashMap<String,String>();

        shiroFilterFactoryBean.setLoginUrl("/login");//设置需要登录认证的连接
        shiroFilterFactoryBean.setSuccessUrl("/successLogin");//设置认证成功的页面
        shiroFilterFactoryBean.setUnauthorizedUrl("/403");//登录成功未授权页面

        //不拦截
        filterChain.put("/static/**", "anon");
        filterChain.put("/loginIndex", "anon");
        filterChain.put("/favicon.ico","anon");//解决登录成功之后跳转/favicon.ico问题
        filterChain.put("/logout", "logout");

        //拦截所有url
        filterChain.put("/**","authc");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChain);
        return shiroFilterFactoryBean;
    }

    /*
     * HashedCredentialsMatcher：加密凭证
     * setHashAlgorithmName：设置加密算法名称
     * setHashIterations：设置加密次数
     */
    @Bean("hashedCredentialsMatcher")
    public HashedCredentialsMatcher hashedCredentialsMatcher() {
        HashedCredentialsMatcher matcher=new HashedCredentialsMatcher(); //Hashed：散列的；Credentials：凭证；Matcher：匹配器
        matcher.setHashAlgorithmName("md5"); //Algorithm：算法
        matcher.setHashIterations(1); //iterations：迭代次数
        return matcher;
    }

    /**
     * 自定义realm，设置加密匹配器
     * @return
     */
    @Bean
    public Realm realm(){
        Realm realm=new Realm();
        realm.setCredentialsMatcher(hashedCredentialsMatcher());
        return realm;
    }

    /**
     * 安全管理器securityManager,注入自定义realm
     * @return
     */
    @Bean
    public SecurityManager securityManager(){
        DefaultWebSecurityManager securityManager=new DefaultWebSecurityManager();
        securityManager.setRealm(realm());
        return securityManager;
    }

    /**
     *  开启shiro aop注解支持.
     *  使用代理方式;所以需要开启代码支持;
     * @param securityManager
     * @return
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager){
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }

}
