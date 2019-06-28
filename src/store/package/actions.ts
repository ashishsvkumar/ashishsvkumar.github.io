import { action } from "typesafe-actions";
import { RedMartOrderActionTypes, RedMartOrder, RedMartItem } from "./types";
import { orderList, orderDetails } from '../../api/mtop'
import { deflattener, errorCode } from "../../utils/mtop-utils";
import { Constants } from "../../config/constants";
import { get, isEmpty, has, groupBy, reduce, values } from 'lodash';
import * as moment from "moment";
import * as log from "loglevel";
import { clearSession } from "../../utils/session";
import { showAlert, hideAlert } from "../alert/actions";
import { currentEnvironment, Environments } from "../../config/environment";

const request = () => action(RedMartOrderActionTypes.FETCH);
const success = (data: RedMartOrder[]) => action(RedMartOrderActionTypes.SUCCESS, data);
const failure = (error: string) => action(RedMartOrderActionTypes.FAILURE, error);

const requestDetails = (tradeOrderId: string) => action(RedMartOrderActionTypes.DETAILS_FETCH, tradeOrderId);
const successDetails = (tradeOrderId: string, data: RedMartOrder) => action(RedMartOrderActionTypes.DETAILS_SUCCESS, {tradeOrderId, data});
const failureDetails = (tradeOrderId: string, error: string) => action(RedMartOrderActionTypes.DETAILS_FAILURE, {tradeOrderId, error});

type Dispatch = (param: any) => any;

const IGNORABLE_ITEM_STATUSES: string[] = ['refunded', 'pending refund', 'refund initiated'];

export function fetchRedMartOrders() {
    return function (dispatch: Dispatch) {
        log.info('Fetching RedMart packages 📦');
        dispatch(request());

        return orderList().then((response) => {
            if (response.retType === 0) {
                const orders = (deflattener(response).orders || []);

                const tradeOrderIds: string[] = orders.filter(filterForRedMartOrders)
                    .filter(order => !pastThreshold(order.tradeOrderId, getSummarySlot(order)))
                    .map(order => get(order, 'tradeOrderId'));

                log.info('Fetched traderOrderIds of RedMart Orders 📦', tradeOrderIds);
                fetchAllDetails(tradeOrderIds, dispatch)
            } else {
                onError(response, dispatch);
            }
        }).catch(err => onError(err, dispatch))
    }
}

function getSummarySlot(order: any) {
    return moment(get(order, 'orderInfo.createdAt'), 'DD MMM YYYY');
}

export function fetchRedMartOrder(traderOrderId: string) {
    return function(dispatch: Dispatch) {
        log.info('Fetching RedMart package 📦', traderOrderId);
        dispatch(requestDetails(traderOrderId));
       
        fetchDetails(traderOrderId)
            .then(response => {
                try {
                    dispatch(successDetails(traderOrderId, digestOrder(response)));
                } catch (err) {
                    onDetailsError(traderOrderId, err, dispatch);
                }
            })
            .catch(err => onDetailsError(traderOrderId, err, dispatch));
    }
}

function onDetailsError(traderOrderId: string, err: any, dispatch: Dispatch) {
    err = errorCode(err)
    log.error('Exception while fetching RedMart package 📦:', err)
    dispatch(failureDetails(traderOrderId, err))

    if (err === 'FAIL_SYS_SESSION_EXPIRED') {
        clearSession();
        location.reload();
    } else {
        // dispatch(showAlert({
        //     show: true, 
        //     title: 'Failure',
        //     message: 'Something went wrong. Please try again later',
        //     onClick: () => dispatch(hideAlert()),
        //     btnText: 'Close'
        // }));
    }
}

function onError(err: any, dispatch: Dispatch) {
    err = errorCode(err)
    log.error('Exception while fetching RedMart packages 📦:', err)
    dispatch(failure(err))

    if (err === 'FAIL_SYS_SESSION_EXPIRED') {
        clearSession();
        location.reload();
    } else {
        dispatch(showAlert({
            show: true, 
            title: 'Failure',
            message: 'Something went wrong. Please try again later',
            onClick: () => dispatch(hideAlert()),
            btnText: 'Close'
        }));
    }
}

function filterForRedMartOrders(order: any) {
    const items: any[] = get(order, 'orderItems');
    return !isEmpty(items) && items.some(im => im.sellerId == Constants.RM_SELLER_ID || true); // Use loose equality!!!
}

