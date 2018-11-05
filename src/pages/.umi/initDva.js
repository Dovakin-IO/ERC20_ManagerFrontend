import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/models/login.js').default) });
app.model({ namespace: 'project', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/models/user.js').default) });
app.model({ namespace: 'register', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/User/models/register.js').default) });
app.model({ namespace: 'activities', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'form', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Forms/models/form.js').default) });
app.model({ namespace: 'tx', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/TxList/models/tx.js').default) });
app.model({ namespace: 'txdetail', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/TxList/models/txdetail.js').default) });
app.model({ namespace: 'txuser', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/TxUser/models/txuser.js').default) });
app.model({ namespace: 'rule', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/List/models/rule.js').default) });
app.model({ namespace: 'profile', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Profile/models/profile.js').default) });
app.model({ namespace: 'error', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Exception/models/error.js').default) });
app.model({ namespace: 'geographic', ...(require('/Users/dovakin/Documents/github/ERC20_ManagerFrontend/src/pages/Account/Settings/models/geographic.js').default) });
