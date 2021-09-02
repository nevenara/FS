import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import {
  Table,
  TableWrapper,
  Row,
  Cell,
} from 'react-native-table-component';

import { useDispatch, useSelector } from 'react-redux';
import { CHECKED_IN, COLOR, PERSONALIZED } from '../constants';
import SearchInput from '../../components/SearchInput';
import {
  searchList, getNextPage, setSearchText, restartSearch,
} from '../reducer';
import {
  getListInfo,
  getListCurrentPage,
  getLoading,
  getTextSearch,
  getLastTextSearch
} from '../selectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: COLOR.DARK_GRAY,
  },
  loadingIndicator: {
    backgroundColor: 'rgba(52, 52, 52, 0)',
    elevation: 0,
    shadowColor: 'rgba(52, 52, 52, 0)',
  },
  header: {
    height: 35,
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  textHeader: {
    textAlign: 'center',
    fontWeight: '100',
  },
  dataWrapper: { marginTop: -1 },
  rowGrey: {
    flexDirection: 'row',
    backgroundColor: COLOR.DARK_GRAY,
  },
  rowWhite: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
  },
  text: {
    textAlign: 'center',
    padding: 5,
  },
  textTicketStatus: {
    color: COLOR.WHITE,
    textAlign: 'center',
    borderRadius: 5,
    width: '90%',
    left: '5%',
  },
  searchContainer: {
    paddingBottom: 30,
  },
  inputText: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
  },
});

const CheckInList = () => {
  const [tickets, setTickets] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const table = {
    tableHead: [
      'Ticket ID',
      'First name',
      'Last name',
      'Ticket status',
      'Verification status',
      'Reason for Failed Check-In',
    ],
    widthArr: [
      120, 80, 100, 120, 115, 220,
    ],
  };
  const dispatch = useDispatch();
  const Action = {
    getList: (payload) => dispatch(searchList(payload)),
    getNextPage: (payload) => dispatch(getNextPage(payload)),
    setSearchText: (payload) => dispatch(setSearchText(payload)),
    restartSearch: (payload) => dispatch(restartSearch(payload)),
  };

  const Selector = {
    list: useSelector((state) => getListInfo(state)),
    currentPage: useSelector((state) => getListCurrentPage(state)),
    loading: useSelector((state) => getLoading(state)),
    textSearch: useSelector((state) => getTextSearch(state)),
    lastText: useSelector((state) => getLastTextSearch(state)),
  };

  useEffect(() => {
    if (Selector.list.totalRecords === 0) {
      Action.getList();
    }
    return function cleanup() {
      Action.restartSearch();
    };
  }, []);

  useEffect(() => {
    const newArray = [];
    const newTickets = Selector.list.checkIns;
    if (newTickets) {
      newTickets.forEach((ticket) => {
        const objectArray = [
          ticket.ticketId || '',
          ticket.firstName || '',
          ticket.lastName || '',
          ticket.ticketStatus || '',
          ticket.verificationStatus,
          ticket.reason];
        newArray.push(objectArray);
      });
      setTickets(newArray);
    }
  }, [JSON.stringify(Selector.list.checkIns)]);

  useEffect(() => {
    if (Selector.currentPage !== 1) {
      Action.getList();
    }
  }, [Selector.currentPage]);

  const ticketStatusElement = (data) => {
    const dataText = data === PERSONALIZED ? 'Personalized' : 'Checked-in';
    return (
      <View>
        <Text style={data === PERSONALIZED
          ? [styles.textTicketStatus, { backgroundColor: COLOR.GREEN }]
          : [styles.textTicketStatus, { backgroundColor: COLOR.BLUE }]}>
          {data ? dataText : 'N/A'}
        </Text>
      </View>
    );
  };

  const getCellValue = (value) => {
    if (value === PERSONALIZED || value === CHECKED_IN) {
      return ticketStatusElement(value);
    }

    if (!value) {
      return 'N/A';
    }

    return value;
  };

  const isScrollCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const search = () => {
    if (Selector.textSearch !== Selector.lastText) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
      }, 250);
    }
    Action.getList({ search: true });
  };

  const renderLoadingInd = () => (
    <View>
      <ActivityIndicator size="large" color={COLOR.BLUE} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Overlay overlayStyle={styles.loadingIndicator} isVisible={Selector.loading}>
        {renderLoadingInd()}
      </Overlay>
      <SearchInput
        value={Selector.textSearch}
        setValue={(text) => Action.setSearchText({ textSearch: text })}
        getList={search}
      />
      <ScrollView
        persistentScrollbar={true}
        horizontal={true}
        showsVerticalScrollIndicator={true}
      >
        <View>
          <Table>
            <Row
              data={table.tableHead}
              widthArr={table.widthArr}
              style={styles.header}
              textStyle={styles.textHeader}
            >
            </Row>
          </Table>
          <ScrollView
            persistentScrollbar={true}
            style={styles.dataWrapper}
            onScroll={({ nativeEvent }) => {
              if (isScrollCloseToBottom(nativeEvent)) {
                Action.getNextPage();
              }
            }}
            overScrollMode="always"
            scrollEventThrottle={400}
          >
            {!isSearching && <Table>
              {
                tickets.map((rowData, index) => (
                  <TableWrapper
                    key={index}
                    style={index % 2 ? styles.rowGrey : styles.rowWhite}
                  >
                    {
                      rowData.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={getCellValue(cellData)}
                          width={table.widthArr[cellIndex]}
                          textStyle={index % 2
                            ? [styles.text, { color: COLOR.WHITE }]
                            : [styles.text, { color: COLOR.DARK_GRAY }]
                          }
                        />
                      ))
                    }
                  </TableWrapper>
                ))
              }
            </Table>}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default CheckInList;
