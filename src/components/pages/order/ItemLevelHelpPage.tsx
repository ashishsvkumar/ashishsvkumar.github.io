import * as React from "react";
import { OrderHelpPage } from "./OrderHelpPage"
import { Button } from "../../form/Button";
import { itemDetailsToItemPreviewProps } from "../../../utils/transformers";
import { ItemsToggleList, Closed } from "../../item/ItemsToggleList"
import * as styles from "./ItemLevelHelpPage.scss";
import { PopupPage, Style } from "../PopupPage"
import { ItemPreviewProps } from "../../item/ItemPreview";
import { ItemIssue } from "../../item/ItemIssue";
import { SelectOption } from "../../form/Select";
import Attachment from "../../form/attachment/Attachment";
import { Ticket, TicketType, RefundMethod } from "../../../store/ticket/types";
import { isEmptyString, isEmptyArray } from "../../../utils/extras";
import { WarningIcon } from "../../icons/WarningIcon";
import { Comment } from "../../form/Comment";
import { RedMartOrder } from "../../../store/package/types";
import { Constants } from "../../../config/constants";
import { trackEvent } from "../../../utils/tracker";
import {isEmpty} from 'lodash';

export class ItemLevelHelpPage extends React.Component<ItemLevelHelpPageProps, ItemLevelHelpPageState> {

    constructor(props: ItemLevelHelpPageProps) {
        super(props);
        this.state = { slideInPopup: false, selectedItems: [], attachments: [], attachmentUploading: false, enableWarning: false, warning: undefined }
    }

    togglePopup = (selectedSku?: string[], status?: Closed) => {
        if (selectedSku !== undefined) {
            const selected = this.props.order.refundableItems.filter(im => selectedSku.indexOf(im.skuId) >= 0).map(itemDetailsToItemPreviewProps);
            this.state.selectedItems.forEach(si => {
                selected.filter(it => it.sku === si.sku).forEach(i => {
                    i.selectedIssue = si.selectedIssue;
                    i.selectedQuantity = si.selectedQuantity || 1;
                });
            });
            this.setState({ slideInPopup: !this.state.slideInPopup, selectedItems: selected })

            trackEvent('Order help', 'items selection', 'count', `${selected.length}`);
        } else {
            this.setState({ slideInPopup: !this.state.slideInPopup })
        }
    }

    getHeading = () => {
        return this.props.helpCategory === Category.missing ? 'Which item(s) are missing?' : 'Which item(s) do you have issues with?'
    }

    getTitle = () => {
        return this.props.helpCategory === Category.missing ? 'Report missing items' : 'Report an issue with received items';
    }

    getLabel = () => {
        return this.props.helpCategory === Category.missing ? 'How many are missing' : 'How many are affected?'
    }

    onQuantityChange = (sku: string, newQuantity: number) => {
        this.state.selectedItems.filter(im => im.sku === sku).forEach(im => im.selectedQuantity = newQuantity);
    }

    onIssueChange = (sku: string, newIssue: string) => {
        const all = [...this.state.selectedItems];
        all.filter(im => im.sku === sku).forEach(im => im.selectedIssue = newIssue);
    
        this.setState({
            selectedItems: all
        });

        if (isEmptyArray(this.getBlackItems())) {
            this.setState({
                warning: undefined
            });
        }

        if (!isEmpty(newIssue)) {
            issueList.filter(is => is.value == newIssue).forEach(is => trackEvent('Item Issue', 'Selected', is.displayText, '1'));
        }
    }

    onRemoveSelection = (sku: string) => {
        const others = this.state.selectedItems.filter(im => im.sku !== sku)
        this.setState({ selectedItems: others })
    }

    onAttachmentUpload = (urls: string[]) => {
        this.setState({ attachments: urls });
    }

    onAttachmentUploadOnGoing = (onGoing: boolean) => {
        this.setState({ attachmentUploading: onGoing })
    }

    onCommentChange = (comment: string) => {
        this.setState({ comment: comment })
    }

    getBlackItems = () => {
        return this.state.selectedItems.filter(item => isEmptyString(item.selectedIssue)).map(item => item.sku);
    }

