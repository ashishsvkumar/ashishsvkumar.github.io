import * as React from "react";
import { Component } from "react";
import { withRouter, Route, Switch } from "react-router";
import * as styles from "../../App.scss";
import { basePath } from "../../config/environment";
import cx from 'classnames';
import LandingPage from "../../containers/pages/LandingPage";
import OrdersPage from "../../containers/pages/OrdersPage";
import OrderHelpLandingPage from "../../containers/pages/OrderHelpLandingPage";
import ItemLevelHelpPage from "../../containers/pages/ItemLevelHelpPage";
import FaqPage from "../../containers/pages/FaqPage";
import CategoryPage from "../../containers/pages/CategoryPage";
import { Sidebar } from "../sidebar/Sidebar";
import Breadcrumbs from "../../containers/partials/Breadcrumbs";
import SnapEngageWrapper from "../../containers/partials/Snapengage";
import RMHelpPage from "../../containers/pages/RMHelpPage";
import { NotFound } from "../pages/notFound/NotFound";
import ChatEntry from "../pages/contact/ChatEntry";

class MainContentHolder extends Component<any, any> {

    componentDidUpdate(prevProps: any) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    isHomePage() {
        return basePath === location.pathname || basePath === `${location.pathname}/`;
    }

    render() {
        const sidebarClassName = cx({ [styles.sidebar]: true, [styles.hidden]: this.isHomePage() })
        const bodyClassName = cx({ [styles.main_content]: true, [styles.full_width]: this.isHomePage() })

        return (
            <React.Fragment>
                <div className={styles.only_desktop}><Breadcrumbs /></div>
                <div className={styles.app}>
                    <div className={sidebarClassName}><Sidebar /></div>
                        <SnapEngageWrapper>
                            <div className={bodyClassName}>
                                <Switch>
                                    <Route path="/contact-us" component={ChatEntry}/>
                                    <Route path="/contact" component={RMHelpPage}/>
                                    <Route path="/orders/:tradeOrderId(\d+)/contact" component={RMHelpPage}/>
                                    <Route path="/orders/:tradeOrderId(\d+)/faq/:id/:heading?" component={FaqPage} />
                                    <Route path="/category/:categoryId(\d+)/:categoryHeading/faq/:id/:heading?" component={FaqPage} />
                                    <Route path="/faq/:id/:heading?" component={FaqPage} />
                                    <Route path="/orders/:tradeOrderId(\d+)/help/:category" component={ItemLevelHelpPage} />
                                    <Route path="/orders/:tradeOrderId(\d+)" component={OrderHelpLandingPage} />
                                    <Route path="/category/:id/:heading" component={CategoryPage} />
                                    <Route path="/orders" component={OrdersPage} />
                                    {/* <Route path="/query" component={QueryFormPage} /> */}
                                    <Route exact path="/" component={LandingPage} />
                                    <Route path="*" component={NotFound}/>
                                </Switch>
                            </div>
                        </SnapEngageWrapper>
                    <div className={styles.clear} />
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(MainContentHolder);
