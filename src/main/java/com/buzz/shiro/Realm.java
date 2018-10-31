package com.buzz.shiro;

import com.buzz.entity.Admin;
import com.buzz.service.AdminService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/22 15:52
 */
public class Realm extends AuthorizingRealm{

    @Autowired
    private AdminService as;

    //判断时授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    /**
     * 登录认证
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String adName=(String) authenticationToken.getPrincipal();
        Admin admin=as.byAdNameQuery(adName);
        if(admin==null){
            throw new UnknownAccountException();
        }else{
            return new SimpleAuthenticationInfo(admin.getAdname(),admin.getPwd(),getName());
        }
    }
}