    canSubmit = () => {
        let can: boolean = true;
        if (this.state.selectedItems.length === 0) {
            can = false;
        }

        const blankItems = this.getBlackItems();
        if (blankItems.length > 0 && this.props.helpCategory === Category.damaged) {
            can = false;
        }

        return can;
    }

    attempSubmit = () => {
        if (!this.canSubmit()) {
            this.setState( { enableWarning: true, warning: "Please select the issue for listed items" } )
            return;
        }

        this.setState({ enableWarning: false, warning: undefined }, this.submitTicket)
    }

    getPrimaryReasonCode = () => {
        const { helpCategory } = this.props;

        if (helpCategory === Category.missing) {
            return Constants.MISSING_REASON_CODE_PRIMARY;
        } else {
            return issueList.filter(option => option.value === this.state.selectedItems[0].selectedIssue).map(option => option.primaryRC)[0];
        }
    }

    getSecondaryReasonCode = () => {
        const { helpCategory } = this.props;

        if (helpCategory === Category.missing) {
            return Constants.MISSING_REASON_CODE_SECONDARY;
        } else {
            return issueList.filter(option => option.value === this.state.selectedItems[0].selectedIssue).map(option => option.value)[0];
        }
    }

    submitTicket = () => {
        const ticket: Ticket = {
            type: TicketType.ORDER,
            forLazada: true,
            publicId: this.props.order.tradeOrderId,
            memberId: this.props.order.userId,
            email: this.props.order.email,
            comment: this.state.comment,
            attachments: this.state.attachments.map(url => { return { link: url, name: null } }),
            rpc: this.state.selectedItems.map(item => { 
                return { id: item.sku, quantity: item.selectedQuantity, reasonCodeId: item.selectedIssue || Constants.MISSING_REASON_CODE_SECONDARY 
                } 
            }),
            primaryReasonCodeId: this.getPrimaryReasonCode(),
            secondaryReasonCodeId: this.getSecondaryReasonCode(),
            refundMethod: RefundMethod.CC_PAYPAL
        }
        this.props.createTicket(ticket);

        trackEvent('Ticket', 'Creation', 'submission', this.props.helpCategory);
        if (this.props.helpCategory === Category.missing) {
            this.state.selectedItems.forEach(im => {
                trackEvent('Item Issue', 'Selected', 'The item is missing', '1');
            });
        }
    }

    issuesView = () => {

        const { helpCategory, inProgress } = this.props;
        const issues = helpCategory === Category.missing ? undefined : issueList;

        return (
            <div className={styles.selected_items}>
                {this.state.selectedItems.map(item => (
                    <ItemIssue
                        {...item}
                        issueTypes={issues}
                        pickerLabel={this.getLabel()}
                        quantityChanged={(oldQ, newQ) => { this.onQuantityChange(item.sku, newQ) }}
                        selectChanged={(newIssue) => { this.onIssueChange(item.sku, newIssue) }}
                        onDelete={() => { this.onRemoveSelection(item.sku) }}
                        enableWarning={this.state.enableWarning}
                        key={`selected-item-card-${item.sku}`}
                    />
                ))}
                <div className={styles.link_button}>
                    <div className={styles.only_mobile}><Button text="Add More Items" style={{ width: '100%', margin: 'auto' }} onClick={() => this.togglePopup()} /></div>
                    <div className={styles.only_desktop}><Button text="Add More Items" style={{ padding: '15px 50px' }} onClick={() => this.togglePopup()} /></div>
                </div>
                {helpCategory === Category.damaged && <div className={styles.attachment}><Attachment label="Add photo(s) of affected items" onChange={this.onAttachmentUpload} notifyOnProgress={this.onAttachmentUploadOnGoing} /></div>}
                {helpCategory === Category.damaged && <Comment title="Additional Information" checkBoxTitle="The concern involves a multi-pack product." subtitle="Please indicate the number of pieces affected." onChange={this.onCommentChange}/>}
                <div className={styles.submission}>
                    { helpCategory === Category.damaged && !isEmptyString(this.state.warning) && <div className={styles.warning_text}><WarningIcon text={this.state.warning}/></div> }
                    <div className={styles.subtitle}>Upon verification of your claim, we will issue a refund to your original payment method within 24 business hours.</div>
                    <div className={styles.only_mobile}><Button text="Submit" isPrimary={true} style={{ padding: '12px', width: '80%', margin: 'auto' }} isDisabled={this.state.attachmentUploading || inProgress} onClick={this.attempSubmit} /></div>
                    <div className={styles.only_desktop}><Button text="Submit" isPrimary={true} style={{ padding: '15px 50px', margin: 'auto' }} isDisabled={this.state.attachmentUploading || inProgress} onClick={this.attempSubmit} /></div>
                </div>
            </div>
        )
    }

