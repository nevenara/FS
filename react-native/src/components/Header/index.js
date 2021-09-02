import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { signOut, openCamera } from '../../screens/reducer';
import * as RootNavigation from '../../utils/RootNavigation';
import { COLOR, ROUTES } from '../../screens/constants';
import Burger from './Burger';
import BurgerItem from './BurgerItem';
import { getIsCameraOpen } from '../../screens/selectors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.DARK_GRAY,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerImage: {
    resizeMode: 'contain',
    width: '80%',
    height: 100,
  },
  modalStyle: {
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
  },
  burgerContainer: {
    top: '23%',
  },
  currentPageBackground: {
    height: 33,
  },
  currentPageContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 33,
  },
  scannerScreenHeader: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  activeHeader: {
    backgroundColor: COLOR.BLUE,
    padding: 6,
    height: 33,
  },
  defaultHeader: {
    backgroundColor: COLOR.LIGHT_GRAY,
    padding: 6,
    height: 33,
  },
  currentPageText: {
    color: COLOR.WHITE,
    marginLeft: 5,
  },
  defaultPageText: {
    color: COLOR.DARK_GRAY,
    marginLeft: 5,
  },
  signOutStyle: {
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    margin: 2,
    width: 150,
    height: 33,
    backgroundColor: COLOR.WHITE,
  },
  signOutContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 60,
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
});
const Header = (props) => {
  const dispatch = useDispatch();
  const route = useRoute();

  const Selector = {
    isCameraOpen: useSelector((state) => getIsCameraOpen(state)),
  };

  const Action = {
    signOut: (payload) => dispatch(signOut(payload)),
    openCamera: (payload) => dispatch(openCamera(payload)),
  };

  const imagePath = require('../../../assets/logo-v1.png');
  const [showMenu, setShowMenu] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  const routes = Object.keys(ROUTES);

  useEffect(() => {
    const routesKeys = routes.filter((routeKey) => routeKey !== 'LOGIN' && routeKey !== 'LIST_FROM_SCANNER');
    setMenuItems(routesKeys.map((routeKey) => ROUTES[routeKey]));
  }, []);

  useEffect(() => {
    let routeName;
    let routePath;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < routes.length; i++) {
      if (ROUTES[routes[i]].PATH === route.name) {
        routeName = ROUTES[routes[i]].NAME;
        routePath = ROUTES[routes[i]].PATH;
        break;
      }
    }
    setCurrentPage(routeName);
    setCurrentPath(routePath);
  }, [route.name]);

  const changePage = (routePath) => {
    RootNavigation.navigate(routePath, '');
    setShowMenu(false);
  };

  const checkIsHome = () => currentPath === ROUTES.HOME.PATH;

  const renderScannerHeader = () => {
    if ((checkIsHome() && Selector.isCameraOpen) || currentPath === ROUTES.LIST_FROM_SCANNER.PATH) {
      return (
        <View style={styles.currentPageBackground}>
          <View style={styles.currentPageContainer}>
            <TouchableOpacity
              style={[styles.scannerScreenHeader, checkIsHome() ? styles.activeHeader : styles.defaultHeader]}
              onPress={() => {
                changePage(ROUTES.HOME.PATH);
                Action.openCamera();
              }}
            >
              {RootNavigation.getPageIcon(ROUTES.HOME.NAME, checkIsHome() ? null : COLOR.DARK_GRAY)}
              <Text style={checkIsHome() ? styles.currentPageText : styles.defaultPageText} >{ROUTES.HOME.NAME}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.scannerScreenHeader, checkIsHome() ? styles.defaultHeader : styles.activeHeader]}
              onPress={() => changePage(ROUTES.LIST_FROM_SCANNER.PATH)}
            >
              {RootNavigation.getPageIcon(ROUTES.LIST.NAME, checkIsHome() ? COLOR.DARK_GRAY : null)}
              <Text style={checkIsHome() ? styles.defaultPageText : styles.currentPageText} >{ROUTES.LIST.NAME}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.currentPageBackground}>
        <View style={styles.currentPageContainer}>
          <View style={[styles.scannerScreenHeader, styles.activeHeader]}>
            {RootNavigation.getPageIcon(currentPage)}
            <Text style={styles.currentPageText} >{currentPage}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={imagePath}
                        style={styles.headerImage}
                        resizeMethod="resize"
                    />
                </View>
                <View style={styles.menuContainer}>
                    <Burger openMenu={() => setShowMenu(true)}/>
                </View>
                {renderScannerHeader()}
                {/* <View style={styles.currentPageBackground}>
                  <View style={styles.currentPageContainer}>
                    <TouchableOpacity style={[styles.scannerScreenHeader, currentPage === ROUTES]}>
                      {RootNavigation.getPageIcon(currentPage)}
                      <Text style={styles.currentPageText} >{currentPage}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scannerScreenHeader} onPress={() => changePage(ROUTES.LIST_FROM_SCANNER.PATH)}>
                      {RootNavigation.getPageIcon(ROUTES.LIST.NAME)}
                      <Text style={styles.currentPageText} >{ROUTES.LIST.NAME}</Text>
                    </TouchableOpacity>
                  </View>
                </View> */}
            </View>
            <Modal onRequestClose={() => setShowMenu(false)} visible={showMenu} animationType='fade' transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
                    <View style={styles.modalStyle}>
                        <View style={styles.burgerContainer}>
                            {menuItems.map((routesItem, index) => <BurgerItem
                            key={`${routesItem.PATH + index}`}
                            currentPage={currentPage}
                            name={routesItem.NAME}
                            route={routesItem.PATH}
                            isCurrent={currentPage === routesItem.NAME}
                            changePage={changePage}
                            />)}
                            <TouchableOpacity
                              onPress={() => {
                                setShowMenu(false);
                                Action.signOut();
                              }}
                            >
                              <View style={styles.signOutStyle}>
                                <View style={styles.signOutContainer}>
                                  <FontAwesome name="sign-out" size={24} color={COLOR.BLUE} />
                                  <Text style={{ color: COLOR.BLUE }}>Sign-Out</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
  );
};

Header.propTypes = {
  signOut: PropTypes.func,
};

export default Header;
