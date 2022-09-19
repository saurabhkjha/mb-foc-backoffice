import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { AgGridReact } from 'ag-grid-react';

import ActionMenu from './long';
import AlertDialog from './popup';
import Tooltip from './tooltip';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Loading from './loading';
import '../style.css';

import useWindowDimensions from '../hooks/dimension';

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

import { API } from '../config';
function ActionPopover(props) {
  return (
    <span>
      <ActionMenu
        id={props.data.id}
        status={props.data.status}
        onAction={(e) => props.onClick(e)}
      />
    </span>
  );
}

export default function Ag({
  rowData,
  colData,
  loading,
  refersh,
  action = true,
  pageNumber = 1,
}) {
  const gridRef = useRef();
  const { height, width } = useWindowDimensions();
  const onAction = useCallback((id) => {
    var raw = JSON.stringify({
      "id": id,
      "status": "approved"
    });
    setShowmsg(true);
    setMsg('Processing...');
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(`${API}/review/approval/`, requestOptions)
      .then(response => response.text())
      .then((result) => {
        setMsg('Done...');
        setTimeout(() => {
          setShowmsg(false);
          refersh();
        }, 200);
      })
      .catch((error) => console.log('error', error));
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    ...colData,
    {
      field: 'Action',
      maxWidth: 100,
      cellRenderer: ActionPopover,
      cellRendererParams: { onClick: onAction },
    },
  ]);
  const [gridApi, setGridApi] = useState();
  let paginationProps = {
    pagination: true,
    paginationPageSize: 10,
    cacheBlockSize: 10,
  };
  const onGridReady = ({ api }) => setGridApi(api);
  const [msg, setMsg] = useState('');
  const [showmsg, setShowmsg] = useState(false);
  useEffect(() => {
    if (!gridApi) {
      return;
    }
    if (action) {
      gridApi.setColumnDefs([
        ...colData,
        {
          field: 'Action',
          maxWidth: 100,
          cellRenderer: ActionPopover,
          cellRendererParams: { onClick: onAction },
        },
      ]);
    } else {
      gridApi.setColumnDefs(colData);
    }
  }, [colData]);
  const onPaginationChanged = useCallback(
    ({ newPage }) => {
      if (!gridApi || !newPage) {
        return;
      }
      const currentPage = gridApi.paginationGetCurrentPage();
    },
    [gridApi]
  );
  useEffect(() => {
    if (!gridApi || isNaN(pageNumber)) {
      return;
    }
    const currentPage = gridApi.paginationGetCurrentPage();
    if (pageNumber === currentPage) {
      return;
    }
    gridApi.paginationGoToPage(pageNumber);
  }, [gridApi, pageNumber]);

  const defaultColDef = {
    sortable: true,
    tooltipComponent: Tooltip,
  };

  useEffect(() => {
    if (!gridApi) {
      return;
    }

    if (loading) {
      gridApi.showLoadingOverlay();
    } else {
      gridApi.hideOverlay();
    }
  }, [loading]);

  const loadingOverlay = useMemo(() => {
    return Loading;
  }, []);

  const loadingOverlayComponentParams = useMemo(() => {
    return {
      loadingMessage: 'One moment please...',
    };
  }, []);

  const cellClickedListener = useCallback((event) => {
    //console.log('cellClicked', API);
  }, []);
  const cellValueChangedListener = useCallback((event) => {
    const raw = JSON.stringify({
      id: event.data.id,
      safetyStock: event.data.safetyStock,
    });
    setShowmsg(true);
    setMsg('Processing...');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${API}/stock/update`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setMsg('Done...');
        setTimeout(() => {
          setShowmsg(false);
          refersh();
        }, 200);
      })
      .catch((error) => console.log('error', error));
  }, []);

  return (
    <div
      className="ag-theme-material"
      style={{ height: `${150 + height / 2}px`, width: '100%' }}
    >
      {' '}
      {showmsg && <AlertDialog msg={msg} />}
      <AgGridReact
        sideBar={true}
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        tooltipShowDelay={0}
        tooltipHideDelay={2000}
        rowSelection="multiple"
        onCellClicked={cellClickedListener}
        onCellValueChanged={cellValueChangedListener}
        onPaginationChanged={onPaginationChanged}
        onGridReady={onGridReady}
        loadingOverlayComponent={loadingOverlay}
        loadingOverlayComponentParams={loadingOverlayComponentParams}
        {...paginationProps}
      />
    </div>
  );
}
