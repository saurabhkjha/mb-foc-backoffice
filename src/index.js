import React, { useEffect } from 'react';
import { render } from 'react-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import Rating from '@mui/material/Rating';
import Paper from '@mui/material/Paper';

import { lightBlue, amber, red, blueGrey } from '@mui/material/colors';

import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Ag from './components/ag';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import useLocalStorage from './hooks/localstorage';

import Auth from './components/auth';
import BenzIcon from './components/benzIcon';

import { API } from './config';

import reviewData from './data/review';
import productData from './data/products';

const avg = lightBlue[500];
const low = amber[300];
const danger = red[400];
const disabled = blueGrey[400];

function Editable(props) {
  let bkColor = avg;
  if (props.data.available === 0) {
    bkColor = disabled;
  } else if (props.value === 0) {
    bkColor = danger;
  }
  return (
    <span
      style={{
        background: bkColor,
        display: 'flex',
        justifyContent: 'space-evenly',
      }}
    >
      {props.value}
      <EditIcon
        style={{
          marginTop: '10px',
          color: props.data.available > 0 ? 'none' : bkColor,
        }}
      />
    </span>
  );
}

function MbRating(props) {
  return (
    <span>
      <Rating
        name="read-only"
        value={props.value}
        readOnly
        style={{ color: '#00ADEF', fontSize:'14px' }}
      />
    </span>
  );
}

function StockCell(props) {
  let bkColor = avg;
  if (props.value === 0) {
    bkColor = danger;
  } else if (props.value < 5) {
    bkColor = low;
  }
  return (
    <span
      style={{ background: bkColor, display: 'flex', justifyContent: 'center' }}
    >
      {props.value}
    </span>
  );
}

function ReviewStatus(props) {
  let status = 'Not Approved';
  let bkColor = 'none';
  if (props.value.toLowerCase() === 'approved') {
    status = 'Approved';
    bkColor = '#00ADEF';
  }
  return (
    <span
      style={{ background: bkColor, display: 'flex', justifyContent: 'center' }}
    >
      {status}
    </span>
  );
}

const reviewCol = [
  {
    field: 'id',
    filter: true,
    resizable: true,
    flex: 1,
    width: 100,
    maxWidth: 100,
  },
  {
    field: 'customerName',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'productCode',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'rating',
    filter: true,
    resizable: true,
    flex: 1,

    cellRenderer: MbRating,
  },
  {
    field: 'reviewHeadline',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'reviewText',
    filter: true,
    resizable: true,
    flex: 1,
    tooltipComponentParams: { bkColor: '#474747' },
    tooltipField: 'reviewText',
  },
  {
    field: 'date',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'status',
    filter: true,
    resizable: true,
    flex: 1,
    cellRenderer: ReviewStatus,
  },
];
const productCol = [
  {
    field: 'id',
    filter: true,
    resizable: true,
    flex: 1,
    width: 100,
    maxWidth: 100,
  },
  {
    field: 'productCode',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'productName',
    filter: true,
    resizable: true,
    flex: 1,
    tooltipComponentParams: { bkColor: '#474747' },
    tooltipField: 'productName',
  },
  {
    field: 'status',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'warehouse',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'baseStore',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'available',
    filter: true,
    resizable: true,
    flex: 1,
    width: 175,
    maxWidth: 175,
    cellRenderer: StockCell,
  },
  {
    field: 'safetyStock',
    filter: true,
    resizable: true,
    editable: (params) => {
      return params.data.available > 0;
    },
    flex: 1,
    cellClass: 'editable-grid-cell',
    cellRenderer: Editable,
    width: 175,
    maxWidth: 175,
  },
  {
    field: 'calculatedStock',
    filter: true,
    resizable: true,
    flex: 1,
    width: 175,
    maxWidth: 175,
    cellRenderer: StockCell,
  },
];
const priceCol = [
  {
    field: 'id',
    filter: true,
    resizable: true,
    flex: 1,
    width: 100,
    maxWidth: 100,
  },
  {
    field: 'product',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'unit',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'price',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'currency',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'startTime',
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    field: 'endTime',
    filter: true,
    resizable: true,
    flex: 1,
  },
];

