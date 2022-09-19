import React, { useMemo } from 'react';

export default (props) => {
  const data = useMemo(
    () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
    []
  );
  console.log('=====', props);
  return (
    <div
      className="custom-tooltip"
      style={{
        backgroundColor: props.bkColor,
        color: 'white',
        padding: '10px',
        fontSize: '18px',
      }}
    >
     {data.reviewHeadline && <><div style={{ borderBottom: '1px solid white' }}>
        <span>{data.reviewHeadline}</span>
      </div>
      <br /></>}
      <div>{props.value}</div>
    </div>
  );
};