function fetchAllDetails(ids: string[], dispatch: Dispatch) {
    // @ts-ignore
    Promise.all(ids.map(fetchDetails)).then(list => list.filter(data => data !== null)).then(list => {
        const packages: RedMartOrder[] = list.map(digestOrder).filter(order => !isEmpty(order));
        dispatch(success(packages))
    });
}

function digestOrder(order: any): RedMartOrder {
    const packages = has(order, 'package') ? [order.package] : order.packages;
    if (isEmpty(packages)) {
        return null;      // unlikely
    }

    const rmPackages = packages.filter(pack => has(pack, 'orderItems')).filter(pack => pack.orderItems.every(im => im.sellerId == Constants.RM_SELLER_ID))
    if (isEmpty(rmPackages)) {
        return null;
    }

    const out: any = {};
    out.userId = order.buyerId;
    out.isAsap = false;
    const items = rmPackages[0].orderItems.map(im => {
        out.tradeOrderId = im.tradeOrderId;
        out.deliverySlot = has(im, 'delivery.desc') ? im.delivery.desc : null;
        out.email = im.buyerEmail;
        out.status = get(im, 'reversible.desc', im.status);

        return {
            name: im.title,
            quantity: im.quantity,
            unitPrice: im.price,
            itemId: im.itemId,
            skuId: im.skuId,
            productPage: im.itemUrl,
            thumbnail: im.picUrl,
            isFreeGift: im.isFreeGift,
            isFreeSample: im.isFreeSample,
            status: get(im, 'reversible.desc', im.status),
            reversible: im.reversible
        };
    });

    out.status = rmPackages[0].status || out.status;

    const allItemGroups = groupBy(items.filter(im => !isEmpty(im)), (item: RedMartItem) => item.skuId);
    const refundableItemGroups = groupBy(items.filter(im => !isEmpty(im)).filter(showItem), (item: RedMartItem) => item.skuId);

    out.items = aggregateItemsBySkuId(allItemGroups);
    out.refundableItems = aggregateItemsBySkuId(refundableItemGroups);

    if (has(order, 'detailInfo.createdAt')) {
        out.createdAt = order.detailInfo.createdAt;
        out.deliverySlot = out.deliverySlot || order.detailInfo.createdAt;
    }

    // const mnt = getTime(out);
    // if (pastThreshold(mnt)) {
    //     log.info('Order', out.tradeOrderId, 'is dated', mnt.format('DD-MM-YYYY'), 'and is past threshold. Will not show.');
    //     return null;
    // }

    return out;
}

function aggregateItemsBySkuId(listOfLists: any) {
    return values(listOfLists).map((list: RedMartItem[]) => {
        if (list.length === 1) {
            return list;
        } else {
            return [reduce(list, (e1, e2) => {
                return {...e1, quantity: e1.quantity + e2.quantity}
            })]
        }
    }).map(list => {
        return list[0];
    });
}

function pastThreshold(tradeOrderId: string, slot: moment.Moment): boolean {
    if (currentEnvironment === Environments.preLive) {
        return false;
    }

    const eightDaysInPast = moment().subtract(21, 'd');
    log.info('Order', tradeOrderId, 'dated', slot.format('DD-MM-YYYY'), `${slot.isBefore(eightDaysInPast) ? 'is' : 'is not' } past thereshold`);
    return slot.isBefore(eightDaysInPast);
}

function getTime(order: RedMartOrder): moment.Moment {
    let slot = get(order, 'deliverySlot', order.createdAt);
    let mnt = moment(slot, ['ddd DD MMM', 'DD MMM YYYY']);
    if (mnt.year() < 2018) {
        slot = slot.split(',')[0] + ' 2018';
        mnt = moment(slot, ['ddd DD MMM YYYY', 'ddd DD MMM', 'DD MMM YYYY']);
    }

    return mnt;
}

function showItem(item: RedMartItem): boolean {
    if (isEmpty(item.status)) {
        return true;
    }

    const status: string = get(item, 'reversible.desc', item.status).toLowerCase();
    return IGNORABLE_ITEM_STATUSES.indexOf(status) < 0;
}

function fetchDetails(id: string) {
    return orderDetails(id)
        .then((response: any) => {
            if (response.retType === 0) {
                return deflattener(response);
            } else {
                return null;
            }
        })
        .catch(err => null)
}