const PRODUCT_URL = `${API}/stocks/all`;
const REVIEW_URL = `${API}/review/approval/`;
const PRICE_URL = `${API}/price/all`;

const App = () => {
  const [value, setValue] = React.useState('review');
  const [colData, setColData] = React.useState(reviewCol);
  const [rowData, setRowData] = React.useState([]);
  const [session, setSession] = useLocalStorage('session');
  const [refresh, setRefresh] = useLocalStorage(false);
  const [loading, setloading] = useLocalStorage(true);
  const [gridAction, setGridAction] = useLocalStorage(true);

  const loadData = (name) => {
    setValue(name);
    setRefresh(true);
    setloading(true);
  };

  const refreshData = () => {
    setloading(true);
    setRefresh(true);
  };

  useEffect(() => {
    fetch(REVIEW_URL)
      .then((response) => response.json())
      .then((data) => {
        setloading(false);
        setRowData(data);
      });
  }, []);

  useEffect(() => {
    if (!refresh) return;
    let URL = '';

    if (value === 'review') {
      setColData(reviewCol);
      setGridAction(true);
      URL = REVIEW_URL;
    } else if (value === 'price') {
      setColData(priceCol);
      setGridAction(false);
      URL = PRICE_URL;
    } else {
      setColData(productCol);
      setGridAction(false);
      URL = PRODUCT_URL;
    }
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setRefresh(false);
        setloading(false);
        setRowData(data);
      });
  }, [refresh]);

  const validate = (val) => {
    setSession(val);
  };
  const fLCapital = (s) => (s = s.charAt(0).toUpperCase() + s.slice(1));
  return (
    <>
      {session && (
        <>
          <AppBar position="static">
            <Toolbar variant="dense">
              <BenzIcon />
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                style={{ marginLeft: 20 }}
              >
                MB FOC Backoffice - {fLCapital(value)}
              </Typography>
            </Toolbar>
          </AppBar>
          <Ag
            colData={colData}
            rowData={rowData}
            action={gridAction}
            loading={loading}
            refersh={() => setRefresh(true)}
          />
          <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation showLabels value={value}>
              <BottomNavigationAction
                label="Refersh"
                icon={<RestoreIcon />}
                onClick={() => refreshData()}
              />
              <BottomNavigationAction
                style={{
                  color: value === 'review' ? '#00ADEF' : 'rgba(0, 0, 0, 0.6)',
                }}
                label="Review"
                icon={
                  <FavoriteIcon
                    style={{
                      color:
                        value === 'review' ? '#00ADEF' : 'rgba(0, 0, 0, 0.6)',
                    }}
                  />
                }
                onClick={() => loadData('review')}
              />
              <BottomNavigationAction
                style={{
                  color: value === 'stock' ? '#00ADEF' : 'rgba(0, 0, 0, 0.6)',
                }}
                label="Stock"
                icon={
                  <ArchiveIcon
                    style={{
                      color:
                        value === 'stock' ? '#00ADEF' : 'rgba(0, 0, 0, 0.6)',
                    }}
                  />
                }
                onClick={() => loadData('stock')}
              />
              <BottomNavigationAction
                style={{
                  color: value === 'price' ? '#00ADEF' : 'rgba(0, 0, 0, 0.6)',
                }}
                label="Price"
                icon={
                  <MonetizationOnIcon
                    style={{
                      color:
                        value === 'price' ? '#00ADEF' : 'rgba(0, 0, 0, 0.6)',
                    }}
                  />
                }
                onClick={() => loadData('price')}
              />
              <BottomNavigationAction
                label="Logout"
                icon={<LockIcon />}
                onClick={() => validate(false)}
              />
            </BottomNavigation>
          </Paper>
        </>
      )}
      {!session && <Auth onLogin={validate} />}
    </>
  );
};

render(<App />, document.getElementById('root'));