    itemListPopupView = () => {
        const items: ItemPreviewProps[] = this.props.order.refundableItems.map(itemDetailsToItemPreviewProps)

        const preSelected = items.map(im => im.sku).filter(sku => this.state.selectedItems.some(im => im.sku === sku))

        return (
            <React.Fragment>
                <div className={styles.only_mobile}>
                    <PopupPage popupStyle={Style.FULLSCREEN} show={this.state.slideInPopup}>
                        <ItemsToggleList
                            items={items}
                            onClose={this.togglePopup}
                            selectedSkus={preSelected}
                            header={this.getHeading()}
                        />
                    </PopupPage>
                </div>
                <div className={styles.only_desktop}>
                    <PopupPage popupStyle={Style.OVERLAY} show={this.state.slideInPopup}>
                        <ItemsToggleList
                            items={items}
                            onClose={this.togglePopup}
                            selectedSkus={preSelected}
                            header={this.getHeading()}
                        />
                    </PopupPage>                
                </div>
            </React.Fragment>
        )
    }

    body = () => {
        return (
            <div className={styles.content}>
                <div className={styles.title}>{this.getHeading()} </div>
                {this.state.selectedItems.length > 0 && this.issuesView()}
                {this.state.selectedItems.length === 0 && <div className={styles.only_mobile}><Button text="Select Items" onClick={() => this.togglePopup()} style={{ width: '100%' }}/></div>}
                {this.state.selectedItems.length === 0 && <div className={styles.only_desktop}><Button text="Select Items" onClick={() => this.togglePopup()} style={{ padding: '15px 50px' }}/></div>}
                {this.itemListPopupView()}
            </div>
        )
    }

    render() {
        return <OrderHelpPage title={this.getTitle()} body={this.body()} order={this.props.order} />
    }
}

interface ItemLevelHelpPageState {
    slideInPopup: boolean,
    enableWarning: boolean,
    warning?: string,
    selectedItems: ItemPreviewProps[],
    attachments: string[],
    comment?: string,
    attachmentUploading: boolean,
}

export const enum Category {
    missing = "missing",
    damaged = "damaged"
}

export interface ItemLevelHelpPageProps {
    order: RedMartOrder,
    helpCategory: Category,
    createTicket: (ticket: Ticket) => void,
    inProgress: boolean
}

interface IssueReasonCode extends SelectOption {
    primaryRC: string
}

const issueList: IssueReasonCode[] = [
    { displayText: 'The item was broken', value: '1456125006689', primaryRC: '1456125006989' },
    { displayText: 'The item was dented', value: '1456125006789', primaryRC: '1456125006989' },
    { displayText: 'The item was leaking', value: '1456125006889', primaryRC: '1456125006989' },
    { displayText: 'The item had torn packaging', value: '1512095387602', primaryRC: '1456125006989' },
    { displayText: 'The item is expired', value: '1456125007889', primaryRC: '1456125007989' },
    { displayText: 'The item is close to expiry', value: '1456125008089', primaryRC: '1456125007989' },
    { displayText: 'The item did not taste good', value: '1456125007389', primaryRC: '1456125007489' },
    { displayText: 'The item may be contaminated', value: '1456125007189', primaryRC: '1456125007489' },
    { displayText: 'The item was rotten or moldy', value: '1456125007289', primaryRC: '1456125007489' },
    { displayText: 'The fresh food was frozen', value: '1456125007689', primaryRC: '1456125007789' },
    { displayText: 'The item was not cold / melted when received', value: '1456125007589', primaryRC: '1456125007789' }
];