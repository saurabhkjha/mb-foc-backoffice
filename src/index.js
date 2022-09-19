import React, { useEffect, useMemo } from 'react';
import { render } from 'react-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LockIcon from '@mui/icons-material/Lock';
import Paper from '@mui/material/Paper';

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

const reviewCol = [
  {
    field: 'id',
    filter: true,
    resizable: true,
    flex: 1,
    hide: true,
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
    width: 10,
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
  },
];
const productCol = [
  {
    field: 'id',
    filter: true,
    resizable: true,
    flex: 1,
    hide: true,
  },
  {
    field: 'productCode',
    filter: true,
    resizable: true,
    flex: 1,
    hide: true,
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
  },
  {
    field: 'safetyStock',
    filter: true,
    resizable: true,
    editable: true,
    flex: 1,
    cellClass: 'editable-grid-cell',
  },
  {
    field: 'calculatedStock',
    filter: true,
    resizable: true,
    flex: 1,
  },
];
const priceCol = [
  {
    field: 'id',
    filter: true,
    resizable: true,
    flex: 1,
    hide: true,
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
                MB FOC Backoffice
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
                label="Review"
                icon={<FavoriteIcon />}
                onClick={() => loadData('review')}
              />
              <BottomNavigationAction
                label="Stock"
                icon={<ArchiveIcon />}
                onClick={() => loadData('product')}
              />
              <BottomNavigationAction
                label="Price"
                icon={<MonetizationOnIcon />}
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
