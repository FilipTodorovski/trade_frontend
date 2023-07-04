import React, { forwardRef } from 'react';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import qz from 'qz-tray';
import moment from 'moment';
import CONFIG from '../config';
import { ORDER_TRANS_TYPE } from 'constants/constants';
import { getOrderListTotalPrice } from './order';

export const printOrder = (orderInfo) => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    starPassPrintOrder(orderInfo.id);
  } else {
    qzPrintOrder(orderInfo);
  }
};

export const starPassPrintOrder = (orderId) => {
  let changeHref = 'starpassprnt:/v1/print/nopreview?';
  changeHref = `${changeHref}&back=${encodeURIComponent(window.location.href)}`;
  changeHref = `${changeHref}&html=${encodeURIComponent(
    `${CONFIG.API_URL}/order/${orderId}/print/index.html`
  )}`;
  document.location.href = changeHref;
};

export const qzPrintOrder = (orderInfo) => {
  // const productStr = orderInfo.items
  //   .map((item, idx) => {
  //     let returnRow = '<div>';
  //     returnRow += `<h5>${item.qty}x ${item.name}<span>£${
  //       item.qty * item.price
  //     }</span></h5>`;
  //     if (item.groups.length > 0) {
  //       returnRow += item.groups
  //         .map((groupItem) => {
  //           return groupItem.items
  //             .map((itemOne) => {
  //               if (itemOne.qty > 1)
  //                 return `<div>+${itemOne.qty} ${itemOne.name}</div>`;
  //               else return `<div>${itemOne.name}</div>`;
  //             })
  //             .join('');
  //         })
  //         .join('');
  //     }
  //     returnRow += '</div>';
  //     return returnRow;
  //   })
  //   .join('');

  // let htmlBody = `<div>
  // <h2 style="font-size: ">#${orderInfo.order_number}</h2>
  // <h4">Pickup time: ${moment(orderInfo.delivery_time).format('HH:mm')}</h4>
  // <hr>
  // <p>Submitted: ${moment(orderInfo.request_time).format(
  //   'HH:mm, ddd D MMM'
  // )}<br>Customer: ${orderInfo.first_name} ${orderInfo.last_name}</p>
  // <hr>
  // <h5>ORDER NOTES</h5>
  // <p>${orderInfo.notes || ''}</p>
  // <hr>
  // <br>
  // ${productStr}
  // <br><hr>
  // <h4>No of items: <span>${orderInfo.items.reduce(
  //   (a, b) => a + b.qty,
  //   0
  // )}</span></h5>
  // <h4>Total: <span>£${Number(orderInfo.amount).toFixed(2)}</span></h4>
  // </div>`;

  // const data = [
  //   {
  //     type: 'raw',
  //     options: { language: 'ESCPOS', dotDensity: 'double' },
  //   },
  //   '\x1B' + '\x40', // init
  //   '\x1B' + '\x45' + '\x0D', // bold on
  //   '\x1D' + '\x21' + '\x11', // double font size
  //   '\x1B' + '\x61' + '\x31' + '\x0A', // center align
  //   `#${orderInfo.order_number}` + '\x0A',
  //   '\x0A',
  //   '\x0A',
  //   '\x1B' + '\x45' + '\x0A', // bold off
  //   '\x1B' + '\x61' + '\x30', // left align
  //   '\x1B' + '\x4D' + '\x30', // normal text
  //   `Pickup time: ${moment(orderInfo.delivery_time).format('HH:mm')}` + '\x0A',
  //   '\x0A',
  //   '------------------------------------------' + '\x0A',
  //   `Submitted: ${moment(orderInfo.request_time).format('HH:mm, ddd D MMM')}` +
  //     '\x0A',
  //   '------------------------------------------' + '\x0A',
  //   '\x0A',
  //   '\x1B' + '\x45' + '\x0D', // bold on
  //   'ORDER NOTES' + '\x0A',
  //   '\x1B' + '\x45' + '\x0A', // bold off
  //   `${orderInfo.notes || ''}` + '\x0A',
  //   '------------------------------------------' + '\x0A',
  //   '\x1B' + '\x45' + '\x0D', // bold on
  //   `No of items: ${orderInfo.items.reduce((a, b) => a + b.qty, 0)}`,
  //   '\x1B' + '\x45' + '\x0A', // bold off
  //   '\x1B' + '\x4D' + '\x30', // normal text
  //   `£${Number(orderInfo.amount).toFixed(2)}` + '\x0A',
  // ];

  if (!qz.websocket.isActive()) {
    qz.websocket
      .connect(undefined)
      .then(() => {
        console.log('socket connected');
        return qz.printers.find();
      })
      .then((printers) => {
        var printData = [
          '\n',
          '\n',
          '\n',
          `#${orderInfo.order_number}\n`,
          '\n',
          '\n',
          '\n',
          `Pickup time: ${moment(orderInfo.delivery_time).format('HH:mm')}\n`,
          '\n',
          '\n',
          '------------------------------------------\n',
          '\n',
          `Submitted: ${moment(orderInfo.request_time).format(
            'HH:mm, ddd D MMM'
          )}\n`,
          '\n',
          '------------------------------------------\n',
          '\n',
          '\n',
          'ORDER NOTES\n',
          '\n',
          `${orderInfo.notes || ''}\n`,
          '\n',
          '------------------------------------------\n',
          '\n',
          `No of items: ${orderInfo.items.reduce((a, b) => a + b.qty, 0)}\n`,
          '\n',
          '\n',
          '\n',
          `£${Number(orderInfo.amount).toFixed(2)}\n`,
          '\n',
        ];

        console.log('Printers:', printers, printData);

        // var data = [
        //   {
        //     type: 'raw',
        //     format: 'command',
        //     flavor: 'hex',
        //     data: printData,
        //     options: { language: 'ZPL' },
        //   },
        // ];
        let config = qz.configs.create(printers[0]);
        return qz.print(config, printData);
      })
      .then(() => {
        return qz.websocket.disconnect();
      })
      .then(() => {
        // process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        // process.exit(1);
      });
  }
};

