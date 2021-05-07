import { Button, Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import CardPage from '../../components/Card';
import { useHistory } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

export default function LayoutPage() {
    const history = useHistory();
    const handleLogout = () => {
        localStorage.removeItem("isLogin");
        window.location.reload();
    }
    return (
        <Layout className="layout">
          <Sider
            breakpoint="md"
            width="100px"
            onBreakpoint={broken => {
              console.log(broken);
            }}
          >
              <Menu theme="dark" mode="inline">
                  <div onClick={() => history.push("/")} className="logo">Zalents</div>
              </Menu>
              <Menu theme="dark" mode="inline" style={{position: 'absolute', bottom: 0}} onClick={handleLogout}>
                  <Button type="danger" style={{width: "100%"}}><LogoutOutlined /></Button>
              </Menu>
          </Sider>
          <Layout>
              <Content>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: "100%" }}>
                      <h3 className="title">Product Roadmap</h3>
                      <CardPage />
                  </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      );
}