export const renderAddress = (address) => {
  if (!address) return;

  const strArr = address.split(', ');

  if (strArr.length > 2) {
    const firstStr = [];
    const secondStr = [];
    strArr.forEach((item, nIndex) => {
      if (nIndex <= strArr.length / 2) firstStr.push(item);
      else secondStr.push(item);
    });
    return (
      <span>
        {firstStr.join(', ')}
        <br />
        {secondStr.join(', ')}
      </span>
    );
  }

  return <span>{address}</span>;
};

const ComponentToPrint = forwardRef((props, ref) => {
  const orderInfo = props.orderInfo;
  const storeName = props.storeName;

  return (
    <PrintContent ref={ref}>
      <div className="header">
        <h1>{storeName}</h1>
        <span className="createdAt">
          {new Date(orderInfo.createdAt).toLocaleString('en-GB')}
        </span>
      </div>
      <div className="main">
        <p>
          <span className="label">Order Number:</span>
          {orderInfo.order_number}
        </p>
        <p>
          <span className="label">Customer Address:</span>
          {renderAddress(orderInfo.address)}
        </p>
        <p>
          <span className="label">Contact:</span>
          {orderInfo.phone_number}
        </p>
        <p>
          <span className="label">Customer Name:</span>
          {`${orderInfo.first_name} ${orderInfo.last_name}`}
        </p>
        <p>
          <span className="label">Delivery Type:</span>
          {orderInfo.trans_type === ORDER_TRANS_TYPE.DELIVERY
            ? 'Delivery'
            : 'Collection'}
        </p>
        <p>
          <span className="label">Amount:</span>£
          {Number(
            getOrderListTotalPrice(null, orderInfo.items) +
              orderInfo.delivery_fee
          ).toFixed(2)}
        </p>
        <p>
          <span className="label">Delivery Time:</span>
          {new Date(orderInfo.delivery_time).toLocaleString('en-GB')}
        </p>
      </div>
      <div className="items">
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Qty</td>
              <td>Price</td>
            </tr>
          </thead>
          <tbody>
            {orderInfo.items &&
              orderInfo.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>£{item.price}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </PrintContent>
  );
});

const PrintContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px;

  .header {
    position: relative;
    padding: 10px 0;
    border-bottom: 2px solid gray;
    width: 100%;

    h1 {
      text-align: center;
    }

    .createdAt {
      position: absolute;
      left: 20px;
      top: 10px;
      font-weight: bold;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    padding: 100px 30px;

    p {
      span.label {
        font-weight: bold;
        margin-right: 20px;
      }
    }
  }

  .items {
    padding: 50px;
  }
`;

export default ComponentToPrint;
